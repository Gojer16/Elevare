"use client";
import { motion } from "framer-motion";

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  date: string;
  reflection?: string;
}

interface ArchiveListProps {
  tasks: Task[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const ArchiveList: React.FC<ArchiveListProps> = ({ tasks }) => {
  if (tasks.length === 0) {
    return (
      <div className="w-full max-w-lg mt-12 text-center">
        <p className="text-gray-400">Your archived tasks will appear here.</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full max-w-lg mt-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Archive</h2>
      <div className="space-y-3">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            variants={itemVariants}
            className="bg-white/60 rounded-lg shadow-sm p-4 border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-700">{task.title}</p>
                <p className="text-sm text-gray-500">{task.date}</p>
              </div>
              <span className={`font-bold text-xs px-2 py-1 rounded-full ${task.completed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {task.completed ? "COMPLETED" : "RESET"}
              </span>
            </div>
            {task.reflection && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600 italic whitespace-pre-wrap">"{task.reflection}"</p>
                <p className="text-sm text-gray-600 italic whitespace-pre-wrap">"{task.description}"</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ArchiveList;
