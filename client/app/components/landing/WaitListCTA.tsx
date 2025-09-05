import { motion } from "framer-motion";
import { Button } from "../ui/Button";

export default function WaitlistCTA() {
  return (
    <motion.div 
      className="w-full text-center mt-12 p-8 rounded-2xl shadow-lg bg-gradient-to-br from-primary to-secondary"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold text-white mb-4">
        Want early access?
      </h2>
      <p className="text-white/80 mb-6 max-w-xl mx-auto">
        Join the beta waitlist and help shape the future of Elevare.
        We’ll notify you when it’s ready to try.
      </p>
      <a 
        href="" // Google Form 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <Button variant="secondary" size="lg">Join Waitlist</Button>
      </a>
    </motion.div>
  );
}
