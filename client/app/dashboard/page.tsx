"use client";
import { Suspense } from "react";
import TaskInput from "../components/TaskInput";
import TaskDisplay from "../components/TaskDisplay";
import ReflectionModal from "../components/ReflectionModal";
import EditTaskModal from "../components/EditTaskModal";
import { useTasks, Task } from "../hooks/useTask";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { dailyPrompts } from "../data/dailyPrompts";
import { useEffect, useState } from "react";
import { quotes } from "../data/quotes";
import { FiTrendingUp } from "react-icons/fi";
import { AchievementToastContainer } from "@/components/AchievementToast";
import LoadingSpinner from "../components/LoadingSpinner";

export default function DashboardPage() {
  const {
    task,
    streak,
    isReflectionModalOpen,
    setReflectionModalOpen,
    isLoading,
    isRefetching,
    isCompletingTask,
    isSavingReflection,
    showCongratulations,
    error,
    fetchTasks,
    addTask,
    completeTask,
    saveReflection,
    editTask,
    clearError,
    achievementToasts,
    removeAchievementToast,
  } = useTasks();
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(random);
  }, []);

  const handleEditSave = async (updatedTask: Partial<Task>) => {
    try {
      setIsSavingEdit(true);
      await editTask(updatedTask);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to save edit:", error);
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
     <Suspense fallback={<LoadingSpinner message="Preparing your dashboard..." />}>
    <main className="flex min-h-screen flex-col items-center px-6 sm:px-12 py-12 sm:py-20 bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors duration-300">
      {/* Header */}
      <div className="text-center mb-12 w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Welcome back, your focus ritual starts here
          </h1>
          <button
            onClick={() => fetchTasks(true)}
            disabled={isRefetching}
            className="p-2 rounded-full hover:bg-[var(--card-bg)] transition-colors"
            aria-label="Refresh tasks"
          >
            
          </button>
        </div>
        <p className="mt-3 text-lg italic opacity-80">
          “One day. One task. One step closer.”
        </p>

        {quote && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-6 card max-w-lg mx-auto text-center"
          >
            <p className="text-lg font-medium">“{quote.text}”</p>
            <p className="text-sm mt-2 opacity-70">— {quote.author}</p>
          </motion.div>
        )}
      </div>

      {/* Streak Display */}
      {streak && streak.count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl mb-8"
        >
          <div className="card p-4 flex items-center justify-center gap-3">
            <FiTrendingUp className="text-xl" style={{ color: 'var(--color-secondary)' }} />
            <span className="font-bold" style={{ color: 'var(--color-secondary)' }}>{streak.count} day streak!</span>
            <span className="text-sm" style={{ color: 'var(--color-foreground)' }}>(Longest: {streak.longest})</span>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-xl mb-6">
          <div className="px-4 py-3 rounded relative border" role="alert" style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', borderColor: 'var(--color-error)', color: 'var(--color-error)' }}>
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button 
              onClick={clearError}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style={{ color: 'var(--color-error)' }}>
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Task Area */}
      <div className="w-full max-w-xl mb-12">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="card text-center"
          >
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading your day…</span>
            </div>
          </motion.div>
        ) : showCongratulations ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="card text-center relative"
          >
            <Confetti recycle={false} numberOfPieces={150} />

            <h2 className="text-2xl font-bold text-[var(--color-success)] mb-4">
              🎉 You did it!
            </h2>
            <p className="opacity-90 mb-6">
              One clear win today, tomorrow we build on this momentum.
              <br />
              <span className="font-medium">
                Extraordinary results come from small, consistent actions.
              </span>
            </p>
          </motion.div>
        ) : task ? (
          <TaskDisplay
            key={task.id}
            task={task}
            onComplete={completeTask}
            onAddReflection={() => setReflectionModalOpen(true)}
            isCompleting={isCompletingTask}
            onEdit={() => setIsEditModalOpen(true)}
          />
        ) : (
          <div className="card text-center">
            <h2 className="text-xl font-semibold mb-3">
              What’s your ONE Thing today?
            </h2>
            <p className="mb-4 italic opacity-80">
              {dailyPrompts[Math.floor(Math.random() * dailyPrompts.length)]}
              <br />
              <span className="font-medium">
                Type it below — clarity begins with commitment.
              </span>
            </p>
            <TaskInput onSubmit={addTask} />
          </div>
        )}
      </div>

      {/* Reflection Modal */}
      <ReflectionModal
        isOpen={isReflectionModalOpen}
        onClose={() => setReflectionModalOpen(false)}
        onSave={saveReflection}
        isSaving={isSavingReflection}
        title="How did today’s focus go?"
        subtitle="What’s one lesson you’ll carry into tomorrow?"
        successAnimation="stars"
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditSave}
        task={task}
        isSaving={isSavingEdit}
      />

      {/* Achievement Toasts */}
      <AchievementToastContainer
        achievements={achievementToasts}
        onRemove={removeAchievementToast}
      />

      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            name: "Elevare Dashboard",
            description:
              "Elevare Dashboard — your daily focus ritual. Add today’s ONE Thing, complete it, and track your momentum in your personal archive.",
            mainEntity: {
              "@type": "WebApplication",
              name: "Elevare",
              applicationCategory: "Productivity",
              operatingSystem: "Web",
              keywords:
                "focus app, productivity app, task manager, one thing method",
            },
          }),
        }}
      />
    </main>
    </Suspense>
  );
}
