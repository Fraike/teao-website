import { env } from "@/lib/env";
import type { Locale } from "@/lib/i18n";
import { LOCALE_NAMES } from "@/lib/i18n";

export class TranslationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TranslationError";
  }
}

const TERM_GUIDE = `
Brand and product names:
- Keep TEAO unchanged.
- Keep product models unchanged, for example RD-T015, RD-V109, RD-T013B.
- Keep URLs, href values, image paths, file paths, units and numbers unchanged.
- Keep HTML tags and attributes unchanged.
- Keep units unchanged: gf.cm, kgf.cm, N.m, N·m, N, mm, °C, cycles.

Terminology:
- gear damper / rotary damper: Japanese ギアダンパー / ロータリーダンパー; German Zahnrad-Dämpfer / Rotationsdämpfer.
- axial damper / barrel damper: Japanese アキシャルダンパー / バレルダンパー; German Axialdämpfer / Barrel-Dämpfer.
- glove box damper: Japanese グローブボックスダンパー; German Handschuhfachdämpfer.
- automotive interior damper: Japanese 自動車内装用ダンパー; German Dämpfer für Fahrzeuginnenraum.
- soft close / soft motion: translate naturally for engineering and procurement readers.
`;

function getTranslationConfig() {
  if (env.TRANSLATION_PROVIDER === "deepseek") {
    return {
      providerName: "DeepSeek",
      apiKey: env.DEEPSEEK_API_KEY,
      baseUrl: env.TRANSLATION_API_BASE_URL || "https://api.deepseek.com",
      model: env.TRANSLATION_MODEL || "deepseek-v4-flash",
    };
  }

  return {
    providerName: "OpenAI",
    apiKey: env.OPENAI_API_KEY,
    baseUrl: env.TRANSLATION_API_BASE_URL || "https://api.openai.com/v1",
    model: env.TRANSLATION_MODEL || "gpt-4.1-mini",
  };
}

function extractJson(text: string) {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) return trimmed;
  const match = trimmed.match(/\{[\s\S]*\}/);
  if (!match) throw new TranslationError("Translation response did not contain JSON.");
  return match[0];
}

export async function translateJsonObject<T extends Record<string, unknown>>(
  input: T,
  locale: Locale,
): Promise<T> {
  const config = getTranslationConfig();
  if (!config.apiKey) {
    const keyName = env.TRANSLATION_PROVIDER === "deepseek" ? "DEEPSEEK_API_KEY" : "OPENAI_API_KEY";
    throw new TranslationError(`${keyName} is not configured.`);
  }

  const targetLanguage = LOCALE_NAMES[locale];
  const response = await fetch(`${config.baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            `You are a professional technical translator for an international B2B damper manufacturer. Translate JSON string values into ${targetLanguage}. Return only valid JSON with the same keys and data shape. Keep arrays as arrays. Do not add commentary.\n\n${TERM_GUIDE}`,
        },
        {
          role: "user",
          content: JSON.stringify(input),
        },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new TranslationError(`${config.providerName} translation failed: ${response.status} ${detail.slice(0, 300)}`);
  }

  const data = await response.json() as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new TranslationError(`${config.providerName} translation returned an empty response.`);

  return JSON.parse(extractJson(content)) as T;
}
