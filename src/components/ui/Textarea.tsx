import { TextareaHTMLAttributes } from "react";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  id,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm font-semibold text-text-primary"
      >
        {label}
      </label>

      <textarea
        id={id}
        className={`
          min-h-32 w-full resize-y rounded-md border
          bg-surface px-4 py-3 text-text-primary
          outline-none transition
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