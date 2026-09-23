import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md px-5 py-3 font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-700",

    secondary:
      "border border-border-default bg-surface text-text-primary hover:bg-background",

    ghost:
      "bg-transparent text-primary-700 hover:bg-primary-100",

    destructive:
      "bg-error text-white hover:opacity-90",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}