export type VisitorStatus =
  | "NOVO"
  | "AGUARDANDO_CONTATO"
  | "CONTATADO"
  | "EM_ACOMPANHAMENTO"
  | "INTEGRADO";

export type EventStatus =
  | "RASCUNHO"
  | "PUBLICADO"
  | "ARQUIVADO";

export type TransmissionStatus =
  | "AGENDADA"
  | "AO_VIVO"
  | "ENCERRADA"
  | "CANCELADA";

export interface AdminVisitor {
  id: string;
  nome_completo: string;
  whatsapp: string;
  email: string;
  origem: string;
  mensagem: string | null;
  permite_contato: boolean;
  status: VisitorStatus;
  created_at: string;
}

export interface AdminEventCategory {
  id: string;
  nome: string;
}

export interface AdminEvent {
  id: string;
  categoria_id: string | null;
  titulo: string;
  descricao: string | null;
  inicio_em: string;
  fim_em: string | null;
  local: string | null;
  status: EventStatus;
  publicado_em: string | null;
  categorias_evento:
    | {
        nome: string;
      }
    | {
        nome: string;
      }[]
    | null;
}

export interface AdminUserListItem {
  id: string;
  email: string;
  nome: string | null;
  ativo: boolean;
  created_at: string;
  usuarios_perfis:
    | {
        perfis:
          | {
              nome: string;
            }
          | {
              nome: string;
            }[]
          | null;
      }[]
    | null;
}

export interface AdminNotification {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: string;
  lida: boolean;
  created_at: string;
}

export interface AdminAuditLog {
  id: string;
  entidade_tipo: string;
  entidade_id: string | null;
  acao: string;
  resumo: string | null;
  created_at: string;
  usuarios:
    | {
        email: string;
      }
    | {
        email: string;
      }[]
    | null;
}

export interface AdminSetting {
  chave: string;
  valor: string;
  descricao: string | null;
  publica: boolean;
  updated_at: string;
}

export interface AdminWeeklySchedule {
  id: string;
  titulo: string;
  dia_semana: number;
  horario: string;
  local: string | null;
  descricao: string | null;
  publico: boolean;
  ativo: boolean;
}

export interface AdminAnnouncement {
  id: string;
  titulo: string;
  mensagem: string;
  publico: boolean;
  ativo: boolean;
  publicado_em: string | null;
  expira_em: string | null;
}

export interface AdminSiteContent {
  chave: string;
  titulo: string;
  conteudo: string;
  publico: boolean;
  updated_at: string;
}

export interface AdminDepartment {
  id: string;
  nome: string;
  descricao: string | null;
  ativo: boolean;
}

export interface AdminMinistry {
  id: string;
  nome: string;
  descricao: string | null;
  publico: boolean;
  ativo: boolean;
  ordem: number;
  departamentos:
    | {
        nome: string;
      }
    | {
        nome: string;
      }[]
    | null;
}

export interface AdminContributionMethod {
  id: string;
  titulo: string;
  descricao: string | null;
  tipo: string;
  categoria: "dizimo" | "oferta" | "outro";
  tipo_chave_pix: string | null;
  chave: string | null;
  chave_pix: string | null;
  pix_copia_cola: string | null;
  favorecido: string | null;
  instituicao: string | null;
  instrucoes: string | null;
  ativo: boolean;
  ordem: number;
}

export interface AdminChurchData {
  chave: string;
  valor: string;
  publico: boolean;
  updated_at: string;
}

export interface AdminTransmission {
  id: string;
  titulo: string;
  descricao: string | null;
  youtube_video_id: string;
  inicio_previsto: string;
  fim_previsto: string | null;
  status: TransmissionStatus;
  destacar_home: boolean;
  exibir_gravacao: boolean;
  ativo: boolean;
}
