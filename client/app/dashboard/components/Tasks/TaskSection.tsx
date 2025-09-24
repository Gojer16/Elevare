"use client";
import { useState } from "react";
import TaskInput from "./TaskInput";
import { EnhancedTaskDisplay } from "./EnhancedTaskDisplay";
import { EditConfirmationModal } from "./EditConfirmationModal";
import { Task } from "../../hooks/useTask";
import { LoadingCard } from "../Dashboard/LoadingCard";
import { EpicCelebration } from "../Celebration/EpicCelebration";
import { CelebrationSounds } from "../Celebration/CelebrationSounds";
import { ParticleEffects } from "../Celebration/ParticleEffects";

interface TaskSectionProps {
  isLoading: boolean;
  showCongratulations: boolean;
  task: Task | null;
  completedTask?: Task | null;
  isCompletingTask: boolean;
  streak?: { count: number; longest: number };
  onAddTask: (newTask: { title: string; description: string; tagNames?: string[] }) => Promise<Task>;
  onCompleteTask: () => Promise<Task | undefined>;
  onOpenReflection: () => void;
  onEditTask: () => void;
  onShowBot?: () => void;
  onContinueAfterCelebration?: () => void;
  hasCompletedDailyTask?: boolean;
  dailyPrompt?: string;
}

export function TaskSection({
  isLoading,
  showCongratulations,
  task,
  completedTask,
  isCompletingTask,
  streak,
  onAddTask,
  onCompleteTask,
  onOpenReflection,
  onEditTask,
  onShowBot,
  onContinueAfterCelebration,
  hasCompletedDailyTask,
  dailyPrompt,
}: TaskSectionProps) {
  const [showEditConfirmation, setShowEditConfirmation] = useState(false);

  const handleEditClick = () => {
    setShowEditConfirmation(true);
  };

  const handleConfirmEdit = () => {
    onEditTask();
  };
  const renderTaskContent = () => {
    if (isLoading) {
      return <LoadingCard />;
    }

    if (showCongratulations && completedTask) {
      return (
        <>
          <EpicCelebration
            task={completedTask}
            streak={streak}
            onContinue={onContinueAfterCelebration || (() => {})}
            onAddReflection={() => onOpenReflection(completedTask?.id)}
          />
          <CelebrationSounds isPlaying={true} volume={0.2} />
          <ParticleEffects isActive={true} duration={4000} />
        </>
      );
    }

    if (task) {
      return (
        <>
          <EnhancedTaskDisplay
            key={task.id}
            task={task}
            onComplete={onCompleteTask}
            onAddReflection={onOpenReflection}
            isCompleting={isCompletingTask}
            onEdit={handleEditClick}
          />
          
          <EditConfirmationModal
            isOpen={showEditConfirmation}
            onClose={() => setShowEditConfirmation(false)}
            onConfirm={handleConfirmEdit}
            taskTitle={task.title}
          />
        </>
      );
    }

    // If user has completed their daily task, show a simple message.
    if (hasCompletedDailyTask) {
      return (
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <span className="text-white text-2xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-primary)]">
            Mission Accomplished!
            </h2>
            <div className="max-w-md mx-auto">
              <p className="text-base opacity-90 leading-relaxed">
              You&apos;ve completed your most important task today. Take a moment to celebrate your progress!
              </p>
              <p className="text-sm font-medium mt-3 text-[var(--color-secondary)]">
              Come back tomorrow for your next ONE Thing.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-[var(--color-primary)]">
          What&apos;s your ONE Thing today?
          </h2>
          <div className="max-w-md mx-auto">
            <p className="text-base italic opacity-90 leading-relaxed">
            {dailyPrompt}
            </p>
            <p className="text-sm font-medium mt-2 text-[var(--color-secondary)]">
            Type it below, clarity begins with commitment.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--border-color)] border-opacity-30">
          <TaskInput onSubmit={onAddTask} />
        </div>

        {/* Bot Helper Hint */}
        {onShowBot && (
          <div className="mt-6 p-4 bg-gradient-to-r from-[var(--color-secondary)]/5 to-[var(--color-primary)]/5 border border-[var(--color-secondary)]/20 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-foreground)]">
                  Need help deciding?
                  </p>
                  <p className="text-xs text-[var(--color-foreground)]/70">
                  Ask our AI assistant to help you find your ONE thing
                  </p>
                </div>
              </div>
              <button
                onClick={onShowBot}
                className="px-4 py-2 bg-[var(--color-secondary)]/10 hover:bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] rounded-lg transition-colors text-sm font-medium"
              >
              Get Help
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="w-full max-w-2xl">
      {/* Task Section Header */}
      <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] mb-4">
          <div className="w-2 h-2 rounded-full bg-[var(--color-secondary)] animate-pulse"></div>
          <span className="text-sm font-medium opacity-80">Today&apos;s Focus</span>
        </div>
      </div>

      {/* Task Content */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-gradient-to-br from-[var(--card-bg)] to-[var(--card-bg-secondary)] shadow-xl">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-secondary) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Content */}
        <div className="relative p-8">
          {renderTaskContent()}
        </div>
      </div>
    </section>
  );
}