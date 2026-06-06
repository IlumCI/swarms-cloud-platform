# Features

A backlog of features that would make Swarms Cloud meaningfully better as a
multi-agent operator console. Grouped by theme. Each row carries an honest
estimate of impact (how much it moves the product), effort (how long it takes
to build well), dependencies, and status against the current codebase.

Legend:

- **Impact**: `S` minor polish · `M` clear quality-of-life win · `L`
  capability-level upgrade · `XL` unlocks a new use case
- **Effort**: `S` < 1 day · `M` 1–3 days · `L` 1 week · `XL` multi-week
- **Status**: `idea` not started · `planned` agreed · `wip` in progress · `live`
  shipped

---

## Identity, accounts, and multi-user

| Feature                                   | What it adds                                                                                            | Impact | Effort | Depends on            | Status   |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------- | :----: | :----: | --------------------- | -------- |
| Supabase auth (email, password, OAuth)    | Sign in, gates the app, replaces the browser-cached API key with a per-user lookup.                     |   XL   |   L    | Existing Supabase DB  | planned  |
| Per-user persisted state                  | Agents, prompt history, settings persisted server-side instead of `localStorage`.                       |   L    |   M    | Auth                  | idea     |
| Team workspaces                           | Shared workspace with multiple seats; agents and runs scoped to the team.                               |   XL   |   XL   | Auth                  | idea     |
| Role-based access (admin/editor/viewer)   | Granular permissions on agents, runs, billing.                                                          |   L    |   L    | Team workspaces       | idea     |
| Audit log                                 | Append-only record of who did what (created agent, deleted run, rotated key) for SOC-2 readiness.       |   M    |   M    | Auth                  | idea     |
| SSO (Google Workspace, Okta, Microsoft)   | Enterprise sign-in via SAML / OIDC.                                                                     |   L    |   L    | Auth                  | idea     |
| SCIM provisioning                         | Automatic seat lifecycle for enterprise customers.                                                      |   M    |   L    | SSO                   | idea     |
| API key rotation UI                       | Generate, scope, and revoke keys from Settings without leaving the app.                                 |   M    |   M    | Auth                  | idea     |

## Building agents

| Feature                       | What it adds                                                                                             | Impact | Effort | Depends on        | Status |
| ----------------------------- | -------------------------------------------------------------------------------------------------------- | :----: | :----: | ----------------- | ------ |
| Agent versioning              | Every save creates a version; diff and roll back to any prior config.                                    |   L    |   M    | Per-user state    | idea   |
| Prompt diff viewer            | Side-by-side diff between versions of a system prompt.                                                   |   M    |   S    | Versioning        | idea   |
| Agent templates gallery       | Built-in starter agents (Researcher, Code Reviewer, Triage, Translator, etc.).                           |   L    |   M    | —                 | idea   |
| Multimodal input              | Upload images directly in Workbench and Playground; pass via `imgs`.                                     |   L    |   M    | —                 | idea   |
| Tool / MCP attachment UI      | Visual picker for MCP URLs, Exa search, web scraper, etc. instead of raw JSON.                           |   L    |   L    | —                 | idea   |
| Live streaming output         | Stream tokens to the UI via `stream: true` instead of waiting for the final result.                      |   L    |   M    | —                 | idea   |
| cURL / SDK snippet preview    | Show the exact request the workbench will send, in any SDK language.                                     |   M    |   S    | —                 | idea   |
| Context window visualizer     | Render the assembled context (system + history + tools) with a token budget bar.                        |   M    |   M    | —                 | idea   |
| Auto-prompt iteration         | Generate, evaluate, and refine prompts in a loop using the Prompt Architect agent.                       |   L    |   L    | Prompt generator  | idea   |

## Multi-agent / swarms

| Feature                                | What it adds                                                                                          | Impact | Effort | Depends on  | Status |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------- | :----: | :----: | ----------- | ------ |
| Visual swarm graph editor              | Drag-and-drop canvas for composing agents into a swarm topology, generates the API payload.           |   XL   |   XL   | —           | idea   |
| Swarm presets library                  | Save and share named swarm configurations (research panel, code-review trio, debate).                 |   L    |   M    | Per-user    | idea   |
| Step-by-step trace viewer              | Per-agent, per-turn timeline of a swarm run with inputs, outputs, and tool calls.                     |   L    |   L    | —           | idea   |
| Side-by-side run comparison            | Run the same task under multiple swarm types and compare outputs in one view.                         |   L    |   M    | —           | idea   |
| Council scoring overlay                | For CouncilAsAJudge / LLMCouncil, visualize each judge's verdict and reasoning.                       |   M    |   M    | —           | idea   |
| Auto-promote winner                    | For MixtureOfAgents, surface the aggregator's pick with a "why" panel.                                |   M    |   S    | —           | idea   |

## Observability and operations

