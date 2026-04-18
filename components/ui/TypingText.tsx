"use client";

import { useEffect, useState } from "react";

interface TypingTextProps {
  text: string;
  speed?: number;
  delay?: number;
  showCursor?: boolean;
  className?: string;
}

export function TypingText({
  text,
  speed = 50,
  delay = 0,
  showCursor = true,
  className = "",
}: TypingTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // ✅ Pastikan text adalah string
    const safeText = String(text || "");

    if (!safeText) {
      setDisplayed("");
      setIsTyping(false);
      return;
    }

    setDisplayed("");
    setIsTyping(true);

    let index = 0;

    const startTimeout = setTimeout(() => {
      const typeInterval = setInterval(() => {
        // ✅ Cek bounds sebelum akses karakter
        if (index < safeText.length) {
          const char = safeText[index];
          // ✅ Hanya concat jika char valid
          if (char !== undefined) {
            setDisplayed((prev) => prev + char);
          }
          index++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
        }
      }, speed);

      return () => clearInterval(typeInterval);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
    };
  }, [text, speed, delay]);

  return (
    <span className={className}>
      {displayed}
      {showCursor && isTyping && (
        <span className="inline-block w-[2px] h-[1em] bg-current ml-0.5 animate-pulse" />
      )}
    </span>
  );
}
