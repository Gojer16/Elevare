"use client";
import TaskInput from "./TaskInput";
import TaskDisplay from "./TaskDisplay";
import { Task } from "../../hooks/useTask";
import { dailyPrompts } from "../../../data/dailyPrompts";
import { LoadingCard } from "../Dashboard/LoadingCard";
import { CongratulationsCard } from "../Dashboard/CongratulationsCard";

interface TaskSectionProps {
  isLoading: boolean;
  showCongratulations: boolean;
  task: Task | null;
  isCompletingTask: boolean;
  onAddTask: (newTask: { title: string; description: string; tagNames?: string[] }) => Promise<Task>;
  onCompleteTask: () => Promise<Task | undefined>;
  onOpenReflection: () => void;
  onEditTask: () => void;
}

export function TaskSection({
  isLoading,
  showCongratulations,
  task,
  isCompletingTask,
  onAddTask,
  onCompleteTask,
  onOpenReflection,
  onEditTask,
}: TaskSectionProps) {
  const renderTaskContent = () => {
    if (isLoading) {
      return <LoadingCard />;
    }

    if (showCongratulations) {
      return <CongratulationsCard />;
    }

    if (task) {
      return (
        <TaskDisplay
          key={task.id}
          task={task}
          onComplete={onCompleteTask}
          onAddReflection={onOpenReflection}
          isCompleting={isCompletingTask}
          onEdit={onEditTask}
        />
      );
    }

    return (
      <div className="text-center space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-[var(--color-primary)]">
          What's your ONE Thing today?
          </h2>
          <div className="max-w-md mx-auto">
            <p className="text-base italic opacity-90 leading-relaxed">
            {dailyPrompts[Math.floor(Math.random() * dailyPrompts.length)]}
            </p>
            <p className="text-sm font-medium mt-2 text-[var(--color-secondary)]">
            Type it below, clarity begins with commitment.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--border-color)] border-opacity-30">
          <TaskInput onSubmit={onAddTask} />
        </div>
      </div>
    );
  };

  return (
    <section className="w-full max-w-2xl">
      {/* Task Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] mb-4">
          <div className="w-2 h-2 rounded-full bg-[var(--color-secondary)] animate-pulse"></div>
          <span className="text-sm font-medium opacity-80">Today's Focus</span>
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