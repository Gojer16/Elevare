"use client";
import { motion } from "framer-motion";

interface DashboardHeaderProps {
  quote?: { text: string; author: string };
}

export function DashboardHeader({ quote }: DashboardHeaderProps) {
  return (
    <div className="text-center mb-12">
      <div className="flex justify-between items-center mb-4">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold">
        Welcome back, your focus ritual starts here.
        </h1>
      </div>
      {/* Quote */}
      {quote && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-6 max-w-lg mx-auto text-center"
        >
          <p className="text-lg font-medium">{"\""}{quote.text}{"\""}</p>
          <p className="text-sm mt-2 opacity-70">— {quote.author}</p>
        </motion.div>
      )}
    </div>
  );
}