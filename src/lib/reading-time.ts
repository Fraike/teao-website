/**
 * Estimate reading time for an article based on word count.
 * Average reading speed: ~200 words per minute for English, ~400 chars/min for Chinese.
 */
export function getReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, "");
  // Count Chinese characters (each roughly one word unit)
  const chineseChars = (text.match(/[一-鿿]/g) || []).length;
  // Count English words
  const englishWords = text
    .replace(/[一-鿿]/g, "")
    .split(/\s+/)
    .filter(Boolean).length;

  // Chinese: ~400 chars/min, English: ~200 words/min
  const minutes = Math.ceil(chineseChars / 400 + englishWords / 200);
  return Math.max(1, minutes);
}

export function formatReadingTime(minutes: number): string {
  if (minutes === 1) return "1 min read";
  return `${minutes} min read`;
}
