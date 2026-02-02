import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { trackSocialShare } from "@/lib/clarity";
import { useToast } from "@/hooks/use-toast";

// Custom SVG icons for social media
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

interface SocialShareIconsProps {
  url: string;
  name: string;
}

const SocialShareIcons = ({ url, name }: SocialShareIconsProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Personalized romantic message for sharing
  const shareMessage = `Hey ${name} ❤️
I made something special for you and I really hope it makes you smile.
Please open this when you have a quiet moment 🫶

💌 ${url}`;

  const handleCopyLink = async () => {
    trackSocialShare("CopyLink");
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for browsers without clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      toast({
        title: "Link copied! 💕",
        description: "Now share it with your special someone!",
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Couldn't copy the link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleWhatsAppShare = () => {
    trackSocialShare("WhatsApp");
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, "_blank");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 300 }
    },
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-primary/70 text-center font-medium">
        Share the love 💕
      </p>
      <motion.div 
        className="flex justify-center gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* WhatsApp Button */}
        <motion.button
          onClick={handleWhatsAppShare}
          className="group flex flex-col items-center gap-2"
          variants={itemVariants}
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.95 }}
          title="Share on WhatsApp"
        >
          <div className="relative w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border-2 border-primary/20 flex items-center justify-center shadow-md transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/20">
            <div 
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ 
                boxShadow: `0 0 0 2px #25D36630, 0 0 12px #25D36620`
              }}
            />
            <WhatsAppIcon 
              className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
              style={{ color: "#25D366" }}
            />
          </div>
          <span className="text-[11px] font-medium text-primary/60 group-hover:text-primary transition-colors">
            WhatsApp
          </span>
        </motion.button>

        {/* Copy Link Button */}
        <motion.button
          onClick={handleCopyLink}
          className="group flex flex-col items-center gap-2"
          variants={itemVariants}
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.95 }}
          title="Copy Link"
        >
          <div className={`relative w-12 h-12 rounded-full backdrop-blur-sm border-2 flex items-center justify-center shadow-md transition-all duration-300 ${
            copied 
              ? "bg-green-100 border-green-300" 
              : "bg-white/80 border-primary/20 group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/20"
          }`}>
            <div 
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ 
                boxShadow: copied 
                  ? `0 0 0 2px #22c55e30, 0 0 12px #22c55e20`
                  : `0 0 0 2px #ec489930, 0 0 12px #ec489920`
              }}
            />
            {copied ? (
              <Check className="w-5 h-5 text-green-500 transition-transform duration-300" />
            ) : (
              <Copy 
                className="w-5 h-5 text-primary transition-transform duration-300 group-hover:scale-110"
              />
            )}
          </div>
          <span className={`text-[11px] font-medium transition-colors ${
            copied ? "text-green-500" : "text-primary/60 group-hover:text-primary"
          }`}>
            {copied ? "Copied!" : "Copy Link"}
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SocialShareIcons;
