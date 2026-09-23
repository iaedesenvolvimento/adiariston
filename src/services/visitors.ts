import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { NormalizedVisitorInput } from "@/types/visitors";

export async function createVisitor(
  input: NormalizedVisitorInput
) {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.from("visitantes").insert({
    nome_completo: input.fullName,
    whatsapp: input.whatsapp,
    email: input.email,
    origem: input.source,
    mensagem: input.message,
    permite_contato: input.allowsContact,
    privacidade_aceita: input.acceptsPrivacy,
    status: "NOVO",
  });

  if (error) {
    throw error;
  }
}
