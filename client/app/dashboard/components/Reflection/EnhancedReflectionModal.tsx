"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Heart, Brain, Target, Lightbulb } from "lucide-react";

interface EnhancedReflectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (reflection: string) => Promise<void>;
    isSaving: boolean;
    title?: string;
    subtitle?: string;
    taskTitle?: string;
}

const reflectionPrompts = [
    { icon: Heart, text: "What went well today?", category: "gratitude" },
    { icon: Brain, text: "What did I learn about myself?", category: "insight" },
    { icon: Target, text: "What would I do differently?", category: "improvement" },
    { icon: Lightbulb, text: "What's my biggest insight?", category: "discovery" },
    { icon: Sparkles, text: "How did I grow today?", category: "growth" }
];

export function EnhancedReflectionModal({
    isOpen,
    onClose,
    onSave,
    isSaving,
    title = "How did today's focus go?",
    subtitle = "Take a moment to reflect on your progress",
    taskTitle
}: EnhancedReflectionModalProps) {
    const [reflection, setReflection] = useState("");
    const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
    const [step, setStep] = useState<'prompts' | 'writing' | 'success'>('prompts');
    const [wordCount, setWordCount] = useState(0);

    useEffect(() => {
        setWordCount(reflection.trim().split(/\s+/).filter(word => word.length > 0).length);
    }, [reflection]);

    useEffect(() => {
        if (isOpen) {
            setStep('prompts');
            setReflection("");
            setSelectedPrompt(null);
            setWordCount(0);
        }
    }, [isOpen]);

    const handlePromptSelect = (prompt: string) => {
        setSelectedPrompt(prompt);
        setReflection(prompt + " ");
        setStep('writing');
    };

    const handleSave = async () => {
        if (!reflection.trim()) return;

        try {
            await onSave(reflection);
            setStep('success');
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error('Failed to save reflection:', error);
        }
    };

    const handleSkip = () => {
        setStep('writing');
        setReflection("");
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
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
                    className="bg-[var(--card-bg)] rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-[var(--border-color)] relative overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-secondary) 1px, transparent 0)`,
                            backgroundSize: '32px 32px'
                        }} />
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-[var(--color-secondary)]/10 transition-colors"
                    >
                        <X className="w-5 h-5 text-[var(--color-foreground)]/60" />
                    </button>

                    {/* Content */}
                    <div className="relative">
                        {step === 'prompts' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center"
                            >
                                <div className="mb-6">
                                    <motion.div
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                                        className="text-4xl mb-4"
                                    >
                                        ✨
                                    </motion.div>
                                    <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">
                                        {title}
                                    </h2>
                                    <p className="text-[var(--color-foreground)]/70">
                                        {subtitle}
                                    </p>
                                    {taskTitle && (
                                        <div className="mt-4 p-3 bg-[var(--color-secondary)]/10 rounded-xl border border-[var(--color-secondary)]/20">
                                            <p className="text-sm text-[var(--color-foreground)]/80">
                                                Reflecting on: <span className="font-medium">"{taskTitle}"</span>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3 mb-6">
                                    <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-4">
                                        Choose a reflection prompt:
                                    </h3>
                                    {reflectionPrompts.map((prompt, index) => {
                                        const Icon = prompt.icon;
                                        return (
                                            <motion.button
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                onClick={() => handlePromptSelect(prompt.text)}
                                                className="w-full p-4 text-left rounded-xl border border-[var(--border-color)] 
                                   hover:border-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/5 
                                   transition-all duration-200 group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-[var(--color-secondary)]/10 group-hover:bg-[var(--color-secondary)]/20 transition-colors">
                                                        <Icon className="w-5 h-5 text-[var(--color-secondary)]" />
                                                    </div>
                                                    <span className="font-medium text-[var(--color-foreground)]">
                                                        {prompt.text}
                                                    </span>
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={handleSkip}
                                    className="text-[var(--color-foreground)]/60 hover:text-[var(--color-foreground)] 
                             transition-colors text-sm underline"
                                >
                                    Skip prompts and write freely
                                </button>
                            </motion.div>
                        )}

                        {step === 'writing' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">
                                        Your Reflection
                                    </h2>
                                    <p className="text-[var(--color-foreground)]/70">
                                        Take your time. There's no rush to perfect thoughts.
                                    </p>
                                </div>

                                <div className="relative">
                                    <textarea
                                        value={reflection}
                                        onChange={(e) => setReflection(e.target.value)}
                                        placeholder="Start writing your thoughts..."
                                        className="w-full h-48 p-4 bg-[var(--card-bg)] border-2 border-[var(--border-color)] 
                               rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]/50 
                               focus:border-[var(--color-secondary)] transition-all duration-200 resize-none
                               text-[var(--color-foreground)] placeholder:text-[var(--color-foreground)]/50"
                                        autoFocus
                                    />

                                    {/* Word Count */}
                                    <div className="absolute bottom-3 right-3 text-xs text-[var(--color-foreground)]/50">
                                        {wordCount} words
                                    </div>
                                </div>

                                {/* Encouragement */}
                                {wordCount > 0 && wordCount < 10 && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-sm text-[var(--color-foreground)]/60 text-center italic"
                                    >
                                        Great start! Keep going...
                                    </motion.p>
                                )}

                                {wordCount >= 10 && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-sm text-[var(--color-secondary)] text-center font-medium"
                                    >
                                        ✨ Beautiful reflection! This will help you grow.
                                    </motion.p>
                                )}

                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() => setStep('prompts')}
                                        className="px-6 py-3 text-[var(--color-foreground)]/70 hover:text-[var(--color-foreground)] 
                               transition-colors font-medium"
                                    >
                                        ← Back to Prompts
                                    </button>

                                    <button
                                        onClick={onClose}
                                        className="px-6 py-3 bg-[var(--color-foreground)]/10 hover:bg-[var(--color-foreground)]/20 
                               text-[var(--color-foreground)] rounded-xl transition-colors font-medium"
                                    >
                                        Skip for Now
                                    </button>

                                    <button
                                        onClick={handleSave}
                                        disabled={!reflection.trim() || isSaving}
                                        className="px-6 py-3 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] 
                               hover:shadow-lg hover:shadow-[var(--color-secondary)]/25 text-white rounded-xl 
                               transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed
                               flex items-center gap-2"
                                    >
                                        {isSaving ? (
                                            <>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                                />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-4 h-4" />
                                                Save Reflection
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 0.6 }}
                                    className="text-6xl mb-4"
                                >
                                    🎉
                                </motion.div>
                                <h2 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">
                                    Reflection Saved!
                                </h2>
                                <p className="text-[var(--color-foreground)]/70">
                                    Your thoughts have been captured. Growth happens in these moments of reflection.
                                </p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}