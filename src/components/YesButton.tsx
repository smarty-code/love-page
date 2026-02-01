import { motion } from "framer-motion";
import { useMemo } from "react";

interface YesButtonProps {
  stage: number;
  onClick: () => void;
  isMultiple?: boolean;
  customPosition?: { x: number; y: number };
}

const YesButton = ({ stage, onClick, isMultiple = false, customPosition }: YesButtonProps) => {
  // Main button grows with stage, spawned buttons stay fixed size
  const buttonConfig = useMemo(() => {
    if (isMultiple) {
      // Fixed sizes for spawned buttons - they don't grow
      const sizes = [
        { width: 100, height: 40, fontSize: "0.875rem" },
        { width: 120, height: 44, fontSize: "0.95rem" },
        { width: 110, height: 42, fontSize: "0.9rem" },
      ];
      const randomIndex = Math.floor(Math.random() * sizes.length);
      return { ...sizes[randomIndex], label: "Yes! 💗" };
    }

    // Main button grows with stage
    const stages = [
      { width: 140, height: 52, fontSize: "1.125rem", label: "Yes! 💗" },
      { width: 170, height: 58, fontSize: "1.25rem", label: "Yes! 💗" },
      { width: 210, height: 68, fontSize: "1.4rem", label: "Yes! 💕" },
      { width: 260, height: 80, fontSize: "1.6rem", label: "Say Yes! 💖" },
      { width: 320, height: 95, fontSize: "1.8rem", label: "Just say Yes! 💝" },
      { width: 380, height: 110, fontSize: "2rem", label: "You know you want to! 💖" },
    ];
    
    return stages[Math.min(stage, stages.length - 1)];
  }, [stage, isMultiple]);

  const { width, height, fontSize, label } = buttonConfig;

  return (
    <motion.button
      onClick={onClick}
      className="gradient-button text-primary-foreground font-quicksand font-semibold rounded-full shadow-button cursor-pointer select-none overflow-hidden whitespace-nowrap flex items-center justify-center"
      style={{
        position: isMultiple && customPosition ? "absolute" : "relative",
        left: isMultiple && customPosition ? customPosition.x : undefined,
        top: isMultiple && customPosition ? customPosition.y : undefined,
        width: width,
        height: height,
        fontSize: fontSize,
        minWidth: width,
        maxWidth: width,
        minHeight: height,
        maxHeight: height,
      }}
      initial={isMultiple ? { scale: 0, opacity: 0 } : { scale: 1 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 12px 40px -10px hsla(330, 100%, 60%, 0.6)",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      <span className="flex items-center justify-center gap-1 px-2 truncate">
        {label}
      </span>
      
      {/* Glow effect for later stages - only on main button */}
      {!isMultiple && stage >= 3 && (
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20 -z-10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.button>
  );
};

export default YesButton;
