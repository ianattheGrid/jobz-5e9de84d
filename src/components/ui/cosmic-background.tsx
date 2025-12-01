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
        ? "bg-gradient-to-br from-[#1a0a15] via-[#2d1028] to-[#150a1a]"
        : "bg-gradient-to-br from-rose-50/50 via-background to-primary/10 dark:from-slate-950 dark:via-background dark:to-primary/20",
      className
    )}>
      {/* Animated stars */}
      {mode === "full" && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(100)].map((_, i) => (
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
                opacity: Math.random() * 0.7 + 0.3,
              }}
            />
          ))}
        </div>
      )}

      {/* Glowing orb effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {mode === "full" ? (
          <>
            {/* Large central pink glow */}
            <div 
              className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] animate-pulse"
              style={{ animationDuration: '4s' }}
            />
            {/* Secondary purple glow */}
            <div 
              className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-accent/25 rounded-full blur-[100px] animate-pulse"
              style={{ animationDuration: '5s', animationDelay: '1s' }}
            />
            {/* Top accent glow */}
            <div 
              className="absolute -top-32 left-1/2 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[80px] animate-pulse"
              style={{ animationDuration: '6s', animationDelay: '2s' }}
            />
          </>
        ) : (
          <>
            <div 
              className="absolute rounded-full blur-3xl transition-opacity duration-1000 bg-primary/20 w-96 h-96 -top-32 -right-32 animate-pulse"
              style={{ animationDuration: '4s' }}
            />
            <div 
              className="absolute rounded-full blur-3xl transition-opacity duration-1000 bg-accent/20 w-96 h-96 -bottom-32 -left-32 animate-pulse"
              style={{ animationDuration: '5s', animationDelay: '1s' }}
            />
          </>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