| Feature                          | What it adds                                                                                       | Impact | Effort | Depends on                | Status |
| -------------------------------- | -------------------------------------------------------------------------------------------------- | :----: | :----: | ------------------------- | ------ |
| Latency & throughput dashboards  | p50 / p95 / p99 charts for the `/v1/*` endpoints over time.                                        |   L    |   M    | —                         | idea   |
| Per-agent / per-model cost split | Attribute spend across agents and models with sortable tables.                                     |   L    |   M    | History page              | idea   |
| Error rate breakdown             | Failures grouped by endpoint, model, status code, and time bucket.                                 |   M    |   M    | —                         | idea   |
| Distributed traces               | Per-run OpenTelemetry waterfalls for agent → tool → upstream call.                                 |   L    |   L    | Streaming output          | idea   |
| Webhook delivery                 | POST every completed run to a customer URL, with HMAC signing and retries.                         |   L    |   M    | —                         | idea   |
| Export logs                      | CSV / JSON / Parquet export of history with date-range and filter selectors.                       |   M    |   S    | —                         | idea   |
| Real-time activity feed          | Live stream of executions on the dashboard, similar to Vercel's deployment feed.                   |   M    |   M    | —                         | idea   |

## Cost and billing

| Feature                       | What it adds                                                                                | Impact | Effort | Depends on   | Status |
| ----------------------------- | ------------------------------------------------------------------------------------------- | :----: | :----: | ------------ | ------ |
| Budget alerts                 | Email / Slack notification when daily / weekly spend crosses a threshold.                   |   L    |   M    | Auth         | idea   |
| Auto-pause on budget overrun  | Hard cap that rejects new requests once spend exceeds limit.                                |   L    |   M    | Budget alerts | idea   |
| Spend forecasting             | Project month-end cost from current usage trend.                                            |   M    |   S    | History      | idea   |
| Model cost comparison         | Side-by-side per-1M-token costs for the catalog, with effective cost from your usage.        |   M    |   S    | Models page  | idea   |
| Project / team cost allocation| Tag runs with a project and report cost per tag.                                            |   L    |   M    | Workspaces   | idea   |
| Invoice & receipt download    | PDF / CSV of monthly spend per workspace.                                                   |   M    |   M    | Auth + Stripe| idea   |

## Developer experience

| Feature                            | What it adds                                                                          | Impact | Effort | Depends on  | Status |
| ---------------------------------- | ------------------------------------------------------------------------------------- | :----: | :----: | ----------- | ------ |
| Interactive API explorer           | Postman-style request builder for every Swarms endpoint with live execution.          |   L    |   L    | —           | idea   |
| SDK snippet generator              | Drop any agent or swarm config and get the equivalent Python / TS / Go / Java code.   |   M    |   M    | SDKs page   | idea   |
| Webhook tester                     | Inspect incoming webhooks during local development (forwarded with `cloudflared`).    |   M    |   M    | Webhooks    | idea   |
| OpenAPI download                   | One-click download of the live OpenAPI spec for use in Stainless / openapi-generator. |   S    |   S    | —           | idea   |
| Command palette commands           | Beyond navigation: "Run last agent", "Copy job ID", "Switch theme", etc.              |   M    |   M    | NavSearch   | idea   |
| Keyboard shortcuts panel           | Discoverable `?` overlay listing every shortcut.                                      |   S    |   S    | —           | idea   |
| CLI                                | `swarms-cli login`, `swarms-cli run agent.yaml` paired with the same backend.         |   L    |   L    | Auth        | idea   |

## Knowledge & RAG

| Feature                          | What it adds                                                                  | Impact | Effort | Depends on        | Status |
| -------------------------------- | ----------------------------------------------------------------------------- | :----: | :----: | ----------------- | ------ |
| Document upload + indexing       | Attach PDFs / markdown to an agent; embeddings stored server-side.            |   L    |   L    | Auth              | idea   |
| Vector store integration         | Bring-your-own pgvector / Pinecone / Qdrant.                                  |   L    |   L    | Document upload   | idea   |
| Per-agent knowledge base UI      | Manage and inspect what an agent "knows" without leaving the workbench.       |   M    |   M    | Document upload   | idea   |
| RAG query inspector              | For a given user message, show the retrieved chunks and similarity scores.    |   M    |   M    | RAG               | idea   |

## Scheduling and automation

| Feature                     | What it adds                                                                  | Impact | Effort | Depends on    | Status |
| --------------------------- | ----------------------------------------------------------------------------- | :----: | :----: | ------------- | ------ |
| Cron-scheduled agent runs   | Run any agent on a schedule (every 5 min, 9am daily, etc.).                   |   L    |   M    | Auth          | idea   |
| Event-driven triggers       | Webhooks, Slack mentions, GitHub events, file uploads as agent triggers.      |   L    |   L    | Webhooks      | idea   |
| Retry policies + DLQ        | Configurable retry/backoff with a dead-letter queue for poison messages.      |   M    |   M    | Scheduling    | idea   |
| Run re-execution            | Re-run any past execution with the original inputs from the History page.    |   M    |   S    | History       | idea   |

