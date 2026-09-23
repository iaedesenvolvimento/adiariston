import type {
  PrayerStatus,
  PrayerVisibility,
} from "@/types/prayers";

export interface AdminPrayerRequest {
  id: string;
  nome: string | null;
  email: string | null;
  whatsapp: string | null;
  pedido: string;
  visibilidade: PrayerVisibility;
  status: PrayerStatus;
  categoria_sugerida: string | null;
  mensagem_acolhimento: string | null;
  requer_atencao_humana: boolean;
  ia_processada_em: string | null;
  ia_erro: string | null;
  created_at: string;
}

export interface AdminPrayerHistoryItem {
  id: string;
  acao: string;
  ator_tipo: string;
  observacao: string | null;
  created_at: string;
}

export interface AdminPrayerModeration {
  id: string;
  pedido_id: string;
  status: "PENDENTE" | "APROVADO" | "REJEITADO";
  texto_publico: string | null;
  moderado_por: string | null;
  moderado_em: string | null;
  observacao_interna: string | null;
  created_at: string;
}

export interface AdminPrayerDetail extends AdminPrayerRequest {
  historico: AdminPrayerHistoryItem[];
  moderacao: AdminPrayerModeration | null;
}

export interface AdminPrayerModerationItem
  extends AdminPrayerModeration {
  pedidos_oracao:
    | {
        id: string;
        nome: string | null;
        email: string | null;
        whatsapp: string | null;
        pedido: string;
        categoria_sugerida: string | null;
        created_at: string;
      }
    | {
        id: string;
        nome: string | null;
        email: string | null;
        whatsapp: string | null;
        pedido: string;
        categoria_sugerida: string | null;
        created_at: string;
      }[];
}
