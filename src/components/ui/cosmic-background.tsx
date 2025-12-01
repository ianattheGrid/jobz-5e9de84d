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
        : "bg-gradient-to-br from-slate-50 via-background to-primary/5 dark:from-slate-950 dark:via-background dark:to-primary/10",
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
            "absolute rounded-full blur-3xl transition-opacity duration-1000",
            mode === "full" 
              ? "bg-primary/20 w-96 h-96 -top-48 -right-48"
              : "bg-primary/10 w-96 h-96 -top-32 -right-32 animate-pulse"
          )}
          style={{ animationDuration: '4s' }}
        />
        <div 
          className={cn(
            "absolute rounded-full blur-3xl transition-opacity duration-1000",
            mode === "full"
              ? "bg-accent/20 w-96 h-96 -bottom-48 -left-48"
              : "bg-accent/10 w-96 h-96 -bottom-32 -left-32 animate-pulse"
          )}
          style={{ animationDuration: '5s', animationDelay: '1s' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
