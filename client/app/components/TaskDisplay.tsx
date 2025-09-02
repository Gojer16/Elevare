"use client";

import { motion } from "framer-motion";

// Define the shape of a task
interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  date: string;
}

interface TaskDisplayProps {
  task: Task;
  onComplete: () => void;
}

const TaskDisplay: React.FC<TaskDisplayProps> = ({ task, onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg p-6 md:p-8 relative overflow-hidden"
    >
      {task.completed && (
        <motion.div 
          className="absolute top-4 right-4 text-green-500"
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
        >
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}

      <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
        {task.title}
      </h2>
      
      {task.description && (
        <p className={`text-gray-600 mb-8 whitespace-pre-wrap ${task.completed ? 'text-gray-400' : ''}`}>
          {task.description}
        </p>
      )}
      
      {!task.completed && (
        <button
          onClick={onComplete}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm hover:shadow-md"
        >
          Mark as Complete
        </button>
      )}
    </motion.div>
  );
};

export default TaskDisplay;
