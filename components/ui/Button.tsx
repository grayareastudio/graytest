"use client";

import { Slot } from "@radix-ui/react-slot";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  asChild?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  asChild = false,
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  const baseStyles =
    "rounded-full font-semibold transition-all duration-200 hover:cursor-pointer";

  const variants = {
    primary: "bg-[#E5E5E5]/20 border border-white/10 text-white",
    secondary: "bg-[#E5E5E5] border text-black",
    outline: "bg-transparent border border-white text-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "w-53 py-4.5 text-sm",
    lg: "w-53 py-4.5 text-sm",
  };

  return (
    <Comp
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </Comp>
  );
}
