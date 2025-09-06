"use client";
import TaskInput from "../components/TaskInput";
import TaskDisplay from "../components/TaskDisplay";
import ArchiveList from "../components/ArchiveList";
import ReflectionModal from "../components/ReflectionModal";
import { useTasks } from "../hooks/useTask";
import { motion } from "framer-motion";
import Confetti from "react-confetti"; 
import { dailyPrompts } from "../data/dailyPrompts";
import { useEffect, useState } from "react";
import { quotes } from "../data/quotes";

export default function DashboardPage() {
  const {
    task,
    archive,
    isReflectionModalOpen,
    setReflectionModalOpen,
    isLoading,
    isCompletingTask,
    isSavingReflection,
    showCongratulations,
    fetchTasks,
    addTask,
    completeTask,
    saveReflection,
  } = useTasks();

const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);

useEffect(() => {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(random);
  }, []);


  return (
    <main className="bg-gradient-to-b from-violet-50 via-white to-gray-50 flex min-h-screen flex-col items-center p-12 sm:p-24">
      {/*  Daily Ritual Headline */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, your focus ritual starts here
        </h1>
        <p className="mt-2 text-lg text-gray-600 italic">“One day. One task. One step closer.”</p>

        {quote && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-6 bg-white shadow-md rounded-xl px-6 py-4 max-w-lg mx-auto"
          >
            <p className="text-gray-800 text-lg font-medium">“{quote.text}”</p>
            <p className="text-gray-500 text-sm mt-2">— {quote.author}</p>
          </motion.div>
        )}
      </div>

      <div className="w-full max-w-lg mb-10">
        {isLoading ? (
          <p className="text-gray-600">Loading your focus space...</p>
        ) : showCongratulations ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-lg shadow-md p-6 md:p-8 text-center relative"
          >
            {/*  Celebration Confetti */}
            <Confetti recycle={false} numberOfPieces={150} />

            <h2 className="text-2xl font-bold text-secondary mb-4">🎉 You did it!</h2>
            <p className="text-gray-700 mb-6">
              One clear win today, tomorrow, we build on this momentum.
              <br />
              <span className="font-medium">
                Extraordinary results come from small, consistent actions. Today, you moved the
                domino.
              </span>
            </p>
          </motion.div>
        ) : task ? (
          <TaskDisplay
            key={task.id}
            task={task}
            onComplete={completeTask}
            onAddReflection={() => setReflectionModalOpen(true)}
            isCompleting={isCompletingTask}
          />
        ) : (
          //  Empty state with guidance
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              What’s your ONE Thing today?
            </h2>
            <p className="text-gray-600 mb-4 italic">
              {dailyPrompts[Math.floor(Math.random() * dailyPrompts.length)]}
              <br />
              <span className="font-medium">Type it below, clarity begins with commitment.</span>
            </p>
            <TaskInput onSubmit={addTask} />
          </div>
        )}
      </div>

      {/*  Progress Journal */}
      <section className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Momentum Journal</h2>
        <p className="text-gray-600 mb-6">
          Every completed task is proof that focus works. Scroll back to see how far you’ve come.
        </p>
        <ArchiveList
          tasks={archive.map((t) => {
            const taskDate = new Date(t.createdAt);
            const formattedDate = taskDate.toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            return {
              ...t,
              description: t.description ?? "",
              completed: t.isDone,
              date: formattedDate,
              reflection: t.reflection ?? "",
            };
          })}
        />
      </section>

      {/*  Reflection Modal with better tone */}
      <ReflectionModal
        isOpen={isReflectionModalOpen}
        onClose={() => setReflectionModalOpen(false)}
        onSave={saveReflection}
        isSaving={isSavingReflection}
        title="How did today’s focus go?"
        subtitle="What’s one lesson you’ll carry into tomorrow?"
        successAnimation="stars" 
      />

      {/*  SEO / JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            name: "Elevare Dashboard",
            description:
              "Elevare Dashboard — your daily focus ritual. Add today’s ONE Thing, complete it, and track your momentum in your personal archive.",
            mainEntity: {
              "@type": "WebApplication",
              name: "Elevare",
              applicationCategory: "Productivity",
              operatingSystem: "Web",
              keywords: "focus app, productivity app, task manager, one thing method",
            },
          }),
        }}
      />
    </main>
  );
}
