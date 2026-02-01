import { motion } from "framer-motion";
import { useMemo } from "react";

interface Heart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const FloatingHearts = () => {
  const hearts = useMemo<Heart[]>(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 24 + 12,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.4 + 0.1,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-primary"
          style={{
            left: `${heart.x}%`,
            fontSize: heart.size,
            opacity: heart.opacity,
          }}
          initial={{ y: "100vh", rotate: 0 }}
          animate={{
            y: "-100vh",
            rotate: [0, 10, -10, 0],
            x: [0, 20, -20, 0],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          💕
        </motion.div>
      ))}
      
      {/* Sparkle effects */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute text-coral animate-sparkle"
          style={{
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 90 + 5}%`,
            fontSize: Math.random() * 12 + 8,
          }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2,
            delay: i * 0.3,
            repeat: Infinity,
          }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;
