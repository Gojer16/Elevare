"use client";
import { motion } from "framer-motion";

interface Task {
  id: string;
  title: string;
  description?: string;
  isDone?: boolean;
  reflection?: string;
}

interface TaskDisplayProps {
  task: Task;
  onComplete: () => void;
  onAddReflection: () => void;
  isCompleting: boolean;
}

const TaskDisplay: React.FC<TaskDisplayProps> = ({ task, onComplete, onAddReflection, isCompleting }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg p-6 md:p-8 relative overflow-hidden"
    >
      <h2 className={`text-3xl md:text-3xl font-bold mb-3 text-gray-800`}>
        {task.title}
      </h2>
      
      {task.description && (
        <p className={`text-gray-600 mb-8 whitespace-pre-wrap`}>
          {task.description}
        </p>
      )}

      {task.reflection && (
        <p className={`text-gray-600 mb-8 whitespace-pre-wrap`}>
          <span className="font-semibold">Reflection:</span> {task.reflection}
        </p>
      )}
      
      {task.isDone ? (
        <button
          aria-label="Add a reflection for this task"
          onClick={onAddReflection}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm hover:shadow-md"
        >
          Add Reflection
        </button>
      ) : (
        <button
          aria-label={`Mark task "${task.title}" as complete`}
          onClick={onComplete}
          disabled={isCompleting}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm hover:shadow-md flex items-center justify-center"
        >
          {isCompleting && (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
          )}
          {isCompleting ? "Completing..." : "Mark as Complete"}
        </button>
      )}
    </motion.div>
  );
};

export default TaskDisplay;
