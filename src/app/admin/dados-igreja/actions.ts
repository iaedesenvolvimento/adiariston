"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseCookieClient } from "@/lib/supabase/server";
import { requireAdminProfile } from "@/services/auth";

export async function updateChurchDataAction(formData: FormData) {
  const admin = await requireAdminProfile(["Admin"]);
  const keys = formData
    .getAll("chaves")
    .filter((value): value is string => {
      return typeof value === "string" && Boolean(value.trim());
    });

  if (keys.length === 0) {
    throw new Error("Nenhum dado informado para atualização.");
  }

  const supabase = await createSupabaseCookieClient();
  const results = await Promise.all(
    keys.map((key) => {
      const value = formData.get(`valor:${key}`);

      if (typeof value !== "string" || !value.trim()) {
        throw new Error(`Valor obrigatório não informado: ${key}`);
      }

      return supabase
        .from("dados_igreja")
        .update({
          valor: value.trim(),
          publico: formData.get(`publico:${key}`) === "on",
          updated_by: admin.id,
        })
        .eq("chave", key);
    })
  );

  const failedResult = results.find((result) => result.error);

  if (failedResult?.error) {
    throw failedResult.error;
  }

  await supabase.from("logs_auditoria").insert({
    usuario_id: admin.id,
    entidade_tipo: "dados_igreja",
    entidade_id: null,
    acao: "ATUALIZAR_DADOS_IGREJA",
    resumo: `Dados atualizados: ${keys.join(", ")}`,
  });

  revalidatePath("/admin/dados-igreja");
}
