export const prayerCategoryValues = [
  "Saúde",
  "Família",
  "Finanças",
  "Espiritual",
  "Relacionamento",
  "Trabalho",
  "Luto",
  "Outros",
] as const;

export const prayerVisibilityValues = [
  "PRIVADO",
  "COMPARTILHAVEL",
] as const;

export const prayerStatusValues = [
  "RECEBIDO",
  "EM_ORACAO",
  "ORADO",
  "ACOMPANHAMENTO",
  "ARQUIVADO",
] as const;

export type PrayerCategory =
  (typeof prayerCategoryValues)[number];

export type PrayerVisibility =
  (typeof prayerVisibilityValues)[number];

export type PrayerStatus =
  (typeof prayerStatusValues)[number];

export interface PrayerFormPayload {
  nome: string;
  email: string;
  telefone: string;
  pedido: string;
  compartilhar: boolean;
  privacidade: boolean;
}

export type PrayerFieldErrors = Partial<
  Record<
    | "nome"
    | "email"
    | "telefone"
    | "pedido"
    | "compartilhar"
    | "privacidade",
    string
  >
>;

export interface NormalizedPrayerInput {
  id: string;
  name: string | null;
  email: string | null;
  whatsapp: string | null;
  request: string;
  visibility: PrayerVisibility;
  acceptsPrivacy: true;
  sharingConsentAt: string | null;
}

export type CreatePrayerResult =
  | {
      ok: true;
      aiSupport?: {
        category: PrayerCategory;
        prayer: string;
        requiresHumanAttention: boolean;
      };
    }
  | {
      ok: false;
      message: string;
      fieldErrors?: PrayerFieldErrors;
    };

export interface PublicPrayerMuralItem {
  id: string;
  pedido_id: string;
  texto_publico: string;
  categoria: PrayerCategory | null;
  publicado_em: string;
}
