"use client";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Edit3, X } from "lucide-react";

interface EditConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskTitle: string;
}

export function EditConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  taskTitle 
}: EditConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-[var(--card-bg)] rounded-3xl p-8 w-full max-w-md shadow-2xl border border-[var(--border-color)] relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-secondary) 1px, transparent 0)`,
                backgroundSize: '24px 24px'
              }} />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-[var(--color-foreground)]/10 transition-colors"
            >
              <X className="w-5 h-5 text-[var(--color-foreground)]/60" />
            </button>

            {/* Content */}
            <div className="relative text-center">
              {/* Icon */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-orange-500" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 w-16 h-16 border-2 border-orange-500/30 rounded-full"
                  />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-3">
              Edit Your Task?
              </h2>

              {/* Message */}
              <div className="mb-6">
                <p className="text-[var(--color-foreground)]/70 mb-4 leading-relaxed">
                You&apos;re about to edit your current focus task:
                </p>
                <div className="p-4 bg-[var(--color-secondary)]/5 border border-[var(--color-secondary)]/20 rounded-2xl">
                  <p className="font-semibold text-[var(--color-foreground)] text-lg">
                  &quot;{taskTitle}&quot;
                  </p>
                </div>
                <p className="text-sm text-[var(--color-foreground)]/60 mt-4">
                This will open the edit form where you can modify the title, description, and tags.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-[var(--card-bg)] hover:bg-[var(--color-foreground)]/5 border border-[var(--border-color)] text-[var(--color-foreground)] 
                  rounded-2xl transition-all duration-200 font-medium"
                >
                Cancel.
                </button>
                
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] hover:shadow-lg hover:shadow-[var(--color-secondary)]/25 text-white 
                  rounded-2xl transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Task.
                </button>
              </div>

              {/* Tip */}
              <p className="text-xs text-[var(--color-foreground)]/50 mt-4 italic">
                💡 Tip: Keep your ONE thing focused and actionable.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}