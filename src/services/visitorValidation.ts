import type {
  NormalizedVisitorInput,
  VisitorFieldErrors,
  VisitorFormPayload,
} from "@/types/visitors";
import {
  visitorSourceValues,
} from "@/types/visitors";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isVisitorSource(
  value: string
): value is NormalizedVisitorInput["source"] {
  return visitorSourceValues.includes(
    value as NormalizedVisitorInput["source"]
  );
}

function toBoolean(value: unknown) {
  return value === true;
}

export function validateVisitorInput(
  payload: unknown
):
  | {
      ok: true;
      data: NormalizedVisitorInput;
    }
  | {
      ok: false;
      fieldErrors: VisitorFieldErrors;
    } {
  const data = payload as Partial<VisitorFormPayload>;
  const fieldErrors: VisitorFieldErrors = {};

  const fullName = String(data.nome ?? "").trim();
  const whatsapp = String(data.telefone ?? "").replace(
    /\D/g,
    ""
  );
  const email = String(data.email ?? "")
    .trim()
    .toLowerCase();
  const source = String(data.comoConheceu ?? "").trim();
  const message = String(data.mensagem ?? "").trim();
  const allowsContact = toBoolean(data.contato);
  const acceptsPrivacy = toBoolean(data.privacidade);

  if (!fullName) {
    fieldErrors.nome = "Informe seu nome.";
  } else if (fullName.length < 3 || fullName.length > 120) {
    fieldErrors.nome =
      "Informe um nome entre 3 e 120 caracteres.";
  }

  if (!whatsapp) {
    fieldErrors.telefone = "Informe seu WhatsApp.";
  } else if (
    whatsapp.length !== 10 &&
    whatsapp.length !== 11
  ) {
    fieldErrors.telefone =
      "Informe um WhatsApp válido com DDD.";
  }

  if (!email) {
    fieldErrors.email = "Informe seu e-mail.";
  } else if (email.length > 254 || !emailRegex.test(email)) {
    fieldErrors.email = "Informe um e-mail válido.";
  }

  if (!source) {
    fieldErrors.comoConheceu = "Selecione uma opção.";
  } else if (!isVisitorSource(source)) {
    fieldErrors.comoConheceu = "Selecione uma opção válida.";
  }

  if (message.length > 1000) {
    fieldErrors.mensagem =
      "A mensagem deve ter no máximo 1000 caracteres.";
  }

  if (!acceptsPrivacy) {
    fieldErrors.privacidade =
      "Você precisa concordar com a Política de Privacidade.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      fieldErrors,
    };
  }

  return {
    ok: true,
    data: {
      fullName,
      whatsapp,
      email,
      source: source as NormalizedVisitorInput["source"],
      message: message || null,
      allowsContact,
      acceptsPrivacy: true,
    },
  };
}
