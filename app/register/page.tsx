// app/register/page.tsx
"use client";

import { useActionState } from "react";
import { signUp } from "@/lib/actions/auth-actions";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const [state, action, isPending] = useActionState(signUp, {
    error: null as string | null,
  });

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-6">
      <div className="w-full max-w-md bg-[#0A0A0A]/40 backdrop-blur-md border border-white/10 rounded-2xl p-8">
        <h1 className="font-serif text-4xl text-white mb-8">Create account</h1>

        <form className="flex flex-col items-center space-y-6" action={action}>
          {state?.error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 w-full">
              {state.error}
            </p>
          )}

          <div className="w-full">
            <label className="block text-sm text-[#A1A1A1] mb-2">
              Username
            </label>
            <input
              name="displayName"
              type="text"
              required
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl bg-white border border-white/20 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D9D9D9] disabled:opacity-50"
              placeholder="Your Username"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm text-[#A1A1A1] mb-2">Email</label>
            <input
              name="email"
              type="email"
              required
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl bg-white border border-white/20 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D9D9D9] disabled:opacity-50"
              placeholder="Your Email"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm text-[#A1A1A1] mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              disabled={isPending}
              className="w-full px-4 py-3 rounded-xl bg-white border border-white/20 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D9D9D9] disabled:opacity-50"
              placeholder="Password"
            />
            <p className="text-xs text-[#A1A1A1] mt-2 italic">
              Passwords must be at least 6 characters and contain at least one
              letter and one number
            </p>
          </div>

          <div className="w-full">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="acceptTerms"
                required
                disabled={isPending}
                className="mt-1 w-4 h-4 rounded border-white/20 bg-white/10 text-[#D9D9D9] focus:ring-2 focus:ring-[#D9D9D9] disabled:opacity-50"
              />
              <span className="text-sm text-white">
                I accept the terms and privacy policy
              </span>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isPending}
            className="w-full"
          >
            {isPending ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-sm text-[#A1A1A1] mt-8 text-center">
          Don't have an account?{" "}
          <Link
            href="/login"
            className="text-white font-medium hover:text-[#D9D9D9] transition-colors"
          >
            Log In
          </Link>
        </p>
      </div>
    </main>
  );
}
