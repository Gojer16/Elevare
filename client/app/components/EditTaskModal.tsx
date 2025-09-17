"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import { Task } from "../hooks/useTask";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: Partial<Task> & { tagNames?: string[] }) => void;
  task: Task | null;
  isSaving: boolean;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  task,
  isSaving,
}) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(
    task?.tags?.map((tag) => tag.name) || []
  );

  // Reset form when task changes
    useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setTags(task.tags?.map((tag) => tag.name) || []);
    }
  }, [task]);

  if (!isOpen || !task) return null;

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

  // onSave expects Partial<Task> but we also send tagNames (client-side helper)
  const handleSave = () => {
    onSave({
      title,
      description,
  // tagNames is a UI-only helper passed to the parent handler
  // parent should accept this shape and handle creating/updating tags
      tagNames: tags,
    } as Partial<Task> & { tagNames?: string[] });
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
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-primary mb-2">Edit Task</h2>
        <p className="text-gray-500 mb-6">Update your task details</p>

        {/* Title */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Task Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            placeholder="What is your most important task?"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            rows={3}
            placeholder="Add a little more detail..."
          ></textarea>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label
            htmlFor="tagInput"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tags (Optional)
          </label>
          <div className="flex items-center">
            <input
              type="text"
              id="tagInput"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              placeholder="Add tags (e.g. #work, #health)"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTag(e);
              }}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="ml-2 px-3 py-1 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Add
            </button>
          </div>

          {/* Display Tags */}
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 mr-2 mb-2 text-sm font-medium bg-primary/10 text-primary rounded-full"
                >
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

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !title.trim()}>
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
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditTaskModal;