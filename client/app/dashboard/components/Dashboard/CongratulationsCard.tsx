"use client";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

export function CongratulationsCard() {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="card text-center relative"
    >
      <Confetti recycle={false} numberOfPieces={150} />

      <h2 className="text-2xl font-bold text-[var(--color-success)] mb-4">
        🎉 You did it!
      </h2>
      <p className="opacity-90 mb-6">
        One clear win today, tomorrow we build on this momentum.
        <br />
        <span className="font-medium">
          Extraordinary results come from small, consistent actions.
        </span>
      </p>
    </motion.div>
  );
}