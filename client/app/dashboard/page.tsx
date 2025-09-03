"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import TaskInput from "../components/TaskInput";
import TaskDisplay from "../components/TaskDisplay";
import ArchiveList from "../components/ArchiveList";
import ReflectionModal from "../components/ReflectionModal";

interface Task {
  id: string;
  content: string;
  isDone: boolean;
  createdAt: string;
  reflection?: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [task, setTask] = useState<Task | null>(null);
  const [archive, setArchive] = useState<Task[]>([]);
  const [isReflectionModalOpen, setReflectionModalOpen] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const tasks = await response.json();
        // For now, let's just set the first task as the current task
        // and the rest as the archive. This logic will need to be improved.
        if (tasks.length > 0) {
          setTask(tasks[0]);
          setArchive(tasks.slice(1));
        }
      }
    };
    fetchTasks();
  }, []);

  const handleAddTask = async (newTask: { title: string; description: string }) => {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: newTask.title, isDone: false }),
    });

    if (response.ok) {
      const createdTask = await response.json();
      setTask(createdTask);
    }
  };

  const handleCompleteTask = async () => {
    if (task) {
      const response = await fetch(`/api/tasks/${task.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isDone: true }),
        });

      if (response.ok) {
        const updatedTask = await response.json();
        setTask(updatedTask);
        setReflectionModalOpen(true);
      }
    }
  };

  const handleSaveReflection = async (reflection: string) => {
    if (task) {
      const response = await fetch(`/api/tasks/${task.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reflection: reflection }),
        });

      if (response.ok) {
        const updatedTask = await response.json();
        setTask(updatedTask);
      }
    }
    setReflectionModalOpen(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12 sm:p-24 bg-background text-foreground">

      <div className="w-full max-w-lg mb-10">
        {task ? (
          <TaskDisplay task={{title: task.content, description: ""}} onComplete={handleCompleteTask} />
        ) : (
          <TaskInput onSubmit={handleAddTask} />
        )}
      </div>

      <ArchiveList tasks={archive.map(t => ({...t, title: t.content, description: "", completed: t.isDone, date: t.createdAt}))} />

      <ReflectionModal
        isOpen={isReflectionModalOpen}
        onClose={() => setReflectionModalOpen(false)}
        onSave={handleSaveReflection}
      />
    </main>
  );
}
