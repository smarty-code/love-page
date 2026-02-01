import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useRef, useEffect } from "react";
import Mascot from "./Mascot";
import YesButton from "./YesButton";
import NoButton from "./NoButton";
import SuccessContent from "./SuccessContent";
import GirlfriendImage from "./GirlfriendImage";

interface ProposalModalProps {
  name: string;
  imageUrl: string | null;
}

interface MultipleYesButton {
  id: string;
  position: { x: number; y: number };
}

const ProposalModal = ({ name, imageUrl }: ProposalModalProps) => {
  const [noAttempts, setNoAttempts] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 200, y: 180 });
  const [multipleYesButtons, setMultipleYesButtons] = useState<MultipleYesButton[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const yesButtonRef = useRef<HTMLDivElement>(null);

  const stage = Math.min(Math.floor(noAttempts / 2) + 1, 6);
  
  const getMascotMood = (): "happy" | "sad" | "excited" | "pleading" => {
    if (isSuccess) return "excited";
    if (noAttempts === 0) return "happy";
    if (noAttempts < 5) return "sad";
    if (noAttempts < 10) return "pleading";
    return "excited";
  };

  const getContainerBounds = useCallback(() => {
    if (!containerRef.current) return { width: 500, height: 400 };
    const rect = containerRef.current.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }, []);

  const getYesButtonBounds = useCallback(() => {
    if (!yesButtonRef.current) return { x: 150, y: 280, width: 140, height: 52 };
    const rect = yesButtonRef.current.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: 150, y: 280, width: rect.width, height: rect.height };
    
    return {
      x: rect.left - containerRect.left,
      y: rect.top - containerRect.top,
      width: rect.width,
      height: rect.height,
    };
  }, []);

  const moveNoButton = useCallback(() => {
    const bounds = getContainerBounds();
    const yesBounds = getYesButtonBounds();
    
    const edgeBuffer = 20; // Buffer from card edges
    const yesPadding = 50; // Extra padding around yes button
    const buttonWidth = stage <= 4 ? 120 : stage <= 8 ? 100 : stage <= 12 ? 80 : 70;
    const buttonHeight = stage <= 4 ? 48 : stage <= 8 ? 42 : stage <= 12 ? 34 : 30;
    
    // Define the exclusion zone (Yes button area + padding)
    const exclusionZone = {
      left: yesBounds.x - yesPadding,
      right: yesBounds.x + yesBounds.width + yesPadding,
      top: yesBounds.y - yesPadding,
      bottom: yesBounds.y + yesBounds.height + yesPadding,
    };
    
    // Define valid movement areas (left, right, or above the Yes button - never below)
    // The No button should stay in the upper 70% of the card
    const maxY = Math.min(yesBounds.y - yesPadding - buttonHeight, bounds.height * 0.65);
    
    // Helper function to check if No button overlaps with exclusion zone
    const overlapsExclusionZone = (x: number, y: number) => {
      const noRight = x + buttonWidth;
      const noBottom = y + buttonHeight;
      
      return !(x > exclusionZone.right || 
               noRight < exclusionZone.left || 
               y > exclusionZone.bottom || 
               noBottom < exclusionZone.top);
    };
    
    // Helper function to check if position is within card bounds
    const isWithinBounds = (x: number, y: number) => {
      return x >= edgeBuffer && 
             x + buttonWidth <= bounds.width - edgeBuffer &&
             y >= edgeBuffer && 
             y + buttonHeight <= maxY;
    };
    
    let attempts = 0;
    let newX: number = edgeBuffer;
    let newY: number = edgeBuffer;
    let validPosition = false;
    
    // Define three zones: left of Yes, right of Yes, above Yes
    const zones = [
      // Left zone
      { 
        minX: edgeBuffer, 
        maxX: Math.max(edgeBuffer, exclusionZone.left - buttonWidth), 
        minY: edgeBuffer, 
        maxY: maxY 
      },
      // Right zone
      { 
        minX: Math.min(bounds.width - buttonWidth - edgeBuffer, exclusionZone.right), 
        maxX: bounds.width - buttonWidth - edgeBuffer, 
        minY: edgeBuffer, 
        maxY: maxY 
      },
      // Above zone (centered above Yes button)
      { 
        minX: edgeBuffer, 
        maxX: bounds.width - buttonWidth - edgeBuffer, 
        minY: edgeBuffer, 
        maxY: Math.max(edgeBuffer, exclusionZone.top - buttonHeight) 
      },
    ];
    
    // Filter out invalid zones (where max < min)
    const validZones = zones.filter(z => z.maxX > z.minX && z.maxY > z.minY);
    
    while (!validPosition && attempts < 100) {
      // Pick a random valid zone
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
    
    // Fallback: place to the left or right of Yes button at same height
    if (!validPosition) {
      const yesCenterX = yesBounds.x + yesBounds.width / 2;
      newY = Math.max(edgeBuffer, Math.min(yesBounds.y, maxY - buttonHeight));
      
      if (yesCenterX > bounds.width / 2) {
        // Yes is on right, place No on left
        newX = edgeBuffer;
      } else {
        // Yes is on left, place No on right
        newX = bounds.width - buttonWidth - edgeBuffer;
      }
    }
    
    setNoButtonPosition({ x: newX, y: newY });
  }, [getContainerBounds, getYesButtonBounds, stage]);

  const handleNoAttempt = useCallback(() => {
    setNoAttempts((prev) => prev + 1);
    moveNoButton();
    
    // Add multiple Yes buttons after stage 4
    if (noAttempts >= 8) {
      const bounds = getContainerBounds();
      const newButtons: MultipleYesButton[] = [];
      const numNewButtons = Math.min(noAttempts - 7, 3);
      
      for (let i = 0; i < numNewButtons; i++) {
        newButtons.push({
          id: `yes-${Date.now()}-${i}`,
          position: {
            x: Math.random() * (bounds.width - 140) + 20,
            y: Math.random() * (bounds.height - 60) + 20,
          },
        });
      }
      
      setMultipleYesButtons((prev) => [...prev, ...newButtons].slice(-12));
    }
  }, [noAttempts, moveNoButton, getContainerBounds]);

  const handleYesClick = () => {
    setIsSuccess(true);
  };

  useEffect(() => {
    moveNoButton();
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Backdrop with blur */}
      <motion.div
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Modal */}
      <motion.div
        ref={containerRef}
        className="relative w-full max-w-lg md:max-w-xl lg:max-w-2xl min-h-[450px] md:min-h-[500px] bg-card rounded-3xl shadow-card p-8 md:p-12"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
        style={{
          boxShadow: "0 25px 80px -20px hsla(330, 100%, 60%, 0.35)",
        }}
      >
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-accent/20 pointer-events-none" />
        
        {/* Mascot */}
        <Mascot mood={getMascotMood()} />

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="proposal"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative z-10"
            >
              {/* Girlfriend image */}
              <GirlfriendImage imageUrl={imageUrl} name={name} />

              {/* Proposal text */}
              <motion.div
                className="text-center mb-10 md:mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.h1
                  className="font-romantic text-2xl md:text-4xl lg:text-5xl text-foreground leading-relaxed"
                  animate={{
                    textShadow: [
                      "0 0 20px hsla(330, 100%, 71%, 0)",
                      "0 0 30px hsla(330, 100%, 71%, 0.3)",
                      "0 0 20px hsla(330, 100%, 71%, 0)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Will you be my Valentine,{" "}
                  <span className="text-gradient">{name}</span>? 💕
                </motion.h1>
              </motion.div>

              {/* Buttons container */}
              <div className="relative h-48 md:h-56">
                {/* Yes button - centered at bottom */}
                <div 
                  ref={yesButtonRef}
                  className="absolute left-1/2 bottom-0 -translate-x-1/2 flex justify-center"
                >
                  <YesButton stage={stage} onClick={handleYesClick} />
                </div>

                {/* No button - moves around */}
                {stage < 8 && (
                  <NoButton
                    stage={stage}
                    position={noButtonPosition}
                    onAttempt={handleNoAttempt}
                    containerBounds={getContainerBounds()}
                    yesButtonBounds={getYesButtonBounds()}
                  />
                )}

                {/* Multiple Yes buttons that spawn - fixed sizes */}
                {multipleYesButtons.map((btn) => (
                  <YesButton
                    key={btn.id}
                    stage={stage}
                    onClick={handleYesClick}
                    isMultiple
                    customPosition={btn.position}
                  />
                ))}
              </div>

              {/* Hint text */}
              {noAttempts > 5 && (
                <motion.p
                  className="text-center text-sm text-muted-foreground mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                >
                  {noAttempts < 10
                    ? "The Yes button is looking pretty nice... 👀"
                    : "Just click Yes already! 💖"}
                </motion.p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <SuccessContent name={name} imageUrl={imageUrl} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative corner hearts */}
        <motion.div
          className="absolute top-4 left-4 text-2xl text-primary/30"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          💗
        </motion.div>
        <motion.div
          className="absolute bottom-4 right-4 text-2xl text-primary/30"
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        >
          💕
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProposalModal;
