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
        : "bg-gradient-to-b from-rose-100/40 via-pink-50/30 to-primary/10",
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
            <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/25 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[150px]" />
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
