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
    const edgeBuffer = 20; // Buffer from card edges
    const yesPadding = 50; // Extra padding around yes button
    
    // Define the exclusion zone (Yes button area + padding)
    const exclusionZone = {
      left: yesButtonBounds.x - yesPadding,
      right: yesButtonBounds.x + yesButtonBounds.width + yesPadding,
      top: yesButtonBounds.y - yesPadding,
      bottom: yesButtonBounds.y + yesButtonBounds.height + yesPadding,
    };
    
    // The No button should stay in the upper 70% of the card, never below Yes button
    const maxY = Math.min(yesButtonBounds.y - yesPadding - height, containerBounds.height * 0.65);
    
    // Helper function to check if No button overlaps with exclusion zone
    const overlapsExclusionZone = (x: number, y: number) => {
      const noRight = x + width;
      const noBottom = y + height;
      
      return !(x > exclusionZone.right || 
               noRight < exclusionZone.left || 
               y > exclusionZone.bottom || 
               noBottom < exclusionZone.top);
    };
    
    // Helper function to check if position is within card bounds
    const isWithinBounds = (x: number, y: number) => {
      return x >= edgeBuffer && 
             x + width <= containerBounds.width - edgeBuffer &&
             y >= edgeBuffer && 
             y + height <= maxY;
    };
    
    // Define three zones: left of Yes, right of Yes, above Yes
    const zones = [
      // Left zone
      { 
        minX: edgeBuffer, 
        maxX: Math.max(edgeBuffer, exclusionZone.left - width), 
        minY: edgeBuffer, 
        maxY: maxY 
      },
      // Right zone
      { 
        minX: Math.min(containerBounds.width - width - edgeBuffer, exclusionZone.right), 
        maxX: containerBounds.width - width - edgeBuffer, 
        minY: edgeBuffer, 
        maxY: maxY 
      },
      // Above zone
      { 
        minX: edgeBuffer, 
        maxX: containerBounds.width - width - edgeBuffer, 
        minY: edgeBuffer, 
        maxY: Math.max(edgeBuffer, exclusionZone.top - height) 
      },
    ];
    
    // Filter out invalid zones
    const validZones = zones.filter(z => z.maxX > z.minX && z.maxY > z.minY);
    
    let attempts = 0;
    let newX: number = edgeBuffer;
    let newY: number = edgeBuffer;
    let validPosition = false;
    
    while (!validPosition && attempts < 100) {
      const zone = validZones[Math.floor(Math.random() * validZones.length)];
      
      if (zone) {
        newX = Math.random() * (zone.maxX - zone.minX) + zone.minX;
        newY = Math.random() * (zone.maxY - zone.minY) + zone.minY;
        
        if (!overlapsExclusionZone(newX, newY) && isWithinBounds(newX, newY)) {
          validPosition = true;
        }
      }
      
      attempts++;
    }
    
    // Fallback position
    if (!validPosition) {
      const yesCenterX = yesButtonBounds.x + yesButtonBounds.width / 2;
      newY = Math.max(edgeBuffer, Math.min(yesButtonBounds.y - yesPadding - height, maxY - height));
      
      if (yesCenterX > containerBounds.width / 2) {
        newX = edgeBuffer;
      } else {
        newX = containerBounds.width - width - edgeBuffer;
      }
    }
    
    return { x: newX, y: newY };
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
      className="absolute z-50 bg-muted text-muted-foreground font-quicksand font-medium rounded-full border-2 border-border cursor-pointer select-none shadow-lg"
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
