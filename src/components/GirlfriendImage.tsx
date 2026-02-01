import { motion } from "framer-motion";
import { useState } from "react";

interface GirlfriendImageProps {
  imageUrl: string | null;
  name: string;
}

const GirlfriendImage = ({ imageUrl, name }: GirlfriendImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!imageUrl || imageError) {
    return null;
  }

  return (
    <motion.div
      className="flex flex-col items-center mb-6"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      {/* Heart-shaped frame container */}
      <div className="relative">
        {/* Outer glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/30 blur-xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Image container with heart border */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-primary shadow-button">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
              <span className="text-2xl">💕</span>
            </div>
          )}
          <img
            src={imageUrl}
            alt={`Photo of ${name}`}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        </div>

        {/* Decorative hearts around the image */}
        <motion.span
          className="absolute -top-2 -right-2 text-lg"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          💖
        </motion.span>
        <motion.span
          className="absolute -bottom-1 -left-2 text-lg"
          animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        >
          💗
        </motion.span>
      </div>

      {/* Name under the image */}
      <motion.p
        className="mt-3 font-romantic text-xl md:text-2xl text-primary"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {name} 💕
      </motion.p>
    </motion.div>
  );
};

export default GirlfriendImage;
