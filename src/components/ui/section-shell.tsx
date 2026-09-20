import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionShellProps {
  children: ReactNode;
  /** Vertical breathing room */
  size?: "sm" | "md" | "lg";
  /** Slightly lifted surface behind the scene */
  tone?: "base" | "raised";
  id?: string;
  className?: string;
  innerClassName?: string;
}

const SIZES = {
  sm: "py-14 sm:py-20",
  md: "py-20 sm:py-28",
  lg: "py-24 sm:py-36",
} as const;

/**
 * Full-bleed scene with consistent rhythm — one idea per screen.
 */
export const SectionShell = ({
  children,
  size = "md",
  tone = "base",
  id,
  className,
  innerClassName,
}: SectionShellProps) => (
  <section
    id={id}
    className={cn(
      "relative w-full overflow-hidden px-5 sm:px-8",
      SIZES[size],
      tone === "raised" && "bg-[hsl(var(--surface-2))]",
      className,
    )}
  >
    <div className={cn("relative z-10 mx-auto w-full max-w-6xl", innerClassName)}>
      {children}
    </div>
  </section>
);

export default SectionShell;
