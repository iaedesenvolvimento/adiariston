"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseCookieClient } from "@/lib/supabase/server";
import { requireAdminProfile } from "@/services/auth";

const contributionCategories = ["dizimo", "oferta", "outro"];
const contributionTypes = [
  "pix",
  "transferencia",
  "dinheiro",
  "outro",
];
const pixKeyTypes = ["cpf_cnpj", "email", "telefone", "aleatoria"];

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function normalizeChoice(
  value: string,
  allowedValues: string[],
  fallback: string
) {
  return allowedValues.includes(value) ? value : fallback;
}

function normalizeOrder(value: string) {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function buildContributionPayload(
  formData: FormData,
  adminId: string
) {
  const title = getString(formData, "titulo");
  const type = normalizeChoice(
    getString(formData, "tipo"),
    contributionTypes,
    "pix"
  );
  const category = normalizeChoice(
    getString(formData, "categoria"),
    contributionCategories,
    "oferta"
  );
  const pixKey = getString(formData, "chavePix");
  const legacyKey = getString(formData, "chave") || pixKey;
  const pixKeyType = normalizeChoice(
    getString(formData, "tipoChavePix"),
    pixKeyTypes,
    "email"
  );
  const active = formData.get("ativo") === "on";

  if (!title) {
    throw new Error("Título é obrigatório.");
  }

  if (
    active &&
    type === "pix" &&
    !pixKey &&
    !getString(formData, "pixCopiaCola")
  ) {
    throw new Error("Informe a chave PIX ou o PIX Copia e Cola.");
  }

  return {
    titulo: title,
    descricao: getString(formData, "descricao") || null,
    tipo: type,
    categoria: category,
    tipo_chave_pix: type === "pix" ? pixKeyType : null,
    chave: legacyKey || null,
    chave_pix: pixKey || null,
    pix_copia_cola: getString(formData, "pixCopiaCola") || null,
    favorecido: getString(formData, "favorecido") || null,
    instituicao: getString(formData, "instituicao") || null,
    instrucoes: getString(formData, "instrucoes") || null,
    ativo: active,
    ordem: normalizeOrder(getString(formData, "ordem")),
    updated_by: adminId,
  };
}

export async function createContributionMethodAction(
  formData: FormData
) {
  const admin = await requireAdminProfile(["Admin"]);
  const supabase = await createSupabaseCookieClient();
  const payload = buildContributionPayload(formData, admin.id);

  const { data, error } = await supabase
    .from("metodos_contribuicao")
    .insert(payload)
    .select("id,titulo")
    .single();

  if (error) {
    throw error;
  }

  await supabase.from("logs_auditoria").insert({
    usuario_id: admin.id,
    entidade_tipo: "metodos_contribuicao",
    entidade_id: data.id,
    acao: "CRIAR_METODO_CONTRIBUICAO",
    resumo: `Método criado: ${data.titulo}`,
  });

  revalidatePath("/admin/contribuicoes");
  revalidatePath("/contribua");
}

export async function updateContributionMethodAction(
  formData: FormData
) {
  const admin = await requireAdminProfile(["Admin"]);
  const contributionMethodId = getString(formData, "id");

  if (!contributionMethodId) {
    throw new Error("Método de contribuição não informado.");
  }

  const supabase = await createSupabaseCookieClient();
  const payload = buildContributionPayload(formData, admin.id);
  const { error } = await supabase
    .from("metodos_contribuicao")
    .update(payload)
    .eq("id", contributionMethodId);

  if (error) {
    throw error;
  }

  await supabase.from("logs_auditoria").insert({
    usuario_id: admin.id,
    entidade_tipo: "metodos_contribuicao",
    entidade_id: contributionMethodId,
    acao: "ATUALIZAR_METODO_CONTRIBUICAO",
    resumo: `Método atualizado: ${payload.titulo}`,
  });

  revalidatePath("/admin/contribuicoes");
  revalidatePath("/contribua");
}

export async function saveMainContributionMethodAction(
  formData: FormData
) {
  const admin = await requireAdminProfile(["Admin"]);
  const contributionMethodId = getString(formData, "id");
  const supabase = await createSupabaseCookieClient();
  const payload = buildContributionPayload(formData, admin.id);

  if (contributionMethodId) {
    const { error } = await supabase
      .from("metodos_contribuicao")
      .update(payload)
      .eq("id", contributionMethodId);

    if (error) {
      throw error;
    }

    await supabase
      .from("metodos_contribuicao")
      .update({ ativo: false, updated_by: admin.id })
      .neq("id", contributionMethodId);

    await supabase.from("logs_auditoria").insert({
      usuario_id: admin.id,
      entidade_tipo: "metodos_contribuicao",
      entidade_id: contributionMethodId,
      acao: "ATUALIZAR_CONTRIBUICAO_PRINCIPAL",
      resumo: `Configuração principal atualizada: ${payload.titulo}`,
    });
  } else {
    const { data, error } = await supabase
      .from("metodos_contribuicao")
      .insert(payload)
      .select("id,titulo")
      .single();

    if (error) {
      throw error;
    }

    await supabase
      .from("metodos_contribuicao")
      .update({ ativo: false, updated_by: admin.id })
      .neq("id", data.id);

    await supabase.from("logs_auditoria").insert({
      usuario_id: admin.id,
      entidade_tipo: "metodos_contribuicao",
      entidade_id: data.id,
      acao: "CRIAR_CONTRIBUICAO_PRINCIPAL",
      resumo: `Configuração principal criada: ${data.titulo}`,
    });
  }

  revalidatePath("/admin/contribuicoes");
  revalidatePath("/contribua");
}
