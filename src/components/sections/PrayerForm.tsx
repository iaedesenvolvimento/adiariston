"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { validatePrayerInput } from "@/services/prayerValidation";
import type {
  CreatePrayerResult,
  PrayerCategory,
  PrayerFieldErrors,
} from "@/types/prayers";

const initialFormData = {
  nome: "",
  email: "",
  telefone: "",
  pedido: "",
  compartilhar: false,
  privacidade: false,
};

const initialErrors = {
  nome: "",
  email: "",
  telefone: "",
  pedido: "",
  compartilhar: "",
  privacidade: "",
} satisfies PrayerFieldErrors;

interface AiPrayerResponse {
  category: PrayerCategory;
  prayer: string;
  requiresHumanAttention: boolean;
}

function formatPhone(value: string) {
  const numbers = value.replace(/\D/g, "").slice(0, 11);

  if (numbers.length === 0) {
    return "";
  }

  if (numbers.length <= 2) {
    return `(${numbers}`;
  }

  if (numbers.length <= 6) {
    return numbers.replace(/(\d{2})(\d+)/, "($1) $2");
  }

  if (numbers.length <= 10) {
    return numbers.replace(
      /(\d{2})(\d{4})(\d+)/,
      "($1) $2-$3"
    );
  }

  return numbers.replace(
    /(\d{2})(\d{5})(\d{4})/,
    "($1) $2-$3"
  );
}

export function PrayerForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] =
    useState<PrayerFieldErrors>(initialErrors);
  const [successMessage, setSuccessMessage] = useState("");
  const [aiPrayer, setAiPrayer] =
    useState<AiPrayerResponse | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearFeedback() {
    setSuccessMessage("");
    setAiPrayer(null);
    setSubmitError("");
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.target;

    clearFeedback();

    const newValue =
      name === "telefone" ? formatPhone(value) : value;

    setFormData((previousData) => ({
      ...previousData,
      [name]: newValue,
    }));

    if (errors[name as keyof PrayerFieldErrors]) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        [name]: "",
      }));
    }
  }

  function handleTextareaChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    clearFeedback();

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    if (errors.pedido) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        pedido: "",
      }));
    }
  }

  function handleCheckboxChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, checked } = event.target;

    clearFeedback();

    setFormData((previousData) => ({
      ...previousData,
      [name]: checked,
    }));

    if (name === "privacidade" && checked) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        privacidade: "",
      }));
    }
  }

  function validateForm() {
    const validation = validatePrayerInput(formData);

    if (!validation.ok) {
      setErrors({
        ...initialErrors,
        ...validation.fieldErrors,
      });

      return false;
    }

    setErrors(initialErrors);
    return true;
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    clearFeedback();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/oracao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result =
        (await response.json()) as CreatePrayerResult;

      if (!response.ok || !result.ok) {
        if (!result.ok && result.fieldErrors) {
          setErrors({
            ...initialErrors,
            ...result.fieldErrors,
          });
        }

        setSubmitError(
          result.ok
            ? "Não foi possível concluir o envio agora."
            : result.message
        );
        return;
      }

      setSuccessMessage(
        result.aiSupport
          ? "Recebemos seu pedido de oração. A oração abaixo foi gerada como apoio inicial, e nossa equipe tratará sua mensagem com cuidado."
          : "Recebemos seu pedido de oração. Nossa equipe tratará sua mensagem com cuidado e responsabilidade."
      );
      setAiPrayer(result.aiSupport ?? null);

      setFormData(initialFormData);
      setErrors(initialErrors);
    } catch {
      setSubmitError(
        "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto max-w-2xl rounded-xl border border-border-default bg-surface p-6 shadow-card sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="nome"
          name="nome"
          label="Nome"
          placeholder="Opcional"
          value={formData.nome}
          onChange={handleInputChange}
          error={errors.nome}
          disabled={isSubmitting}
        />

        <Input
          id="telefone"
          name="telefone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          label="WhatsApp"
          placeholder="Opcional"
          value={formData.telefone}
          onChange={handleInputChange}
          error={errors.telefone}
          disabled={isSubmitting}
        />
      </div>

      <div className="mt-5">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          label="E-mail"
          placeholder="Opcional"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          disabled={isSubmitting}
        />
      </div>

      <div className="mt-5">
        <Textarea
          id="pedido"
          name="pedido"
          label="Pedido de oração"
          placeholder="Compartilhe seu pedido com a equipe de oração..."
          value={formData.pedido}
          onChange={handleTextareaChange}
          error={errors.pedido}
          disabled={isSubmitting}
        />
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <Checkbox
          id="compartilhar"
          name="compartilhar"
          label="Autorizo que este pedido seja considerado para o mural público após moderação humana."
          checked={formData.compartilhar}
          onChange={handleCheckboxChange}
          disabled={isSubmitting}
        />

        <Checkbox
          id="privacidade"
          name="privacidade"
          label="Li e concordo com a Política de Privacidade."
          checked={formData.privacidade}
          onChange={handleCheckboxChange}
          error={errors.privacidade}
          disabled={isSubmitting}
        />
      </div>

      {submitError && (
        <div
          role="alert"
          className="mt-6 rounded-md border border-error/20 bg-red-50 p-4"
        >
          <p className="font-semibold text-error">
            Não foi possível enviar
          </p>

          <p className="mt-1 text-sm leading-6 text-error">
            {submitError}
          </p>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="mt-6 rounded-md border border-success/20 bg-green-50 p-4"
        >
          <p className="font-semibold text-success">
            Pedido recebido
          </p>

          <p className="mt-1 text-sm leading-6 text-success">
            {successMessage}
          </p>
        </div>
      )}

      {aiPrayer && (
        <div className="mt-6 rounded-lg border border-primary-100 bg-background p-5">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-bold text-primary-900">
              Uma oração para este momento
            </p>

            <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-semibold text-primary-700">
              {aiPrayer.category}
            </span>
          </div>

          <p className="mt-4 whitespace-pre-wrap leading-7 text-text-primary">
            {aiPrayer.prayer}
          </p>

          {aiPrayer.requiresHumanAttention && (
            <p className="mt-4 text-sm font-semibold text-primary-900">
              Também vamos encaminhar este pedido para atenção
              humana com cuidado pastoral.
            </p>
          )}
        </div>
      )}

      <div className="mt-8">
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Enviando..."
            : "Enviar pedido de oração"}
        </Button>
      </div>

      <p className="mt-5 text-center text-sm leading-6 text-text-secondary">
        Pedidos privados não aparecem no mural. Pedidos compartilháveis
        dependem de moderação antes de qualquer publicação.
      </p>
    </form>
  );
}
