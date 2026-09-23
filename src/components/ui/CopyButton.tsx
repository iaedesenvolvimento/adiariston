"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";

interface CopyButtonProps {
  value: string;
  label: string;
}

export function CopyButton({ value, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleCopy}
      className="w-full sm:w-auto"
      aria-live="polite"
    >
      {copied ? "Copiado" : label}
    </Button>
  );
}
