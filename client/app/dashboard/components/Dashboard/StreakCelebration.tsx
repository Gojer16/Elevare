"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface StreakData {
    count: number;
    longest: number;
}

interface StreakCelebrationProps {
    streak: StreakData;
    isVisible: boolean;
    onClose: () => void;
}

export function StreakCelebration({ streak, isVisible, onClose }: StreakCelebrationProps) {
    const [showDetails, setShowDetails] = useState(false);
    const isNewRecord = streak.count === streak.longest && streak.count > 1;

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => setShowDetails(true), 800);
            const autoClose = setTimeout(() => onClose(), 4000);
            return () => {
                clearTimeout(timer);
                clearTimeout(autoClose);
            };
        }
    }, [isVisible, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.5, opacity: 0, y: 50 }}
                        transition={{ type: "spring", damping: 15, stiffness: 300 }}
                        className="bg-[var(--card-bg)] rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-[var(--border-color)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Fire animation */}
                        <motion.div
                            animate={{
                                scale: [1, 1.3, 1.1, 1.4, 1],
                                rotate: [0, -10, 10, -5, 0]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                            className="text-6xl mb-4"
                        >
                            🔥
                        </motion.div>

                        {/* Main message */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                                {streak.count} Day Streak!
                            </h2>

                            {isNewRecord ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5, type: "spring" }}
                                    className="mb-4"
                                >
                                    <div className="text-lg font-semibold text-green-600 dark:text-green-400 mb-1">
                                        🎉 New Personal Record!
                                    </div>
                                    <div className="text-sm text-[var(--color-foreground)]/70">
                                        You&apos;ve beaten your previous best of {streak.longest - 1} days
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="text-[var(--color-foreground)]/70 mb-4">
                                    Keep going! Your best is {streak.longest} days
                                </div>
                            )}
                        </motion.div>

                        {/* Progress visualization */}
                        <AnimatePresence>
                            {showDetails && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-6 p-4 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-2xl border border-orange-500/20"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-[var(--color-foreground)]/60">Progress to record</span>
                                        <span className="text-sm font-medium">{streak.count}/{streak.longest}</span>
                                    </div>

                                    <div className="h-2 bg-[var(--card-bg)] rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min((streak.count / streak.longest) * 100, 100)}%` }}
                                            transition={{ duration: 1, delay: 0.2 }}
                                            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Close button */}
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            onClick={onClose}
                            className="mt-6 px-6 py-2 bg-[var(--color-secondary)]/10 hover:bg-[var(--color-secondary)]/20 
                         text-[var(--color-secondary)] rounded-full transition-colors text-sm font-medium"
                        >
                        Continue
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}