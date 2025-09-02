"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import TaskInput from "../components/TaskInput";
import TaskDisplay from "../components/TaskDisplay";
import ArchiveList from "../components/ArchiveList";
import ReflectionModal from "../components/ReflectionModal";

// Define the shape of a task
interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  date: string;
  reflection?: string;
}

export default function DashboardPage() {
  const [task, setTask] = useState<Task | null>(null);
  const [archive, setArchive] = useState<Task[]>([]);
  const [isReflectionModalOpen, setReflectionModalOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();

  // On initial load, handle task and archive
  useEffect(() => {
    const savedArchive = localStorage.getItem("task_archive");
    const archiveData = savedArchive ? JSON.parse(savedArchive) : [];
    setArchive(archiveData);

    const savedTask = localStorage.getItem("today_task");
    if (savedTask) {
      const taskData = JSON.parse(savedTask);
      if (taskData.date === new Date().toISOString().slice(0, 10)) {
        setTask(taskData);
      } else {
        const updatedArchive = [taskData, ...archiveData];
        setArchive(updatedArchive);
        localStorage.setItem("task_archive", JSON.stringify(updatedArchive));
        localStorage.removeItem("today_task");
      }
    }
  }, []);

  const handleAddTask = (newTask: { title: string; description: string }) => {
    const taskWithId: Task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false,
      date: new Date().toISOString().slice(0, 10),
    };
    setTask(taskWithId);
    localStorage.setItem("today_task", JSON.stringify(taskWithId));
  };

  const handleCompleteTask = () => {
    if (task) {
      const updatedTask = { ...task, completed: true };
      setTask(updatedTask);
      localStorage.setItem("today_task", JSON.stringify(updatedTask));
      setReflectionModalOpen(true);
    }
  };

  const handleSaveReflection = (reflection: string) => {
    if (task) {
      const updatedTask = { ...task, reflection };
      setTask(updatedTask);
      localStorage.setItem("today_task", JSON.stringify(updatedTask));
    }
    setReflectionModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12 sm:p-24 bg-background text-foreground">
      <header className="w-full max-w-lg mb-10 text-center relative">
        <h1 className="text-4xl sm:text-5xl font-bold mb-2">The ONE Thing</h1>
        <p className="text-zinc-400">Focus on what matters most, every day.</p>
        <button onClick={handleLogout} className="absolute top-0 right-0 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors">
          Logout
        </button>
      </header>
      
      <div className="w-full max-w-lg mb-10">
        {task ? (
          <TaskDisplay task={task} onComplete={handleCompleteTask} />
        ) : (
          <TaskInput onSubmit={handleAddTask} />
        )}
      </div>

      <ArchiveList tasks={archive} />

      <ReflectionModal 
        isOpen={isReflectionModalOpen} 
        onClose={() => setReflectionModalOpen(false)} 
        onSave={handleSaveReflection} 
      />
    </main>
  );
}