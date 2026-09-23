import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function isConfigured(value: string | undefined) {
  return Boolean(value && value.trim());
}

export function GET() {
  const supabaseConfigured =
    isConfigured(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    isConfigured(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const groqConfigured = isConfigured(process.env.GROQ_API_KEY);
  const serviceRoleConfigured = isConfigured(
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const ready =
    supabaseConfigured && groqConfigured && serviceRoleConfigured;

  return NextResponse.json(
    {
      status: ready ? "ok" : "degraded",
      checks: {
        supabase: supabaseConfigured ? "configured" : "missing",
        groq: groqConfigured ? "configured" : "missing",
        serviceRole: serviceRoleConfigured
          ? "configured"
          : "missing",
      },
      timestamp: new Date().toISOString(),
    },
    {
      status: ready ? 200 : 503,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
