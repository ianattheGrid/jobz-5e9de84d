import * as React from "react";
import { cn } from "@/lib/utils";

const GlowCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-primary/10 bg-card/90 backdrop-blur-md text-card-foreground",
      "shadow-[0_0_15px_rgba(var(--primary-rgb),0.05)]",
      "transition-all duration-300",
      "hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.15)] hover:border-primary/30 hover:bg-card/95 hover:scale-[1.02]",
      "relative overflow-hidden",
      "before:absolute before:inset-0 before:rounded-lg before:p-[1px]",
      "before:bg-gradient-to-br before:from-primary/20 before:via-transparent before:to-accent/20",
      "before:-z-10 before:opacity-0 hover:before:opacity-100 before:transition-opacity",
      className
    )}
    {...props}
  />
));
GlowCard.displayName = "GlowCard";

const GlowCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
GlowCardHeader.displayName = "GlowCardHeader";

const GlowCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      "bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text",
      className
    )}
    {...props}
  />
));
GlowCardTitle.displayName = "GlowCardTitle";

const GlowCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
GlowCardDescription.displayName = "GlowCardDescription";

const GlowCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
GlowCardContent.displayName = "GlowCardContent";

export { GlowCard, GlowCardHeader, GlowCardTitle, GlowCardDescription, GlowCardContent };
