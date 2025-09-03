"use client";
import { motion } from "framer-motion";

interface Task {
  title: string;
  description?: string;
}

interface TaskDisplayProps {
  task: Task;
  onComplete: () => void;
}

const TaskDisplay: React.FC<TaskDisplayProps> = ({ task, onComplete }) => {
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
        <p className={`text-gray-600 line-clamp-1 mb-8 whitespace-pre-wrap`}>
          {task.description}
        </p>
      )}
      
      <button
        aria-label={`Mark task "${task.title}" as complete`}
        onClick={onComplete}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm hover:shadow-md"
      >
      Mark as Complete
      </button>
    </motion.div>
  );
};

export default TaskDisplay;
