"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { Sparkles, Trophy, Target, Zap, Crown, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";

interface Task {
    id: string;
    title: string;
    description?: string;
    tags?: { id: string; name: string }[];
}

interface EpicCelebrationProps {
    task: Task;
    streak?: { count: number; longest: number };
    onContinue: () => void;
    onAddReflection: (taskId?: string) => void;
}

const celebrationMessages = [
    {
        title: "🎉 Incredible!",
        subtitle: "You just conquered your ONE thing!",
        message: "Every great achievement starts with the decision to focus on what matters most."
    },
    {
        title: "⚡ Unstoppable!",
        subtitle: "Another victory in the books!",
        message: "You're building the habit of winners - one focused action at a time."
    },
    {
        title: "🚀 Amazing Work!",
        subtitle: "You turned intention into action!",
        message: "This is how extraordinary results are built - one meaningful task at a time."
    },
    {
        title: "👑 Champion Move!",
        subtitle: "You stayed focused and delivered!",
        message: "Success isn't about doing everything - it's about doing the right thing."
    }
];

const achievements = [
    { icon: Target, text: "Focus Master", color: "text-blue-500" },
    { icon: Zap, text: "Action Taker", color: "text-yellow-500" },
    { icon: Trophy, text: "Goal Crusher", color: "text-purple-500" },
    { icon: Rocket, text: "Momentum Builder", color: "text-green-500" }
];

export function EpicCelebration({ task, streak, onAddReflection }: EpicCelebrationProps) {
    const [stage, setStage] = useState<'explosion' | 'message' | 'achievements' | 'actions'>('explosion');
    const [selectedMessage] = useState(celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)]);
    const [showConfetti, setShowConfetti] = useState(true);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });

        const timer1 = setTimeout(() => setStage('message'), 1500);
        const timer2 = setTimeout(() => setStage('achievements'), 4000);
        const timer3 = setTimeout(() => setStage('actions'), 6500);
        const timer4 = setTimeout(() => setShowConfetti(false), 8000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
        };
    }, []);

    const router = useRouter();

    return (
        <div className="relative">
            {/* Confetti */}
            {showConfetti && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={300}
                    gravity={0.3}
                    colors={['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899']}
                />
            )}

            {/* Main Celebration Container */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, type: "spring", damping: 15 }}
                className="relative overflow-hidden rounded-3xl border border-[var(--border-color)] 
                   bg-gradient-to-br from-[var(--card-bg)] via-[var(--card-bg-secondary)] to-[var(--card-bg)]
                   shadow-2xl"
            >
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <motion.div
                        animate={{
                            background: [
                                "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                                "radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
                                "radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
                                "radial-gradient(circle at 50% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)"
                            ]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0"
                    />
                </div>

                {/* Content */}
                <div className="relative p-8 text-center">
                    <AnimatePresence mode="wait">
                        {/* Stage 1: Explosion */}
                        {stage === 'explosion' && (
                            <motion.div
                                key="explosion"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 0.8, type: "spring", damping: 10 }}
                                className="py-16"
                            >
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 10, -10, 0]
                                    }}
                                    transition={{ duration: 1, repeat: 2 }}
                                    className="text-8xl mb-4"
                                >
                                    🎉
                                </motion.div>
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-4xl font-bold bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] 
                             bg-clip-text text-transparent"
                                >
                                    TASK COMPLETED!
                                </motion.h1>
                            </motion.div>
                        )}

                        {/* Stage 2: Personal Message */}
                        {stage === 'message' && (
                            <motion.div
                                key="message"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.6 }}
                                className="py-8"
                            >
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-5xl mb-6"
                                >
                                    ✨
                                </motion.div>

                                <h2 className="text-3xl font-bold text-[var(--color-foreground)] mb-4">
                                    {selectedMessage.title}
                                </h2>

                                <p className="text-xl text-[var(--color-secondary)] font-semibold mb-4">
                                    {selectedMessage.subtitle}
                                </p>

                                {/* Task Achievement */}
                                <div className="bg-gradient-to-r from-[var(--color-secondary)]/10 to-[var(--color-primary)]/10 
                                border border-[var(--color-secondary)]/20 rounded-2xl p-6 mb-6">
                                    <div className="flex items-center justify-center gap-3 mb-3">
                                        <Crown className="w-6 h-6 text-[var(--color-secondary)]" />
                                        <span className="font-semibold text-[var(--color-foreground)]">You Completed:</span>
                                    </div>
                                    <p className="text-lg font-bold text-[var(--color-foreground)]">
                                        &quot;{task.title}&quot;
                                    </p>
                                    {task.tags && task.tags.length > 0 && (
                                        <div className="flex justify-center gap-2 mt-3">
                                            {task.tags.slice(0, 3).map((tag) => (
                                                <span
                                                    key={tag.id}
                                                    className="px-2 py-1 bg-[var(--color-secondary)]/20 text-[var(--color-secondary)] 
                                     rounded-full text-xs font-medium"
                                                >
                                                    #{tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <p className="text-[var(--color-foreground)]/80 leading-relaxed italic">
                                    {selectedMessage.message}
                                </p>
                            </motion.div>
                        )}

                        {/* Stage 3: Achievements */}
                        {stage === 'achievements' && (
                            <motion.div
                                key="achievements"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.6 }}
                                className="py-8"
                            >
                                <h3 className="text-2xl font-bold text-[var(--color-foreground)] mb-6">
                                    🏆 You Earned These Badges!
                                </h3>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    {achievements.map((achievement, index) => {
                                        const Icon = achievement.icon;
                                        return (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                transition={{ delay: index * 0.2, type: "spring", damping: 15 }}
                                                className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-4 
                                   hover:shadow-lg transition-all duration-200"
                                            >
                                                <Icon className={`w-8 h-8 mx-auto mb-2 ${achievement.color}`} />
                                                <p className="text-sm font-semibold text-[var(--color-foreground)]">
                                                    {achievement.text}
                                                </p>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Streak Celebration */}
                                {streak && streak.count > 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.8 }}
                                        className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-4 mb-4"
                                    >
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <span className="text-2xl">🔥</span>
                                            <span className="font-bold text-orange-600 dark:text-orange-400">
                                                {streak.count} Day Streak!
                                            </span>
                                        </div>
                                        {streak.count === streak.longest && (
                                            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                                🎉 New Personal Record!
                                            </p>
                                        )}
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* Stage 4: Actions */}
                        {stage === 'actions' && (
                            <motion.div
                                key="actions"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="py-8"
                            >
                                <h3 className="text-2xl font-bold text-[var(--color-foreground)] mb-6">
                                    What&apos;s Next?
                                </h3>

                                <div className="space-y-4">
                                    <motion.button
                                        onClick={() => router.push("dashboard/reflection")}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] hover:shadow-lg hover:shadow-[var(--color-secondary)]/25 text-white rounded-2xl transition-all duration-200 font-semibold"
                                    >
                                        <Sparkles className="w-5 h-5" />
                                        Add a Reflection
                                    </motion.button>
                                </div>

                                <p className="text-sm text-[var(--color-foreground)]/60 mt-6 italic">
                                    🌟 Remember: Consistency beats perfection. You&apos;re building something amazing!
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}