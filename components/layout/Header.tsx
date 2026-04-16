"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "IQ", href: "/iq" },
  { name: "EQ", href: "/eq" },
  { name: "Personality", href: "/personality" },
  { name: "Spectrum", href: "/spectrum" },
  { name: "Login", href: "/login" },
  { name: "Sign Up", href: "/signup" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`
        fixed top-14 left-39 right-39 z-999 
        flex items-center justify-between 
        px-10 h-16
        transition-all duration-400
        backdrop-blur-[20px]
        border border-white/10 rounded-full
      `}
    >
      <a
        href="/"
        className="font-serif text-2xl uppercase text-[#D4D4D4] no-underline"
      >
        Graytest
      </a>
      <ul className="flex gap-10 list-none">
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
      </ul>
    </nav>
  );
}
