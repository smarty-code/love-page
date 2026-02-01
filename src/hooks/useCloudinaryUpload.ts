import { useState, useCallback } from "react";

interface UploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  result: UploadResult | null;
}

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const useCloudinaryUpload = () => {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    result: null,
  });

  const sanitizeName = (name: string): string => {
    // Remove special characters and replace spaces with underscores
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "_")
      .substring(0, 50);
  };

  const upload = useCallback(async (file: File, name: string): Promise<UploadResult | null> => {
    console.log("=== Cloudinary Upload Debug ===");
    console.log("Cloud Name:", CLOUD_NAME);
    console.log("Upload Preset:", UPLOAD_PRESET);
    console.log("File:", file.name, file.type, file.size, "bytes");
    console.log("Name:", name);

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      console.error("❌ Missing Cloudinary configuration!");
      console.error("VITE_CLOUDINARY_CLOUD_NAME:", CLOUD_NAME || "NOT SET");
      console.error("VITE_CLOUDINARY_UPLOAD_PRESET:", UPLOAD_PRESET || "NOT SET");
      setState((prev) => ({
        ...prev,
        error: "Cloudinary configuration missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.",
      }));
      return null;
    }

    setState({
      isUploading: true,
      progress: 0,
      error: null,
      result: null,
    });

    try {
      const sanitizedName = sanitizeName(name);
      const timestamp = Date.now();
      const publicId = `valentine_${sanitizedName}_${timestamp}`;

      console.log("Sanitized name:", sanitizedName);
      console.log("Public ID:", publicId);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("public_id", publicId);
      formData.append("folder", "valentine-pages");

      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
      console.log("Upload URL:", uploadUrl);

      // Using XMLHttpRequest for progress tracking
      const result = await new Promise<UploadResult>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            console.log("Upload progress:", progress + "%");
            setState((prev) => ({ ...prev, progress }));
          }
        });

        xhr.addEventListener("load", () => {
          console.log("Response status:", xhr.status);
          console.log("Response text:", xhr.responseText);
          
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            console.log("✅ Upload successful!", response);
            resolve(response);
          } else {
            console.error("❌ Upload failed with status:", xhr.status);
            console.error("Response:", xhr.responseText);
            try {
              const errorResponse = JSON.parse(xhr.responseText);
              reject(new Error(errorResponse.error?.message || `Upload failed with status ${xhr.status}`));
            } catch {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          }
        });

        xhr.addEventListener("error", () => {
          console.error("❌ Network error during upload");
          reject(new Error("Network error during upload"));
        });

        xhr.open("POST", uploadUrl);
        xhr.send(formData);
      });

      setState({
        isUploading: false,
        progress: 100,
        error: null,
        result,
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Upload failed";
      setState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
        result: null,
      });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isUploading: false,
      progress: 0,
      error: null,
      result: null,
    });
  }, []);

  return {
    ...state,
    upload,
    reset,
  };
};
