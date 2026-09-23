import { notFound } from "next/navigation";

import { createSupabaseCookieClient } from "@/lib/supabase/server";
import type {
  AdminAnnouncement,
  AdminAuditLog,
  AdminChurchData,
  AdminContributionMethod,
  AdminDepartment,
  AdminEvent,
  AdminEventCategory,
  AdminMinistry,
  AdminNotification,
  AdminSetting,
  AdminSiteContent,
  AdminUserListItem,
  AdminVisitor,
  AdminWeeklySchedule,
} from "@/types/admin";

export async function listAdminVisitors() {
  const supabase = await createSupabaseCookieClient();
  const { data, error } = await supabase
    .from("visitantes")
    .select(
      "id,nome_completo,whatsapp,email,origem,mensagem,permite_contato,status,created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminVisitor[];
}

export async function getAdminVisitor(id: string) {
  const supabase = await createSupabaseCookieClient();
  const { data, error } = await supabase
    .from("visitantes")
    .select(
      "id,nome_completo,whatsapp,email,origem,mensagem,permite_contato,status,created_at"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    notFound();
  }

  return data as AdminVisitor;
}

export async function listAdminEventCategories() {
  const supabase = await createSupabaseCookieClient();
  const { data, error } = await supabase
    .from("categorias_evento")
    .select("id,nome")
    .order("nome");

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminEventCategory[];
}

export async function listAdminEvents() {
  const supabase = await createSupabaseCookieClient();
  const { data, error } = await supabase
    .from("eventos")
    .select(
      "id,categoria_id,titulo,descricao,inicio_em,fim_em,local,status,publicado_em,categorias_evento(nome)"
    )
    .order("inicio_em", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminEvent[];
}

export async function getAdminEvent(id: string) {
  const supabase = await createSupabaseCookieClient();
  const { data, error } = await supabase
    .from("eventos")
    .select(
      "id,categoria_id,titulo,descricao,inicio_em,fim_em,local,status,publicado_em,categorias_evento(nome)"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    notFound();
  }

  return data as AdminEvent;
}

export async function listAdminUsers() {
  const supabase = await createSupabaseCookieClient();
  const { data, error } = await supabase
    .from("usuarios")
    .select(
      "id,email,nome,ativo,created_at,usuarios_perfis!usuarios_perfis_usuario_id_fkey(perfis(nome))"
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminUserListItem[];
}

export async function getAdminUser(id: string) {
  const users = await listAdminUsers();
  const user = users.find((item) => item.id === id);

  if (!user) {
    notFound();
  }

  return user;
}

export async function listAdminNotifications() {
  const supabase = await createSupabaseCookieClient();
  const { data, error } = await supabase
    .from("notificacoes")
    .select("id,titulo,mensagem,tipo,lida,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminNotification[];
}

export async function listAdminAuditLogs() {
  const supabase = await createSupabaseCookieClient();
  const { data, error } = await supabase
    .from("logs_auditoria")
    .select(
      "id,entidade_tipo,entidade_id,acao,resumo,created_at,usuarios(email)"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminAuditLog[];
}

export async function listAdminSettings() {
  const supabase = await createSupabaseCookieClient();
  const { data, error } = await supabase
    .from("configuracoes")
    .select("chave,valor,descricao,publica,updated_at")
    .order("chave");

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminSetting[];
}

export async function listAdminWeeklySchedule() {
  const supabase = await createSupabaseCookieClient();
  const { data, error } = await supabase
    .from("programacao_semanal")
    .select(
      "id,titulo,dia_semana,horario,local,descricao,publico,ativo"
    )
    .order("dia_semana")
    .order("horario");

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminWeeklySchedule[];
}

export async function listAdminAnnouncements() {
  const supabase = await createSupabaseCookieClient();
  const { data, error } = await supabase
    .from("avisos")
    .select(
      "id,titulo,mensagem,publico,ativo,publicado_em,expira_em"
    )
    .order("publicado_em", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminAnnouncement[];
}

export async function listAdminSiteContent() {
  const supabase = await createSupabaseCookieClient();
  const { data, error } = await supabase
    .from("conteudos_site")
    .select("chave,titulo,conteudo,publico,updated_at")
    .order("chave");

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminSiteContent[];
}

export async function listAdminDepartments() {
  const supabase = await createSupabaseCookieClient();
  const { data, error } = await supabase
    .from("departamentos")
    .select("id,nome,descricao,ativo")
    .order("nome");

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminDepartment[];
}

export async function listAdminMinistries() {
  const supabase = await createSupabaseCookieClient();
  const { data, error } = await supabase
    .from("ministerios")
    .select(
      "id,nome,descricao,publico,ativo,ordem,departamentos(nome)"
    )
    .order("ordem")
    .order("nome");

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminMinistry[];
}

export async function listAdminContributionMethods() {
  const supabase = await createSupabaseCookieClient();
  const { data, error } = await supabase
    .from("metodos_contribuicao")
    .select(
      "id,titulo,descricao,tipo,categoria,tipo_chave_pix,chave,chave_pix,pix_copia_cola,favorecido,instituicao,instrucoes,ativo,ordem"
    )
    .order("ordem")
    .order("titulo");

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminContributionMethod[];
}

export async function listAdminChurchData() {
  const supabase = await createSupabaseCookieClient();
  const { data, error } = await supabase
    .from("dados_igreja")
    .select("chave,valor,publico,updated_at")
    .order("chave");

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminChurchData[];
}
