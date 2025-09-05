"use client";
import { Button } from "./ui/Button";
import { useState } from "react";
import { motion } from "framer-motion";

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reflection: string) => void;
  isSaving: boolean;
}

const ReflectionModal: React.FC<ReflectionModalProps> = ({ isOpen, onClose, onSave, isSaving }) => {
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
        <h2 className="text-2xl font-bold text-primary mb-2">Add a Reflection</h2>
        <p className="text-gray-500 mb-6">How did it go? What did you learn?</p>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          rows={5}
          placeholder="Your thoughts..."
        ></textarea>
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="ghost" onClick={onClose}>Skip</Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving && (
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
            {isSaving ? "Saving..." : "Save Reflection"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReflectionModal;