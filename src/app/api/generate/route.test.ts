import { afterEach, describe, expect, it, vi } from "vitest";

const generatePixelArt = vi.hoisted(() => vi.fn());
vi.mock("@/lib/image-generator", () => ({ generatePixelArt }));

import { POST } from "@/app/api/generate/route";

function post(body: unknown, raw?: string) {
  return new Request("http://localhost/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: raw ?? JSON.stringify(body),
  });
}

afterEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/generate", () => {
  it("returns the generated image for a valid prompt", async () => {
    generatePixelArt.mockResolvedValue("data:image/svg+xml;base64,abc");

    const res = await POST(post({ prompt: "a fox" }));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ image: "data:image/svg+xml;base64,abc" });
    expect(generatePixelArt).toHaveBeenCalledWith("a fox");
  });

  it("returns 400 for a missing prompt", async () => {
    const res = await POST(post({}));
    expect(res.status).toBe(400);
    expect(generatePixelArt).not.toHaveBeenCalled();
  });

  it("returns 400 for a blank prompt", async () => {
    const res = await POST(post({ prompt: "   " }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid JSON", async () => {
    const res = await POST(post(null, "{not json"));
    expect(res.status).toBe(400);
  });

  it("returns 500 when generation fails", async () => {
    generatePixelArt.mockRejectedValue(new Error("boom"));

    const res = await POST(post({ prompt: "a fox" }));

    expect(res.status).toBe(500);
    expect(await res.json()).toHaveProperty("error");
  });
});
