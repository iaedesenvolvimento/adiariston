"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseCookieClient } from "@/lib/supabase/server";
import { requireAdminProfile } from "@/services/auth";

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    throw new Error("Dados inválidos para moderação.");
  }

  return value.trim();
}

export async function approvePrayerModerationAction(
  formData: FormData
) {
  const admin = await requireAdminProfile([
    "Admin",
    "Intercessor",
  ]);
  const moderationId = getRequiredString(
    formData,
    "moderationId"
  );
  const prayerId = getRequiredString(formData, "prayerId");
  const publicText = getRequiredString(
    formData,
    "textoPublico"
  );

  if (publicText.length < 10 || publicText.length > 1000) {
    throw new Error(
      "O texto público deve ter entre 10 e 1000 caracteres."
    );
  }

  const supabase = await createSupabaseCookieClient();
  const { error: moderationError } = await supabase
    .from("moderacoes_oracao")
    .update({
      status: "APROVADO",
      texto_publico: publicText,
      moderado_por: admin.id,
      moderado_em: new Date().toISOString(),
    })
    .eq("id", moderationId)
    .eq("pedido_id", prayerId);

  if (moderationError) {
    throw moderationError;
  }

  const { error: prayerStatusError } = await supabase
    .from("pedidos_oracao")
    .update({
      status: "EM_ORACAO",
    })
    .eq("id", prayerId);

  if (prayerStatusError) {
    console.error("Falha ao atualizar status do pedido.", {
      code: prayerStatusError.code,
    });
  }

  const { error: historyError } = await supabase
    .from("historico_oracao")
    .insert({
      pedido_id: prayerId,
      acao: "MODERACAO_APROVADA",
      ator_tipo: "intercessor",
      observacao: "Pedido aprovado para o mural público.",
    });

  if (historyError) {
    console.error("Falha ao registrar histórico.", {
      code: historyError.code,
    });
  }

  revalidatePath("/admin/oracao");
  revalidatePath("/admin/oracao/moderacao");
  revalidatePath(`/admin/oracao/${prayerId}`);
  revalidatePath("/oracao/mural");
}

export async function rejectPrayerModerationAction(
  formData: FormData
) {
  const admin = await requireAdminProfile([
    "Admin",
    "Intercessor",
  ]);
  const moderationId = getRequiredString(
    formData,
    "moderationId"
  );
  const prayerId = getRequiredString(formData, "prayerId");
  const observation = getRequiredString(
    formData,
    "observacaoInterna"
  );

  if (observation.length > 500) {
    throw new Error(
      "A observação interna deve ter no máximo 500 caracteres."
    );
  }

  const supabase = await createSupabaseCookieClient();
  const { error: moderationError } = await supabase
    .from("moderacoes_oracao")
    .update({
      status: "REJEITADO",
      texto_publico: null,
      observacao_interna: observation,
      moderado_por: admin.id,
      moderado_em: new Date().toISOString(),
    })
    .eq("id", moderationId)
    .eq("pedido_id", prayerId);

  if (moderationError) {
    throw moderationError;
  }

  const { error: historyError } = await supabase
    .from("historico_oracao")
    .insert({
      pedido_id: prayerId,
      acao: "MODERACAO_REJEITADA",
      ator_tipo: "intercessor",
      observacao: "Pedido rejeitado para publicação no mural.",
    });

  if (historyError) {
    console.error("Falha ao registrar histórico.", {
      code: historyError.code,
    });
  }

  revalidatePath("/admin/oracao");
  revalidatePath("/admin/oracao/moderacao");
  revalidatePath(`/admin/oracao/${prayerId}`);
  revalidatePath("/oracao/mural");
}
