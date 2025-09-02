import { motion } from "framer-motion";

export default function WaitlistCTA() {
  return (
    <motion.div 
      className="w-full text-center mt-12 p-8 rounded-2xl shadow-lg bg-gradient-to-br from-purple-50 to-purple-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold text-purple-900 mb-4">
        Want early access?
      </h2>
      <p className="text-gray-700 mb-6 max-w-xl mx-auto">
        Join the beta waitlist and help shape the future of Success-List.
        We’ll notify you when it’s ready to try.
      </p>
      <motion.button 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-colors"
      >
        <a 
          href="" // Google Form 
          target="_blank" 
          rel="noopener noreferrer"
        >
        Join Waitlist
        </a>
      </motion.button>
    </motion.div>
  );
}
