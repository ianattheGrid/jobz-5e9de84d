import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface StarfieldProps {
  /** How busy the sky is */
  density?: "low" | "medium" | "high";
  /** Show the soft pink/blue nebula glows */
  nebula?: boolean;
  className?: string;
}

const COUNTS = { low: 40, medium: 80, high: 140 } as const;

/**
 * Deep-space backdrop: a slow, quiet starfield with optional nebula glows.
 * Purely decorative — never interactive.
 */
export const Starfield = ({
  density = "medium",
  nebula = true,
  className,
}: StarfieldProps) => {
  const stars = useMemo(() => {
    const count = COUNTS[density];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() < 0.85 ? 1 : 2,
      opacity: 0.2 + Math.random() * 0.6,
      delay: Math.random() * 6,
      duration: 3 + Math.random() * 5,
    }));
  }, [density]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {nebula && (
        <>
          <div className="absolute -right-1/4 top-0 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[140px]" />
          <div className="absolute -left-1/4 bottom-0 h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-[140px]" />
        </>
      )}
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

export default Starfield;
