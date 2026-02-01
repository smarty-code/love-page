import { motion } from "framer-motion";
import { useMemo } from "react";

interface YesButtonProps {
  stage: number;
  onClick: () => void;
  isMultiple?: boolean;
  customPosition?: { x: number; y: number };
  customSize?: { width: number; height: number };
}

const YesButton = ({ stage, onClick, isMultiple = false, customPosition, customSize }: YesButtonProps) => {
  const buttonConfig = useMemo(() => {
    const stages = [
      { width: 140, height: 52, fontSize: "1.125rem", label: "Yes! 💗" },
      { width: 170, height: 58, fontSize: "1.25rem", label: "Yes! 💗" },
      { width: 210, height: 68, fontSize: "1.4rem", label: "Yes! 💕" },
      { width: 260, height: 80, fontSize: "1.6rem", label: "Say Yes! 💖" },
      { width: 320, height: 95, fontSize: "1.8rem", label: "Just say Yes! 💝" },
      { width: 380, height: 110, fontSize: "2rem", label: "You know you want to! 💖" },
    ];
    
    return stages[Math.min(stage, stages.length - 1)];
  }, [stage]);

  const { width, height, fontSize, label } = customSize 
    ? { ...buttonConfig, width: customSize.width, height: customSize.height }
    : buttonConfig;

  const buttonStyle = isMultiple && customPosition 
    ? { 
        position: "absolute" as const,
        left: customPosition.x,
        top: customPosition.y,
        width,
        height,
        fontSize,
      }
    : { width, height, fontSize };

  return (
    <motion.button
      onClick={onClick}
      className="gradient-button text-primary-foreground font-quicksand font-semibold rounded-full shadow-button cursor-pointer select-none"
      style={buttonStyle}
      initial={isMultiple ? { scale: 0, opacity: 0 } : { scale: 1 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        width,
        height,
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
        scale: { duration: 0.2 },
      }}
    >
      <motion.span
        animate={stage >= 4 ? {
          scale: [1, 1.05, 1],
        } : {}}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex items-center justify-center gap-1"
      >
        {label}
      </motion.span>
      
      {/* Glow effect for later stages */}
      {stage >= 3 && (
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
