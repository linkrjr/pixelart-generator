"use client";

import { useState } from "react";
import Image from "next/image";
import { MAX_PROMPT_LENGTH, isValidPrompt } from "@/lib/prompt";

type Status = "idle" | "loading" | "done" | "error";

export function Generator() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [image, setImage] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState("");
  const [error, setError] = useState("");

  const canSubmit = isValidPrompt(prompt) && status !== "loading";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;

    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      setImage(data.image);
      setImagePrompt(prompt.trim());
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <div className="w-full max-w-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label
          htmlFor="prompt"
          className="text-sm font-medium tracking-wide text-muted uppercase"
        >
          Describe your image
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          maxLength={MAX_PROMPT_LENGTH}
          rows={3}
          placeholder="a knight standing on a hill at sunset"
          className="resize-none rounded-lg border border-black/10 bg-surface px-4 py-3 text-base text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">
            {prompt.trim().length}/{MAX_PROMPT_LENGTH}
          </span>
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-lg bg-secondary px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {status === "loading" ? "Generating..." : "Generate"}
          </button>
        </div>
      </form>

      <div className="mt-6 h-1 w-16 rounded-full bg-accent" />

      <div
        className="mt-6 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-surface"
        aria-live="polite"
      >
        {status === "loading" && (
          <p className="animate-pulse text-sm text-muted">Generating pixel art...</p>
        )}
        {status === "error" && (
          <p role="alert" className="px-6 text-center text-sm text-secondary">
            {error}
          </p>
        )}
        {status === "done" && image && (
          <Image
            src={image}
            alt={imagePrompt}
            width={512}
            height={512}
            unoptimized
            className="h-full w-full object-contain [image-rendering:pixelated]"
          />
        )}
        {status === "idle" && (
          <p className="px-6 text-center text-sm text-muted">
            Your generated image will appear here.
          </p>
        )}
      </div>
    </div>
  );
}
