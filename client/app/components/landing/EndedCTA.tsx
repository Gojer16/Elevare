import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import Link from "next/link";

export default function EndedCTA() {
  return (
    <motion.div 
      className="w-full text-center mt-12 p-8 rounded-2xl shadow-lg bg-gradient-to-br from-primary to-secondary"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-bold text-white mb-4">
      You’re Early, That’s the Best Time
      </h2>

      <p className="text-white/90 mb-6 max-w-xl mx-auto">
      Elevare is live, but still evolving. We’re building in public,  
      and your voice can help shape where it goes next.
      </p>

      <Link
        href="/dashboard" 
        rel="noopener noreferrer"
      >
        <Button variant="secondary" size="lg">
        Join the Journey
        </Button>
      </Link>

      {/* Pro teaser */}
      <p className="text-sm text-white/80 mt-4 max-w-xl mx-auto">
      Core features are free forever. Upgrade to <strong>Pro</strong> later for unlimited AI guidance, advanced analytics, reminders, and enhanced achievements.
      </p>

      <p className="text-sm text-white/70 mt-2">
      Extraordinary success is built one step at a time, and so is Elevare.  
      Be part of the foundation.
      </p>
    </motion.div>
  );
}
