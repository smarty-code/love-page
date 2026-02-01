import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Heart, Sparkles } from "lucide-react";

const SocialProofBadge = () => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Generate a realistic random count on mount and update periodically
  useEffect(() => {
    // Base count between 1000-5000
    const baseCount = Math.floor(Math.random() * 4000) + 1000;
    setCount(baseCount);
    setIsVisible(true);

    // Occasionally increment the count to make it feel live
    const interval = setInterval(() => {
      setCount((prev) => {
        // Random chance to increment (30% chance every 5 seconds)
        if (Math.random() > 0.7) {
          return prev + Math.floor(Math.random() * 3) + 1;
        }
        return prev;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{
            background: "rgba(236, 72, 153, 0.1)",
            border: "1px solid rgba(236, 72, 153, 0.2)",
          }}
        >
          {/* Pulsing dot indicator */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>

          {/* Count with animation */}
          <motion.span
            key={count}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-semibold"
          >
            {formatNumber(count)}
          </motion.span>

          <span className="text-primary/70 hidden sm:inline">love stories shared</span>
          <span className="text-primary/70 sm:hidden">❤️ sent</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SocialProofBadge;
