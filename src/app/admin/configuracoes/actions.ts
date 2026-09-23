"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { requireAdminProfile } from "@/services/auth";

const resetConfirmation = "LIMPAR BASE";

const tablesToClear = [
  { name: "moderacoes_oracao", label: "moderações de oração" },
  { name: "historico_oracao", label: "histórico de oração" },
  { name: "pedidos_oracao", label: "pedidos de oração" },
  { name: "visitantes", label: "visitantes" },
  { name: "notificacoes", label: "notificações" },
  { name: "excecoes_programacao", label: "exceções de agenda" },
  { name: "transmissoes", label: "transmissões" },
  { name: "eventos", label: "eventos" },
  { name: "programacao_semanal", label: "programação semanal" },
  { name: "avisos", label: "avisos" },
  { name: "conteudos_site", label: "conteúdos do site", key: "chave" },
  { name: "metodos_contribuicao", label: "métodos de contribuição" },
  { name: "ministerios", label: "ministérios" },
  { name: "departamentos", label: "departamentos" },
  { name: "categorias_evento", label: "categorias de evento" },
  { name: "categorias_oracao", label: "categorias de oração" },
  { name: "dados_igreja", label: "dados da igreja", key: "chave" },
  { name: "configuracoes", label: "configurações", key: "chave" },
  { name: "logs_auditoria", label: "auditoria antiga" },
];

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function clearDemoDatabaseAction(formData: FormData) {
  const admin = await requireAdminProfile(["Admin"]);
  const confirmation = getString(formData, "confirmacao");

  if (confirmation !== resetConfirmation) {
    throw new Error(
      `Digite exatamente "${resetConfirmation}" para confirmar.`
    );
  }

  const supabase = createSupabaseServiceRoleClient();
  const clearedTables: string[] = [];

  for (const table of tablesToClear) {
    const key = table.key ?? "id";
    const { error } = await supabase
      .from(table.name)
      .delete()
      .not(key, "is", null);

    if (error) {
      throw new Error(
        `Falha ao limpar ${table.label}: ${error.message}`
      );
    }

    clearedTables.push(table.label);
  }

  await supabase.from("logs_auditoria").insert({
    usuario_id: admin.id,
    entidade_tipo: "sistema",
    entidade_id: null,
    acao: "LIMPAR_BASE_ADMIN",
    resumo: `Base limpa pelo Admin. Tabelas: ${clearedTables.join(", ")}`,
  });

  [
    "/",
    "/agenda",
    "/ao-vivo",
    "/contribua",
    "/contato",
    "/ministerios",
    "/oracao/mural",
    "/admin",
    "/admin/configuracoes",
    "/admin/agenda-semanal",
    "/admin/eventos",
    "/admin/transmissoes",
    "/admin/visitantes",
    "/admin/oracao",
    "/admin/avisos",
    "/admin/conteudo",
    "/admin/ministerios",
    "/admin/contribuicoes",
    "/admin/dados-igreja",
    "/admin/notificacoes",
    "/admin/auditoria",
  ].forEach((path) => revalidatePath(path));
}
