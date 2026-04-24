// components/ui/Button.tsx
"use client";

import { Slot } from "@radix-ui/react-slot";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  asChild?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  const baseStyles =
    "rounded-full font-semibold transition-all duration-200 hover:cursor-pointer disabled:opacity-50 disabled:cursor-wait";

  const variants = {
    primary: "bg-[#E5E5E5]/20 border border-white/10 text-white",
    secondary: "bg-[#E5E5E5] border text-black",
    outline: "bg-transparent border border-white text-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "w-53 py-4.5 px-2 text-sm",
    lg: "w-53 py-4.5 text-sm",
  };

  return (
    <Comp
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Comp>
  );
}
