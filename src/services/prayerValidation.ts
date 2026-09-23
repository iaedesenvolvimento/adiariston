import type {
  NormalizedPrayerInput,
  PrayerFieldErrors,
  PrayerFormPayload,
} from "@/types/prayers";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toBoolean(value: unknown) {
  return value === true;
}

export function validatePrayerInput(
  payload: unknown
):
  | {
      ok: true;
      data: NormalizedPrayerInput;
    }
  | {
      ok: false;
      fieldErrors: PrayerFieldErrors;
    } {
  const data = payload as Partial<PrayerFormPayload>;
  const fieldErrors: PrayerFieldErrors = {};

  const name = String(data.nome ?? "").trim();
  const email = String(data.email ?? "")
    .trim()
    .toLowerCase();
  const whatsapp = String(data.telefone ?? "").replace(
    /\D/g,
    ""
  );
  const request = String(data.pedido ?? "").trim();
  const share = toBoolean(data.compartilhar);
  const acceptsPrivacy = toBoolean(data.privacidade);

  if (name && (name.length < 3 || name.length > 120)) {
    fieldErrors.nome =
      "Informe um nome entre 3 e 120 caracteres ou deixe em branco.";
  }

  if (email && (email.length > 254 || !emailRegex.test(email))) {
    fieldErrors.email = "Informe um e-mail válido.";
  }

  if (
    whatsapp &&
    whatsapp.length !== 10 &&
    whatsapp.length !== 11
  ) {
    fieldErrors.telefone =
      "Informe um WhatsApp válido com DDD ou deixe em branco.";
  }

  if (!request) {
    fieldErrors.pedido = "Informe seu pedido de oração.";
  } else if (request.length < 10 || request.length > 2000) {
    fieldErrors.pedido =
      "O pedido deve ter entre 10 e 2000 caracteres.";
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
      id: crypto.randomUUID(),
      name: name || null,
      email: email || null,
      whatsapp: whatsapp || null,
      request,
      visibility: share ? "COMPARTILHAVEL" : "PRIVADO",
      acceptsPrivacy: true,
      sharingConsentAt: share
        ? new Date().toISOString()
        : null,
    },
  };
}
