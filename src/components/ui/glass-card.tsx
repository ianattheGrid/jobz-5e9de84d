import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  /** Highlight this card as the Jobz / preferred option */
  featured?: boolean;
  /** Lift and glow on hover */
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Frosted glass tile on the deep-space background.
 */
export const GlassCard = ({
  children,
  featured = false,
  interactive = false,
  className,
  onClick,
}: GlassCardProps) => (
  <div
    onClick={onClick}
    className={cn(
      "group relative overflow-hidden rounded-3xl border bg-card/40 p-8 backdrop-blur-xl transition-all duration-500",
      featured
        ? "border-primary/40 shadow-glow"
        : "border-white/10 shadow-elevated",
      interactive &&
        "cursor-pointer hover:-translate-y-1 hover:border-primary/30 hover:bg-card/60",
      className,
    )}
  >
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl transition-colors duration-500",
        featured ? "bg-primary/20" : "bg-primary/10 group-hover:bg-primary/20",
      )}
    />
    <div className="relative z-10">{children}</div>
  </div>
);

export default GlassCard;
