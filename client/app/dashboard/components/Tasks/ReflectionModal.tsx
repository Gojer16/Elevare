"use client";
import { Button } from "../../../components/ui/Button";
import { useState } from "react";
import { motion } from "framer-motion";
import { ButtonSpinner } from "../../../components/UnifiedLoadingSpinner";

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reflection: string) => void;
  isSaving: boolean;
  title: string;
  subtitle: string;
  successAnimation?: string;
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
            {isSaving && <ButtonSpinner className="-ml-1 mr-3" />}
            {isSaving ? "Saving..." : "Save Reflection"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReflectionModal;