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
  const startDate = getString(formData, "dataInicio");

  if (!title || Number.isNaN(day) || !time || !startDate) {
    throw new Error(
      "Título, dia, horário e início da recorrência são obrigatórios."
    );
  }

  return {
    titulo: title,
    categoria: getString(formData, "categoria") || "Culto",
    dia_semana: day,
    horario: time,
    horario_fim: getString(formData, "horarioFim") || null,
    local: getString(formData, "local") || null,
    descricao: getString(formData, "descricao") || null,
    ministerio_id: getString(formData, "ministerioId") || null,
    data_inicio: startDate,
    data_fim: getString(formData, "dataFim") || null,
    publico: getBoolean(formData, "publico"),
    ativo: getBoolean(formData, "ativo"),
    ordem: Number(getString(formData, "ordem")) || 0,
  };
}

function normalizeExceptionPayload(
  formData: FormData,
  adminId: string
) {
  const scheduleId = getString(formData, "programacaoId");
  const date = getString(formData, "data");
  const status = getString(formData, "status") || "ALTERADA";

  if (!scheduleId || !date) {
    throw new Error("Programação e data da exceção são obrigatórias.");
  }

  return {
    programacao_id: scheduleId,
    data: date,
    status: ["NORMAL", "ALTERADA", "CANCELADA"].includes(status)
      ? status
      : "ALTERADA",
    titulo: getString(formData, "titulo") || null,
    horario: getString(formData, "horario") || null,
    horario_fim: getString(formData, "horarioFim") || null,
    local: getString(formData, "local") || null,
    descricao: getString(formData, "descricao") || null,
    updated_by: adminId,
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
  revalidatePath("/agenda");
  revalidatePath("/");
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
  revalidatePath("/agenda");
  revalidatePath("/");
}

export async function deleteWeeklyScheduleAction(
  formData: FormData
) {
  const admin = await requireAdminProfile(["Admin", "Editor"]);
  const id = getString(formData, "id");
  const title = getString(formData, "titulo") || "Programação";

  if (!id) {
    throw new Error("Programação não informada.");
  }

  const supabase = await createSupabaseCookieClient();
  const { error } = await supabase
    .from("programacao_semanal")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  await supabase.from("logs_auditoria").insert({
    usuario_id: admin.id,
    entidade_tipo: "programacao_semanal",
    entidade_id: id,
    acao: "EXCLUIR_PROGRAMACAO_SEMANAL",
    resumo: `Programação excluída: ${title}`,
  });

  revalidatePath("/admin/agenda-semanal");
  revalidatePath("/agenda");
  revalidatePath("/");
}

export async function upsertScheduleExceptionAction(
  formData: FormData
) {
  const admin = await requireAdminProfile(["Admin", "Editor"]);
  const payload = normalizeExceptionPayload(formData, admin.id);
  const supabase = await createSupabaseCookieClient();

  const { error } = await supabase
    .from("excecoes_programacao")
    .upsert(payload, {
      onConflict: "programacao_id,data",
    });

  if (error) {
    throw error;
  }

  await supabase.from("logs_auditoria").insert({
    usuario_id: admin.id,
    entidade_tipo: "excecoes_programacao",
    acao: "SALVAR_EXCECAO_PROGRAMACAO",
    resumo: `Exceção salva para ${payload.data}`,
  });

  revalidatePath("/admin/agenda-semanal");
  revalidatePath("/agenda");
  revalidatePath("/");
}

export async function deleteScheduleExceptionAction(
  formData: FormData
) {
  const admin = await requireAdminProfile(["Admin", "Editor"]);
  const id = getString(formData, "id");
  const date = getString(formData, "data");

  if (!id) {
    throw new Error("Exceção não informada.");
  }

  const supabase = await createSupabaseCookieClient();
  const { error } = await supabase
    .from("excecoes_programacao")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  await supabase.from("logs_auditoria").insert({
    usuario_id: admin.id,
    entidade_tipo: "excecoes_programacao",
    entidade_id: id,
    acao: "EXCLUIR_EXCECAO_PROGRAMACAO",
    resumo: `Exceção excluída${date ? ` para ${date}` : ""}`,
  });

  revalidatePath("/admin/agenda-semanal");
  revalidatePath("/agenda");
  revalidatePath("/");
}
