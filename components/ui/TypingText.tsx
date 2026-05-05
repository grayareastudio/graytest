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

interface Segment {
  content: string;
  highlight: boolean;
}

function parseSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  const regex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ content: text.slice(lastIndex, match.index), highlight: false });
    }
    segments.push({ content: match[1], highlight: true });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ content: text.slice(lastIndex), highlight: false });
  }

  return segments;
}

function stripMarkers(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, "$1");
}

export function TypingText({
  text,
  speed = 50,
  delay = 0,
  showCursor = true,
  className = "",
  gradient,
}: TypingTextProps) {
  const [displayedCount, setDisplayedCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const plainText = stripMarkers(text || "");
  const segments = parseSegments(text || "");

  useEffect(() => {
    if (!plainText) {
      setDisplayedCount(0);
      setIsTyping(false);
      return;
    }

    setDisplayedCount(0);
    setIsTyping(true);

    let index = 0;

    const startTimeout = setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (index < plainText.length) {
          index++;
          setDisplayedCount(index);
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
  }, [text, speed, delay, plainText]);

  function buildVisible(): React.ReactNode[] {
    const nodes: React.ReactNode[] = [];
    let remaining = displayedCount;

    segments.forEach((seg, i) => {
      if (remaining <= 0) return;
      const visible = seg.content.slice(0, remaining);
      remaining -= seg.content.length;

      if (seg.highlight) {
        nodes.push(
          <span
            key={i}
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #d4c9b8 0%, #c6bcaa 45%, #b8a88f 100%)",
            }}
          >
            {visible}
          </span>
        );
      } else {
        nodes.push(<span key={i}>{visible}</span>);
      }
    });

    return nodes;
  }

  return (
    <span className={`relative inline-block ${className}`}>
      {/* Invisible placeholder to reserve space */}
      <span className="invisible">{plainText}</span>

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
        {buildVisible()}
        {showCursor && isTyping && (
          <span className="inline-block w-0.5 h-[1em] bg-current ml-0.5 animate-pulse" />
        )}
      </span>
    </span>
  );
}
