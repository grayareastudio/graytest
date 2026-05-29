"use client";

import { useActionState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { saveOnboardingProfile } from "@/lib/actions/profile-actions";
import { Button } from "@/components/ui/Button";

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non_binary", label: "Non-binary" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

const educationOptions = [
  { value: "high_school", label: "High School" },
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "doctorate", label: "Doctorate" },
  { value: "other", label: "Other" },
];

function OnboardingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get("redirect") || "/";

  const [state, action, isPending] = useActionState(saveOnboardingProfile, {
    error: undefined,
  });

  useEffect(() => {
    if (state?.success) {
      router.push(redirectTo);
    }
  }, [state?.success, redirectTo, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-6 py-12">
      <div className="w-full max-w-lg bg-[#0A0A0A]/40 backdrop-blur-md border border-white/10 rounded-2xl p-8">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-white mb-3">
            Before you begin
          </h1>
          <p className="text-[#A1A1A1] text-sm leading-relaxed">
            Help us personalise your results by sharing a few details. This
            information is used only to improve the accuracy of your assessment.
          </p>
        </div>

        <form className="space-y-6" action={action}>
          <input type="hidden" name="redirectTo" value={redirectTo} />

          {state?.error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {state.error}
            </p>
          )}

          {/* Age */}
          <div>
            <label className="block text-sm text-[#A1A1A1] mb-2">Age</label>
            <input
              name="age"
              type="number"
              min={10}
              max={120}
              required
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl bg-white border border-white/20 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D9D9D9] disabled:opacity-50"
              placeholder="Your age"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm text-[#A1A1A1] mb-2">Gender</label>
            <div className="grid grid-cols-2 gap-2">
              {genderOptions.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer has-[:checked]:border-white has-[:checked]:bg-white/15"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={opt.value}
                    required
                    disabled={isPending}
                    className="accent-white"
                  />
                  <span className="text-sm text-white">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <label className="block text-sm text-[#A1A1A1] mb-2">
              Education level
            </label>
            <select
              name="education"
              required
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl bg-white border border-white/20 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#D9D9D9] disabled:opacity-50"
            >
              <option value="">Select your education level</option>
              {educationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Occupation (optional) */}
          <div>
            <label className="block text-sm text-[#A1A1A1] mb-2">
              Occupation{" "}
              <span className="text-[#666] text-xs">(optional)</span>
            </label>
            <input
              name="occupation"
              type="text"
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl bg-white border border-white/20 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D9D9D9] disabled:opacity-50"
              placeholder="e.g. Student, Engineer, Designer..."
            />
          </div>

          <Button
            type="submit"
            variant="secondary"
            size="md"
            disabled={isPending}
            className="w-full"
          >
            {isPending ? "Saving..." : "Continue to test"}
          </Button>
        </form>
      </div>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense>
      <OnboardingForm />
    </Suspense>
  );
}
