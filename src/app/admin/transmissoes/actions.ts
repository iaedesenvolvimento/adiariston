"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseCookieClient } from "@/lib/supabase/server";
import { requireAdminProfile } from "@/services/auth";

const transmissionStatuses = [
  "AGENDADA",
  "AO_VIVO",
  "ENCERRADA",
  "CANCELADA",
];

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function normalizeStatus(value: string) {
  return transmissionStatuses.includes(value)
    ? value
    : "AGENDADA";
}

function extractYouTubeVideoId(value: string) {
  const trimmedValue = value.trim();

  if (/^[A-Za-z0-9_-]{6,32}$/.test(trimmedValue)) {
    return trimmedValue;
  }

  try {
    const url = new URL(trimmedValue);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0] ?? "";
      return /^[A-Za-z0-9_-]{6,32}$/.test(id) ? id : "";
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      const watchId = url.searchParams.get("v") ?? "";
      if (/^[A-Za-z0-9_-]{6,32}$/.test(watchId)) {
        return watchId;
      }

      const parts = url.pathname.split("/").filter(Boolean);
      const embedIndex = parts.findIndex((part) =>
        ["embed", "live", "shorts"].includes(part)
      );
      const id = embedIndex >= 0 ? parts[embedIndex + 1] ?? "" : "";
      return /^[A-Za-z0-9_-]{6,32}$/.test(id) ? id : "";
    }
  } catch {
    return "";
  }

  return "";
}

function buildTransmissionPayload(
  formData: FormData,
  adminId: string
) {
  const title = getString(formData, "titulo");
  const startsAt = getString(formData, "inicioPrevisto");
  const endsAt = getString(formData, "fimPrevisto");
  const youtubeVideoId = extractYouTubeVideoId(
    getString(formData, "youtube")
  );

  if (!title || !startsAt || !youtubeVideoId) {
    throw new Error(
      "Título, início previsto e URL/ID do YouTube são obrigatórios."
    );
  }

  return {
    titulo: title,
    descricao: getString(formData, "descricao") || null,
    youtube_video_id: youtubeVideoId,
    inicio_previsto: new Date(startsAt).toISOString(),
    fim_previsto: endsAt ? new Date(endsAt).toISOString() : null,
    status: normalizeStatus(getString(formData, "status")),
    destacar_home: formData.get("destacarHome") === "on",
    exibir_gravacao: formData.get("exibirGravacao") === "on",
    ativo: formData.get("ativo") === "on",
    updated_by: adminId,
  };
}

export async function createTransmissionAction(formData: FormData) {
  const admin = await requireAdminProfile(["Admin", "Editor"]);
  const supabase = await createSupabaseCookieClient();
  const payload = buildTransmissionPayload(formData, admin.id);

  const { data, error } = await supabase
    .from("transmissoes")
    .insert(payload)
    .select("id,titulo")
    .single();

  if (error) {
    throw error;
  }

  await supabase.from("logs_auditoria").insert({
    usuario_id: admin.id,
    entidade_tipo: "transmissoes",
    entidade_id: data.id,
    acao: "CRIAR_TRANSMISSAO",
    resumo: `Transmissão criada: ${data.titulo}`,
  });

  revalidatePath("/admin/transmissoes");
  revalidatePath("/ao-vivo");
  revalidatePath("/");
}

export async function updateTransmissionAction(formData: FormData) {
  const admin = await requireAdminProfile(["Admin", "Editor"]);
  const transmissionId = getString(formData, "id");

  if (!transmissionId) {
    throw new Error("Transmissão não informada.");
  }

  const supabase = await createSupabaseCookieClient();
  const payload = buildTransmissionPayload(formData, admin.id);
  const { error } = await supabase
    .from("transmissoes")
    .update(payload)
    .eq("id", transmissionId);

  if (error) {
    throw error;
  }

  await supabase.from("logs_auditoria").insert({
    usuario_id: admin.id,
    entidade_tipo: "transmissoes",
    entidade_id: transmissionId,
    acao: "ATUALIZAR_TRANSMISSAO",
    resumo: `Transmissão atualizada: ${payload.titulo}`,
  });

  revalidatePath("/admin/transmissoes");
  revalidatePath("/ao-vivo");
  revalidatePath("/");
}
