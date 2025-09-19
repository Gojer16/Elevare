"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

interface TaskInputProps {
  onSubmit: (task: { title: string; description: string; tagNames?: string[] }) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onSubmit }) => {
  const { theme } = useTheme();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({ title, description, tagNames: tags });
      setTitle("");
      setDescription("");
      setTags([]);
      setTagInput("");
    }
  };

  // 🎨 Theme-based styles
  const layoutClasses = {
    modern: "bg-[var(--card-bg)] rounded-xl shadow-md p-6 md:p-8 border border-[var(--card-border)]",
    minimal: "border-b border-[var(--card-border)] pb-6",
  };

  const inputClasses = {
    modern:
      "w-full p-2 bg-transparent border-b-2 border-[var(--card-border)] focus:outline-none focus:border-[var(--color-primary-accent)] transition-colors text-[var(--color-foreground)] placeholder:text-gray-400",
    minimal:
      "w-full bg-transparent focus:outline-none text-lg md:text-xl text-[var(--color-foreground)] placeholder:text-gray-400 font-light",
  };

  const buttonClasses = {
    modern:
      "w-full bg-[var(--color-primary-accent)] hover:brightness-110 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm hover:shadow-md disabled:opacity-50",
    minimal:
      "mt-4 px-4 py-2 text-sm rounded-md border border-[var(--card-border)] text-[var(--color-foreground)] hover:bg-[var(--color-background)] transition disabled:opacity-50",
  };

  const tagClasses = {
    modern:
      "inline-flex items-center px-3 py-1 mr-2 mb-2 text-sm font-medium bg-[var(--color-primary-accent)]/10 text-[var(--color-primary-accent)] rounded-full transition",
    minimal:
      "inline-flex items-center mr-2 mb-2 text-xs uppercase tracking-wide border border-[var(--card-border)] px-2 py-0.5 rounded-sm text-[var(--color-foreground)]/70 hover:bg-[var(--color-background)] transition",
  };

  const tagInputClasses = {
    modern:
      "flex-1 p-2 bg-transparent border-b-2 border-[var(--card-border)] focus:outline-none focus:border-[var(--color-primary-accent)] transition-colors text-[var(--color-foreground)] placeholder:text-gray-400",
    minimal:
      "flex-1 bg-transparent focus:outline-none text-[var(--color-foreground)] placeholder:text-gray-400 text-sm",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={layoutClasses[theme]}
    >
      <form onSubmit={handleSubmit} className="w-full">
        {/* Title */}
        <div className="mb-6">
          {theme === "modern" && (
            <label
              htmlFor="title"
              className="block text-sm font-medium text-[var(--color-foreground)] mb-1"
            >
              Today&apos;s ONE Thing
            </label>
          )}
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClasses[theme]}
            placeholder="What is your most important task?"
          />
        </div>

        {/* Description */}
        <div className="mb-8">
          {theme === "modern" && (
            <label
              htmlFor="description"
              className="block text-sm font-medium text-[var(--color-foreground)] mb-1"
            >
              Description (Optional)
            </label>
          )}
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClasses[theme]}
            rows={theme === "minimal" ? 1 : 3}
            placeholder="Add a little more detail..."
          ></textarea>
        </div>

        {/* Tags */}
        <div className="mb-6">
          {theme === "modern" && (
            <label
              htmlFor="tagInput"
              className="block text-sm font-medium text-[var(--color-foreground)] mb-1"
            >
              Tags (Optional)
            </label>
          )}
          <div className="flex items-center">
            <input
              type="text"
              id="tagInput"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className={tagInputClasses[theme]}
              placeholder="Add tags (e.g. #work, #health)"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTag(e);
              }}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className={`ml-2 px-3 py-1 rounded-md ${
                theme === "modern"
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                  : "text-sm text-[var(--color-foreground)]/70 hover:underline"
              }`}
            >
              Add
            </button>
          </div>

          {/* Display Tags */}
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap">
              {tags.map((tag, index) => (
                <span key={index} className={tagClasses[theme]}>
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 hover:text-red-500 transition"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={buttonClasses[theme]}
          disabled={!title.trim()}
        >
          Set Today&apos;s Task
        </button>
      </form>
    </motion.div>
  );
};

export default TaskInput;
