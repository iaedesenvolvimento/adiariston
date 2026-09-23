import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({
  label,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm font-semibold text-text-primary"
      >
        {label}
      </label>

      <input
        id={id}
        className={`
          w-full rounded-md border bg-surface px-4 py-3
          text-text-primary outline-none transition
          placeholder:text-text-secondary
          focus:ring-2
          disabled:cursor-not-allowed
          disabled:bg-slate-100
          disabled:opacity-60
          ${
            error
              ? "border-error focus:border-error focus:ring-red-100"
              : "border-border-default focus:border-primary-600 focus:ring-primary-100"
          }
          ${className}
        `}
        {...props}
      />

      {error && (
        <span className="text-sm text-error">
          {error}
        </span>
      )}
    </div>
  );
}