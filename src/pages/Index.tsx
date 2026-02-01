import FloatingHearts from "@/components/FloatingHearts";
import ProposalModal from "@/components/ProposalModal";
import Navbar from "@/components/Navbar";
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
      {/* Navbar - Valentine page mode (no menu) */}
      <Navbar isValentinePage />

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

      {/* Floating "Create Your Own" button - centered at bottom */}
      <div className="fixed bottom-4 md:bottom-6 inset-x-0 z-50 flex justify-center px-4">
        <motion.button
          onClick={() => navigate("/create")}
          className="flex items-center justify-center gap-2 md:gap-3 bg-primary text-white px-4 py-3 md:px-6 md:py-4 rounded-full shadow-xl hover:bg-primary/90 transition-all border-2 border-white/20 max-w-[90vw]"
          initial={{ opacity: 0, scale: 0, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart className="w-4 h-4 md:w-5 md:h-5 fill-white animate-pulse flex-shrink-0" />
          <span className="font-semibold text-sm md:text-base whitespace-nowrap">Create Your Own Valentine 💕</span>
        </motion.button>
      </div>
    </div>
  );
};

export default Index;
