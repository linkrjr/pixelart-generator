# PixelArt Generator

One-page web app: describe an image, get pixel art back.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS. Source lives in `src/`.

## Develop

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Test

```bash
pnpm test        # unit tests (Vitest)
pnpm test:e2e    # integration tests (Playwright)
pnpm lint
pnpm typecheck
```

## Image generation

Image generation is isolated in `src/lib/image-generator.ts`. The default is an
offline, deterministic placeholder so the app runs with no external services. To
wire a real model, implement it there behind the `IMAGE_PROVIDER` env var (see
`.env.example`).
