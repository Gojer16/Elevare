"use client";
import { useCallback, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task } from "../../../types/task";

export type { Task };

interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string | null;
}

interface Streak {
  id: string;
  count: number;
  longest: number;
  lastActive: string;
}

/**
 * Lightweight fetch wrapper used by the hook.
 * Throws Error with normalized message on non-2xx responses.
 */
async function fetchJson(input: RequestInfo, init: RequestInit = {}) {
  const res = await fetch(input, { credentials: "include", ...init });
  const ct = res.headers.get("content-type") ?? "";
  const isJson = ct.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    // Prefer API-provided message; fall back to status text.
    const message = body?.error || body?.message || res.statusText || "Request failed";
    throw new Error(message);
  }
  return body;
}

/**
 * useTasks hook backed by React Query.
 *
 * Assumes the following endpoints:
 * GET  /api/tasks            -> returns Task[]
 * POST /api/tasks            -> create task
 * PUT  /api/tasks/:id        -> update task (complete/reflection/edit)
 * GET  /api/streak           -> returns streak
 * POST /api/streak          -> { action: "increment" } increments streak
 * POST /api/achievements/check -> returns { newlyUnlocked: Achievement[] }
 */
export function useTasks() {
  const queryClient = useQueryClient();
  const [isReflectionModalOpen, setReflectionModalOpen] = useState(false);
  const [achievementToasts, setAchievementToasts] = useState<Achievement[]>([]);
  const [error, setError] = useState<string | null>(null);

  // --- Queries --- //
  const tasksQuery = useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: async ({ signal }: { signal?: AbortSignal }) => {
      try {
        return await fetchJson("/api/tasks", { signal });
      } catch (e) {
        // If the fetch was aborted (react-query cancel / component unmount),
        // don't surface a user-visible error — it's expected behavior.
        if ((e as Error)?.name === "AbortError") {
          // Let react-query handle the abort; don't set global error state.
          throw e;
        }

        setError((e as Error).message);
        throw e;
      }
    },
    staleTime: 1000 * 60, // 1 minute
    retry: 2,
  });

  const streakQuery = useQuery<Streak | null, Error>({
    queryKey: ["streak"],
    queryFn: async ({ signal }: { signal?: AbortSignal }) => {
      try {
        return await fetchJson("/api/streak", { signal });
      } catch (e) {
        // Streak failures are non-blocking UX wise
        console.error("useTasks: fetch streak error", e);
        throw e;
      }
    },
    staleTime: 1000 * 60,
    retry: 1,
  });

  // Derived UI state from tasks query
  const tasks = useMemo(() => (tasksQuery.data ?? []) as Task[], [tasksQuery.data]);

  const activeTask = useMemo(() => tasks.find((t: Task) => !t.isDone) ?? null, [tasks]);

  const archive = useMemo(() => {
    if (!activeTask) return tasks.filter((t: Task) => t.isDone);
    return tasks.filter((t: Task) => t.id !== activeTask.id);
  }, [tasks, activeTask]);

  const today = useMemo(() => new Date().toDateString(), []);
  const showCongratulations = useMemo(() => {
    const todaysCompleted = tasks.find(
      (t: Task) => t.isDone && new Date(t.createdAt).toDateString() === today
    );
    return !activeTask && !!todaysCompleted;
  }, [tasks, activeTask, today]);

  // Flags mapped from react-query states
  const isLoading = tasksQuery.isLoading;
  const isRefetching = tasksQuery.isFetching && !tasksQuery.isLoading;

  // --- Mutations --- //

  // Add Task (no optimistic update - simple create then invalidate)
  const addTaskMutation = useMutation<Task, Error, { title: string; description: string; tagNames?: string[] }>(
    {
      mutationFn: async (newTask) =>
        fetchJson("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newTask, isDone: false }),
        }),
      onMutate: async () => {
        setError(null);
        await queryClient.cancelQueries({ queryKey: ["tasks"] });
      },
      onError: (err: Error) => {
        setError(err.message || "Failed to add task");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      },
    }
  );

  // Complete Task (optimistic update with rollback)
  const completeTaskMutation = useMutation<Task, Error, string, { previous?: Task[] }>(
    {
      mutationFn: async (id) =>
        fetchJson(`/api/tasks/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isDone: true }),
        }),
      onMutate: async (id) => {
        setError(null);
        await queryClient.cancelQueries({ queryKey: ["tasks"] });
        const previous = queryClient.getQueryData<Task[]>(["tasks"]);

        // Optimistically mark task done in the cache and set completedAt
        queryClient.setQueryData<Task[] | undefined>(["tasks"], (old) =>
          old?.map((t) => (t.id === id ? { ...t, isDone: true, completedAt: new Date().toISOString() } : t))
        );

        return { previous };
      },
      onError: (err: Error, _id: string, context) => {
        setError(err.message || "Failed to complete task");
        // rollback
        if (context?.previous) {
          queryClient.setQueryData(["tasks"], context.previous);
        }
      },
      onSuccess: async () => {
        // refresh streak and tasks; achievements check will run after reflection save
        try {
          await fetchJson("/api/streak", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "increment" }),
          });
        } catch (e) {
          // non-blocking
          console.warn("streak increment failed", e);
        }

        // small UX delay before opening reflection modal
        setTimeout(() => setReflectionModalOpen(true), 600);

        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        queryClient.invalidateQueries({ queryKey: ["streak"] });
      },
      onSettled: () => {
        // ensure we refetch to get canonical state
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      },
    }
  );

  // Save Reflection (no optimistic update; after success, check achievements)
  const saveReflectionMutation = useMutation<void, Error, { id: string; reflection: string }>(
    {
      mutationFn: async ({ id, reflection }) =>
        fetchJson(`/api/tasks/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reflection }),
        }),
      onMutate: async () => {
        setError(null);
        setReflectionModalOpen(false);
        await queryClient.cancelQueries({ queryKey: ["tasks"] });
      },
      onError: (err: Error) => {
        setError(err.message || "Failed to save reflection");
      },
      onSuccess: async () => {
        // refresh tasks & streak, then check achievements
        await queryClient.invalidateQueries({ queryKey: ["tasks"] });
        await queryClient.invalidateQueries({ queryKey: ["streak"] });

        // call achievements check endpoint, enqueue results if any
        try {
          const body = await fetchJson("/api/achievements/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          if (Array.isArray(body?.newlyUnlocked) && body.newlyUnlocked.length > 0) {
            setAchievementToasts((prev) => [...prev, ...body.newlyUnlocked]);
          }
          // Ensure we have fresh streak
          queryClient.invalidateQueries({ queryKey: ["streak"] });
        } catch (e) {
          console.warn("achievements check failed", e);
        }
      },
    }
  );

  // Edit Task (simple update -> invalidate)
  const editTaskMutation = useMutation<Task, Error, { id: string; payload: Partial<Task> }>(
    {
      mutationFn: async ({ id, payload }) =>
        fetchJson(`/api/tasks/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      onMutate: async () => {
        setError(null);
        await queryClient.cancelQueries({ queryKey: ["tasks"] });
      },
      onError: (err: Error) => {
        setError(err.message || "Failed to update task");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      },
    }
  );

  // --- Helper actions exposed by the hook --- //
  const fetchTasks = useCallback(
    (force?: boolean) => {
      // When force=true we want to actively refetch even inactive queries;
      // otherwise just invalidate (allowing typical refetch behavior).
      if (force) {
        return queryClient.invalidateQueries({ queryKey: ["tasks"], refetchType: "all" });
      }
      return queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    [queryClient]
  );
  const fetchStreak = useCallback(() => queryClient.invalidateQueries({ queryKey: ["streak"] }), [queryClient]);

  const addTask = useCallback(
    async (newTask: { title: string; description: string; tagNames?: string[] }) => {
      return addTaskMutation.mutateAsync(newTask);
    },
    [addTaskMutation]
  );

  const completeTask = useCallback(async () => {
    const t = activeTask;
    if (!t) return;
    return completeTaskMutation.mutateAsync(t.id);
  }, [activeTask, completeTaskMutation]);

  const saveReflection = useCallback(
    async (reflection: string) => {
      const t = activeTask;
      if (!t) return;
      return saveReflectionMutation.mutateAsync({ id: t.id, reflection });
    },
    [activeTask, saveReflectionMutation]
  );

  const editTask = useCallback(
    async (payload: Partial<Task>) => {
      const t = activeTask;
      if (!t) return;
      return editTaskMutation.mutateAsync({ id: t.id, payload });
    },
    [activeTask, editTaskMutation]
  );

  const clearError = useCallback(() => setError(null), []);
  const removeAchievementToast = useCallback((id: string) => {
    setAchievementToasts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return {
    // data
    task: activeTask,
    archive,
    streak: streakQuery.data ?? null,
    // UI / modal
    isReflectionModalOpen,
    setReflectionModalOpen,
    // flags
    isLoading,
    isRefetching,
  isCompletingTask: completeTaskMutation.status === "pending",
  isSavingReflection: saveReflectionMutation.status === "pending",
    showCongratulations,
    error,
    // actions
    fetchTasks,
    fetchStreak,
    addTask,
    completeTask,
    saveReflection,
    editTask,
    clearError,
    // achievements
    achievementToasts,
    removeAchievementToast,
  } as const;
}
