"use client";
import { motion } from "framer-motion";
import { useTheme } from "../../../../contexts/ThemeContext";
import { FiEdit2 } from "react-icons/fi";

interface Task {
  id: string;
  title: string;
  description?: string;
  isDone?: boolean;
  reflection?: string;
  tags?: { id: string; name: string }[];
}

interface TaskDisplayProps {
  task: Task;
  onComplete: () => void;
  onAddReflection: () => void;
  isCompleting: boolean;
  onEdit: () => void;
}

const TaskDisplay: React.FC<TaskDisplayProps> = ({
  task,
  onComplete,
  onAddReflection,
  isCompleting,
  onEdit,
}) => {
  const { theme } = useTheme();

  // 🎨 Layout classes by theme
  const containerClasses = {
    modern:
      "rounded-lg border bg-[var(--card-bg)] text-[var(--color-foreground)] shadow-sm p-6 md:p-8",
    minimal:
      "border-b border-[var(--card-border)] bg-transparent text-[var(--color-foreground)] py-6",
  };

  const titleClasses = {
    modern: "text-2xl md:text-3xl font-bold mb-3",
    minimal: "text-xl md:text-2xl font-semibold mb-2",
  };

  const descriptionClasses = {
    modern: "mb-6 whitespace-pre-wrap text-[var(--color-foreground)]/90 leading-relaxed",
    minimal: "mb-4 whitespace-pre-wrap text-[var(--color-foreground)]/80 italic",
  };

  const tagClasses = {
    modern:
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[var(--color-primary-accent)]/10 text-[var(--color-primary-accent)]",
    minimal:
      "text-xs uppercase tracking-wide text-[var(--color-foreground)]/70 border px-2 py-0.5 rounded-sm",
  };

  const reflectionClasses = {
    modern:
      "mb-6 text-sm text-[var(--color-foreground)]/80 bg-[var(--card-border)]/10 p-3 rounded-md",
    minimal: "mb-4 text-sm text-[var(--color-foreground)]/70 border-l-2 pl-3 italic",
  };

  const buttonCompleteClasses = {
    modern:
      "w-full bg-[var(--color-success)] hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center disabled:opacity-50",
    minimal:
      "mt-3 px-4 py-2 text-sm border border-[var(--card-border)] rounded-md hover:bg-[var(--color-background)] transition disabled:opacity-50",
  };

  const buttonReflectionClasses = {
    modern:
      "w-full bg-[var(--color-primary-accent)] hover:opacity-90 text-white font-medium py-3 px-4 rounded-lg transition-all shadow-sm hover:shadow-md",
    minimal:
      "mt-3 px-3 py-1 text-xs border-b border-dashed border-[var(--color-foreground)] text-[var(--color-foreground)]/80 hover:text-[var(--color-foreground)] transition",
  };

  return (
    <motion.div
      whileHover={{ scale: theme === "modern" ? 1.01 : 1 }}
      whileTap={{ scale: theme === "modern" ? 0.98 : 1 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={containerClasses[theme]}
    >
      {/* Header with title and edit button */}
      <div className="flex justify-between items-start mb-2">
        <h2 className={titleClasses[theme]}>{task.title}</h2>
        {!task.isDone && (
          <button
            onClick={onEdit}
            className="p-2 rounded-full hover:bg-[var(--card-border)] transition-colors"
            aria-label="Edit task"
          >
            <FiEdit2 className="text-[var(--color-foreground)]" />
          </button>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <p className={descriptionClasses[theme]}>{task.description}</p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <motion.div
          className="mb-4 flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {task.tags.map((tag) => (
            <span key={tag.id} className={tagClasses[theme]}>
              {tag.name}
            </span>
          ))}
        </motion.div>
      )}

      {/* Reflection */}
      {task.reflection && (
        <motion.div
          className={reflectionClasses[theme]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="font-semibold">Reflection:</span> {task.reflection}
        </motion.div>
      )}

      {/* Action buttons */}
      {task.isDone ? (
        <button
          aria-label="Add a reflection for this task"
          onClick={onAddReflection}
          className={buttonReflectionClasses[theme]}
        >
          Add Reflection
        </button>
      ) : (
        <button
          aria-label={`Mark task "${task.title}" as complete`}
          onClick={onComplete}
          disabled={isCompleting}
          className={buttonCompleteClasses[theme]}
        >
          {isCompleting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Completing...
            </>
          ) : (
            "Mark as Complete"
          )}
        </button>
      )}
    </motion.div>
  );
};

export default TaskDisplay;
