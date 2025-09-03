"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface TaskInputProps {
  onSubmit: (task: { title: string; description: string }) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({ title, description });
      setTitle("");
      setDescription("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6 md:p-8"
    >
      <form onSubmit={handleSubmit} className="w-full">
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-600 mb-1">
            Today&apos;s ONE Thing
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 bg-transparent border-b-2 border-gray-200 focus:outline-none focus:border-primary-accent transition-colors"
            placeholder="What is your most important task?"
          />
        </div>
        <div className="mb-8">
          <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 bg-transparent border-b-2 border-gray-200 focus:outline-none focus:border-primary-accent transition-colors"
            rows={3}
            placeholder="Add a little more detail..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-primary-accent hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-sm hover:shadow-md disabled:opacity-50"
          disabled={!title.trim()}
        >
          Set Today&apos;s Task
        </button>
      </form>
    </motion.div>
  );
};

export default TaskInput;
