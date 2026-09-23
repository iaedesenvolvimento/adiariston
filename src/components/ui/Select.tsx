import { SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
}

export function Select({
  label,
  options,
  error,
  id,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm font-semibold text-text-primary"
      >
        {label}
      </label>

      <select
        id={id}
        className={`
          w-full rounded-md border bg-surface px-4 py-3
          text-text-primary outline-none transition
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
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <span className="text-sm text-error">
          {error}
        </span>
      )}
    </div>
  );
}