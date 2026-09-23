import {
  createServerClient,
  type CookieOptions,
} from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

import { SupabaseConfigError } from "@/lib/supabase/server";

interface CookieToSet {
  name: string;
  value: string;
  options: CookieOptions;
}

function createRedirectResponse(
  request: NextRequest,
  pathname: string,
  cookiesToSet: CookieToSet[],
  responseHeaders: Record<string, string>
) {
  const response = NextResponse.redirect(
    new URL(pathname, request.url),
    {
      headers: responseHeaders,
    }
  );

  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  return response;
}

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new SupabaseConfigError();
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
  };
}

export async function POST(request: NextRequest) {
  const cookiesToSet: CookieToSet[] = [];
  const responseHeaders: Record<string, string> = {};

  let email = "";
  let password = "";

  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const body = (await request.json()) as {
        email?: unknown;
        password?: unknown;
      };

      email =
        typeof body.email === "string" ? body.email.trim() : "";
      password =
        typeof body.password === "string" ? body.password : "";
    } else {
      const formData = await request.formData();
      const formEmail = formData.get("email");
      const formPassword = formData.get("password");

      email =
        typeof formEmail === "string"
          ? formEmail.trim()
          : "";
      password =
        typeof formPassword === "string"
          ? formPassword
          : "";
    }
  } catch {
    return createRedirectResponse(
      request,
      "/login?erro=dados",
      cookiesToSet,
      responseHeaders
    );
  }

  if (!email || !password) {
    return createRedirectResponse(
      request,
      "/login?erro=campos",
      cookiesToSet,
      responseHeaders
    );
  }

  try {
    const { supabaseUrl, supabaseAnonKey } =
      getSupabaseConfig();

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(newCookies, headers) {
            cookiesToSet.push(...newCookies);
            Object.assign(responseHeaders, headers);
          },
        },
      }
    );

    const {
      data: { user },
      error: signInError,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !user) {
      return createRedirectResponse(
        request,
        "/login?erro=credenciais",
        cookiesToSet,
        responseHeaders
      );
    }

    const { data: profiles, error: profilesError } =
      await supabase
        .from("usuarios_perfis")
        .select("perfis!inner(nome)")
        .eq("usuario_id", user.id);

    if (profilesError || !profiles || profiles.length === 0) {
      await supabase.auth.signOut();

      return createRedirectResponse(
        request,
        "/login?erro=perfil",
        cookiesToSet,
        responseHeaders
      );
    }

    return createRedirectResponse(
      request,
      "/admin",
      cookiesToSet,
      responseHeaders
    );
  } catch (error) {
    if (error instanceof SupabaseConfigError) {
      return createRedirectResponse(
        request,
        "/login?erro=config",
        cookiesToSet,
        responseHeaders
      );
    }

    console.error("Erro ao autenticar usuário administrativo.", {
      name:
        error instanceof Error
          ? error.name
          : "UnknownError",
    });

    return createRedirectResponse(
      request,
      "/login?erro=servidor",
      cookiesToSet,
      responseHeaders
    );
  }
}
