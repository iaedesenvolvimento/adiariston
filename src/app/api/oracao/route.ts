import { NextRequest } from "next/server";

import { SupabaseConfigError } from "@/lib/supabase/server";
import { validatePrayerInput } from "@/services/prayerValidation";
import {
  createPrayerRequest,
  processPrayerAiSupport,
} from "@/services/prayers";
import type { CreatePrayerResult } from "@/types/prayers";

export const runtime = "nodejs";

const rateLimitWindowMs = 10 * 60 * 1000;
const maxRequestsPerWindow = 5;
const submissionsByIp = new Map<
  string,
  { count: number; resetAt: number }
>();

function json(
  body: CreatePrayerResult,
  init?: ResponseInit
) {
  return Response.json(body, init);
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(identifier: string) {
  const now = Date.now();
  const current = submissionsByIp.get(identifier);

  if (!current || current.resetAt <= now) {
    submissionsByIp.set(identifier, {
      count: 1,
      resetAt: now + rateLimitWindowMs,
    });

    return false;
  }

  if (current.count >= maxRequestsPerWindow) {
    return true;
  }

  current.count += 1;
  return false;
}

export async function POST(request: NextRequest) {
  if (isRateLimited(getClientIp(request))) {
    return json(
      {
        ok: false,
        message:
          "Recebemos muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.",
      },
      { status: 429 }
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return json(
      {
        ok: false,
        message: "Não foi possível ler os dados enviados.",
      },
      { status: 400 }
    );
  }

  const validation = validatePrayerInput(payload);

  if (!validation.ok) {
    return json(
      {
        ok: false,
        message: "Revise os campos destacados.",
        fieldErrors: validation.fieldErrors,
      },
      { status: 400 }
    );
  }

  try {
    await createPrayerRequest(validation.data);
    const aiSupport = await processPrayerAiSupport(
      validation.data
    );

    return json({
      ok: true,
      ...(aiSupport ? { aiSupport } : {}),
    });
  } catch (error) {
    if (error instanceof SupabaseConfigError) {
      return json(
        {
          ok: false,
          message:
            "O envio de pedidos ainda não está disponível porque o Supabase não foi configurado.",
        },
        { status: 503 }
      );
    }

    console.error("Erro ao cadastrar pedido de oração.", {
      name:
        error instanceof Error
          ? error.name
          : "UnknownError",
    });

    return json(
      {
        ok: false,
        message:
          "Não foi possível concluir o envio agora. Tente novamente em alguns minutos.",
      },
      { status: 500 }
    );
  }
}
