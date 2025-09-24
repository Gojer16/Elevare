"use client";
import { useCallback, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task } from "../../../types/task";

export type { Task };

/**
 * Achievement interface
 * 
 * Represents an achievement that users can unlock in the Elevare application
 */
interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string | null;
}

/**
 * Streak interface
 * 
 * Represents a user's streak information (consecutive days of task completion)
 */
interface Streak {
  id: string;
  count: number;
  longest: number;
  lastActive: string;
}

/**
 * Lightweight fetch wrapper used by the hook.
 * 
 * This function handles API requests and normalizes error responses.
 * It automatically includes credentials and properly handles JSON responses.
 * 
 * @param input - The URL or Request object to fetch
 * @param init - Optional fetch initialization options
 * @returns The parsed JSON response body
 * @throws Error with normalized message on non-2xx responses
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
 * Custom React hook for managing tasks in the Elevare dashboard
 * 
 * This hook provides a complete interface to the task management functionality
 * using React Query for data fetching, caching, and synchronization.
 * 
 * It handles:
 * - Fetching and caching user tasks
 * - Creating new tasks
 * - Updating tasks (completing, reflecting, editing)
 * - Managing streaks and achievements
 * - Providing UI state for the dashboard
 * 
 * @returns An object containing tasks data, UI state flags, and action functions
 */
export function useTasks() {
  const queryClient = useQueryClient();
  const [isReflectionModalOpen, setReflectionModalOpen] = useState(false);
  const [achievementToasts, setAchievementToasts] = useState<Achievement[]>([]);
  const [error, setError] = useState<string | null>(null);

  // --- Queries --- //
  // Fetches the user's tasks from the API
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

  // Fetches the user's streak information
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

  // --- Derived UI state from tasks query --- //
  // All tasks for the current user
  const tasks = useMemo(() => (tasksQuery.data ?? []) as Task[], [tasksQuery.data]);

  // The currently active (not completed) task
  const activeTask = useMemo(() => tasks.find((t: Task) => !t.isDone) ?? null, [tasks]);

  // Archive of completed tasks (all tasks except the active one)
  const archive = useMemo(() => {
    if (!activeTask) return tasks.filter((t: Task) => t.isDone);
    return tasks.filter((t: Task) => t.id !== activeTask.id);
  }, [tasks, activeTask]);

  // Helper to determine if user should see congratulations message
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

  // Mutation to add a new task
  // This mutation invalidates the tasks query after successful creation
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

  // Mutation to complete a task with optimistic update
  // Updates the UI immediately and rolls back on error
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
      onSuccess: async (_, taskId) => {
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
        // Store the task ID for when the reflection modal is opened
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

  // Mutation to save a reflection on a task
  // After successful save, checks for newly unlocked achievements
  const saveReflectionMutation = useMutation<void, Error, { id: string; reflection: string }>(
    {
      mutationFn: async ({ id, reflection }) => {
        // Only save reflection to the dedicated reflections table
        // This prevents duplicates since we were saving to both task.reflection and Reflection table
        await fetchJson("/api/reflection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            message: reflection,
            taskId: id
          }),
        });
      },
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

  // Mutation to edit task details (title, description, etc.)
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
  // Function to manually trigger a refetch of tasks
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
  
  // Function to manually trigger a refetch of streak data
  const fetchStreak = useCallback(() => queryClient.invalidateQueries({ queryKey: ["streak"] }), [queryClient]);

  // Function to add a new task
  const addTask = useCallback(
    async (newTask: { title: string; description: string; tagNames?: string[] }) => {
      return addTaskMutation.mutateAsync(newTask);
    },
    [addTaskMutation]
  );

  // Function to complete the current active task
  const completeTask = useCallback(async () => {
    const t = activeTask;
    if (!t) return;
    return completeTaskMutation.mutateAsync(t.id);
  }, [activeTask, completeTaskMutation]);

  // Function to save a reflection on a specific task
  const saveReflection = useCallback(
    async (reflection: string, taskId?: string) => {
      const t = taskId ? tasks.find(task => task.id === taskId) : activeTask;
      if (!t) return;
      return saveReflectionMutation.mutateAsync({ id: t.id, reflection });
    },
    [activeTask, saveReflectionMutation, tasks]
  );

  // Function to edit the current active task
  const editTask = useCallback(
    async (payload: Partial<Task>) => {
      const t = activeTask;
      if (!t) return;
      return editTaskMutation.mutateAsync({ id: t.id, payload });
    },
    [activeTask, editTaskMutation]
  );

  // Function to clear the current error state
  const clearError = useCallback(() => setError(null), []);
  
  // Function to remove an achievement toast
  const removeAchievementToast = useCallback((id: string) => {
    setAchievementToasts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // Return the complete interface for the dashboard
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
