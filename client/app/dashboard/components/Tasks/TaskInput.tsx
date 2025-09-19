"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TaskInputProps {
  onSubmit: (task: { title: string; description: string; tagNames?: string[] }) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        onSubmit({ title, description, tagNames: tags });
        // Reset form
        setTitle("");
        setDescription("");
        setTags([]);
        setTagInput("");
        setShowDescription(false);
      } catch (error) {
        console.error("Failed to submit task:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Task Input - Chatbot Style */}
        <div className="relative">
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your ONE thing today?"
            className="w-full px-4 py-3 pr-12 bg-[var(--card-bg)] border border-[var(--border-color)] 
                       rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/50 
                       focus:border-[var(--color-secondary)] transition-all duration-200
                       text-[var(--color-foreground)] placeholder:text-[var(--color-foreground)]/50"
          />
          
          {/* Send Button */}
          <button
            type="submit"
            disabled={!title.trim() || isSubmitting}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all duration-200
              ${title.trim() && !isSubmitting
                ? 'bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 text-white shadow-md hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            {isSubmitting ? (
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 text-sm">
          <button
            type="button"
            onClick={() => setShowDescription(!showDescription)}
            className="px-3 py-1.5 bg-[var(--card-bg)] hover:bg-[var(--color-secondary)]/10 
                       border border-[var(--border-color)] rounded-full transition-colors
                       text-[var(--color-foreground)]/70 hover:text-[var(--color-secondary)]"
          >
            {showDescription ? '− Description' : '+ Add Description'}
          </button>
        </div>

        {/* Description - Expandable */}
        <AnimatePresence>
          {showDescription && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details about your task..."
                rows={3}
                className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--border-color)] 
                           rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/50 
                           focus:border-[var(--color-secondary)] transition-all duration-200 resize-none
                           text-[var(--color-foreground)] placeholder:text-[var(--color-foreground)]/50"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tags Input */}
        <div className="flex gap-2">
          <input
            id="tag-input"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="Add a tag..."
            className="flex-1 px-4 py-2 bg-[var(--card-bg)] border border-[var(--border-color)] 
                       rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/50 
                       focus:border-[var(--color-secondary)] transition-all duration-200
                       text-[var(--color-foreground)] placeholder:text-[var(--color-foreground)]/50"
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={!tagInput.trim()}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200
              ${tagInput.trim()
                ? 'bg-[var(--color-secondary)]/10 hover:bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] border border-[var(--color-secondary)]/30'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              }`}
          >
            Add
          </button>
        </div>

        {/* Display Tags */}
        <AnimatePresence>
          {tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2"
            >
              {tags.map((tag) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--color-secondary)]/10 
                             text-[var(--color-secondary)] rounded-full text-sm border border-[var(--color-secondary)]/20"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-400 transition-colors text-sm"
                  >
                    ×
                  </button>
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keyboard Hint */}
        <p className="text-center text-xs text-[var(--color-foreground)]/50">
          Press <kbd className="px-1.5 py-0.5 bg-[var(--card-bg)] border border-[var(--border-color)] rounded text-xs">Enter</kbd> to submit or add tags
        </p>
      </form>
    </div>
  );
};

export default TaskInput;