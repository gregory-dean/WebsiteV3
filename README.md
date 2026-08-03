# Gregory Dean — Portfolio

Personal portfolio for Gregory Dean, a cybersecurity practitioner.

## Features

- **Particle morph hero** — Three.js / R3F point cloud sampled from branding + security-tool banners (name, PowerShell/Kali/Linux/Git stack, SOC tooling)
- **Scrolling skills rows** — Marquee lanes of tools and frameworks inside a bordered panel matching the site chrome
- **Work & projects** — Experience + GitHub projects with visit / read-story actions
- **Writing & labs** — MDX writeups under `content/writing/`
- Soft blur entrance motion (Motion) and optional Cuelume interaction sounds

## Develop

```bash
cd portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Add a writeup

Create `content/writing/your-slug.mdx`:

```mdx
---
title: Your title
summary: One-line summary
date: 2026-08-02
kind: writeup
tags:
  - Detection
---

Body in MDX…
```

## Stack

Next.js · Tailwind CSS · Motion · Three.js · React Three Fiber · MDX · Cuelume · Geist
