// app/(auth)/reset-password/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

type Status = "verifying" | "ready" | "invalid" | "success";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [status, setStatus] = useState<Status>("verifying");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    // Session was already set server-side via /auth/callback
    // Just verify it exists
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setStatus("ready");
      } else {
        setStatus("invalid");
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value;

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsPending(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setIsPending(false);
      return;
    }

    await supabase.auth.signOut();
    setStatus("success");
    setTimeout(() => router.push("/login"), 2000);
  };

  if (status === "verifying") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black px-6">
        <div className="w-full max-w-md bg-[#0A0A0A]/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin mx-auto mb-6" />
          <p className="text-[#A1A1A1] text-sm">Verifying your reset link...</p>
        </div>
      </main>
    );
  }

  if (status === "invalid") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black px-6">
        <div className="w-full max-w-md bg-[#0A0A0A]/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl text-white mb-3">Link expired</h1>
          <p className="text-[#A1A1A1] text-sm mb-8 leading-relaxed">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link
            href="/forgot-password"
            className="inline-block bg-[#E5E5E5] text-black px-6 py-3 rounded-full text-sm font-medium hover:bg-white transition-colors"
          >
            Request new link
          </Link>
        </div>
      </main>
    );
  }

  if (status === "success") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black px-6">
        <div className="w-full max-w-md bg-[#0A0A0A]/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl text-white mb-3">Password updated</h1>
          <p className="text-[#A1A1A1] text-sm">Redirecting you to login...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-6">
      <div className="w-full max-w-md bg-[#0A0A0A]/40 backdrop-blur-md border border-white/10 rounded-2xl p-8">
        <h1 className="font-serif text-4xl text-white mb-3">Set new password</h1>
        <p className="text-[#A1A1A1] text-sm mb-8 leading-relaxed">
          Choose a strong password for your account.
        </p>

        <form className="flex flex-col items-center space-y-6" onSubmit={handleSubmit}>
          {error && (
            <p className="w-full text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="w-full">
            <label className="block text-sm text-[#A1A1A1] mb-2">New password</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl bg-white border border-white/20 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D9D9D9] disabled:opacity-50"
              placeholder="New password"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm text-[#A1A1A1] mb-2">Confirm new password</label>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl bg-white border border-white/20 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D9D9D9] disabled:opacity-50"
              placeholder="Confirm new password"
            />
            <p className="text-xs text-[#A1A1A1] mt-2 italic">Must be at least 6 characters</p>
          </div>

          <Button type="submit" variant="primary" size="md" disabled={isPending}>
            {isPending ? "Updating..." : "Update password"}
          </Button>
        </form>

        <p className="text-sm text-[#A1A1A1] mt-8 text-center">
          <Link href="/login" className="text-white font-medium hover:text-[#D9D9D9] transition-colors">
            ← Back to login
          </Link>
        </p>
      </div>
    </main>
  );
}
