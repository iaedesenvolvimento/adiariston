import { cache } from "react";
import { redirect } from "next/navigation";

import { createSupabaseCookieClient } from "@/lib/supabase/server";
import {
  AdminProfile,
  adminProfileValues,
  AuthenticatedAdmin,
} from "@/types/auth";

interface UserProfileRow {
  usuarios:
    | {
        id: string;
        email: string;
        nome: string | null;
        ativo: boolean;
      }
    | {
        id: string;
        email: string;
        nome: string | null;
        ativo: boolean;
      }[]
    | null;
  perfis:
    | {
        nome: AdminProfile;
      }
    | {
        nome: AdminProfile;
      }[]
    | null;
}

interface UserData {
  id: string;
  email: string;
  nome: string | null;
  ativo: boolean;
}

function firstValue<T>(value: T | T[] | null) {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}

function normalizeUserProfileRow(
  row: UserProfileRow
) {
  return {
    usuario: firstValue(row.usuarios) as UserData | null,
    perfil: firstValue(row.perfis),
  };
}

interface SupabaseUserProfileRow {
  usuarios:
    | {
        id: string;
        email: string;
        nome: string | null;
        ativo: boolean;
      }
    | {
        id: string;
        email: string;
        nome: string | null;
        ativo: boolean;
      }[]
    | null;
  perfis:
    | {
        nome: AdminProfile;
      }
    | {
        nome: AdminProfile;
      }[]
    | null;
}

function isAdminProfile(value: string): value is AdminProfile {
  return adminProfileValues.includes(value as AdminProfile);
}

export const getCurrentAdmin = cache(async () => {
  const supabase = await createSupabaseCookieClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user) {
    if (userError) {
      console.warn("[admin-auth] Sessão ausente ou inválida.", {
        errorName: userError.name,
      });
    }
    return null;
  }

  const { data, error } = await supabase
    .from("usuarios_perfis")
    .select(
      "usuarios!usuarios_perfis_usuario_id_fkey!inner(id,email,nome,ativo),perfis!inner(nome)"
    )
    .eq("usuario_id", user.id);

  if (error || !data || data.length === 0) {
    console.warn("[admin-auth] Perfis não encontrados.", {
      errorCode: error?.code,
      rows: data?.length ?? 0,
    });
    return null;
  }

  const rows = (data as unknown as SupabaseUserProfileRow[]).map(
    (row) => normalizeUserProfileRow(row)
  );
  const userData = rows[0]?.usuario;

  if (!userData || !userData.ativo) {
    console.warn("[admin-auth] Usuário interno ausente ou inativo.", {
      hasUserData: Boolean(userData),
      active: userData?.ativo,
    });
    return null;
  }

  const profiles = rows
    .map((row) => row.perfil?.nome)
    .filter((profile): profile is AdminProfile => {
      return Boolean(profile && isAdminProfile(profile));
    });

  if (profiles.length === 0) {
    console.warn("[admin-auth] Usuário sem perfis válidos.");
    return null;
  }

  return {
    id: userData.id,
    email: userData.email,
    name: userData.nome,
    profiles,
  } satisfies AuthenticatedAdmin;
});

export async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    console.warn(
      "[admin-auth] Acesso negado. Redirecionando para /login."
    );
    redirect("/login");
  }

  return admin;
}

export async function requireAdminProfile(
  allowedProfiles: AdminProfile[]
) {
  const admin = await requireAdmin();
  const canAccess = admin.profiles.some((profile) =>
    allowedProfiles.includes(profile)
  );

  if (!canAccess) {
    redirect("/admin");
  }

  return admin;
}
