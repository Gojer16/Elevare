"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Calendar, CheckCircle, XCircle, MessageSquare, Tag as TagIcon, ChevronDown, ChevronUp } from "lucide-react";
import type { Task, Tag } from "../../../../types/task";

interface EnhancedArchiveCardProps {
  task: Task;
  index: number;
}

export function EnhancedArchiveCard({ task, index }: EnhancedArchiveCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isCompleted = task.isDone;
  const hasReflection = task.reflection && task.reflection.length > 0;
  const hasDescription = task.description && task.description.length > 0;
  const hasTags = task.tags && task.tags.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="group relative"
    >
      {/* Main Card */}
      <div className={`
        relative overflow-hidden rounded-2xl border transition-all duration-300
        ${isCompleted 
          ? 'bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-900/10 dark:to-emerald-900/5 border-green-200/50 dark:border-green-800/30' 
          : 'bg-gradient-to-br from-red-50/50 to-orange-50/30 dark:from-red-900/10 dark:to-orange-900/5 border-red-200/50 dark:border-red-800/30'
        }
        hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20
      `}>
        
        {/* Status Indicator */}
        <div className={`
          absolute top-0 left-0 w-full h-1
          ${isCompleted 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
            : 'bg-gradient-to-r from-red-500 to-orange-500'
          }
        `} />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-[var(--color-foreground)] truncate">
                  {task.title}
                </h3>
                <div className={`
                  flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                  ${isCompleted
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  }
                `}>
                  {isCompleted ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {isCompleted ? 'Completed' : 'Reset'}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-[var(--color-foreground)]/60">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={task.createdAt}>
                    {new Date(task.createdAt).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </time>
                </div>
                
                {hasReflection && (
                  <div className="flex items-center gap-1.5 text-[var(--color-secondary)]">
                    <MessageSquare className="w-4 h-4" />
                    <span>Has reflection</span>
                  </div>
                )}
              </div>
            </div>

            {/* Expand Button */}
            {(hasDescription || hasReflection || hasTags) && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            )}
          </div>

          {/* Quick Preview */}
          {hasDescription && !isExpanded && (
            <p className="text-[var(--color-foreground)]/70 text-sm line-clamp-2 mb-3">
              {task.description}
            </p>
          )}

          {/* Tags Preview */}
          {hasTags && !isExpanded && (
            <div className="flex items-center gap-2 mb-3">
              <TagIcon className="w-4 h-4 text-[var(--color-foreground)]/40" />
              <div className="flex gap-1 flex-wrap">
                {task.tags?.slice(0, 3).map((tag: Tag) => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] 
                               rounded-full text-xs font-medium"
                  >
                    {tag.name}
                  </span>
                ))}
                {task.tags && task.tags.length > 3 && (
                  <span className="px-2 py-1 bg-[var(--color-foreground)]/10 text-[var(--color-foreground)]/60 
                                   rounded-full text-xs">
                    +{task.tags.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Expandable Content */}
          <motion.div
            initial={false}
            animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-4 border-t border-[var(--border-color)]/30">
              {/* Full Description */}
              {hasDescription && (
                <div>
                  <h4 className="text-sm font-semibold text-[var(--color-foreground)] mb-2">
                    Description
                  </h4>
                  <p className="text-[var(--color-foreground)]/80 text-sm leading-relaxed whitespace-pre-wrap">
                    {task.description}
                  </p>
                </div>
              )}

              {/* All Tags */}
              {hasTags && (
                <div>
                  <h4 className="text-sm font-semibold text-[var(--color-foreground)] mb-2 flex items-center gap-2">
                    <TagIcon className="w-4 h-4" />
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {task.tags?.map((tag: Tag) => (
                      <span
                        key={tag.id}
                        className="px-3 py-1.5 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] 
                                   rounded-full text-sm font-medium border border-[var(--color-secondary)]/20"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reflection */}
              {hasReflection && (
                <div>
                  <h4 className="text-sm font-semibold text-[var(--color-foreground)] mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Reflection
                  </h4>
                  <div className="relative">
                    <div className="absolute left-0 top-0 w-1 h-full bg-[var(--color-secondary)]/30 rounded-full" />
                    <blockquote className="pl-4 text-[var(--color-foreground)]/80 italic leading-relaxed whitespace-pre-wrap">
                      "{task.reflection}"
                    </blockquote>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}