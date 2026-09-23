"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseCookieClient } from "@/lib/supabase/server";
import { requireAdminProfile } from "@/services/auth";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function normalizeAnnouncementPayload(formData: FormData) {
  const title = getString(formData, "titulo");
  const message = getString(formData, "mensagem");
  const publishedAt = getString(formData, "publicadoEm");
  const expiresAt = getString(formData, "expiraEm");

  if (!title || !message) {
    throw new Error("Título e mensagem são obrigatórios.");
  }

  return {
    titulo: title,
    mensagem: message,
    publico: getBoolean(formData, "publico"),
    ativo: getBoolean(formData, "ativo"),
    publicado_em: publishedAt
      ? new Date(publishedAt).toISOString()
      : null,
    expira_em: expiresAt ? new Date(expiresAt).toISOString() : null,
  };
}

export async function createAnnouncementAction(formData: FormData) {
  const admin = await requireAdminProfile(["Admin", "Editor"]);
  const payload = normalizeAnnouncementPayload(formData);
  const supabase = await createSupabaseCookieClient();

  const { error } = await supabase.from("avisos").insert(payload);

  if (error) {
    throw error;
  }

  await supabase.from("logs_auditoria").insert({
    usuario_id: admin.id,
    entidade_tipo: "avisos",
    acao: "CRIAR_AVISO",
    resumo: `Aviso criado: ${payload.titulo}`,
  });

  revalidatePath("/admin/avisos");
}

export async function updateAnnouncementAction(formData: FormData) {
  const admin = await requireAdminProfile(["Admin", "Editor"]);
  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Aviso não informado.");
  }

  const payload = normalizeAnnouncementPayload(formData);
  const supabase = await createSupabaseCookieClient();

  const { error } = await supabase
    .from("avisos")
    .update(payload)
    .eq("id", id);

  if (error) {
    throw error;
  }

  await supabase.from("logs_auditoria").insert({
    usuario_id: admin.id,
    entidade_tipo: "avisos",
    entidade_id: id,
    acao: "ATUALIZAR_AVISO",
    resumo: `Aviso atualizado: ${payload.titulo}`,
  });

  revalidatePath("/admin/avisos");
}
