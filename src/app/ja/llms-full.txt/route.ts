import { buildLocalizedLlmsFull } from "@/lib/localized-llms-full";

export const revalidate = 86400;

export async function GET() {
  const content = await buildLocalizedLlmsFull("ja");

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
