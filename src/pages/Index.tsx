import FloatingHearts from "@/components/FloatingHearts";
import ProposalModal from "@/components/ProposalModal";
import { useURLParam, useImageURL } from "@/hooks/useURLParam";

const Index = () => {
  const name = useURLParam("name", "My Love");
  const imageUrl = useImageURL("image");

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
    </div>
  );
};

export default Index;
