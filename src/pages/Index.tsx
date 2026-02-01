import FloatingHearts from "@/components/FloatingHearts";
import ProposalModal from "@/components/ProposalModal";
import { useURLParam, useImageURL } from "@/hooks/useURLParam";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useEffect } from "react";

const Index = () => {
  const name = useURLParam("name", "My Love");
  const imageUrl = useImageURL("image");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Redirect to /create if no name parameter is provided
  useEffect(() => {
    if (!searchParams.get("name")) {
      navigate("/create");
    }
  }, [searchParams, navigate]);

  // If no name param, don't render the page (will redirect)
  if (!searchParams.get("name")) {
    return null;
  }

  return (
    <div className="min-h-screen gradient-romantic overflow-hidden relative">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          background: "radial-gradient(ellipse at 30% 20%, hsla(330, 100%, 85%, 0.4) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsla(350, 100%, 88%, 0.3) 0%, transparent 50%)",
        }}
      />
      
      {/* Floating hearts background */}
      <FloatingHearts />
      
      {/* Main proposal modal */}
      <ProposalModal name={name} imageUrl={imageUrl} />

      {/* Floating "Create Your Own" button */}
      <motion.button
        onClick={() => navigate("/create")}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-primary text-white px-6 py-4 rounded-full shadow-xl hover:bg-primary/90 transition-all hover:scale-105 border-2 border-white/20"
        initial={{ opacity: 0, scale: 0, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Heart className="w-5 h-5 fill-white animate-pulse" />
        <span className="font-semibold text-base">Create Your Own Valentine 💕</span>
      </motion.button>
    </div>
  );
};

export default Index;
