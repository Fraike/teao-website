import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  href?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "btn inline-flex items-center justify-center gap-2.5 min-h-[46px] px-5 text-sm font-bold rounded-full transition-all duration-300 ease-out hover:-translate-y-0.5";

  const variants = {
    primary:
      "bg-[#ED7606] text-white hover:bg-[#D46900] border-transparent shadow-[0_18px_36px_rgba(237,118,6,.25)] hover:shadow-[0_22px_46px_rgba(237,118,6,.32)]",
    outline:
      "border-black/15 bg-white text-[#171717] hover:shadow-md",
    ghost:
      "border-white/20 text-white bg-white/10 backdrop-blur-md hover:bg-white/15",
  };

  if (href) {
    const anchorProps: Record<string, string> = {};
    for (const [key, value] of Object.entries(props)) {
      if (key.startsWith("data-") && typeof value === "string") {
        anchorProps[key] = value;
      }
    }
    return (
      <a href={href} className={cn(base, variants[variant], className)} {...anchorProps}>
        {children}
      </a>
    );
  }

  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
