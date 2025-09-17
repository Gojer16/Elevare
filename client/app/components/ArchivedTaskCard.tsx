"use client";
import { motion } from "framer-motion";
import { Quote, Calendar, CheckCircle, XCircle } from "lucide-react";
import type { Task, Tag } from "../../types/task";
import { useTheme } from "@/contexts/ThemeContext";

interface ArchivedTaskCardProps {
  task: Task;
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

const ArchivedTaskCard: React.FC<ArchivedTaskCardProps> = ({ task }) => {
  const { theme } = useTheme();
  const isMinimal = theme === 'minimal';

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ 
        scale: isMinimal ? 1.01 : 1.02, 
        boxShadow: isMinimal ? "0px 2px 8px rgba(0,0,0,0.05)" : "0px 5px 15px rgba(0,0,0,0.05)" 
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        rounded-lg p-5 relative overflow-hidden group
        ${isMinimal 
          ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm' 
          : 'bg-[var(--color-card)] shadow-sm'
        }
      `}
      role="article"
      aria-label={`Archived task: ${task.title}`}
    >
      {/* Accent bar */}
      <div
        className={`absolute top-0 left-0 w-1.5 h-full ${
          task.completed
            ? "bg-[var(--color-success)]"
            : "bg-[var(--color-error)]"
        }`}
      />

      <div className="pl-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h3 className={`
              font-bold text-[var(--color-foreground)] mb-1
              ${isMinimal ? 'text-lg' : 'text-xl'}
            `}>
              {task.title}
            </h3>
            <div className="flex items-center gap-2 text-xs opacity-60">
              <Calendar className="w-3 h-3" />
              <time dateTime={task.createdAt}>{task.date}</time>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {task.completed ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
            <span
              className={`
                text-xs font-bold px-3 py-1 rounded-full
                ${task.completed
                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                }
              `}
              aria-label={`Task status: ${task.completed ? 'Completed' : 'Reset'}`}
            >
              {task.completed ? "COMPLETED" : "RESET"}
            </span>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className={`
            mb-4 opacity-80 text-[var(--color-foreground)]
            ${isMinimal ? 'text-sm' : 'text-sm'}
          `}>
            {task.description}
          </p>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4" role="list" aria-label="Task tags">
            {task.tags.map((tag: Tag) => (
              <span
                key={tag.id}
                className={`
                  text-xs font-semibold px-2.5 py-1 rounded-full
                  ${isMinimal 
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' 
                    : 'bg-[var(--color-primary-accent)]/10 text-[var(--color-primary-accent)]'
                  }
                `}
                role="listitem"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Reflection */}
        {task.reflection && (
          <div className={`
            relative mt-5 pt-4 pl-5 border-l-2 border-dashed
            ${isMinimal 
              ? 'border-gray-300 dark:border-gray-600' 
              : 'border-[var(--color-primary-accent)]'
            }
          `}>
            <Quote className={`
              absolute -left-3.5 top-2 w-6 h-6 opacity-60
              ${isMinimal 
                ? 'text-gray-500 dark:text-gray-400' 
                : 'text-[var(--color-primary-accent)]'
              }
            `} />
            <blockquote className={`
              italic opacity-90 whitespace-pre-wrap
              ${isMinimal ? 'text-sm font-sans' : 'text-base font-serif'}
              text-[var(--color-foreground)]
            `}>
              {task.reflection}
            </blockquote>
          </div>
        )}
      
      </div>
    </motion.div>
  );
};

export default ArchivedTaskCard;
