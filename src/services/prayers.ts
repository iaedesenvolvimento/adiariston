import {
  createSupabaseServerClient,
  createSupabaseServiceRoleClient,
  SupabaseConfigError,
} from "@/lib/supabase/server";
import { analyzePrayerWithGroq } from "@/services/prayerAi";
import type {
  NormalizedPrayerInput,
  PrayerCategory,
  PublicPrayerMuralItem,
} from "@/types/prayers";

interface PrayerAiPublicSupport {
  category: PrayerCategory;
  prayer: string;
  requiresHumanAttention: boolean;
}

export async function createPrayerRequest(
  input: NormalizedPrayerInput
) {
  const supabase = createSupabaseServerClient();

  const { error: prayerError } = await supabase
    .from("pedidos_oracao")
    .insert({
      id: input.id,
      nome: input.name,
      email: input.email,
      whatsapp: input.whatsapp,
      pedido: input.request,
      visibilidade: input.visibility,
      status: "RECEBIDO",
      privacidade_aceita: input.acceptsPrivacy,
      consentimento_compartilhamento_em:
        input.sharingConsentAt,
    });

  if (prayerError) {
    throw prayerError;
  }

  const { error: historyError } = await supabase
    .from("historico_oracao")
    .insert({
      pedido_id: input.id,
      acao: "PEDIDO_RECEBIDO",
      ator_tipo: "sistema",
    });

  if (historyError) {
    console.error("Falha ao registrar histórico de oração.", {
      code: historyError.code,
    });
  }

  if (input.visibility === "COMPARTILHAVEL") {
    const { error: moderationError } = await supabase
      .from("moderacoes_oracao")
      .insert({
        pedido_id: input.id,
        status: "PENDENTE",
      });

    if (moderationError) {
      console.error("Falha ao criar moderação de oração.", {
        code: moderationError.code,
      });
    }
  }
}

export async function processPrayerAiSupport(
  input: NormalizedPrayerInput
): Promise<PrayerAiPublicSupport | null> {
  const analysis = await analyzePrayerWithGroq(input);
  const publicSupport = analysis.ok
    ? {
        category: analysis.category,
        prayer: analysis.welcomeMessage,
        requiresHumanAttention:
          analysis.requiresHumanAttention,
      }
    : null;

  try {
    const supabase = createSupabaseServiceRoleClient();

    if (!analysis.ok) {
      const { error } = await supabase
        .from("pedidos_oracao")
        .update({
          ia_erro: analysis.reason.slice(0, 300),
        })
        .eq("id", input.id);

      if (error) {
        console.error("Falha ao registrar erro de IA.", {
          code: error.code,
        });
      }

      return null;
    }

    const { error: updateError } = await supabase
      .from("pedidos_oracao")
      .update({
        categoria_sugerida: analysis.category,
        mensagem_acolhimento: analysis.welcomeMessage,
        requer_atencao_humana:
          analysis.requiresHumanAttention,
        ia_processada_em: new Date().toISOString(),
        ia_erro: null,
      })
      .eq("id", input.id);

    if (updateError) {
      console.error("Falha ao atualizar análise de IA.", {
        code: updateError.code,
      });
      return publicSupport;
    }

    const { error: historyError } = await supabase
      .from("historico_oracao")
      .insert({
        pedido_id: input.id,
        acao: "IA_PROCESSADA",
        ator_tipo: "sistema",
        observacao: analysis.requiresHumanAttention
          ? "IA sinalizou atenção humana."
          : "IA gerou apoio inicial.",
      });

    if (historyError) {
      console.error("Falha ao registrar histórico de IA.", {
        code: historyError.code,
      });
    }

    return publicSupport;
  } catch (error) {
    if (error instanceof SupabaseConfigError) {
      console.warn(
        "IA processada, mas SUPABASE_SERVICE_ROLE_KEY não está configurada."
      );
      return publicSupport;
    }

    console.error("Falha inesperada no pós-processamento de IA.", {
      name:
        error instanceof Error ? error.name : "UnknownError",
    });

    return publicSupport;
  }
}

export async function listPublicPrayerMural() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.rpc(
    "listar_mural_oracao"
  );

  if (error) {
    throw error;
  }

  return (data ?? []) as PublicPrayerMuralItem[];
}
