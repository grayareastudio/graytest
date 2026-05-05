// components/layout/HeaderClient.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/actions/auth-actions";
import { User } from "@supabase/supabase-js";
import userIcon from "@/assets/icons/user.svg";
import Image from "next/image";

interface HeaderClientProps {
  user: User | null;
}

const guestLinks = [
  { name: "Home", href: "/" },
  { name: "Spectrum", href: "/spectrum" },
  { name: "IQ", href: "/iq" },
  { name: "EQ", href: "/eq" },
  { name: "Personality", href: "/personality" },
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
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const pathname = usePathname();

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
    ? [...guestLinks]
    : [
        ...guestLinks,
        { name: "Login", href: "/login" },
        { name: "Sign Up", href: "/register" },
      ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const getDisplayName = () => {
    if (!user) return null;
    return (
      user.user_metadata?.display_name || user.email?.split("@")[0] || "User"
    );
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await signOut();
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
                className={`
                  font-light no-underline transition-colors
                  ${
                    isActive(link.href)
                      ? "text-white font-medium"
                      : "text-[#D4D4D4] hover:text-white"
                  }
                `}
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
                <Image src={userIcon} width={40} height={40} alt="user" />
                <p className="font-light text-white truncate">{displayName}</p>
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
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                    >
                      Logout
                    </button>
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
                  className={`
                    block font-light text-lg no-underline transition-colors py-2.5 border-b border-white/5 last:border-0
                    ${
                      isActive(link.href)
                        ? "text-white font-medium"
                        : "text-[#D4D4D4] hover:text-white"
                    }
                  `}
                >
                  {link.name}
                </a>
              </li>
            ))}

            {/* Auth Section - Mobile */}
            {user && (
              <>
                <li key="dashbord">
                  <a
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                    block font-light text-lg no-underline transition-colors py-2.5 border-b border-white/5 last:border-0
                    ${
                      isActive("/dashboard")
                        ? "text-white font-medium"
                        : "text-[#D4D4D4] hover:text-white"
                    }
                  `}
                  >
                    Dashboard
                  </a>
                </li>
                <li className="py-2.5 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <Image src={userIcon} width={40} height={40} alt="user" />
                    <div>
                      <p className="text-sm text-white">{displayName}</p>
                      <p className="text-xs text-[#A1A1A1]">{userEmail}</p>
                    </div>
                  </div>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block font-light text-lg text-red-400 no-underline transition-colors hover:text-red-300 py-2.5 w-full text-left cursor-pointer"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </>
  );
}
