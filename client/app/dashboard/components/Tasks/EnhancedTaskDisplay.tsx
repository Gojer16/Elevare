"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Edit3, Check, Sparkles, MessageSquare, Tag, Calendar, MoreHorizontal } from "lucide-react";

interface Task {
    id: string;
    title: string;
    description?: string;
    isDone?: boolean;
    reflection?: string;
    tags?: { id: string; name: string }[];
    createdAt?: string;
}

interface EnhancedTaskDisplayProps {
    task: Task;
    onComplete: () => void;
    onAddReflection: () => void;
    isCompleting: boolean;
    onEdit: () => void;
    onDelete?: () => void;
}

export function EnhancedTaskDisplay({
    task,
    onComplete,
    onAddReflection,
    isCompleting,
    onEdit,
    onDelete,
}: EnhancedTaskDisplayProps) {
    const [showActions, setShowActions] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, type: "spring", damping: 20 }}
            className="relative group"
        >
            {/* Main Task Card */}
            <div className="relative overflow-hidden rounded-3xl border border-[var(--border-color)] 
                      bg-gradient-to-br from-[var(--card-bg)] to-[var(--card-bg-secondary)] 
                      shadow-xl hover:shadow-2xl transition-all duration-300">

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.02]">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-secondary) 1px, transparent 0)`,
                        backgroundSize: '32px 32px'
                    }} />
                </div>

                {/* Status Indicator */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)]" />

                {/* Content */}
                <div className="relative p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-3 h-3 rounded-full bg-[var(--color-secondary)] animate-pulse" />
                                <span className="text-sm font-medium text-[var(--color-secondary)] uppercase tracking-wide">
                                Today&apos;s Focus
                                </span>
                            </div>

                            <h2 className="text-3xl font-bold text-[var(--color-foreground)] leading-tight mb-2">
                                {task.title}
                            </h2>

                            {task.createdAt && (
                                <div className="flex items-center gap-2 text-sm text-[var(--color-foreground)]/60">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {new Date(task.createdAt).toLocaleDateString("en-US", {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric"
                                        })}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Actions Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowActions(!showActions)}
                                className="p-2 rounded-full hover:bg-[var(--color-foreground)]/5 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <MoreHorizontal className="w-5 h-5 text-[var(--color-foreground)]/60" />
                            </button>

                            {/* Actions Dropdown */}
                            {showActions && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="absolute right-0 top-12 bg-[var(--card-bg)] border border-[var(--border-color)] 
                             rounded-xl shadow-lg p-2 min-w-[120px] z-10"
                                >
                                    <button
                                        onClick={() => {
                                            onEdit();
                                            setShowActions(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-foreground)] 
                               hover:bg-[var(--color-secondary)]/10 rounded-lg transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        Edit Task
                                    </button>

                                    {onDelete && (
                                        <button
                                            onClick={() => {
                                                onDelete();
                                                setShowActions(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <span className="w-4 h-4 text-center">🗑️</span>
                                            Delete
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    {task.description && (
                        <div className="mb-6">
                            <p className="text-[var(--color-foreground)]/80 leading-relaxed whitespace-pre-wrap">
                                {task.description}
                            </p>
                        </div>
                    )}

                    {/* Tags */}
                    {task.tags && task.tags.length > 0 && (
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Tag className="w-4 h-4 text-[var(--color-foreground)]/60" />
                                <span className="text-sm font-medium text-[var(--color-foreground)]/60">Tags</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {task.tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="inline-flex items-center px-3 py-1.5 bg-[var(--color-secondary)]/10 
                               text-[var(--color-secondary)] rounded-full text-sm font-medium 
                               border border-[var(--color-secondary)]/20"
                                    >
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reflection */}
                    {task.reflection && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 
                            border border-[var(--color-primary)]/20 rounded-2xl">
                            <div className="flex items-center gap-2 mb-2">
                                <MessageSquare className="w-4 h-4 text-[var(--color-primary)]" />
                                <span className="text-sm font-semibold text-[var(--color-primary)]">Reflection</span>
                            </div>
                            <p className="text-[var(--color-foreground)]/80 italic leading-relaxed">
                            &quot;{task.reflection}&quot;
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        {task.isDone ? (
                            <button
                                onClick={onAddReflection}
                                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 hover:from-[var(--color-primary)]/20 hover:to-[var(--color-secondary)]/20 
                                border border-[var(--color-primary)]/30 text-[var(--color-primary)] rounded-2xl transition-all duration-200 font-semibold"
                            >
                                <Sparkles className="w-5 h-5" />
                                Add Reflection
                            </button>
                        ) : (
                            <motion.button
                                onClick={onComplete}
                                disabled={isCompleting}
                                whileHover={{ scale: isCompleting ? 1 : 1.02 }}
                                whileTap={{ scale: isCompleting ? 1 : 0.98 }}
                                className="w-full flex items-center justify-center gap-3 px-6 py-4 
                           bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] 
                           hover:shadow-lg hover:shadow-[var(--color-secondary)]/25 text-white 
                           rounded-2xl transition-all duration-200 font-semibold text-lg
                           disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isCompleting ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                        />
                                        Completing...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Mark as Complete
                                    </>
                                )}
                            </motion.button>
                        )}

                        {/* Quick Edit Button */}
                        {!task.isDone && (
                            <button
                                onClick={onEdit}
                                className="w-full flex items-center justify-center gap-3 px-6 py-3 
                           bg-[var(--card-bg)] hover:bg-[var(--color-foreground)]/5 
                           border border-[var(--border-color)] text-[var(--color-foreground)] 
                           rounded-2xl transition-all duration-200 font-medium"
                            >
                                <Edit3 className="w-4 h-4" />
                                Edit Task
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}