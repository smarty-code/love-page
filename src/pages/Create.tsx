import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import FloatingHearts from "@/components/FloatingHearts";
import Navbar from "@/components/Navbar";
import SocialShareIcons from "@/components/SocialShareIcons";
import { Heart, Upload, Copy, Check, Image as ImageIcon, Sparkles } from "lucide-react";

const Create = () => {
  const [name, setName] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isUploading, progress, error, upload, reset } = useCloudinaryUpload();

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("Image must be less than 10MB");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Image must be less than 10MB");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleSubmit = async () => {
    if (!selectedFile || !name.trim()) {
      alert("Please enter a name and select a photo");
      return;
    }

    const result = await upload(selectedFile, name);
    if (result) {
      // Generate the shareable URL
      const baseUrl = window.location.origin;
      const params = new URLSearchParams({
        name: name.trim(),
        image: result.secure_url,
      });
      const shareableUrl = `${baseUrl}/?${params.toString()}`;
      setGeneratedUrl(shareableUrl);
    }
  };

  const copyToClipboard = async () => {
    if (generatedUrl) {
      try {
        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(generatedUrl);
        } else {
          // Fallback for older browsers or non-secure contexts
          const textArea = document.createElement("textarea");
          textArea.value = generatedUrl;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
        alert("Failed to copy. Please copy the link manually.");
      }
    }
  };

  const startOver = () => {
    setName("");
    setPreviewImage(null);
    setSelectedFile(null);
    setGeneratedUrl(null);
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen gradient-romantic overflow-hidden relative">
      {/* Navbar - Main page mode (with menu) */}
      <Navbar />

      {/* Background effects */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, hsla(330, 100%, 85%, 0.4) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsla(350, 100%, 88%, 0.3) 0%, transparent 50%)",
        }}
      />
      <FloatingHearts />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-romantic text-primary mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8" />
            Create Valentine Page
            <Sparkles className="w-8 h-8" />
          </h1>
          <p className="text-muted-foreground text-lg">
            Create a personalized Valentine's page for your loved one 💕
          </p>
        </motion.div>

        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-primary/20 shadow-lg bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <Heart className="w-5 h-5 fill-primary" />
                  Enter Details
                </CardTitle>
                <CardDescription>
                  Add your loved one's name and a beautiful photo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Name Input */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Your Loved One's Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={20}
                    className="border-primary/30 focus:border-primary"
                    disabled={isUploading || !!generatedUrl}
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label className="text-foreground">Photo</Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      previewImage
                        ? "border-primary bg-primary/5"
                        : "border-primary/30 hover:border-primary hover:bg-primary/5"
                    }`}
                    onClick={() => !isUploading && !generatedUrl && fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileSelect}
                      disabled={isUploading || !!generatedUrl}
                    />
                    {previewImage ? (
                      <div className="space-y-2">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-24 h-24 object-cover rounded-full mx-auto border-4 border-primary"
                        />
                        <p className="text-sm text-muted-foreground">
                          Click to change photo
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <ImageIcon className="w-12 h-12 mx-auto text-primary/50" />
                        <p className="text-muted-foreground">
                          Click or drag & drop a photo
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Max size: 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Progress */}
                <AnimatePresence>
                  {isUploading && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Message */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-destructive text-sm"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Generated URL */}
                <AnimatePresence>
                  {generatedUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3 p-4 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <p className="text-green-700 font-medium flex items-center gap-2">
                        <Check className="w-5 h-5" />
                        Your Valentine page is ready!
                      </p>
                      <div className="flex gap-2">
                        <Input
                          value={generatedUrl}
                          readOnly
                          className="text-xs bg-white"
                        />
                        <Button
                          onClick={copyToClipboard}
                          variant="outline"
                          size="icon"
                          className="shrink-0"
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => window.open(generatedUrl, "_blank")}
                          className="flex-1 bg-primary hover:bg-primary/90"
                        >
                          View Page 💕
                        </Button>
                        <Button
                          onClick={startOver}
                          variant="outline"
                          className="flex-1"
                        >
                          Create Another
                        </Button>
                      </div>

                      {/* Social Share Icons */}
                      <div className="pt-2 border-t border-green-200">
                        <SocialShareIcons url={generatedUrl} name={name} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                {!generatedUrl && (
                  <Button
                    onClick={handleSubmit}
                    disabled={!name.trim() || !selectedFile || isUploading}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-6"
                  >
                    {isUploading ? (
                      "Creating..."
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Create Valentine Page
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Preview Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-primary/20 shadow-lg bg-white/80 backdrop-blur h-full">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Preview
                </CardTitle>
                <CardDescription>
                  This is how your Valentine page will look
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-[9/16] max-h-[400px] rounded-lg overflow-hidden border border-primary/20 bg-gradient-to-b from-pink-100 to-pink-200 relative">
                  {/* Mini preview of the Valentine page */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    {/* Floating hearts decoration */}
                    <div className="absolute inset-0 overflow-hidden">
                      {[...Array(5)].map((_, i) => (
                        <motion.span
                          key={i}
                          className="absolute text-2xl"
                          style={{
                            left: `${20 + i * 15}%`,
                            top: `${10 + i * 10}%`,
                          }}
                          animate={{
                            y: [0, -10, 0],
                            opacity: [0.3, 0.6, 0.3],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                          }}
                        >
                          💕
                        </motion.span>
                      ))}
                    </div>

                    {/* Image placeholder */}
                    <motion.div
                      className="w-20 h-20 rounded-full border-4 border-pink-400 overflow-hidden bg-pink-300 flex items-center justify-center mb-4"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">💗</span>
                      )}
                    </motion.div>

                    {/* Name */}
                    <p className="text-pink-600 font-romantic text-lg mb-4">
                      {name || "Your Love"} 💕
                    </p>

                    {/* Mock proposal card */}
                    <div className="bg-white/90 rounded-xl p-4 shadow-lg w-full max-w-[200px]">
                      <p className="text-center text-pink-600 font-medium text-sm mb-3">
                        Will you be my Valentine?
                      </p>
                      <div className="flex gap-2 justify-center">
                        <div className="px-4 py-1 bg-pink-500 text-white rounded-full text-xs">
                          Yes!
                        </div>
                        <div className="px-4 py-1 bg-gray-200 text-gray-600 rounded-full text-xs">
                          No
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Create;
