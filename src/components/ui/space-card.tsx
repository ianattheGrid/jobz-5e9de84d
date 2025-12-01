import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SpaceCardProps {
  children: ReactNode;
  className?: string;
}

export const SpaceCard = ({ children, className }: SpaceCardProps) => {
  return (
    <div
      className={cn(
        "cosmic-form space-card",
        "relative group",
        "bg-black/40 backdrop-blur-xl",
        "border border-primary/30",
        "rounded-lg p-6",
        "shadow-[0_0_40px_rgba(236,72,153,0.3)]",
        "transition-all duration-300",
        "hover:shadow-[0_0_60px_rgba(236,72,153,0.4)]",
        "hover:border-primary/40",
        "hover:scale-[1.01]",
        className
      )}
    >
      {/* Inner glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
