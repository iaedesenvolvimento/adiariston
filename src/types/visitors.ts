export const visitorSourceValues = [
  "amigo",
  "instagram",
  "youtube",
  "google",
  "outro",
] as const;

export const visitorStatusValues = [
  "NOVO",
  "AGUARDANDO_CONTATO",
  "CONTATADO",
  "EM_ACOMPANHAMENTO",
  "INTEGRADO",
] as const;

export type VisitorSource =
  (typeof visitorSourceValues)[number];

export type VisitorStatus =
  (typeof visitorStatusValues)[number];

export interface VisitorFormPayload {
  nome: string;
  telefone: string;
  email: string;
  comoConheceu: string;
  mensagem: string;
  contato: boolean;
  privacidade: boolean;
}

export type VisitorFieldErrors = Partial<
  Record<
    | "nome"
    | "telefone"
    | "email"
    | "comoConheceu"
    | "mensagem"
    | "privacidade",
    string
  >
>;

export interface NormalizedVisitorInput {
  fullName: string;
  whatsapp: string;
  email: string;
  source: VisitorSource;
  message: string | null;
  allowsContact: boolean;
  acceptsPrivacy: true;
}

export type CreateVisitorResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      message: string;
      fieldErrors?: VisitorFieldErrors;
    };
