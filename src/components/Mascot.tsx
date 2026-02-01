import { motion } from "framer-motion";

interface MascotProps {
  mood: "happy" | "sad" | "excited" | "pleading";
}

const Mascot = ({ mood }: MascotProps) => {
  const getMascotExpression = () => {
    switch (mood) {
      case "happy":
        return { eyes: "◠‿◠", mouth: "ᴥ", blush: true };
      case "sad":
        return { eyes: "◕︵◕", mouth: "︿", blush: false };
      case "excited":
        return { eyes: "★‿★", mouth: "▽", blush: true };
      case "pleading":
        return { eyes: "◕‸◕", mouth: "ω", blush: true };
      default:
        return { eyes: "◠‿◠", mouth: "ᴥ", blush: true };
    }
  };

  const expression = getMascotExpression();

  const bounceVariants = {
    happy: {
      y: [0, -5, 0],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const },
    },
    sad: {
      y: [0, 2, 0],
      rotate: [-2, 2, -2],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
    },
    excited: {
      y: [0, -15, 0],
      scale: [1, 1.1, 1],
      transition: { duration: 0.5, repeat: Infinity, ease: "easeOut" as const },
    },
    pleading: {
      rotate: [-5, 5, -5],
      transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" as const },
    },
  };

  return (
    <motion.div
      className="absolute -top-8 -right-8 md:-top-10 md:-right-10 z-20"
      variants={bounceVariants}
      animate={mood}
    >
      {/* Bear body */}
      <div className="relative">
        {/* Main body - cute bear */}
        <motion.div
          className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-peach to-secondary relative shadow-lg"
          style={{
            boxShadow: "0 8px 25px -5px hsla(330, 100%, 71%, 0.4)",
          }}
        >
          {/* Ears */}
          <div className="absolute -top-3 left-2 w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-peach to-secondary shadow-md" />
          <div className="absolute -top-3 right-2 w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-br from-peach to-secondary shadow-md" />
          
          {/* Inner ears */}
          <div className="absolute -top-2 left-3 w-4 h-4 md:w-5 md:h-5 rounded-full bg-primary/30" />
          <div className="absolute -top-2 right-3 w-4 h-4 md:w-5 md:h-5 rounded-full bg-primary/30" />

          {/* Face */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
            {/* Eyes */}
            <div className="text-foreground text-lg md:text-xl font-bold tracking-widest">
              {expression.eyes}
            </div>
            
            {/* Nose and mouth */}
            <div className="mt-1 text-foreground/80 text-sm">
              {expression.mouth}
            </div>
          </div>

          {/* Blush cheeks */}
          {expression.blush && (
            <>
              <motion.div
                className="absolute top-10 left-1 w-4 h-2 rounded-full bg-primary/40"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute top-10 right-1 w-4 h-2 rounded-full bg-primary/40"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </>
          )}

          {/* Little heart on chest */}
          <motion.div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-primary text-lg"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            💗
          </motion.div>
        </motion.div>

        {/* Sparkles around mascot when excited */}
        {mood === "excited" && (
          <>
            <motion.span
              className="absolute -top-4 -left-2 text-lg"
              animate={{ scale: [0, 1, 0], rotate: [0, 180, 360] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ✨
            </motion.span>
            <motion.span
              className="absolute -top-2 -right-4 text-lg"
              animate={{ scale: [0, 1, 0], rotate: [0, -180, -360] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
            >
              💖
            </motion.span>
            <motion.span
              className="absolute bottom-0 -left-4 text-lg"
              animate={{ scale: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
            >
              ⭐
            </motion.span>
          </>
        )}

        {/* Tear when sad */}
        {mood === "sad" && (
          <motion.div
            className="absolute top-12 left-4 text-blue-400 text-xs"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], y: [0, 10, 20] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💧
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Mascot;
