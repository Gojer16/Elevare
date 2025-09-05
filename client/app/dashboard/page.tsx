"use client";
import { useState, useEffect } from "react";
import TaskInput from "../components/TaskInput";
import TaskDisplay from "../components/TaskDisplay";
import ArchiveList from "../components/ArchiveList";
import ReflectionModal from "../components/ReflectionModal";
import { Task } from "../../types/task";

export default function DashboardPage() {
  const [task, setTask] = useState<Task | null>(null);
  const [archive, setArchive] = useState<Task[]>([]);
  const [isReflectionModalOpen, setReflectionModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompletingTask, setIsCompletingTask] = useState(false);
  const [isSavingReflection, setIsSavingReflection] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);

const fetchTasks = async () => {
  try {
    setIsLoading(true);
    const response = await fetch('/api/tasks');
    if (response.ok) {
      const tasks = await response.json();
      const today = new Date().toDateString();

      // Find active task (not done and created today)
      const activeTask = tasks.find((task: Task) => {
        const taskDate = new Date(task.createdAt).toDateString();
        return !task.isDone && taskDate === today;
      });

      // Find today's completed task
      const todaysCompletedTask = tasks.find((task: Task) => {
        const taskDate = new Date(task.createdAt).toDateString();
        return task.isDone && taskDate === today;
      });

      // Archive includes all other tasks
      const archivedTasks = tasks.filter((task: Task) => {
        const taskDate = new Date(task.createdAt).toDateString();
        return task.isDone || taskDate !== today;
      });

      setTask(activeTask || null);

      // Derive congratulations state from DB data
      if (!activeTask && todaysCompletedTask) {
        setShowCongratulations(true);
      } else {
        setShowCongratulations(false);
      }

      setArchive(archivedTasks);
    } else {
      throw new Error('Failed to fetch tasks');
    }
  } catch (error) {
    alert((error as Error).message);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (newTask: { title: string; description: string }) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTask.title, description: newTask.description, isDone: false }),
      });

      if (response.ok) {
        const createdTask = await response.json();
        setTask(createdTask);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to add task');
      }
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const handleCompleteTask = async () => {
    if (task) {
      try {
        setIsCompletingTask(true);
        // Simulate a network delay for better UX with loading spinner
        await new Promise(resolve => setTimeout(resolve, 500)); 

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
          setTask({...updatedTask, isDone: true});
          
          // Show reflection modal automatically after completing task
          setTimeout(() => setReflectionModalOpen(true), 1500);
        } else {
          throw new Error('Failed to complete task');
        }
      } catch (error) {
        alert((error as Error).message);
      } finally {
        setIsCompletingTask(false);
      }
    }
  };

  const handleSaveReflection = async (reflection: string) => {
    if (task) {
      try {
        setIsSavingReflection(true);
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
          
          // After saving reflection, show congratulations message
          setShowCongratulations(true);
          
          // Refresh archive to include the completed task with reflection
          await fetchTasks();
        } else {
          throw new Error('Failed to save reflection');
        }
      } catch (error) {
        alert((error as Error).message);
      } finally {
        setIsSavingReflection(false);
      }
    }
    setReflectionModalOpen(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-12 sm:p-24 bg-background text-foreground">

      <div className="w-full max-w-lg mb-10">
        {isLoading ? (
          <p>Loading tasks...</p>
        ) : showCongratulations ? (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Congratulations!</h2>
            <p className="text-gray-700 mb-6">Congratulations you complete your most important task today. come back tomorrow for your tomorrow most important task.</p>
          </div>
        ) : task ? (
          <TaskDisplay key={task.id} task={task} onComplete={handleCompleteTask} onAddReflection={() => setReflectionModalOpen(true)} isCompleting={isCompletingTask} />
        ) : (
          <TaskInput onSubmit={handleAddTask} />
        )}
      </div>

      <ArchiveList tasks={archive.map(t => {
          // Format the date to be more user-friendly
          const taskDate = new Date(t.createdAt);
          const formattedDate = taskDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          });
          
          return {...t, description: t.description ?? "", completed: t.isDone, date: formattedDate, reflection: t.reflection ?? ""};
        })} />

      <ReflectionModal
        isOpen={isReflectionModalOpen}
        onClose={() => setReflectionModalOpen(false)}
        onSave={handleSaveReflection}
        isSaving={isSavingReflection}
      />
    </main>
  );
}
