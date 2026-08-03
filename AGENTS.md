# AGENTS.md

## Cursor Cloud specific instructions

This repo is a single **Next.js 16 (App Router) static portfolio site** (Gregory Dean portfolio). TypeScript, React 19, Tailwind CSS 4, Three.js/R3F hero, MDX writeups under `content/writing/`. Package manager is **npm** (`package-lock.json`); Node 22 (matches CI). There is no backend, database, or external service — everything is filesystem-based and statically exported (`output: "export"` in `next.config.ts`).

Dependencies are refreshed automatically by the startup update script (`npm install`), so you normally don't need to install anything manually.

Standard commands (see `package.json` / `README.md`):
- Dev server: `npm run dev` → http://localhost:3000 (primary way to develop/test).
- Build (static export to `out/`): `npm run build`.
- Lint: `npm run lint`.

Non-obvious notes:
- `npm run lint` currently exits non-zero due to **pre-existing** `react-hooks` lint errors in `src/components/ParticleScene.tsx` and `src/components/SocialLinks.tsx`. These are unrelated to environment setup; a clean lint run is not expected until that code is fixed.
- `npm run build` succeeds and prerenders all pages (`/`, `/writing`, `/writing/[slug]`) despite the lint errors — Next build does not fail on those.
- Writing articles are MDX files in `content/writing/*.mdx`; adding/editing one there makes it appear on `/writing` (frontmatter format documented in `README.md`).
- The theme toggle (mono ↔ green "signal") is the last icon in the social links row and persists via `localStorage`.
- The README says `cd portfolio` before `npm install`, but the app actually lives at the repo root — ignore the `cd portfolio` step.
