"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  delay: number;
}

interface ParticleEffectsProps {
  isActive: boolean;
  duration?: number;
}

const celebrationEmojis = ['🎉', '✨', '🌟', '💫', '🎊', '🏆', '👏', '🔥', '💪', '🚀'];

export function ParticleEffects({ isActive, duration = 3000 }: ParticleEffectsProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    // Generate particles
    const newParticles: Particle[] = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        emoji: celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)],
        delay: Math.random() * 2000
      });
    }
    setParticles(newParticles);

    // Clear particles after duration
    const timer = setTimeout(() => {
      setParticles([]);
    }, duration);

    return () => clearTimeout(timer);
  }, [isActive, duration]);

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              opacity: 0, 
              scale: 0,
              x: `${particle.x}vw`,
              y: `${particle.y}vh`,
              rotate: 0
            }}
            animate={{ 
              opacity: [0, 1, 1, 0], 
              scale: [0, 1.5, 1, 0],
              y: `${particle.y - 20}vh`,
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 2,
              delay: particle.delay / 1000,
              ease: "easeOut"
            }}
            className="absolute text-2xl"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`
            }}
          >
            {particle.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}