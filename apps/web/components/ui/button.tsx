import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          variant === "primary" &&
            "bg-accent text-accent-foreground hover:bg-accent/90",
          variant === "secondary" &&
            "border border-border text-foreground hover:bg-surface",
          variant === "ghost" && "text-muted hover:text-foreground",
          variant === "danger" &&
            "border border-danger/40 text-danger hover:bg-danger/10",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";