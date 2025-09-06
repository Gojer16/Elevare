"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";

interface FeatureDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: {
    title: string;
    description: string;
    icon: React.ElementType;
    image: string;
  } | null;
}

const FeatureDetailModal: React.FC<FeatureDetailModalProps> = ({ isOpen, onClose, feature }) => {
  if (!isOpen || !feature) return null;

  const Icon = feature.icon;

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-md flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="bg-gradient-to-br from-white to-gray-100 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div variants={contentVariants} initial="hidden" animate="visible" className="p-8 md:p-12">
              <motion.div variants={itemVariants} className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {feature.title}
                </h2>
              </motion.div>
              <motion.p variants={itemVariants} className="text-gray-600 text-lg leading-relaxed mb-8">
                {feature.description}
              </motion.p>
              <motion.div variants={itemVariants} className="text-right">
                <Button onClick={onClose} variant="outline" size="lg">
                  Close
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeatureDetailModal;
