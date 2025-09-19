"use client";
import { Suspense, useState } from "react";
import { useTasks, Task } from "../dashboard/hooks/useTask";
import { useQuote } from "./hooks/useQuote";
import { AchievementToastContainer } from "@/components/AchievementToast";
import LoadingSpinner from "../components/LoadingSpinner";
import { DashboardHeader } from "./components/Dashboard/DashboardHeader";
import { StreakDisplay } from "./components/Dashboard/StreakDisplay";
import { ErrorAlert } from "./components/Dashboard/ErrorAlert";
import { TaskSection } from "./components/Tasks/TaskSection";
import { DashboardModals } from "./components/Dashboard/DashboardModals";
import { SectionDivider } from "./components/UI/SectionDivider";

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
  } = useTasks();

  const { quote } = useQuote();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

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
      <main className="flex min-h-screen flex-col items-center px-6 sm:px-12 py-8 sm:py-12 bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors duration-300">
        {/* Header Section */}
        <div className="w-full max-w-4xl mb-12">
          <DashboardHeader quote={quote || undefined} />
        </div>

        {/* Streak Display */}
        {streak && (
          <div className="w-full max-w-2xl mb-8">
            <StreakDisplay streak={streak} />
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="w-full max-w-2xl mb-8">
            <ErrorAlert error={error} onClear={clearError} />
          </div>
        )}

        {/* Section Divider */}
        <SectionDivider variant="subtle" />

        {/* Main Task Section */}
        <div className="w-full flex justify-center mb-16">
          <TaskSection
            isLoading={isLoading}
            showCongratulations={showCongratulations}
            task={task}
            isCompletingTask={isCompletingTask}
            onAddTask={addTask}
            onCompleteTask={completeTask}
            onOpenReflection={() => setReflectionModalOpen(true)}
            onEditTask={() => setIsEditModalOpen(true)}
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