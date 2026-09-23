"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/Button";

interface SubmitButtonProps {
  children: string;
  pendingLabel?: string;
  className?: string;
}

export function SubmitButton({
  children,
  pendingLabel = "Salvando...",
  className = "",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className={className}
    >
      {pending ? pendingLabel : children}
    </Button>
  );
}