## Collaboration

| Feature                  | What it adds                                                                 | Impact | Effort | Depends on    | Status |
| ------------------------ | ---------------------------------------------------------------------------- | :----: | :----: | ------------- | ------ |
| Comments on runs / agents| Threaded comments tied to a specific run or config.                          |   M    |   M    | Auth          | idea   |
| Share read-only links    | Copy a URL that lets anyone view a run / agent without an account.           |   M    |   M    | Auth          | idea   |
| Forks of public agents   | Duplicate someone else's published agent into your workspace.                |   M    |   M    | Marketplace   | idea   |
| Slack / Discord integration | Post run results / alerts to channels.                                    |   M    |   M    | Webhooks      | idea   |
| Email digests            | Weekly summary of executions, spend, errors.                                 |   S    |   S    | Auth          | idea   |

## Marketplace

| Feature                         | What it adds                                                          | Impact | Effort | Depends on        | Status |
| ------------------------------- | --------------------------------------------------------------------- | :----: | :----: | ----------------- | ------ |
| Public agent gallery            | Browse community agents tagged by category and use case.              |   L    |   L    | Auth              | idea   |
| Publish-your-agent              | One-click publish of an agent config to the gallery.                  |   L    |   M    | Public gallery    | idea   |
| Ratings & reviews               | Lightweight feedback on published agents.                             |   M    |   M    | Public gallery    | idea   |
| Tokenized agents (ATP)          | Hook into Swarms' ATP / Solana settlement for usage-billed agents.    |   XL   |   XL   | Marketplace       | idea   |

## Security and compliance

| Feature                  | What it adds                                                            | Impact | Effort | Depends on  | Status |
| ------------------------ | ----------------------------------------------------------------------- | :----: | :----: | ----------- | ------ |
| IP allowlists            | Restrict API key usage to specific source IP ranges.                    |   M    |   M    | Auth        | idea   |
| Data residency selector  | Pin runs to a region (US / EU) for compliance.                          |   L    |   XL   | Backend     | idea   |
| PII redaction filter     | Mask emails, phone numbers, SSNs in stored logs by default.             |   L    |   M    | History     | idea   |
| Compliance reports       | Download a self-serve SOC-2 / HIPAA evidence pack.                      |   M    |   M    | Audit log   | idea   |
| Encryption-at-rest keys  | BYO KMS keys for at-rest encryption of stored prompts and outputs.      |   M    |   L    | Storage     | idea   |

## Onboarding and learning

| Feature                     | What it adds                                                              | Impact | Effort | Depends on   | Status |
| --------------------------- | ------------------------------------------------------------------------- | :----: | :----: | ------------ | ------ |
| Interactive tutorial        | Guided "run your first agent" overlay on first sign-in.                   |   M    |   M    | Auth         | idea   |
| Example library             | Curated example payloads for every endpoint, runnable in one click.       |   M    |   S    | API explorer | idea   |
| Templates on first-run      | Pick a starter agent or swarm to populate the workbench.                  |   M    |   S    | Templates    | idea   |
| In-app changelog            | Whatsnew feed pinned to the navbar bell icon.                             |   S    |   S    | —            | idea   |
| Inline doc tooltips         | Hover any field in the workbench for a one-line description and a link.   |   S    |   S    | —            | idea   |

## UX polish

| Feature                       | What it adds                                                                  | Impact | Effort | Depends on    | Status |
| ----------------------------- | ----------------------------------------------------------------------------- | :----: | :----: | ------------- | ------ |
| Recently visited apps         | Surfaced on the Apps directory and ⌘K.                                        |   S    |   S    | —             | idea   |
| Pinned / favorited apps       | User can pin frequently used apps to the top of the directory and the nav.    |   M    |   S    | Per-user      | idea   |
| Workspace switcher            | Combobox in the navbar to switch active workspace.                            |   M    |   M    | Workspaces    | idea   |
| Notifications center          | Inbox-style feed with run completions, budget alerts, comments.               |   M    |   M    | Auth          | idea   |
| Mobile-first layout audit     | Tighten dense tables, add bottom-sheet patterns, fix safe-area edges.         |   M    |   M    | —             | idea   |
| Accessibility audit           | Full axe-core pass, semantic landmarks, focus order, contrast.                |   M    |   M    | —             | idea   |
| Theme variants                | Brand-red accent toggle in addition to system blue accent.                    |   S    |   S    | —             | idea   |

---

## Suggested next four

If we shipped these in order, the platform would feel significantly more
capable inside a month:

1. **Supabase auth + per-user persisted state** — unlocks every other row in
   this document.
2. **Live streaming output in Workbench & Playground** — turns the workbench
   from a request-builder into a usable IDE.
3. **Cron-scheduled agent runs** — converts Swarms Cloud from a console into
   an automation surface; pairs with webhooks.
4. **Visual swarm graph editor** — the single biggest visual upgrade and the
   most compelling demo asset.
