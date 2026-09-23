"use server";

import { redirect } from "next/navigation";

import { createSupabaseCookieClient } from "@/lib/supabase/server";

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function loginAction(formData: FormData) {
  const email = getFormString(formData, "email");
  const passwordValue = formData.get("password");
  const password =
    typeof passwordValue === "string" ? passwordValue : "";

  if (!email || !password) {
    redirect("/login?erro=campos");
  }

  const supabase = await createSupabaseCookieClient();

  const {
    data: { user },
    error: signInError,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError || !user) {
    redirect("/login?erro=credenciais");
  }

  const { data: profiles, error: profilesError } =
    await supabase
      .from("usuarios_perfis")
      .select("perfis!inner(nome)")
      .eq("usuario_id", user.id);

  if (profilesError || !profiles || profiles.length === 0) {
    console.warn("[admin-login] Perfil administrativo não validado.", {
      errorCode: profilesError?.code,
      rows: profiles?.length ?? 0,
    });
    await supabase.auth.signOut();
    redirect("/login?erro=perfil");
  }

  redirect("/admin");
}
