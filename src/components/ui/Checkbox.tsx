import { InputHTMLAttributes, ReactNode } from "react";

interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type"
  > {
  label: ReactNode;
  error?: string;
}

export function Checkbox({
  label,
  error,
  id,
  className = "",
  ...props
}: CheckboxProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-3"
      >
        <input
          id={id}
          type="checkbox"
          className={`
            mt-1 h-4 w-4
            accent-primary-600
            ${className}
          `}
          {...props}
        />

        <span className="text-sm leading-6 text-text-primary">
          {label}
        </span>
      </label>

      {error && (
        <span className="ml-7 text-sm text-error">
          {error}
        </span>
      )}
    </div>
  );
}