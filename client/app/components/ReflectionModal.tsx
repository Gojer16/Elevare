"use client";
import { motion } from "framer-motion";
import { useState } from "react";

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reflection: string) => void;
}

const ReflectionModal: React.FC<ReflectionModalProps> = ({ isOpen, onClose, onSave }) => {
  const [reflection, setReflection] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(reflection);
    setReflection("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        className="bg-white rounded-lg p-6 md:p-8 w-full max-w-md shadow-2xl border border-gray-200"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Add a Reflection</h2>
        <p className="text-gray-500 mb-6">How did it go? What did you learn?</p>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-accent transition-colors"
          rows={5}
          placeholder="Your thoughts..."
        ></textarea>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleSave}
            className="bg-primary-accent hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-sm hover:shadow-md"
          >
            Save Reflection
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReflectionModal;