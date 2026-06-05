# Swarms Cloud

**Build, deploy, and scale multi-agent systems for any application.**

Swarms Cloud is the operator console for the Swarms API — an enterprise-grade
control plane for designing, executing, and observing single agents, reasoning
agents, and multi-agent swarms across 17+ orchestration architectures. It pairs
a production-ready Rust agent runtime on the back end with a fast, themeable
Next.js front end on the desk.

---

## Overview

Swarms Cloud is the official browser-based console for the Swarms API. It
provides a single workspace for the full multi-agent lifecycle — agent
authoring, model selection, swarm composition, execution, telemetry,
rate-limit and credit monitoring, and cost forecasting.

The application is a Next.js 15 App Router project running on React 19 and
TypeScript 5.7, styled with TailwindCSS 3.4 and a semantic, token-driven
design system that supports light and dark themes out of the box.

## Capabilities

**Multi-agent orchestration**

- Author and persist agent configurations against the Swarms API
- Browse all 17+ supported swarm architectures from `/v1/swarms/available`
  (Hierarchical, Sequential, Concurrent, Mixture of Agents, Council as a
  Judge, Debate with Judge, Multi-Agent Router, Auto Swarm Builder, Heavy
  Swarm, Batched Grid Workflow, and more)
- Browse the live model catalog from `/v1/models/available` across GPT,
  Claude, Gemini, Llama, and other supported providers

**Operations and observability**

- Real-time rate-limit, tier, and limit-configuration dashboard
- API request log explorer backed by `/v1/swarm/logs` with search, pagination,
  and per-request input/output/usage breakdown
- Credit balance breakdown (paid, free, referral) with low-balance warnings

**Cost intelligence**

- Token-based pricing calculator covering unified pricing, agent cost, image,
  MCP, Exa search, web-scraper add-ons, the night-time discount, and Frenzy
  Mode

**UX**

- Command-palette nav search (Cmd+K / Ctrl+K) across every page
- Themeable: light, dark, and system, persisted client-side
- Fully responsive, with safe-area-aware layouts for notched devices

## Architecture

```
Browser  ──►  Next.js App Router (React 19, RSC + Client Components)
              │
              ├── /app/api/*          Server routes (Node runtime)
              │     ├── credits       24 h TTL, per-key in-memory cache
              │     ├── logs          30 s TTL, per-key in-memory cache
              │     ├── models        10 h TTL, per-key in-memory cache
              │     ├── swarms        10 h TTL, per-key in-memory cache
              │     ├── rate-limits   no cache
              │     └── agents/list   on-demand
              │
              └── lib/api/swarms-client.ts
                      │
                      ▼
              Swarms API (https://api.swarms.world)
              x-api-key header authentication
```

Every API route reads the Swarms API key from either the incoming
`x-api-key` header (when the user has provided one in Settings) or
`process.env.SWARMS_API_KEY` as a fallback. The key never reaches the
browser; the client speaks only to the Next.js routes.

State is managed with Zustand stores:

- `lib/store/ui-store.ts` — UI state, toasts, API key, theme
- `lib/store/agent-store.ts` — local agent metadata and execution history

## Prerequisites

- Node.js 18.18 or newer
- pnpm 9.x (the project pins `pnpm@9.12.2` via the `packageManager` field)
- A Swarms API key from
  [swarms.world/platform/api-keys](https://swarms.world/platform/api-keys)

## Installation

```bash
git clone <repository-url>
cd orchestrate
pnpm install
```

## Environment

Create `.env.local` at the project root and populate the variables you need.
None are strictly required at boot — the app will prompt for an API key on
first load if `SWARMS_API_KEY` is unset — but production deployments should
configure all of the relevant ones.

```dotenv
# Required at runtime if you want a default key (otherwise the user supplies it)
SWARMS_API_KEY=sk-...

# Override the Swarms API host (default: https://api.swarms.world)
SWARMS_API_BASE_URL=https://api.swarms.world

# Used for absolute canonical URLs in metadata, OpenGraph, Twitter, and sitemap
NEXT_PUBLIC_SITE_URL=https://cloud.swarms.ai

# Optional: Vercel sets this automatically; used as a fallback for canonical URLs
# NEXT_PUBLIC_VERCEL_URL is read automatically when present
```

The application reads `NEXT_PUBLIC_SITE_URL` first, falls back to
`NEXT_PUBLIC_VERCEL_URL`, and finally defaults to `https://swarms.ai` for SEO
metadata.

## Running locally

```bash
pnpm dev
```

The dev server boots on [http://localhost:3000](http://localhost:3000).

If `SWARMS_API_KEY` is unset, the `ApiKeyGate` component prompts for a key on
first load and persists it to local storage. The key is sent on every request
to `/api/*` via the `x-api-key` header.

## Project layout

```
orchestrate/
├── app/
│   ├── (root)/
│   │   ├── layout.tsx           Root layout, fonts, metadata, JSON-LD
│   │   ├── page.tsx             Dashboard
│   │   ├── globals.css          Tailwind layer + design tokens
│   │   ├── robots.ts            robots.txt generator
│   │   ├── sitemap.ts           sitemap.xml generator
│   │   ├── manifest.ts          PWA web manifest
│   │   ├── icon.svg             Favicon (Swarms logo)
│   │   └── apple-icon.svg       Apple touch icon
│   ├── agents/                  /v1/agents/list browser
│   ├── workbench/               Agent authoring
│   ├── playground/              Multi-agent swarm composer
│   ├── history/                 /v1/swarm/logs viewer
│   ├── models/                  /v1/models/available catalog
│   ├── swarms/                  /v1/swarms/available catalog
│   ├── pricing/                 Token pricing calculator
│   ├── settings/                API key + credits + appearance
│   └── api/
│       ├── agents/{route,list/route}.ts
│       ├── credits/route.ts     24 h cache
│       ├── logs/route.ts        30 s cache
│       ├── models/route.ts      10 h cache
│       ├── rate-limits/route.ts
│       └── swarms/route.ts      10 h cache
├── components/
│   ├── layout/                  Navbar, NavSearch, ThemeProvider/Switcher
│   ├── dashboard/                MetricsCard, RateLimitCard, CreditBalance
│   ├── agents/                   AgentTable, AgentStatusIndicator
│   ├── outputs/                  LogCard, ExecutionCard
│   ├── auth/                     ApiKeyGate
│   └── ui/                       Button, Card, Input, Modal, SearchBar, …
├── lib/
│   ├── api/swarms-client.ts     Typed client for every Swarms endpoint
│   ├── hooks/                   useCredits, useRateLimits, useSwarmLogs, …
│   ├── store/                   Zustand stores
│   └── seo.ts                   Central SEO config + metadata builder
├── public/
│   └── swarms-logo.svg
├── types/                       API and domain types
└── tailwind.config.ts
```

## Page reference

| Route          | Purpose                                                                          | Upstream                                            |
| -------------- | -------------------------------------------------------------------------------- | --------------------------------------------------- |
| `/`            | Dashboard with metrics, rate limits, and tier summary                            | `/v1/rate/limits`                                   |
| `/workbench`   | Build, configure, and run an individual agent                                    | `/v1/agent/completions`                             |
| `/agents`      | List agent configurations on the account                                         | `/v1/agents/list`                                   |
| `/history`     | API request log viewer, sortable and searchable                                  | `/v1/swarm/logs`                                    |
| `/models`      | Browse every available model                                                     | `/v1/models/available`                              |
| `/swarms`      | Catalog of every supported multi-agent architecture                              | `/v1/swarms/available`                              |
| `/playground`  | Compose multiple agents and run them as a swarm                                  | `/v1/swarm/completions`                             |
| `/pricing`     | Token + tool pricing calculator                                                  | Static                                              |
| `/settings`    | API key, credit balance, theme                                                   | `/v1/account/credits`                               |

## Server cache strategy

Each proxied endpoint uses an in-memory cache keyed by API key. All cached
routes accept `?refresh=1` to bypass the cache and emit `X-Cache: HIT|MISS`
and `X-Cache-Expires-In` response headers so the UI can surface freshness.

| Route              | TTL    | Cache headers                            |
| ------------------ | ------ | ---------------------------------------- |
| `/api/credits`     | 24 h   | `private, max-age=86400`                 |
| `/api/logs`        | 30 s   | `private, max-age=30`                    |
| `/api/models`      | 10 h   | `public, max-age=36000`                  |
| `/api/swarms`      | 10 h   | `private, max-age=36000`                 |
| `/api/rate-limits` | none   | (live)                                   |
| `/api/agents/list` | none   | (live)                                   |

The cache lives in process memory. On a multi-replica deployment each replica
maintains its own cache.

## API integration

`lib/api/swarms-client.ts` exposes a typed `SwarmsAPIClient` with one method
per endpoint:

```ts
const client = new SwarmsAPIClient(apiKey);
await client.executeAgent(config, task, options);
await client.executeBatch(requests);
await client.listAgentConfigs();
await client.getRateLimits();
await client.getCredits();
await client.getAvailableModels();
await client.getAvailableSwarmTypes();
await client.getSwarmLogs();
await client.checkHealth();
```

All methods normalize errors through a shared `parseError` / `toAPIError`
pipeline that surfaces friendly messages for 401, 403, and 429 responses.

Reference documentation:
[docs.swarms.ai](https://docs.swarms.ai).

## SEO and metadata

Site-wide metadata is centralized in `lib/seo.ts` and consumed by the root
layout and every per-route `layout.tsx`. The setup includes:

- Title template `%s — Swarms Cloud`
- Full OpenGraph and Twitter Card metadata with absolute URLs derived from
  `NEXT_PUBLIC_SITE_URL`
- `robots` directives including `googleBot` overrides
  (`max-image-preview: large`, `max-snippet: -1`)
- JSON-LD Organization and SoftwareApplication blocks injected in `<head>`
- `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts` (PWA), and SVG
  favicon + Apple touch icon

To localize the site URL, set `NEXT_PUBLIC_SITE_URL` before building.

## Theming

The theme is token-based. Every color flows through CSS variables defined in
`app/globals.css` and exposed to Tailwind via `tailwind.config.ts` using
`rgb(var(--token) / <alpha-value>)`, so opacity modifiers (e.g. `bg-card/50`)
work uniformly across light and dark modes.

- `--background`, `--foreground`, `--card`, `--subtle`, `--muted`
- `--border`, `--border-strong`, `--input`, `--ring`
- `--accent`, `--success`, `--warning`, `--danger`

The Theme Switcher writes `light`, `dark`, or `system` to local storage. A
small inline script in the root layout applies the resolved class before the
first paint to avoid the flash of incorrect theme.

## Scripts

```bash
pnpm dev          # Start the Next.js dev server
pnpm build        # Production build
pnpm start        # Run the production server (after build)
pnpm lint         # Run ESLint
pnpm type-check   # Run tsc --noEmit
```

## Production builds

```bash
pnpm build
pnpm start
```

The build emits a mix of statically prerendered routes (dashboard, agents,
models, swarms, pricing, history, settings, workbench) and dynamic routes
(`/playground`, all `/api/*`). Static assets and the build output live in
`.next/`.

## Troubleshooting

**`MODULE_NOT_FOUND` or `ENOENT` on chunk files in dev**

The dev server is reading stale `.next` artifacts left over from a previous
`pnpm build`. Stop `pnpm dev`, then:

```bash
rm -rf .next node_modules/.cache
pnpm dev
```

**`401 / 403` responses from `/api/*`**

The Swarms API key is missing, invalid, or lacks permission. Confirm
`SWARMS_API_KEY` in `.env.local` or update the key from Settings.

**Credits or models look stale**

Both endpoints cache aggressively (24 h and 10 h respectively). Click the
Refresh button on the page — the UI calls the route with `?refresh=1`, which
bypasses the cache.

**Build fails with `useSearchParams() should be wrapped in a suspense
boundary`**

The route reads `useSearchParams` at module scope. Either wrap the consumer
in `<Suspense>` or add `export const dynamic = 'force-dynamic'` to the
route's `layout.tsx` (as `/playground/layout.tsx` does).

## License

Licensed under the Apache License, Version 2.0. See [`LICENSE`](./LICENSE) for
the full text.

The Swarms API, brand, and trademarks are owned by The Swarm Corporation. Use
of the Swarms API is governed by [swarms.world](https://swarms.world)'s terms
of service.
