"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createSupabaseCookieClient } from "@/lib/supabase/server";
import { requireAdminProfile } from "@/services/auth";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createAdminEventAction(
  formData: FormData
) {
  const admin = await requireAdminProfile(["Admin", "Editor"]);
  const title = getString(formData, "titulo");
  const startsAt = getString(formData, "inicioEm");
  const endsAt = getString(formData, "fimEm");
  const categoryId = getString(formData, "categoriaId");
  const location = getString(formData, "local");
  const description = getString(formData, "descricao");
  const status = getString(formData, "status") || "RASCUNHO";

  if (!title || !startsAt) {
    redirect("/admin/eventos/novo?erro=campos");
  }

  const supabase = await createSupabaseCookieClient();
  const { error } = await supabase.from("eventos").insert({
    titulo: title,
    categoria_id: categoryId || null,
    local: location || null,
    descricao: description || null,
    inicio_em: new Date(startsAt).toISOString(),
    fim_em: endsAt ? new Date(endsAt).toISOString() : null,
    status,
    publicado_em:
      status === "PUBLICADO" ? new Date().toISOString() : null,
  });

  if (error) {
    console.error("[admin-eventos] Falha ao criar evento.", {
      code: error.code,
      message: error.message,
    });
    redirect("/admin/eventos/novo?erro=servidor");
  }

  await supabase.from("logs_auditoria").insert({
    usuario_id: admin.id,
    entidade_tipo: "eventos",
    acao: "CRIAR_EVENTO",
    resumo: `Evento criado: ${title}`,
  });

  redirect("/admin/eventos");
}

export async function updateAdminEventAction(
  formData: FormData
) {
  const admin = await requireAdminProfile(["Admin", "Editor"]);
  const eventId = getString(formData, "id");
  const title = getString(formData, "titulo");
  const startsAt = getString(formData, "inicioEm");
  const endsAt = getString(formData, "fimEm");
  const categoryId = getString(formData, "categoriaId");
  const location = getString(formData, "local");
  const description = getString(formData, "descricao");
  const status = getString(formData, "status") || "RASCUNHO";

  if (!eventId || !title || !startsAt) {
    throw new Error("Evento, título e início são obrigatórios.");
  }

  const supabase = await createSupabaseCookieClient();
  const { error } = await supabase
    .from("eventos")
    .update({
      titulo: title,
      categoria_id: categoryId || null,
      local: location || null,
      descricao: description || null,
      inicio_em: new Date(startsAt).toISOString(),
      fim_em: endsAt ? new Date(endsAt).toISOString() : null,
      status,
      publicado_em:
        status === "PUBLICADO" ? new Date().toISOString() : null,
    })
    .eq("id", eventId);

  if (error) {
    throw error;
  }

  await supabase.from("logs_auditoria").insert({
    usuario_id: admin.id,
    entidade_tipo: "eventos",
    entidade_id: eventId,
    acao: "ATUALIZAR_EVENTO",
    resumo: `Evento atualizado: ${title}`,
  });

  revalidatePath("/admin/eventos");
  revalidatePath(`/admin/eventos/${eventId}`);
}
