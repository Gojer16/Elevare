"use client";
import { useState, useEffect } from "react";
import { Task } from "../../types/task";

export function useTasks() {
  const [task, setTask] = useState<Task | null>(null);
  const [archive, setArchive] = useState<Task[]>([]);
  const [isReflectionModalOpen, setReflectionModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompletingTask, setIsCompletingTask] = useState(false);
  const [isSavingReflection, setIsSavingReflection] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);

  // --- Fetch tasks ---
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");

      const tasks: Task[] = await response.json();
      const today = new Date().toDateString();

      const activeTask = tasks.find(
        (t) => !t.isDone && new Date(t.createdAt).toDateString() === today
      );

      const todaysCompletedTask = tasks.find(
        (t) => t.isDone && new Date(t.createdAt).toDateString() === today
      );

      const archivedTasks = tasks.filter((t) => {
        const taskDate = new Date(t.createdAt).toDateString();
        return t.isDone || taskDate !== today;
      });

      setTask(activeTask || null);
      setArchive(archivedTasks);
      setShowCongratulations(!activeTask && !!todaysCompletedTask);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Add a new task ---
  const addTask = async (newTask: { title: string; description: string }) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newTask, isDone: false }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add task");
      }

      const createdTask = await response.json();
      setTask(createdTask);
    } catch (error) {
      alert((error as Error).message);
    }
  };

  // --- Complete task ---
  const completeTask = async () => {
    if (!task) return;
    try {
      setIsCompletingTask(true);
      await new Promise((resolve) => setTimeout(resolve, 500)); // UX delay

      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDone: true }),
      });

      if (!response.ok) throw new Error("Failed to complete task");

      const updatedTask = await response.json();
      setTask({ ...updatedTask, isDone: true });

      // Open reflection modal
      setTimeout(() => setReflectionModalOpen(true), 1500);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsCompletingTask(false);
    }
  };

  // --- Save reflection ---
  const saveReflection = async (reflection: string) => {
    if (!task) return;
    try {
      setIsSavingReflection(true);

      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reflection }),
      });

      if (!response.ok) throw new Error("Failed to save reflection");

      const updatedTask = await response.json();
      setTask(updatedTask);
      setShowCongratulations(true);
      await fetchTasks(); // refresh archive
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsSavingReflection(false);
      setReflectionModalOpen(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    task,
    archive,
    isReflectionModalOpen,
    setReflectionModalOpen,
    isLoading,
    isCompletingTask,
    isSavingReflection,
    showCongratulations,
    fetchTasks,
    addTask,
    completeTask,
    saveReflection,
  };
}
