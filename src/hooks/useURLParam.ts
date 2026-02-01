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
