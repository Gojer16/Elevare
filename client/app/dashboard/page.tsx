"use client";
import { Suspense, useState, useEffect, useMemo } from "react";
import { useTasks, Task } from "../dashboard/hooks/useTask";
import { useQuote } from "./hooks/useQuote";
import { useDailyPrompt } from "./hooks/useDailyPrompt"; 
import { AchievementToastContainer } from "@/components/AchievementToast";
import LoadingSpinner from "../components/LoadingSpinner";
import { DashboardHeader } from "./components/Dashboard/DashboardHeader";
import { ErrorAlert } from "./components/Dashboard/ErrorAlert";
import { TaskSection } from "./components/Tasks/TaskSection";
import { DashboardModals } from "./components/Dashboard/DashboardModals";
import { SectionDivider } from "./components/UI/SectionDivider";
import { StreakCelebration } from "./components/Dashboard/StreakCelebration";
import { DashboardBackground } from "./components/UI/DashboardBackground";
import { OneThingBot } from "./components/AI/OneThingBot";
import { BotIntroTooltip } from "./components/AI/BotIntroTooltip";
import { useOneThingBot } from "./hooks/useOneThingBot";

export default function DashboardPage() {
  const {
    task,
    streak,
    isReflectionModalOpen,
    setReflectionModalOpen,
    isLoading,
    isCompletingTask,
    isSavingReflection,
    showCongratulations,
    error,
    addTask,
    completeTask,
    saveReflection,
    editTask,
    clearError,
    achievementToasts,
    removeAchievementToast,
    archive,
  } = useTasks();

  // Check if user has completed their daily task
  const hasCompletedDailyTask = useMemo(() => {
    if (error && error.includes("already completed your daily task")) {
      return true;
    }
    // Also check if there's a completed task from today in the archive
    const today = new Date().toDateString();
    return archive.some(t => t.isDone && new Date(t.createdAt).toDateString() === today);
  }, [error, archive]);

  const { quote } = useQuote();
  const { prompt } = useDailyPrompt(); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [completedTask, setCompletedTask] = useState<Task | null>(null);
  const { isBotVisible, hasSeenBot, toggleBot, showBot } = useOneThingBot();
  const [showBotIntro, setShowBotIntro] = useState(false);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  // Show bot intro for new users when they don't have a task and haven't completed daily task
  useEffect(() => {
    if (!hasSeenBot && !task && !isLoading && !showCongratulations && !hasSeenIntro && !hasCompletedDailyTask) {
      const timer = setTimeout(() => {
        setShowBotIntro(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasSeenBot, task, isLoading, showCongratulations, hasSeenIntro, hasCompletedDailyTask]);

  const handleDismissIntro = () => {
    setShowBotIntro(false);
    setHasSeenIntro(true);
  };

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

  const handleBotTaskSuggestion = async (taskSuggestion: string) => {
    try {
      await addTask({
        title: taskSuggestion,
        description: "Suggested by AI assistant",
        tagNames: ["ai-suggested"]
      });
    } catch (error) {
      console.error("Failed to add suggested task:", error);
    }
  };

  const handleCompleteTask = async () => {
    if (task) {
      setCompletedTask(task); // Store the completed task for celebration
      const result = await completeTask();
      return result;
    }
  };

  const handleContinueAfterCelebration = () => {
    setCompletedTask(null); // Clear completed task to return to normal state
  };

  return (
    <Suspense fallback={<LoadingSpinner message="Preparing your dashboard..." />}>
      <main className="relative flex min-h-screen flex-col items-center px-6 sm:px-12 py-8 sm:py-8 text-[var(--color-foreground)] transition-colors duration-300 overflow-hidden">
        {/* Beautiful Soft Background */}
        <DashboardBackground variant="soft" />
        {/* Header Section */}
        <div className="w-full max-w-4xl mb-2">
          <DashboardHeader
            quote={quote || undefined}
            streak={streak || undefined}
          />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="w-full max-w-2xl mb-4">
            {error.includes("already completed your daily task") ? (
              <div className="w-full max-w-xl mb-6">
                <div
                  className="px-6 py-4 rounded-xl relative border text-center"
                  role="alert"
                  style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.08)',
                    borderColor: 'var(--color-success, #22c55e)',
                    color: 'var(--color-success, #22c55e)'
                  }}
                >             
                  <button
                    onClick={clearError}
                    className="absolute top-2 right-2 p-2 hover:opacity-75 transition-opacity rounded-full"
                    aria-label="Close message"
                  >
                    <svg
                      className="fill-current h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      style={{ color: 'var(--color-success, #22c55e)' }}
                    >
                      <title>Close</title>
                      <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <ErrorAlert error={error} onClear={clearError} />
            )}
          </div>
        )}

        {/* Section Divider */}
        <SectionDivider variant="prominent" />

        {/* Main Task Section */}
        <div className="w-full flex justify-center mb-16">
          <TaskSection
            isLoading={isLoading}
            showCongratulations={showCongratulations}
            task={task}
            completedTask={completedTask}
            isCompletingTask={isCompletingTask}
            streak={streak || undefined}
            onAddTask={addTask}
            onCompleteTask={handleCompleteTask}
            onOpenReflection={() => setReflectionModalOpen(true)}
            onEditTask={() => setIsEditModalOpen(true)}
            onShowBot={!task && !hasCompletedDailyTask ? showBot : undefined}
            onContinueAfterCelebration={handleContinueAfterCelebration}
            hasCompletedDailyTask={hasCompletedDailyTask}
            dailyPrompt={prompt ?? undefined} 
          />
        </div>

       
        {/* Modals */}
        <DashboardModals
          isReflectionOpen={isReflectionModalOpen}
          onCloseReflection={() => setReflectionModalOpen(false)}
          onSaveReflection={saveReflection}
          isSavingReflection={isSavingReflection}
          isEditOpen={isEditModalOpen}
          onCloseEdit={() => setIsEditModalOpen(false)}
          onSaveEdit={handleEditSave}
          task={task}
          isSavingEdit={isSavingEdit}
        />

        {/* Achievement Toasts */}
        <AchievementToastContainer
          achievements={achievementToasts}
          onRemove={removeAchievementToast}
        />

        {/* Floating Streak Widget */}
        {/* {streak && <FloatingStreak streak={streak} position="bottom-left" />} */}

        {/* ONE Thing Bot */}
        <OneThingBot
          isVisible={isBotVisible}
          onToggle={toggleBot}
          onTaskSuggestion={handleBotTaskSuggestion}
        />

        {/* Bot Intro Tooltip for new users */}
        <BotIntroTooltip
          isVisible={showBotIntro}
          onDismiss={handleDismissIntro}
          onOpenBot={() => {
            showBot();
            handleDismissIntro();
          }}
        />

        {/* Streak Celebration Modal */}
        {streak && (
          <StreakCelebration
            streak={streak}
            isVisible={showStreakCelebration}
            onClose={() => setShowStreakCelebration(false)}
          />
        )}

        {/* SEO Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfilePage",
              name: "Elevare Dashboard",
              description:
                "Elevare Dashboard — your daily focus ritual. Add today's ONE Thing, complete it, and track your momentum in your personal archive.",
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