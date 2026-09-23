"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/Button";

interface ConfirmSubmitButtonProps {
  children: string;
  confirmMessage: string;
  pendingLabel?: string;
  className?: string;
}

export function ConfirmSubmitButton({
  children,
  confirmMessage,
  pendingLabel = "Excluindo...",
  className = "",
}: ConfirmSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="destructive"
      disabled={pending}
      aria-disabled={pending}
      className={className}
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      {pending ? pendingLabel : children}
    </Button>
  );
}
