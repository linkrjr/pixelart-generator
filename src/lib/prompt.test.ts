import { describe, expect, it } from "vitest";
import {
  MAX_PROMPT_LENGTH,
  buildImagePrompt,
  isValidPrompt,
  normalizePrompt,
} from "@/lib/prompt";

describe("normalizePrompt", () => {
  it("collapses whitespace and trims", () => {
    expect(normalizePrompt("  a   red \n dragon  ")).toBe("a red dragon");
  });

  it("returns empty string for blank input", () => {
    expect(normalizePrompt("   \n\t ")).toBe("");
  });
});

describe("isValidPrompt", () => {
  it("accepts a normal prompt", () => {
    expect(isValidPrompt("a castle")).toBe(true);
  });

  it("rejects blank input", () => {
    expect(isValidPrompt("   ")).toBe(false);
  });

  it("rejects input longer than the limit", () => {
    expect(isValidPrompt("x".repeat(MAX_PROMPT_LENGTH + 1))).toBe(false);
  });
});

describe("buildImagePrompt", () => {
  it("normalizes and appends pixel-art styling terms", () => {
    const result = buildImagePrompt("  a  green  slime ");
    expect(result).toMatch(/^a green slime, /);
    expect(result).toContain("pixel art");
  });
});
