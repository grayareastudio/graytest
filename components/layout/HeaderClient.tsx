// components/layout/HeaderClient.tsx
"use client";

import { useState, useEffect } from "react";
import { signOut } from "@/lib/actions/auth-actions";
import { User } from "@supabase/supabase-js";

interface HeaderClientProps {
  user: User | null;
}

const guestLinks = [
  { name: "Home", href: "/" },
  { name: "IQ", href: "/test/iq" },
  { name: "EQ", href: "/test/eq" },
  { name: "Personality", href: "/test/personality" },
  { name: "Spectrum", href: "/test/spectrum" },
];

export function HeaderClient({ user }: HeaderClientProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = user
    ? [...guestLinks, { name: "Dashboard", href: "/dashboard" }]
    : [
        ...guestLinks,
        { name: "Login", href: "/login" },
        { name: "Sign Up", href: "/register" },
      ];

  const getDisplayName = () => {
    if (!user) return null;
    return (
      user.user_metadata?.display_name || user.email?.split("@")[0] || "User"
    );
  };

  return (
    <>
      <nav
        className={`
          fixed z-999 flex items-center justify-between
          transition-all duration-400 backdrop-blur-[20px] border border-white/10
          /* Mobile */
          top-4 left-4 right-4 h-14 px-5
          /* Tablet */
          md:top-8 md:left-8 md:right-8 md:h-16 md:px-8
          /* Desktop */
          lg:top-14 lg:left-39 lg:right-39 lg:h-16 lg:px-10 rounded-full lg:bg-transparent
        `}
      >
        <a
          href="/"
          className="font-serif text-xl md:text-2xl uppercase text-[#D4D4D4] no-underline"
        >
          Graytest
        </a>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex gap-10 list-none items-center">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className="font-light text-[#D4D4D4] no-underline transition-colors hover:text-white"
              >
                {link.name}
              </a>
            </li>
          ))}

          {/* Auth Section - Desktop */}
          {user ? (
            <li className="flex items-center gap-4">
              <span className="text-sm text-[#A1A1A1]">{getDisplayName()}</span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-sm text-[#D4D4D4] hover:text-white transition-colors"
                >
                  Logout
                </button>
              </form>
            </li>
          ) : null}
        </ul>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-[#D4D4D4] p-2 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed top-20 md:top-25 left-4 md:left-8 right-4 md:right-8 z-998 lg:hidden bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <ul className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-light text-lg text-[#D4D4D4] no-underline transition-colors hover:text-white py-2.5 border-b border-white/5 last:border-0"
                >
                  {link.name}
                </a>
              </li>
            ))}

            {/* Auth Section - Mobile */}
            {user && (
              <>
                <li className="py-2.5 border-b border-white/5">
                  <span className="text-[#A1A1A1]">
                    Signed in as {getDisplayName()}
                  </span>
                </li>
                <li>
                  <form
                    action={async () => {
                      await signOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <button
                      type="submit"
                      className="block font-light text-lg text-[#D4D4D4] no-underline transition-colors hover:text-white py-2.5 w-full text-left"
                    >
                      Logout
                    </button>
                  </form>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </>
  );
}
