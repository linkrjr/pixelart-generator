const STYLE_SUFFIX =
  "pixel art, 16-bit, crisp pixels, limited palette, no anti-aliasing";

export const MAX_PROMPT_LENGTH = 300;

/** Collapse whitespace and trim. Returns "" for anything blank. */
export function normalizePrompt(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

export function isValidPrompt(input: string): boolean {
  const normalized = normalizePrompt(input);
  return normalized.length > 0 && normalized.length <= MAX_PROMPT_LENGTH;
}

/** Normalized user prompt decorated with pixel-art styling terms. */
export function buildImagePrompt(input: string): string {
  return `${normalizePrompt(input)}, ${STYLE_SUFFIX}`;
}
