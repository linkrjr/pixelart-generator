# PixelArt Generator - MVP Plan

## Context

The repo started with only `CLAUDE.md`, specifying an MVP: a one-page Next.js web
app where a user types a text description and gets a generated pixel-art image
below the form. No persistence, no history, no search. Priority is a slick,
professional UI with a very small feature set.

**Deferred decision:** the real image-generation model/provider is still to be
defined. Image generation sits behind a single seam
(`src/lib/image-generator.ts`) with a working placeholder so the full UI and test
suite ship now. Swapping in a real model later is a localized change to that file
plus an env var.

## Tech choices

- Next.js (latest, App Router) + TypeScript, `src/` dir, `pnpm`
- Tailwind CSS (via `create-next-app`)
- Color tokens from `CLAUDE.md` as CSS custom properties / Tailwind theme
- Vitest + React Testing Library for unit tests
- Playwright for integration tests
- No emojis anywhere (README, code, UI, commits)

## Architecture

- `src/app/page.tsx` - server shell, renders `<Generator />`
- `src/app/layout.tsx` - fonts, metadata, global styles
- `src/app/globals.css` - Tailwind + color tokens
  (`--accent-yellow #ecad0a`, `--blue-primary #209dd7`,
  `--purple-secondary #753991`, `--dark-navy #032147`, `--gray-text #888888`)
- `src/components/generator.tsx` - client component: textarea, purple submit
  button, image panel with idle / loading / error / result states
- `src/app/api/generate/route.ts` - POST `{ prompt }` -> `{ image }`. Validates
  non-empty prompt (400), handles generation failure (500). Calls
  `generatePixelArt`.
- `src/lib/image-generator.ts` - `generatePixelArt(prompt): Promise<string>`.
  **Swap point.** Placeholder: deterministic hash of the prompt rendered as a
  blocky pixel-art SVG data URI, testable offline. Real model drops in here
  behind an `IMAGE_PROVIDER` env check without touching the route or UI.
- `src/lib/prompt.ts` - normalizes/decorates the user prompt; unit-tested.

## Phases and success criteria

### Phase 0 - Planning
- [x] `docs/plan.md` written with this checklist

### Phase 1 - Scaffolding
- [x] `create next-app` run (TypeScript, App Router, src dir, Tailwind, ESLint, `@/*` alias)
- [x] `git init`, `.gitignore` covers `node_modules`, `.next`, `.env*`, `coverage`, `playwright-report`, `test-results`
- [x] `.env.example` with placeholder for the future image-provider key
- [x] Minimal `README.md` (setup, dev, test commands only)
- [x] Vitest + RTL + Playwright installed and configured; `pnpm test`, `pnpm test:e2e`, `pnpm lint`, `pnpm build` scripts work
- [x] `pnpm build` and `pnpm lint` pass on the bare scaffold

### Phase 2 - Core implementation
- [x] Color tokens wired into Tailwind theme / globals
- [x] `src/lib/prompt.ts` implemented
- [x] `src/lib/image-generator.ts` placeholder implemented (deterministic SVG pixel grid)
- [x] `src/app/api/generate/route.ts` implemented with input validation and error handling
- [x] `src/components/generator.tsx` implemented: idle / loading / error / result states, disabled submit while empty or loading, keyboard submit
- [x] `src/app/page.tsx` + `layout.tsx` assembled into the single-page layout - clean, centered, generous whitespace, navy headings, purple primary action, yellow accent
- [x] Responsive down to mobile width
- [x] `pnpm build` and `pnpm lint` pass

### Phase 3 - Unit testing
- [x] `prompt.ts`: normalization/decoration cases
- [x] `image-generator.ts`: returns a valid data URI, deterministic for same prompt, differs across prompts
- [x] `api/generate/route.ts`: 200 on valid prompt, 400 on empty/missing prompt, 500 path when generator throws
- [x] `generator.tsx`: renders form; submit disabled when empty; shows loading then image on success; shows error message on failed request; image `alt` uses the prompt
- [x] All unit tests pass; meaningful coverage of `src/lib` and the route

### Phase 4 - Integration testing (Playwright)
- [x] Dev/preview server boots in the Playwright config
- [x] Happy path: load page -> type prompt -> submit -> image appears in panel
- [x] Validation: submit button inert with empty prompt
- [x] Error path: generation failure surfaces a visible error message
- [x] Basic a11y/layout assertions (heading present, form labelled, no horizontal scroll)
- [x] All e2e tests pass; fix any defects found

### Phase 5 - Handoff
- [x] `pnpm lint`, `pnpm build`, `pnpm test`, `pnpm test:e2e` all green
- [x] `docs/plan.md` checklist fully ticked
- [x] `pnpm dev` running and serving the app for the user
- [x] Short summary of what was built and where to plug in the real image model

## Verification

- `pnpm lint && pnpm build` - clean
- `pnpm test` - unit suite green
- `pnpm test:e2e` - Playwright suite green
- `pnpm dev`, open `http://localhost:3000`, enter "a small green dragon", confirm a
  pixel-art image renders below the form; confirm empty submit is blocked
- No emojis in README, code, UI, or commits
- All source under `src/`

## Notes / follow-ups

- Real image model deferred. When chosen: implement inside
  `src/lib/image-generator.ts` using the Vercel AI SDK `generateImage` through AI
  Gateway (needs `AI_GATEWAY_API_KEY` or a linked Vercel project via OIDC), gated
  by `IMAGE_PROVIDER`, keeping the placeholder as the default/offline path so
  tests stay hermetic.
- No persistence, history, or search - out of scope by requirement.
