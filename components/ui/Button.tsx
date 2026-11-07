import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";

type Variant = "primary" | "secondary" | "success" | "danger";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-blue-900 text-white hover:bg-blue-800 disabled:hover:bg-blue-900",
  secondary:
    "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:hover:bg-white",
  success: "bg-emerald-600 text-white hover:bg-emerald-700",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
};

type StyleProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
}: StyleProps = {}): string {
  return `${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""}`;
}

export function Button({
  variant,
  size,
  fullWidth,
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & StyleProps) {
  return (
    <button
      type={type}
      className={`${buttonClasses({ variant, size, fullWidth })} ${className}`}
      {...props}
    />
  );
}

export function ButtonLink({
  variant,
  size,
  fullWidth,
  className = "",
  ...props
}: ComponentProps<typeof Link> & StyleProps) {
  return (
    <Link
      className={`${buttonClasses({ variant, size, fullWidth })} ${className}`}
      {...props}
    />
  );
}
