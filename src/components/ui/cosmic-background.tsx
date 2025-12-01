import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CosmicBackgroundProps {
  children: ReactNode;
  mode?: "full" | "light";
  className?: string;
}

export const CosmicBackground = ({ 
  children, 
  mode = "light",
  className 
}: CosmicBackgroundProps) => {
  return (
    <div className={cn(
      "relative min-h-screen overflow-hidden",
      mode === "full" 
        ? "bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]"
        : "bg-gradient-to-br from-background via-background to-muted",
      className
    )}>
      {/* Animated stars */}
      {mode === "full" && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                width: Math.random() * 3 + 1 + "px",
                height: Math.random() * 3 + 1 + "px",
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                animationDelay: Math.random() * 3 + "s",
                animationDuration: Math.random() * 3 + 2 + "s",
                opacity: Math.random() * 0.5 + 0.2,
              }}
            />
          ))}
        </div>
      )}

      {/* Subtle orb glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className={cn(
            "absolute rounded-full blur-3xl",
            mode === "full" 
              ? "bg-primary/20 w-96 h-96 -top-48 -right-48"
              : "bg-primary/5 w-64 h-64 -top-32 -right-32"
          )}
        />
        <div 
          className={cn(
            "absolute rounded-full blur-3xl",
            mode === "full"
              ? "bg-accent/20 w-96 h-96 -bottom-48 -left-48"
              : "bg-accent/5 w-64 h-64 -bottom-32 -left-32"
          )}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
