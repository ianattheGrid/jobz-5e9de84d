import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  helpText?: string;
  helpTitle?: string;
}

export const DashboardCard = ({ 
  children, 
  className, 
  onClick,
  helpText,
  helpTitle 
}: DashboardCardProps) => {
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
      {/* Help icon with popover */}
      {helpText && (
        <Popover>
          <PopoverTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="absolute top-3 right-3 z-20 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
            >
              <HelpCircle className="h-4 w-4 text-primary/70" />
            </button>
          </PopoverTrigger>
          <PopoverContent 
            side="top" 
            className="w-72 bg-white/95 backdrop-blur-sm border-primary/20"
            onClick={(e) => e.stopPropagation()}
          >
            {helpTitle && (
              <h4 className="font-semibold text-foreground mb-1">{helpTitle}</h4>
            )}
            <p className="text-sm text-muted-foreground">{helpText}</p>
          </PopoverContent>
        </Popover>
      )}

      {/* Subtle inner glow */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
