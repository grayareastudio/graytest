// app/forgot-password/page.tsx
"use client";

import { useActionState } from "react";
import { sendPasswordResetEmail } from "@/lib/actions/auth-actions";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [state, action, isPending] = useActionState(sendPasswordResetEmail, {
    error: undefined,
    success: false,
  });

  if (state?.success) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black px-6">
        <div className="w-full max-w-md bg-[#0A0A0A]/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
          {/* Checkmark */}
          <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-6 h-6 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl text-white mb-3">Check your email</h1>
          <p className="text-[#A1A1A1] text-sm leading-relaxed mb-8">
            We've sent a password reset link to your email address. The link
            expires in 1 hour.
          </p>
          <p className="text-[#A1A1A1] text-xs mb-8">
            Don't see it? Check your spam or junk folder.
          </p>
          <Link
            href="/login"
            className="text-sm text-white hover:text-[#D9D9D9] transition-colors"
          >
            ← Back to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-6">
      <div className="w-full max-w-md bg-[#0A0A0A]/40 backdrop-blur-md border border-white/10 rounded-2xl p-8">
        <h1 className="font-serif text-4xl text-white mb-3">Forgot password?</h1>
        <p className="text-[#A1A1A1] text-sm mb-8 leading-relaxed">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <form className="flex flex-col items-center space-y-6" action={action}>
          {state?.error && (
            <p className="w-full text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {state.error}
            </p>
          )}

          <div className="w-full">
            <label className="block text-sm text-[#A1A1A1] mb-2">
              Email address
            </label>
            <input
              name="email"
              type="email"
              required
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl bg-white border border-white/20 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D9D9D9] disabled:opacity-50"
              placeholder="Your Email"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isPending}
          >
            {isPending ? "Sending..." : "Send reset link"}
          </Button>
        </form>

        <p className="text-sm text-[#A1A1A1] mt-8 text-center">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-white font-medium hover:text-[#D9D9D9] transition-colors"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
