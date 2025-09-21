import { Task } from "../types/api";

export const selectTask = (tasks: Task[]): Task | null => {
  if (tasks.length === 0) return null;

  return tasks
    .slice() // avoid mutating original
    .sort((a, b) => {
      // Higher priority first
      if (b.priority !== a.priority) return b.priority - a.priority;

      // Earlier due date first (only if both have valid dates)
      const aDate = a.dueDate ? new Date(a.dueDate) : null;
      const bDate = b.dueDate ? new Date(b.dueDate) : null;

      if (aDate && bDate) {
        const diff = aDate.getTime() - bDate.getTime();
        if (diff !== 0) return diff;
      }

      //  Fallback: alphabetical by name
      return a.name.localeCompare(b.name);
    })[0];
};
