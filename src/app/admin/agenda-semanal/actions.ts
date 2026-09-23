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

function normalizeSchedulePayload(formData: FormData) {
  const title = getString(formData, "titulo");
  const day = Number(getString(formData, "diaSemana"));
  const time = getString(formData, "horario");

  if (!title || Number.isNaN(day) || !time) {
    throw new Error("Título, dia e horário são obrigatórios.");
  }

  return {
    titulo: title,
    dia_semana: day,
    horario: time,
    local: getString(formData, "local") || null,
    descricao: getString(formData, "descricao") || null,
    publico: getBoolean(formData, "publico"),
    ativo: getBoolean(formData, "ativo"),
  };
}

export async function createWeeklyScheduleAction(
  formData: FormData
) {
  const admin = await requireAdminProfile(["Admin", "Editor"]);
  const payload = normalizeSchedulePayload(formData);
  const supabase = await createSupabaseCookieClient();

  const { error } = await supabase
    .from("programacao_semanal")
    .insert(payload);

  if (error) {
    throw error;
  }

  await supabase.from("logs_auditoria").insert({
    usuario_id: admin.id,
    entidade_tipo: "programacao_semanal",
    acao: "CRIAR_PROGRAMACAO_SEMANAL",
    resumo: `Programação criada: ${payload.titulo}`,
  });

  revalidatePath("/admin/agenda-semanal");
}

export async function updateWeeklyScheduleAction(
  formData: FormData
) {
  const admin = await requireAdminProfile(["Admin", "Editor"]);
  const id = getString(formData, "id");

  if (!id) {
    throw new Error("Programação não informada.");
  }

  const payload = normalizeSchedulePayload(formData);
  const supabase = await createSupabaseCookieClient();

  const { error } = await supabase
    .from("programacao_semanal")
    .update(payload)
    .eq("id", id);

  if (error) {
    throw error;
  }

  await supabase.from("logs_auditoria").insert({
    usuario_id: admin.id,
    entidade_tipo: "programacao_semanal",
    entidade_id: id,
    acao: "ATUALIZAR_PROGRAMACAO_SEMANAL",
    resumo: `Programação atualizada: ${payload.titulo}`,
  });

  revalidatePath("/admin/agenda-semanal");
}
