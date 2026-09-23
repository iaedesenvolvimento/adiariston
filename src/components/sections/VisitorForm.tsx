"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { validateVisitorInput } from "@/services/visitorValidation";
import type {
  CreateVisitorResult,
  VisitorFieldErrors,
} from "@/types/visitors";

const initialFormData = {
  nome: "",
  telefone: "",
  email: "",
  comoConheceu: "",
  mensagem: "",
  contato: false,
  privacidade: false,
};

const initialErrors = {
  nome: "",
  telefone: "",
  email: "",
  comoConheceu: "",
  mensagem: "",
  privacidade: "",
} satisfies VisitorFieldErrors;

export function VisitorForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] =
    useState<VisitorFieldErrors>(initialErrors);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function formatPhone(value: string) {
    const numbers = value.replace(/\D/g, "").slice(0, 11);

    if (numbers.length === 0) {
      return "";
    }

    if (numbers.length <= 2) {
      return `(${numbers}`;
    }

    if (numbers.length <= 6) {
      return numbers.replace(
        /(\d{2})(\d+)/,
        "($1) $2"
      );
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

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.target;

    setSuccessMessage("");
    setSubmitError("");

    const newValue =
      name === "telefone"
        ? formatPhone(value)
        : value;

    setFormData((previousData) => ({
      ...previousData,
      [name]: newValue,
    }));

    if (errors[name as keyof VisitorFieldErrors]) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        [name]: "",
      }));
    }
  }

  function handleSelectChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setSuccessMessage("");
    setSubmitError("");

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      comoConheceu: "",
    }));
  }

  function handleTextareaChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setSuccessMessage("");
    setSubmitError("");

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    if (errors.mensagem) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        mensagem: "",
      }));
    }
  }

  function handleCheckboxChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, checked } = event.target;

    setSuccessMessage("");
    setSubmitError("");

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
    const validation = validateVisitorInput(formData);

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

    setSuccessMessage("");
    setSubmitError("");

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/visitantes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result =
        (await response.json()) as CreateVisitorResult;

      if (!response.ok || !result.ok) {
        if (!result.ok && result.fieldErrors) {
          setErrors({
            ...initialErrors,
            ...result.fieldErrors,
          });
        }

        setSubmitError(
          result.ok
            ? "Não foi possível concluir o cadastro agora."
            : result.message
        );
        return;
      }

      setSuccessMessage(
        "Informações enviadas com sucesso! Obrigado por compartilhar seus dados conosco."
      );

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
      {/* Nome e WhatsApp */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="nome"
          name="nome"
          label="Nome completo"
          placeholder="Digite seu nome"
          value={formData.nome}
          onChange={handleChange}
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
          placeholder="(11) 99999-9999"
          value={formData.telefone}
          onChange={handleChange}
          error={errors.telefone}
          disabled={isSubmitting}
        />
      </div>

      {/* E-mail */}
      <div className="mt-5">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          label="E-mail"
          placeholder="seuemail@exemplo.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isSubmitting}
        />
      </div>

      {/* Como conheceu */}
      <div className="mt-5">
        <Select
          id="como-conheceu"
          name="comoConheceu"
          label="Como conheceu a igreja?"
          value={formData.comoConheceu}
          onChange={handleSelectChange}
          error={errors.comoConheceu}
          disabled={isSubmitting}
          options={[
            {
              value: "",
              label: "Selecione uma opção",
            },
            {
              value: "amigo",
              label: "Amigo ou familiar",
            },
            {
              value: "instagram",
              label: "Instagram",
            },
            {
              value: "youtube",
              label: "YouTube",
            },
            {
              value: "google",
              label: "Google",
            },
            {
              value: "outro",
              label: "Outro",
            },
          ]}
        />
      </div>

      {/* Mensagem */}
      <div className="mt-5">
        <Textarea
          id="mensagem"
          name="mensagem"
          label="Gostaria de nos contar algo?"
          placeholder="Escreva sua mensagem aqui..."
          value={formData.mensagem}
          onChange={handleTextareaChange}
          error={errors.mensagem}
          disabled={isSubmitting}
        />
      </div>

      {/* Autorizações */}
      <div className="mt-6 flex flex-col gap-4">
        <Checkbox
          id="contato"
          name="contato"
          label="Autorizo a equipe da igreja a entrar em contato comigo."
          checked={formData.contato}
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

      {/* Mensagem de sucesso */}
      {successMessage && (
        <div
          role="status"
          className="mt-6 rounded-md border border-success/20 bg-green-50 p-4"
        >
          <p className="font-semibold text-success">
            Cadastro concluído
          </p>

          <p className="mt-1 text-sm leading-6 text-success">
            {successMessage}
          </p>
        </div>
      )}

      {/* Botão */}
      <div className="mt-8">
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Enviando..."
            : "Enviar informações"}
        </Button>
      </div>

      {/* Privacidade */}
      <p className="mt-5 text-center text-sm leading-6 text-text-secondary">
        Seus dados serão utilizados apenas para acolhimento e contato
        relacionado às atividades da igreja.
      </p>
    </form>
  );
}
