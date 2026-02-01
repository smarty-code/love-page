import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export const useURLParam = (paramName: string, fallback: string = "my love") => {
  const [searchParams] = useSearchParams();

  const value = useMemo(() => {
    const param = searchParams.get(paramName);

    if (!param) return fallback;

    // Sanitize input - only allow alphabetic characters, spaces, and some punctuation
    const sanitized = param
      .replace(/[^a-zA-Z\s'-]/g, "") // Remove non-alphabetic chars except spaces, hyphens, apostrophes
      .substring(0, 20) // Limit length
      .trim();

    if (!sanitized) return fallback;

    // Capitalize first letter of each word
    return sanitized
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }, [searchParams, paramName, fallback]);

  return value;
};

export const useImageURL = (paramName: string = "image") => {
  const [searchParams] = useSearchParams();

  const imageUrl = useMemo(() => {
    const param = searchParams.get(paramName);

    if (!param) return null;

    // Try to decode the URL if it's encoded
    let decodedUrl = param;
    try {
      // Check if the URL is encoded (contains %xx patterns)
      if (param.includes('%')) {
        decodedUrl = decodeURIComponent(param);
      }
    } catch {
      // If decoding fails, use the original param
      decodedUrl = param;
    }

    // Basic URL validation
    try {
      const url = new URL(decodedUrl);
      // Only allow http and https protocols
      if (url.protocol === "http:" || url.protocol === "https:") {
        // Return the href directly without re-encoding
        return url.href;
      }
    } catch {
      // If it's not a valid absolute URL, check if it starts with http/https
      if (decodedUrl.startsWith('http://') || decodedUrl.startsWith('https://')) {
        return decodedUrl;
      }
      return null;
    }

    return null;
  }, [searchParams, paramName]);

  return imageUrl;
};
