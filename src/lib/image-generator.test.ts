import { describe, expect, it } from "vitest";
import { generatePixelArt } from "@/lib/image-generator";

function decode(dataUri: string): string {
  const base64 = dataUri.replace("data:image/svg+xml;base64,", "");
  return Buffer.from(base64, "base64").toString("utf-8");
}

describe("generatePixelArt", () => {
  it("returns an svg data URI", async () => {
    const result = await generatePixelArt("a wizard");
    expect(result.startsWith("data:image/svg+xml;base64,")).toBe(true);
    expect(decode(result)).toContain("<svg");
  });

  it("is deterministic for the same prompt", async () => {
    const a = await generatePixelArt("a wizard");
    const b = await generatePixelArt("a wizard");
    expect(a).toBe(b);
  });

  it("produces different output for different prompts", async () => {
    const a = await generatePixelArt("a wizard");
    const b = await generatePixelArt("a spaceship");
    expect(a).not.toBe(b);
  });

  it("ignores surrounding whitespace when seeding", async () => {
    const a = await generatePixelArt("a wizard");
    const b = await generatePixelArt("  a   wizard  ");
    expect(a).toBe(b);
  });
});
