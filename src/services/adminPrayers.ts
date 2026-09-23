import { notFound } from "next/navigation";

import { createSupabaseCookieClient } from "@/lib/supabase/server";
import type {
  AdminPrayerDetail,
  AdminPrayerHistoryItem,
  AdminPrayerModeration,
  AdminPrayerModerationItem,
  AdminPrayerRequest,
} from "@/types/adminPrayer";

function firstValue<T>(value: T | T[] | null) {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}

export async function listAdminPrayerRequests() {
  const supabase = await createSupabaseCookieClient();
  const { data, error } = await supabase
    .from("pedidos_oracao")
    .select(
      "id,nome,email,whatsapp,pedido,visibilidade,status,categoria_sugerida,mensagem_acolhimento,requer_atencao_humana,ia_processada_em,ia_erro,created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminPrayerRequest[];
}

export async function getAdminPrayerRequest(id: string) {
  const supabase = await createSupabaseCookieClient();
  const [requestResult, historyResult, moderationResult] =
    await Promise.all([
      supabase
        .from("pedidos_oracao")
        .select(
          "id,nome,email,whatsapp,pedido,visibilidade,status,categoria_sugerida,mensagem_acolhimento,requer_atencao_humana,ia_processada_em,ia_erro,created_at"
        )
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("historico_oracao")
        .select("id,acao,ator_tipo,observacao,created_at")
        .eq("pedido_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("moderacoes_oracao")
        .select(
          "id,pedido_id,status,texto_publico,moderado_por,moderado_em,observacao_interna,created_at"
        )
        .eq("pedido_id", id)
        .maybeSingle(),
    ]);

  if (requestResult.error) {
    throw requestResult.error;
  }

  if (!requestResult.data) {
    notFound();
  }

  if (historyResult.error) {
    throw historyResult.error;
  }

  if (moderationResult.error) {
    throw moderationResult.error;
  }

  return {
    ...(requestResult.data as AdminPrayerRequest),
    historico: (historyResult.data ??
      []) as AdminPrayerHistoryItem[],
    moderacao:
      (moderationResult.data as AdminPrayerModeration | null) ??
      null,
  } satisfies AdminPrayerDetail;
}

export async function listPendingPrayerModerations() {
  const supabase = await createSupabaseCookieClient();
  const { data, error } = await supabase
    .from("moderacoes_oracao")
    .select(
      "id,pedido_id,status,texto_publico,moderado_por,moderado_em,observacao_interna,created_at,pedidos_oracao!inner(id,nome,email,whatsapp,pedido,categoria_sugerida,created_at)"
    )
    .eq("status", "PENDENTE")
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((item) => {
    const row = item as unknown as AdminPrayerModerationItem;
    return {
      ...row,
      pedidos_oracao: firstValue(row.pedidos_oracao),
    };
  });
}
