"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseCookieClient } from "@/lib/supabase/server";
import { processPrayerAiSupport } from "@/services/prayers";
import { requireAdminProfile } from "@/services/auth";
import type { PrayerVisibility } from "@/types/prayers";

interface PrayerAiRetryRow {
  id: string;
  pedido: string;
  visibilidade: PrayerVisibility;
  privacidade_aceita: boolean;
  consentimento_compartilhamento_em: string | null;
}

export async function retryPrayerAiAction(formData: FormData) {
  await requireAdminProfile([
    "Admin",
    "Leadership",
    "Intercessor",
  ]);

  const prayerId = String(formData.get("prayerId") ?? "");

  if (!prayerId) {
    return;
  }

  const supabase = await createSupabaseCookieClient();
  const { data, error } = await supabase
    .from("pedidos_oracao")
    .select(
      "id,pedido,visibilidade,privacidade_aceita,consentimento_compartilhamento_em"
    )
    .eq("id", prayerId)
    .maybeSingle();

  if (error || !data) {
    console.error("Falha ao carregar pedido para retentativa de IA.", {
      code: error?.code,
      hasData: Boolean(data),
    });
    return;
  }

  const prayer = data as PrayerAiRetryRow;

  await processPrayerAiSupport({
    id: prayer.id,
    name: null,
    email: null,
    whatsapp: null,
    request: prayer.pedido,
    visibility: prayer.visibilidade,
    acceptsPrivacy: true,
    sharingConsentAt: prayer.consentimento_compartilhamento_em,
  });

  revalidatePath("/admin/oracao");
  revalidatePath(`/admin/oracao/${prayerId}`);
}
