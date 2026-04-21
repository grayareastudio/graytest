// components/layout/HeaderClient.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { signOut } from "@/lib/actions/auth-actions";
import { User } from "@supabase/supabase-js";

interface HeaderClientProps {
  user: User | null;
}

const guestLinks = [
  { name: "Home", href: "/" },
  { name: "IQ", href: "/iq" },
  { name: "EQ", href: "/eq" },
  { name: "Personality", href: "/personality" },
  { name: "Spectrum", href: "/spectrum" },
];

function getInitials(user: User | null): string {
  if (!user) return "U";
  const name = user.user_metadata?.display_name || user.email || "User";
  const parts = name.split(/[\s@.]/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0]?.[0]?.toUpperCase() || "U";
}

export function HeaderClient({ user }: HeaderClientProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

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

  const initials = getInitials(user);
  const userEmail = user?.email || "";
  const displayName = getDisplayName() || "User";

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

          {user && (
            <li className="relative" ref={userMenuRef}>
              {/* Avatar Button */}
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity hover:cursor-pointer"
                aria-label="User menu"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#D9D9D9]/20 border border-white/20 flex items-center justify-center text-white font-medium text-sm md:text-base">
                  {initials}
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-4 w-64 bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 z-[1000] animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Info */}
                  <div className="mb-3 pb-3 border-b border-white/10">
                    <p className="font-medium text-white truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-[#A1A1A1] truncate">
                      {userEmail}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-1">
                    <a
                      href="/dashboard"
                      className="block px-3 py-2 text-sm text-[#D4D4D4] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </a>
                    <form action={signOut}>
                      <button
                        type="submit"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        Logout
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </li>
          )}
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
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D9D9D9]/20 border border-white/20 flex items-center justify-center text-white font-medium">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm text-white">{displayName}</p>
                      <p className="text-xs text-[#A1A1A1]">{userEmail}</p>
                    </div>
                  </div>
                </li>
                <li>
                  <form action={signOut}>
                    <button
                      type="submit"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block font-light text-lg text-red-400 no-underline transition-colors hover:text-red-300 py-2.5 w-full text-left"
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
