"use client";

import { useEffect, useState } from "react";

interface TypingTextProps {
  text: string;
  speed?: number;
  delay?: number;
  showCursor?: boolean;
  className?: string;
  gradient?: boolean;
}

export function TypingText({
  text,
  speed = 50,
  delay = 0,
  showCursor = true,
  className = "",
  gradient,
}: TypingTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
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
        if (index < safeText.length) {
          const char = safeText[index];
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
    <span className={`relative inline-block ${className}`}>
      <span className="invisible">{text}</span>

      <span
        className={`absolute left-0 top-0 ${
          gradient ? "bg-clip-text text-transparent" : ""
        }`}
        style={
          gradient
            ? {
                backgroundImage:
                  "linear-gradient(160deg, rgba(212,212,212,1) 0%, rgba(212,212,212,0.5) 80%, rgba(115,115,115,1) 100%)",
              }
            : {}
        }
      >
        {displayed}
        {showCursor && isTyping && (
          <span className="inline-block w-0.5 h-[1em] bg-current ml-0.5 animate-pulse" />
        )}
      </span>
    </span>
  );
}
