"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Mic } from "lucide-react";
import { SendHorizontal } from "lucide-react";

interface OpenEndedQuestionProps {
  questionNumber: number;
  questionText: string;
  assistantName?: string;
  assistantAvatar?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function OpenEndedQuestion({
  questionNumber,
  questionText,
  assistantName = "GrayTest Assistant",
  assistantAvatar = "/images/assistant-avatar.png",
  value,
  onChange,
  placeholder = "Write your answer...",
}: OpenEndedQuestionProps) {
  return (
    <div className="text-white flex-1 flex flex-col">
      {/* Assistant Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12.5 h-12.5 rounded-full bg-white/10 overflow-hidden border border-white/20">
          <img
            src={assistantAvatar}
            alt={assistantName}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-2xl font-bold">{assistantName}</span>
      </div>

      <div className="flex-1">
        {/* Question Card */}
        <div className="px-11 py-6 rounded-2xl bg-[#0A0A0A] border border-white/10">
          <h3 className="text-lg text-[#D4D4D4] font-semibold mb-3">
            Question {questionNumber}
          </h3>
          <p className="text-sm text-[#9CA3AF]">{questionText}</p>
        </div>
      </div>

      {/* Answer Input */}
      <div className="pt-8">
        <div
          className={`
          relative flex items-center gap-2.5 px-7.5 py-2.5 rounded-full bg-white/5
          border border-[#1F2937] transition-all duration-200
        `}
        >
          <button className="hover:cursor-pointer">
            <Plus className="w-6 h-6" />
          </button>

          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={1}
            className="flex-1 bg-transparent  placeholder:text-white/50 outline-none resize-none"
          />

          <button className="hover:cursor-pointer">
            <Mic className="w-6 h-6" />
          </button>

          <button className="hover:cursor-pointer">
            <SendHorizontal className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
