import {
  prayerCategoryValues,
  type NormalizedPrayerInput,
  type PrayerCategory,
} from "@/types/prayers";

const groqChatCompletionsUrl =
  "https://api.groq.com/openai/v1/chat/completions";
const defaultGroqModel = "openai/gpt-oss-20b";

export type PrayerAiAnalysisResult =
  | {
      ok: true;
      category: PrayerCategory;
      welcomeMessage: string;
      requiresHumanAttention: boolean;
    }
  | {
      ok: false;
      reason: string;
    };

interface GroqChatCompletionResponse {
  choices?: {
    message?: {
      content?: string | null;
    };
  }[];
}

interface PrayerAiPayload {
  categoria_sugerida?: unknown;
  mensagem_acolhimento?: unknown;
  requer_atencao_humana?: unknown;
}

function normalizeAiError(error: unknown) {
  if (error instanceof Error) {
    return error.message.slice(0, 300);
  }

  return "Falha desconhecida ao processar IA.";
}

function isPrayerCategory(value: unknown): value is PrayerCategory {
  return (
    typeof value === "string" &&
    prayerCategoryValues.includes(value as PrayerCategory)
  );
}

function normalizeWelcomeMessage(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const message = value.trim();

  if (message.length < 10 || message.length > 500) {
    return null;
  }

  return message;
}

function parsePrayerAiPayload(
  content: string
): PrayerAiAnalysisResult {
  let parsed: PrayerAiPayload;

  try {
    parsed = JSON.parse(content) as PrayerAiPayload;
  } catch {
    return {
      ok: false,
      reason: "Resposta da IA não estava em JSON válido.",
    };
  }

  const welcomeMessage = normalizeWelcomeMessage(
    parsed.mensagem_acolhimento
  );

  if (
    !isPrayerCategory(parsed.categoria_sugerida) ||
    !welcomeMessage ||
    typeof parsed.requer_atencao_humana !== "boolean"
  ) {
    return {
      ok: false,
      reason: "Resposta da IA não respeitou o contrato esperado.",
    };
  }

  return {
    ok: true,
    category: parsed.categoria_sugerida,
    welcomeMessage,
    requiresHumanAttention: parsed.requer_atencao_humana,
  };
}

export async function analyzePrayerWithGroq(
  input: NormalizedPrayerInput
): Promise<PrayerAiAnalysisResult> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      reason: "GROQ_API_KEY não configurada.",
    };
  }

  try {
    const response = await fetch(groqChatCompletionsUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || defaultGroqModel,
        temperature: 0.2,
        max_completion_tokens: 500,
        include_reasoning: false,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "triagem_pedido_oracao",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                categoria_sugerida: {
                  type: "string",
                  enum: prayerCategoryValues,
                },
                mensagem_acolhimento: {
                  type: "string",
                  minLength: 10,
                  maxLength: 500,
                },
                requer_atencao_humana: {
                  type: "boolean",
                },
              },
              required: [
                "categoria_sugerida",
                "mensagem_acolhimento",
                "requer_atencao_humana",
              ],
            },
          },
        },
        messages: [
          {
            role: "system",
            content:
              "Você apoia uma equipe pastoral brasileira. Responda somente JSON. Classifique pedidos de oração com cuidado, sem dar diagnóstico médico, jurídico ou financeiro. A mensagem de acolhimento deve ser uma oração curta, pastoral, respeitosa, em português do Brasil, direcionada à necessidade do pedido e coerente com a categoria sugerida. Não prometa cura, solução garantida ou revelação divina. Marque requer_atencao_humana como true quando houver risco, luto intenso, violência, abuso, ideação suicida, urgência médica, crise familiar grave ou necessidade clara de acompanhamento pastoral humano.",
          },
          {
            role: "user",
            content: JSON.stringify({
              pedido: input.request,
              visibilidade: input.visibility,
            }),
          },
        ],
      }),
    });

    if (!response.ok) {
      return {
        ok: false,
        reason: `Groq retornou HTTP ${response.status}.`,
      };
    }

    const completion =
      (await response.json()) as GroqChatCompletionResponse;
    const content =
      completion.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return {
        ok: false,
        reason: "Groq não retornou conteúdo analisável.",
      };
    }

    return parsePrayerAiPayload(content);
  } catch (error) {
    return {
      ok: false,
      reason: normalizeAiError(error),
    };
  }
}
