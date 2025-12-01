import * as React from "react";
import { cn } from "@/lib/utils";

export interface AnimatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ className, type, label, id, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    return (
      <div className="relative">
        <input
          type={type}
          id={id}
          className={cn(
            "flex h-12 w-full rounded-md border border-input bg-background/50 backdrop-blur-sm px-3 py-2 text-base ring-offset-background",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
            "placeholder:text-transparent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary",
            "focus-visible:shadow-[0_0_20px_rgba(255,105,180,0.15)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "md:text-sm transition-all duration-300",
            "peer",
            className
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            setHasValue(e.target.value !== "");
          }}
          onChange={(e) => {
            setHasValue(e.target.value !== "");
            props.onChange?.(e);
          }}
          {...props}
        />
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "absolute left-3 transition-all duration-300 pointer-events-none",
              "text-muted-foreground",
              isFocused || hasValue || props.value
                ? "top-0 -translate-y-1/2 text-xs bg-background px-1 text-primary"
                : "top-1/2 -translate-y-1/2 text-base"
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
AnimatedInput.displayName = "AnimatedInput";

export { AnimatedInput };
