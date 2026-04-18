"use client";

import { Button } from "@/components/ui/Button";
import { useState } from "react";

// 📊 Mock Data (Phase 1)
const STATS = [
  { label: "Total Tests", value: "12" },
  { label: "Average Score", value: "118" },
  { label: "Best Score", value: "134" },
  { label: "Time Invested", value: "2h 14m" },
];

const HISTORY = [
  {
    id: 1,
    type: "IQ Assessment",
    date: "Apr 15, 2026",
    score: 128,
    percentile: "91st",
    duration: "14m 20s",
  },
  {
    id: 2,
    type: "EQ Assessment",
    date: "Apr 10, 2026",
    score: 112,
    percentile: "78th",
    duration: "11m 05s",
  },
  {
    id: 3,
    type: "Personality",
    date: "Apr 02, 2026",
    score: null,
    percentile: "OCEAN Profile",
    duration: "9m 45s",
  },
  {
    id: 4,
    type: "Spectrum",
    date: "Mar 28, 2026",
    score: 24,
    percentile: "Moderate AQ",
    duration: "12m 10s",
  },
  {
    id: 5,
    type: "IQ Assessment",
    date: "Mar 15, 2026",
    score: 115,
    percentile: "84th",
    duration: "15m 00s",
  },
];

type FilterType = "all" | "iq" | "eq" | "personality" | "spectrum";

export default function DashboardPage() {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredHistory =
    filter === "all"
      ? HISTORY
      : HISTORY.filter((h) => h.type.toLowerCase().includes(filter));

  return (
    <main className="min-h-full flex flex-col bg-linear-to-tr from-black to-[#171717] text-white">
      {/* Header Section */}
      <section className="pt-24 md:pt-28 lg:pt-32 pb-8 md:pb-10 lg:pb-8 px-6 md:px-12 lg:px-39">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-12">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-6xl text-white font-light tracking-tight">
              Your Dashboard
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-[#D4D4D4] font-light mt-2 md:mt-3 max-w-xl">
              Track your progress, review past assessments, and unlock deeper
              insights.
            </p>
          </div>
          <Button variant="primary" size="md">
            Take New Test
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#0A0A0A]/20 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6 text-center hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="font-serif text-2xl md:text-3xl lg:text-4xl text-white mb-1 md:mb-2">
                {stat.value}
              </div>
              <div className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[#A1A1A1]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* History Section */}
      <section className="py-6 md:py-8 lg:py-12 px-6 md:px-12 lg:px-39 flex-1">
        <div className="bg-[#0A0A0A]/20 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 md:p-5 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="font-serif text-xl md:text-2xl lg:text-3xl text-white">
              Test History
            </h2>
            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
              {(
                ["all", "iq", "eq", "personality", "spectrum"] as FilterType[]
              ).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`
                    px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-medium capitalize transition-colors whitespace-nowrap
                    ${
                      filter === f
                        ? "bg-white text-black"
                        : "bg-white/5 text-[#A1A1A1] hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="divide-y divide-white/5">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((test) => (
                <div
                  key={test.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-5 hover:bg-white/5 transition-colors gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base md:text-lg text-[#D4D4D4] truncate">
                      {test.type}
                    </h3>
                    <p className="text-[10px] md:text-xs text-[#A1A1A1] mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
                      <span>{test.date}</span>
                      <span>•</span>
                      <span>{test.duration}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 lg:gap-10">
                    <div className="text-right min-w-[80px] md:min-w-[100px]">
                      <div className="font-serif text-lg md:text-xl text-white">
                        {test.score ?? "—"}
                      </div>
                      <div className="text-[9px] md:text-[10px] uppercase tracking-wider text-[#A1A1A1]">
                        {test.percentile}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-xs shrink-0"
                    >
                      View Results
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 md:p-12 text-center text-[#A1A1A1]">
                <p className="text-sm md:text-base">
                  No tests found for this filter.
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  Take a Test
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
