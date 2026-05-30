"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { saveOnboardingProfile } from "@/lib/actions/profile-actions";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { STORAGE_KEYS } from "@/lib/utils/constants";

const USER_DRAFT_PROFILE = STORAGE_KEYS.USER_DRAFT_PROFILE;

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

  const [isPending, setIsPending] = useState(false);
  const [isAutoSubmitting, setIsAutoSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(USER_DRAFT_PROFILE);
    if (!saved) return;

    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;

      try {
        const pending = JSON.parse(saved);
        localStorage.removeItem(USER_DRAFT_PROFILE);
        setIsAutoSubmitting(true);

        const formData = new FormData();
        formData.set("age", String(pending.age));
        formData.set("gender", pending.gender);
        formData.set("education", pending.education);
        if (pending.occupation) formData.set("occupation", pending.occupation);

        const result = await saveOnboardingProfile({ error: undefined }, formData);
        if (result?.error) {
          setError(result.error);
          setIsAutoSubmitting(false);
        } else {
          router.push(pending.redirectTo || redirectTo);
        }
      } catch {
        localStorage.removeItem(USER_DRAFT_PROFILE);
        setIsAutoSubmitting(false);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const age = Number(formData.get("age"));
    const gender = formData.get("gender") as string;
    const education = formData.get("education") as string;
    const occupation = (formData.get("occupation") as string) || "";

    if (!age || age < 10 || age > 120) {
      setError("Please enter a valid age (10–120)");
      return;
    }
    if (!gender) {
      setError("Please select a gender");
      return;
    }
    if (!education) {
      setError("Please select your education level");
      return;
    }

    setIsPending(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      localStorage.setItem(USER_DRAFT_PROFILE, JSON.stringify({
        age,
        gender,
        education,
        occupation: occupation || null,
        redirectTo,
      }));
      router.push(`/login?redirect=/onboarding?redirect=${encodeURIComponent(redirectTo)}`);
      return;
    }

    const result = await saveOnboardingProfile({ error: undefined }, formData);

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    } else {
      router.push(redirectTo);
    }
  };

  if (isAutoSubmitting) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black px-6">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          <p className="font-serif text-2xl text-white">Saving your profile...</p>
        </div>
      </main>
    );
  }

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

        <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
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
