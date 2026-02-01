import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";

interface SuccessContentProps {
  name: string;
  imageUrl?: string | null;
}

const SuccessContent = ({ name, imageUrl }: SuccessContentProps) => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    const timer = setTimeout(() => setShowConfetti(false), 7000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  const heartColors = ["#FF69B4", "#FF1493", "#FFB6C1", "#FF6B9D", "#FFC0CB", "#FFE4E1"];

  return (
    <>
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={300}
          recycle={false}
          colors={heartColors}
          gravity={0.15}
          wind={0.02}
          tweenDuration={7000}
        />
      )}

      <motion.div
        className="text-center px-4 py-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.34, 1.56, 0.64, 1],
        }}
      >
        {/* Image in success state */}
        {imageUrl && (
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/40 blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-primary shadow-lg">
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                    <span className="text-3xl">💕</span>
                  </div>
                )}
                <img
                  src={imageUrl}
                  alt={`Photo of ${name}`}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
              <motion.span
                className="absolute -top-2 -right-2 text-2xl"
                animate={{ scale: [1, 1.3, 1], rotate: [0, 15, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                💖
              </motion.span>
            </div>
          </motion.div>
        )}

        {/* Main celebration text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.h1
            className="font-romantic text-3xl md:text-5xl lg:text-6xl text-primary mb-6 leading-relaxed"
            animate={{ 
              scale: [1, 1.02, 1],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            Yay! I knew you'd say yes, {name}! ❤️
          </motion.h1>
        </motion.div>

        {/* Hearts decoration */}
        <motion.div
          className="flex justify-center gap-4 my-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {["💕", "💖", "💗", "💖", "💕"].map((heart, i) => (
            <motion.span
              key={i}
              className="text-3xl md:text-4xl"
              animate={{ 
                y: [0, -10, 0],
                rotate: [-5, 5, -5],
              }}
              transition={{ 
                duration: 1.5, 
                delay: i * 0.15, 
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {heart}
            </motion.span>
          ))}
        </motion.div>

        {/* Secondary message */}
        <motion.p
          className="text-lg md:text-xl text-muted-foreground font-quicksand mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          This Valentine's Day is going to be amazing! 💖
        </motion.p>

        {/* Big animated heart */}
        <motion.div
          className="text-5xl md:text-7xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            delay: 1, 
            type: "spring", 
            stiffness: 200, 
            damping: 10 
          }}
        >
          <motion.span
            animate={{ 
              scale: [1, 1.15, 1],
            }}
            transition={{ 
              duration: 0.8, 
              repeat: Infinity, 
              ease: "easeInOut",
            }}
            className="inline-block"
          >
            💝
          </motion.span>
        </motion.div>

        {/* Love message */}
        <motion.p
          className="text-xl md:text-2xl font-romantic text-accent mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          I love you so much! 💕
        </motion.p>

        {/* Floating elements around */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 8 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute text-xl md:text-2xl"
              style={{
                left: `${Math.random() * 80 + 10}%`,
                top: `${Math.random() * 80 + 10}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0],
                y: [-20, -60],
              }}
              transition={{
                duration: 3,
                delay: 1 + i * 0.3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              {["💗", "✨", "💖", "⭐", "💕"][i % 5]}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default SuccessContent;
