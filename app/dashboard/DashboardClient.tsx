// app/dashboard/DashboardClient.tsx
"use client";

import { Button } from "@/components/ui/Button";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import deleteIcon from "@/assets/icons/delete.svg";
import { TestCards } from "@/components/sections/TestCards";
import type { TestResult } from "@/lib/actions/result-actions";
import type { UserProfile } from "@/lib/actions/profile-actions";

type FilterType = "all" | "iq" | "eq" | "personality" | "spectrum";

interface DashboardClientProps {
  initialResults: TestResult[];
  profile: UserProfile | null;
  stats: {
    totalTests: number;
    averageScore: number | null;
    bestScore: number | null;
    totalTime: number; // in seconds
  };
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function getFilterKey(testType: string): FilterType {
  const map: Record<string, FilterType> = {
    iq: "iq",
    "IQ Assessment": "iq",
    eq: "eq",
    "EQ Assessment": "eq",
    personality: "personality",
    spectrum: "spectrum",
  };
  return map[testType.toLowerCase()] || "all";
}

export function DashboardClient({
  initialResults,
  stats,
  profile,
}: DashboardClientProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [showTestModal, setShowTestModal] = useState(false);

  const filteredResults =
    filter === "all"
      ? initialResults
      : initialResults.filter((r) => getFilterKey(r.test_type) === filter);

  return (
    <main className="min-h-screen flex flex-col bg-linear-to-tr from-black to-[#171717] text-white">
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
          <Button variant="primary" size="md" onClick={() => setShowTestModal(true)}>
            Take New Test
          </Button>
        </div>

        {/* Test Selection Modal */}
        {showTestModal && (
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowTestModal(false)}
          >
            <div
              className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-8xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 md:px-8 pt-6 md:pt-8 pb-2">
                <h2 className="font-serif text-2xl md:text-3xl text-white font-medium">
                  Choose a Test
                </h2>
                <button
                  onClick={() => setShowTestModal(false)}
                  className="text-white/70 hover:text-white transition-colors hover:cursor-pointer"
                >
                  <Image src={deleteIcon} alt="close" width={36} height={36} />
                </button>
              </div>
              <TestCards />
            </div>
          </div>
        )}

        {/* Profile Section */}
        {profile && (
          <section className="py-0 pb-6 md:pb-8">
            <div className="bg-[#0A0A0A]/20 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl md:text-2xl text-white">
                  Your Profile
                </h2>
                <Link
                  href={`/onboarding?redirect=/dashboard`}
                  className="text-xs text-[#A1A1A1] hover:text-white transition-colors"
                >
                  Edit
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[#A1A1A1] mb-1">
                    Age
                  </p>
                  <p className="text-sm text-white">
                    {profile.age ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[#A1A1A1] mb-1">
                    Gender
                  </p>
                  <p className="text-sm text-white capitalize">
                    {profile.gender?.replace(/_/g, " ") ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[#A1A1A1] mb-1">
                    Education
                  </p>
                  <p className="text-sm text-white capitalize">
                    {profile.education?.replace(/_/g, " ") ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[#A1A1A1] mb-1">
                    Occupation
                  </p>
                  <p className="text-sm text-white">
                    {profile.occupation ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-[#0A0A0A]/20 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6 text-center">
            <div className="font-serif text-2xl md:text-3xl lg:text-4xl text-white mb-1">
              {stats.totalTests}
            </div>
            <div className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[#A1A1A1]">
              Total Tests
            </div>
          </div>
          <div className="bg-[#0A0A0A]/20 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6 text-center">
            <div className="font-serif text-2xl md:text-3xl lg:text-4xl text-white mb-1">
              {stats.averageScore !== null
                ? Math.round(stats.averageScore)
                : "—"}
            </div>
            <div className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[#A1A1A1]">
              Average Score
            </div>
          </div>
          <div className="bg-[#0A0A0A]/20 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6 text-center">
            <div className="font-serif text-2xl md:text-3xl lg:text-4xl text-white mb-1">
              {stats.bestScore !== null ? stats.bestScore : "—"}
            </div>
            <div className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[#A1A1A1]">
              Best Score
            </div>
          </div>
          <div className="bg-[#0A0A0A]/20 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6 text-center">
            <div className="font-serif text-2xl md:text-3xl lg:text-4xl text-white mb-1">
              {formatDuration(stats.totalTime)}
            </div>
            <div className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[#A1A1A1]">
              Time Invested
            </div>
          </div>
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
            {/* <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
              {(
                ["all", "iq", "eq", "personality", "spectrum"] as FilterType[]
              ).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                    filter === f
                      ? "bg-white text-black"
                      : "bg-white/5 text-[#A1A1A1] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div> */}
          </div>

          {/* List */}
          <div className="divide-y divide-white/5">
            {filteredResults.length > 0 ? (
              filteredResults.map((result) => (
                <Link
                  key={result.id}
                  href={`/results/${result.id}`}
                  className="block"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-5 hover:bg-white/5 transition-colors gap-4 cursor-pointer">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-base md:text-lg text-[#D4D4D4] truncate">
                        {result.test_type}
                      </h3>
                      <p className="text-[10px] md:text-xs text-[#A1A1A1] mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
                        <span>
                          {new Date(result.completed_at).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </span>
                        <span>•</span>
                        <span>
                          {result.duration_seconds
                            ? formatDuration(result.duration_seconds)
                            : "—"}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6 lg:gap-10">
                      <div className="text-right min-w-[80px] md:min-w-[100px]">
                        <div className="font-serif text-lg md:text-xl text-white">
                          {result.score !== null ? result.score : "—"}
                        </div>
                        <div className="text-[9px] md:text-[10px] uppercase tracking-wider text-[#A1A1A1]">
                          {result.percentile || "—"}
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
                </Link>
              ))
            ) : (
              <div className="p-8 md:p-12 text-center text-[#A1A1A1]">
                <p className="text-sm md:text-base mb-4">
                  No tests found for this filter.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={`/test/${filter === "all" ? "iq" : filter}/questions`}
                  >
                    Take a Test
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
