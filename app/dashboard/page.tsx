"use client";

import { Button } from "@/components/ui/Button";
import { useState } from "react";
import Link from "next/link";

type TestType = "IQ Assessment" | "EQ Assessment" | "Personality" | "Spectrum";
type FilterType = "all" | "iq" | "eq" | "personality" | "spectrum";

interface TestHistoryItem {
  id: number;
  type: TestType;
  date: string;
  score: number | null;
  percentile: string;
  duration: string;
}

interface DashboardStats {
  totalTests: string;
  averageScore: string;
  bestScore: string;
  timeInvested: string;
}

const MOCK_STATS: DashboardStats = {
  totalTests: "12",
  averageScore: "118",
  bestScore: "134",
  timeInvested: "2h 14m",
};

const MOCK_HISTORY: TestHistoryItem[] = [
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
    percentile: "70th",
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
    percentile: "Typical Range",
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
  {
    id: 6,
    type: "EQ Assessment",
    date: "Mar 10, 2026",
    score: 105,
    percentile: "52nd",
    duration: "10m 30s",
  },
];

const FILTER_TYPE_MAP: Record<FilterType, TestType[]> = {
  all: [],
  iq: ["IQ Assessment"],
  eq: ["EQ Assessment"],
  personality: ["Personality"],
  spectrum: ["Spectrum"],
};

function formatPercentile(testType: TestType, value: string): string {
  if (testType === "Personality") return "OCEAN Profile";
  if (testType === "Spectrum") {
    const num = parseInt(value);
    if (num >= 32) return "Elevated AQ";
    if (num >= 26) return "Moderate AQ";
    return "Typical Range";
  }
  return value; // IQ & EQ: "91st", "70th", dll
}

function getScoreDisplay(item: TestHistoryItem): {
  primary: string;
  secondary: string;
  isNumeric: boolean;
} {
  if (item.type === "Personality") {
    return { primary: "—", secondary: "OCEAN Profile", isNumeric: false };
  }
  if (item.type === "Spectrum") {
    return {
      primary: item.score?.toString() || "—",
      secondary: formatPercentile("Spectrum", item.percentile),
      isNumeric: true,
    };
  }
  return {
    primary: item.score?.toString() || "—",
    secondary: item.percentile,
    isNumeric: true,
  };
}

export default function DashboardPage() {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredHistory =
    filter === "all"
      ? MOCK_HISTORY
      : MOCK_HISTORY.filter((h) => FILTER_TYPE_MAP[filter].includes(h.type));

  return (
    <main className="min-h-full flex flex-col bg-linear-to-tr from-black to-[#171717] text-white">
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {Object.entries(MOCK_STATS).map(([key, value]) => (
            <div
              key={key}
              className="bg-[#0A0A0A]/20 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6 text-center hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="font-serif text-2xl md:text-3xl lg:text-4xl text-white mb-1 md:mb-2">
                {value}
              </div>
              <div className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[#A1A1A1]">
                {key.replace(/([A-Z])/g, " $1").trim()}
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
              filteredHistory.map((test) => {
                const { primary, secondary, isNumeric } = getScoreDisplay(test);
                return (
                  <Link
                    key={test.id}
                    href={`/results/${test.id}`}
                    className="block"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-5 hover:bg-white/5 transition-colors gap-4 cursor-pointer">
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
                          {isNumeric ? (
                            <>
                              <div className="font-serif text-lg md:text-xl text-white">
                                {primary}
                              </div>
                              <div className="text-[9px] md:text-[10px] uppercase tracking-wider text-[#A1A1A1]">
                                {secondary}
                              </div>
                            </>
                          ) : (
                            <div className="text-[10px] md:text-xs text-[#A1A1A1] italic">
                              {secondary}
                            </div>
                          )}
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
                  </Link>
                );
              })
            ) : (
              <div className="p-8 md:p-12 text-center text-[#A1A1A1]">
                <p className="text-sm md:text-base mb-4">
                  No tests found for this filter.
                </p>
                <Button variant="outline" size="sm">
                  <Link href="/iq">Take a Test</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
