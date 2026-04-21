// app/login/page.tsx
"use client";

import { useActionState } from "react";
import { signIn } from "@/lib/actions/auth-actions";
import Link from "next/link";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(signIn, {
    error: null as string | null,
  });

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-6">
      <div className="w-full max-w-md bg-[#0A0A0A]/40 backdrop-blur-md border border-white/10 rounded-2xl p-8">
        <h1 className="font-serif text-2xl text-white mb-6">Welcome Back</h1>

        <form className="space-y-4" action={action}>
          {state?.error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {state.error}
            </p>
          )}

          <div>
            <label className="block text-sm text-[#A1A1A1] mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              disabled={isPending}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-1 focus:ring-[#D9D9D9] disabled:opacity-50"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-[#A1A1A1] mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              disabled={isPending}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-1 focus:ring-[#D9D9D9] disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#D9D9D9] text-black py-2.5 rounded-lg font-medium hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-wait"
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-[#A1A1A1] mt-6 text-center">
          Don't have an account?{" "}
          <Link href="/register" className="text-white underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
