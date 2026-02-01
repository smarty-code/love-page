import { motion } from "framer-motion";
import { useCallback, useMemo } from "react";

interface NoButtonProps {
  stage: number;
  position: { x: number; y: number };
  onAttempt: () => void;
  containerBounds: { width: number; height: number };
  yesButtonBounds: { x: number; y: number; width: number; height: number };
}

const NoButton = ({ stage, position, onAttempt, containerBounds, yesButtonBounds }: NoButtonProps) => {
  const buttonConfig = useMemo(() => {
    if (stage <= 4) {
      return { width: 120, height: 48, fontSize: "1rem", label: "No 😢" };
    } else if (stage <= 6) {
      return { width: 110, height: 44, fontSize: "0.95rem", label: "Still no? 🥺" };
    } else if (stage <= 8) {
      return { width: 100, height: 42, fontSize: "0.9rem", label: "Are you sure? 😰" };
    } else if (stage <= 10) {
      return { width: 90, height: 38, fontSize: "0.85rem", label: "Please no! 😭" };
    } else if (stage <= 12) {
      return { width: 80, height: 34, fontSize: "0.8rem", label: "Really?! 💔" };
    } else {
      return { width: 70, height: 30, fontSize: "0.75rem", label: "😱" };
    }
  }, [stage]);

  const { width, height, fontSize, label } = buttonConfig;

  const getRandomPosition = useCallback(() => {
    const buffer = 60;
    // Add generous padding around the Yes button (invisible boundary)
    const yesPadding = 40;
    
    // Define the exclusion zone (Yes button area + padding)
    const exclusionZone = {
      left: yesButtonBounds.x - yesPadding,
      right: yesButtonBounds.x + yesButtonBounds.width + yesPadding,
      top: yesButtonBounds.y - yesPadding,
      bottom: yesButtonBounds.y + yesButtonBounds.height + yesPadding,
    };
    
    // Helper function to check if No button overlaps with exclusion zone
    const overlapsExclusionZone = (x: number, y: number) => {
      const noRight = x + width;
      const noBottom = y + height;
      
      // Check if there's any overlap
      return !(x > exclusionZone.right || 
               noRight < exclusionZone.left || 
               y > exclusionZone.bottom || 
               noBottom < exclusionZone.top);
    };
    
    let attempts = 0;
    let newX: number, newY: number;
    let validPosition = false;
    
    while (!validPosition && attempts < 100) {
      newX = Math.random() * (containerBounds.width - width - buffer * 2) + buffer;
      newY = Math.random() * (containerBounds.height - height - buffer * 2) + buffer;
      
      // Check if position is outside the exclusion zone
      if (!overlapsExclusionZone(newX, newY)) {
        validPosition = true;
      }
      
      attempts++;
    }
    
    // If no valid position found after max attempts, place it far from Yes button
    if (!validPosition) {
      const yesCenterX = yesButtonBounds.x + yesButtonBounds.width / 2;
      if (yesCenterX < containerBounds.width / 2) {
        newX = containerBounds.width - width - buffer;
      } else {
        newX = buffer;
      }
      newY = buffer + Math.random() * (containerBounds.height / 3);
    }
    
    return { x: newX!, y: newY! };
  }, [containerBounds, yesButtonBounds, width, height]);

  const handleHover = () => {
    onAttempt();
  };

  const handleClick = () => {
    onAttempt();
  };

  const transitionSpeed = stage <= 4 ? 0.3 : stage <= 8 ? 0.2 : 0.15;

  // If stage is very high, button becomes nearly impossible to catch
  if (stage > 14) {
    return null; // Button disappears at this stage
  }

  return (
    <motion.button
      className="absolute bg-muted text-muted-foreground font-quicksand font-medium rounded-full border-2 border-border cursor-pointer select-none"
      style={{ fontSize }}
      initial={{ x: position.x, y: position.y, width, height }}
      animate={{ 
        x: position.x, 
        y: position.y,
        width,
        height,
        opacity: stage > 10 ? 0.7 : 1,
      }}
      onHoverStart={handleHover}
      onClick={handleClick}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: transitionSpeed,
      }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        animate={stage >= 6 ? { x: [-1, 1, -1] } : {}}
        transition={{ duration: 0.1, repeat: stage >= 6 ? Infinity : 0 }}
      >
        {label}
      </motion.span>
    </motion.button>
  );
};

export default NoButton;
