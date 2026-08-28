import { buildImagePrompt } from "@/lib/prompt";

/**
 * Turns a text description into a pixel-art image, returned as a data URI.
 *
 * This is the single swap point for image generation. The default implementation
 * is an offline, deterministic placeholder so the app and its tests run with no
 * external dependencies. To use a real model, branch on `process.env.IMAGE_PROVIDER`
 * here and call it (e.g. the Vercel AI SDK `generateImage` through AI Gateway),
 * keeping this placeholder as the fallback.
 */
export async function generatePixelArt(prompt: string): Promise<string> {
  const decorated = buildImagePrompt(prompt);
  return renderPlaceholder(decorated);
}

const GRID = 16;
const CELL = 24;
const PALETTE = ["#209dd7", "#753991", "#ecad0a", "#032147"];
const BG = "#f2f4f7";

function renderPlaceholder(seed: string): string {
  const rand = mulberry32(hash(seed));
  const palette = shuffle(PALETTE, rand).slice(0, 3);
  const density = 0.32 + rand() * 0.18;

  let rects = "";
  const half = GRID / 2;
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < half; x++) {
      if (rand() > density) continue;
      const color = palette[Math.floor(rand() * palette.length)];
      const mx = GRID - 1 - x;
      rects += cell(x, y, color);
      rects += cell(mx, y, color);
    }
  }

  const size = GRID * CELL;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" ` +
    `viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges">` +
    `<rect width="${size}" height="${size}" fill="${BG}"/>` +
    rects +
    `</svg>`;

  return `data:image/svg+xml;base64,${toBase64(svg)}`;
}

function cell(x: number, y: number, color: string): string {
  return `<rect x="${x * CELL}" y="${y * CELL}" width="${CELL}" height="${CELL}" fill="${color}"/>`;
}

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: readonly T[], rand: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function toBase64(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "utf-8").toString("base64");
  }
  return btoa(unescape(encodeURIComponent(str)));
}
