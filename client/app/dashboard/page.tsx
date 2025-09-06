"use client";
import TaskInput from "../components/TaskInput";
import TaskDisplay from "../components/TaskDisplay";
import ArchiveList from "../components/ArchiveList";
import ReflectionModal from "../components/ReflectionModal";
import { useTasks } from "../hooks/useTask";


export default function DashboardPage() {
  const {
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
  } = useTasks();

  return (
    <main className="bg-gradient-to-b from-violet-50 via-white to-gray-50 flex min-h-screen flex-col items-center p-12 sm:p-24 bg-background text-foreground">

      <div className="w-full max-w-lg mb-10">
        {isLoading ? (
          <p>Loading tasks...</p>
        ) : showCongratulations ? (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 text-center">
            <h2 className="text-2xl font-bold text-secondary mb-4">Congratulations!</h2>
            <p className="text-gray-700 mb-6">Congratulations you complete your most important task today. come back tomorrow for your tomorrow most important task.</p>
          </div>
        ) : task ? (
          <TaskDisplay 
          key={task.id} 
          task={task} 
          onComplete={completeTask} 
          onAddReflection={() => setReflectionModalOpen(true)} 
          isCompleting={isCompletingTask} 
        />
        ) : (
          <TaskInput onSubmit={addTask} />
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
        onSave={saveReflection}
        isSaving={isSavingReflection}
      />
    </main>
  );
}
