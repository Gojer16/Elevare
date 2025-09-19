"use client";
import { motion } from "framer-motion";
import ArchivedTaskCard from "./ArchivedTaskCard";
import type { Task } from "../../../../types/task";
import { useTheme } from "@/contexts/ThemeContext";

interface ArchiveListProps {
  tasks: Task[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};



const ArchiveList: React.FC<ArchiveListProps> = ({ tasks }) => {
  const { theme } = useTheme();
  const isMinimal = theme === 'minimal';

  if (tasks.length === 0) {
    return (
      <div className={`w-full ${isMinimal ? 'max-w-2xl' : 'max-w-xl'} mt-16 text-center`}>
        <div className={`
          p-8 rounded-lg
          ${isMinimal 
            ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700' 
            : 'bg-[var(--color-card)]'
          }
        `}>
          <div className="text-6xl mb-4">📚</div>
          <h3 className={`${isMinimal ? 'text-xl' : 'text-2xl'} font-semibold text-[var(--color-foreground)] mb-2`}>
            {isMinimal ? 'No Tasks Yet' : 'No Archived Tasks Yet'}
          </h3>
          <p className={`${isMinimal ? 'text-sm' : 'text-base'} text-[var(--color-foreground)] opacity-70`}>
            {isMinimal 
              ? 'Complete tasks to see them here.' 
              : 'Completed or reset tasks will appear here.'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`w-full ${isMinimal ? 'max-w-4xl' : 'max-w-3xl'} ${isMinimal ? 'mt-8' : 'mt-16'}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {!isMinimal && (
        <h2 className="text-4xl font-bold mb-8 text-center text-[var(--color-primary)]">
          Archive
        </h2>
      )}

      <div className={`grid gap-${isMinimal ? '4' : '6'}`}>
        {tasks.map((task) => (
          <ArchivedTaskCard key={task.id} task={task} />
        ))}
      </div>
    </motion.div>
  );
};

export default ArchiveList;
