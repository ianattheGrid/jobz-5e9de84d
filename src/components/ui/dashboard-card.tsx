import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const DashboardCard = ({ children, className, onClick }: DashboardCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative group cursor-pointer",
        "bg-white/80 backdrop-blur-sm",
        "border border-primary/20",
        "rounded-xl p-6",
        "shadow-[0_4px_20px_rgba(236,72,153,0.1)]",
        "transition-all duration-300",
        "hover:shadow-[0_8px_30px_rgba(236,72,153,0.2)]",
        "hover:border-primary/30",
        "hover:scale-[1.02]",
        "hover:-translate-y-1",
        className
      )}
    >
      {/* Subtle inner glow */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
