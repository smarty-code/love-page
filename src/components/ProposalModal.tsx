import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useRef, useEffect } from "react";
import Mascot from "./Mascot";
import YesButton from "./YesButton";
import NoButton from "./NoButton";
import SuccessContent from "./SuccessContent";

interface ProposalModalProps {
  name: string;
}

interface MultipleYesButton {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

const ProposalModal = ({ name }: ProposalModalProps) => {
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
    return "excited"; // Getting excited as Yes button takes over
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
    
    const buffer = 50;
    const minDistance = 160;
    const buttonWidth = stage <= 4 ? 120 : stage <= 8 ? 100 : stage <= 12 ? 80 : 70;
    const buttonHeight = stage <= 4 ? 48 : stage <= 8 ? 42 : stage <= 12 ? 34 : 30;
    
    let attempts = 0;
    let newX: number, newY: number;
    
    do {
      newX = Math.random() * (bounds.width - buttonWidth - buffer * 2) + buffer;
      newY = Math.random() * (bounds.height - buttonHeight - buffer * 2) + buffer;
      
      const yesCenterX = yesBounds.x + yesBounds.width / 2;
      const yesCenterY = yesBounds.y + yesBounds.height / 2;
      const noCenterX = newX + buttonWidth / 2;
      const noCenterY = newY + buttonHeight / 2;
      
      const distance = Math.sqrt(
        Math.pow(yesCenterX - noCenterX, 2) + Math.pow(yesCenterY - noCenterY, 2)
      );
      
      attempts++;
      if (distance > minDistance || attempts > 30) break;
    } while (attempts < 30);
    
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
            x: Math.random() * (bounds.width - 180) + 40,
            y: Math.random() * (bounds.height - 100) + 40,
          },
          size: {
            width: 120 + Math.random() * 60,
            height: 45 + Math.random() * 20,
          },
        });
      }
      
      setMultipleYesButtons((prev) => [...prev, ...newButtons].slice(-12)); // Max 12 extra buttons
    }
  }, [noAttempts, moveNoButton, getContainerBounds]);

  const handleYesClick = () => {
    setIsSuccess(true);
  };

  // Initialize No button position
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
        className="relative w-full max-w-lg md:max-w-xl lg:max-w-2xl min-h-[400px] md:min-h-[450px] bg-card rounded-3xl shadow-card p-8 md:p-12 overflow-hidden"
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
              {/* Proposal text */}
              <motion.div
                className="text-center mb-12 md:mb-16"
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

                {/* Multiple Yes buttons that spawn */}
                {multipleYesButtons.map((btn) => (
                  <YesButton
                    key={btn.id}
                    stage={stage}
                    onClick={handleYesClick}
                    isMultiple
                    customPosition={btn.position}
                    customSize={btn.size}
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
              <SuccessContent name={name} />
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
