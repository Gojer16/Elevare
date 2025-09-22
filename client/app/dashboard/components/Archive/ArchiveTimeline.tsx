"use client";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { EnhancedArchiveCard } from "./EnhancedArchiveCard";
import type { Task } from "../../../../types/task";

interface ArchiveTimelineProps {
  tasks: Task[];
  viewMode: 'grid' | 'timeline';
}

export function ArchiveTimeline({ tasks, viewMode }: ArchiveTimelineProps) {
  // Group tasks by date for timeline view
  const groupedTasks = useMemo(() => {
    if (viewMode !== 'timeline') return null;

    const groups: { [key: string]: Task[] } = {};
    
    tasks.forEach(task => {
      const date = new Date(task.createdAt);
      const dateKey = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(task);
    });

    // Convert to array and sort by date (newest first)
    return Object.entries(groups)
      .map(([date, tasks]) => ({
        date,
        tasks: tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        dateObj: new Date(tasks[0].createdAt)
      }))
      .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
  }, [tasks, viewMode]);

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tasks.map((task, index) => (
          <EnhancedArchiveCard key={task.id} task={task} index={index} />
        ))}
      </div>
    );
  }

  if (!groupedTasks || groupedTasks.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--color-secondary)] via-[var(--color-primary)] to-[var(--color-secondary)] opacity-30" />
      
      <div className="space-y-12">
        {groupedTasks.map((group, groupIndex) => (
          <motion.div
            key={group.date}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
            className="relative"
          >
            {/* Date Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-4 h-4 bg-[var(--color-secondary)] rounded-full border-4 border-[var(--card-bg)] shadow-lg" />
                <div className="absolute inset-0 w-4 h-4 bg-[var(--color-secondary)] rounded-full opacity-20" />
              </div>
              <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl px-4 py-2 shadow-sm">
                <h3 className="font-semibold text-[var(--color-foreground)]">
                  {group.date}
                </h3>
                <p className="text-sm text-[var(--color-foreground)]/60">
                  {group.tasks.length} task{group.tasks.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Tasks for this date */}
            <div className="ml-12 space-y-4">
              {group.tasks.map((task, taskIndex) => (
                <EnhancedArchiveCard 
                  key={task.id} 
                  task={task} 
                  index={groupIndex * 10 + taskIndex} 
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}