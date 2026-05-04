"use client";

import { useState } from "react";
import deleteIcon from "@/assets/icons/delete.svg";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function DownloadPDFButton() {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    // TODO: trigger actual PDF email logic here
    setShowModal(true);
  };

  return (
    <>
      <Button
        size="md"
        variant="outline"
        className="w-full sm:w-auto"
        onClick={handleClick}
      >
        Download Results PDF
      </Button>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4 h-4 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="font-serif text-2xl text-white font-medium">
                  PDF sent!
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/70 hover:text-white transition-colors hover:cursor-pointer mt-1"
              >
                <Image src={deleteIcon} alt="close" width={32} height={32} />
              </button>
            </div>

            <p className="text-white/70 text-sm leading-relaxed mb-8">
              We've sent your full results report to your registered email
              address. It includes your scores, AI-generated insights, and
              personalized recommendations.
            </p>

            <p className="text-white/40 text-xs mb-8">
              Don't see it? Check your spam or junk folder.
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-[#E5E5E5] text-black px-6 py-3 rounded-full text-sm font-medium hover:bg-white transition-colors hover:cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
