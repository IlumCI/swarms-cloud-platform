'use client';

import React, { useMemo, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import {
  Calculator,
  Coins,
  Moon,
  Sparkles,
  Users,
  Image as ImageIcon,
  Plug,
  Search,
  Globe,
  Info,
} from 'lucide-react';

const PRICING = {
  inputPer1M: 6.5,
  outputPer1M: 18.5,
  agentCost: 0.01,
  imageCost: 0.25,
  mcpCost: 0.1,
  exaSearchCost: 0.04,
  webScraperCost: 0.15,
  nightDiscount: 0.5,
} as const;

type Endpoint =
  | 'swarm'
  | 'agent'
  | 'research'
  | 'auto_swarm'
  | 'graph'
  | 'batched_grid';

const ENDPOINTS: { id: Endpoint; label: string; agentCostApplies: boolean }[] = [
  { id: 'swarm', label: 'Swarm Completions', agentCostApplies: true },
  { id: 'agent', label: 'Agent Completions', agentCostApplies: false },
  { id: 'research', label: 'Advanced Research', agentCostApplies: false },
  { id: 'auto_swarm', label: 'Auto Swarm Builder', agentCostApplies: false },
  { id: 'graph', label: 'Graph Workflow', agentCostApplies: true },
  { id: 'batched_grid', label: 'Batched Grid Workflow', agentCostApplies: true },
];

export default function PricingCalculatorPage() {
  const [endpoint, setEndpoint] = useState<Endpoint>('swarm');
  const [inputTokens, setInputTokens] = useState<number>(10_000);
  const [outputTokens, setOutputTokens] = useState<number>(2_000);
  const [agents, setAgents] = useState<number>(1);
  const [requests, setRequests] = useState<number>(1);
  const [images, setImages] = useState<number>(0);
  const [mcpCalls, setMcpCalls] = useState<number>(0);
  const [exaSearches, setExaSearches] = useState<number>(0);
  const [webScrapes, setWebScrapes] = useState<number>(0);
  const [nightMode, setNightMode] = useState(false);
  const [frenzyMode, setFrenzyMode] = useState(false);

  const selectedEndpoint = ENDPOINTS.find((e) => e.id === endpoint)!;
  const agentCostApplies = selectedEndpoint.agentCostApplies;
  const nightDiscountApplies = endpoint === 'swarm' && nightMode;

  const calc = useMemo(() => {
    const tokenInputBase = (inputTokens / 1_000_000) * PRICING.inputPer1M;
    const tokenOutputBase = (outputTokens / 1_000_000) * PRICING.outputPer1M;
    const tokensBase = tokenInputBase + tokenOutputBase;
    const tokensDiscounted = nightDiscountApplies
      ? tokensBase * (1 - PRICING.nightDiscount)
      : tokensBase;

    const agentCost = agentCostApplies ? agents * PRICING.agentCost : 0;
    const imageCost = images * PRICING.imageCost;
    const mcpCost = mcpCalls * PRICING.mcpCost;
    const exaCost = exaSearches * PRICING.exaSearchCost;
    const scraperCost = webScrapes * PRICING.webScraperCost;

    const perRequest =
      tokensDiscounted + agentCost + imageCost + mcpCost + exaCost + scraperCost;

    const total = frenzyMode ? 0 : perRequest * Math.max(0, requests);

    return {
      tokenInputBase,
      tokenOutputBase,
      tokensBase,
      tokensDiscounted,
      agentCost,
      imageCost,
      mcpCost,
      exaCost,
      scraperCost,
      perRequest,
      total,
    };
  }, [
    inputTokens,
    outputTokens,
    agents,
    requests,
    images,
    mcpCalls,
    exaSearches,
    webScrapes,
    nightDiscountApplies,
    agentCostApplies,
    frenzyMode,
  ]);

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="page-main px-4 sm:px-6 lg:px-8 py-6 lg:py-8 box-border">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col gap-1 mb-6">
            <p className="text-xs text-muted-foreground">Tools</p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Pricing calculator
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Estimate Swarms API costs by tokens, agents, and tool usage. Pricing
              uses the unified rate of ${PRICING.inputPer1M.toFixed(2)} / 1M input and $
              {PRICING.outputPer1M.toFixed(2)} / 1M output tokens.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
            {/* Inputs */}
            <div className="lg:col-span-3 space-y-4">
              <section className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold tracking-tight text-foreground">
                    Workload
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Endpoint">
                    <select
                      value={endpoint}
                      onChange={(e) => setEndpoint(e.target.value as Endpoint)}
                      className="w-full h-9 px-3 rounded-md border border-border bg-input text-foreground text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      {ENDPOINTS.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Requests">
                    <NumberInput value={requests} onChange={setRequests} min={0} />
                  </Field>

                  <Field label="Input tokens / request">
                    <NumberInput
                      value={inputTokens}
                      onChange={setInputTokens}
                      min={0}
                      step={100}
                    />
                  </Field>

                  <Field label="Output tokens / request">
                    <NumberInput
                      value={outputTokens}
                      onChange={setOutputTokens}
                      min={0}
                      step={100}
                    />
                  </Field>

                  <Field
                    label="Agents / request"
                    hint={
                      agentCostApplies
                        ? `$${PRICING.agentCost.toFixed(2)} per agent`
                        : 'Not billed on this endpoint'
                    }
                  >
                    <NumberInput
                      value={agents}
                      onChange={setAgents}
                      min={0}
                      disabled={!agentCostApplies}
                    />
                  </Field>
                </div>
              </section>

              <section className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Plug className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold tracking-tight text-foreground">
                    Tools &amp; media
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Images"
                    hint={`$${PRICING.imageCost.toFixed(2)} each`}
                    icon={ImageIcon}
                  >
                    <NumberInput value={images} onChange={setImages} min={0} />
                  </Field>
                  <Field
                    label="MCP calls"
                    hint={`$${PRICING.mcpCost.toFixed(2)} each`}
                    icon={Plug}
                  >
                    <NumberInput
                      value={mcpCalls}
                      onChange={setMcpCalls}
                      min={0}
                    />
                  </Field>
                  <Field
                    label="Exa searches"
                    hint={`$${PRICING.exaSearchCost.toFixed(2)} each`}
                    icon={Search}
                  >
                    <NumberInput
                      value={exaSearches}
                      onChange={setExaSearches}
                      min={0}
                    />
                  </Field>
                  <Field
                    label="Web scrapes"
                    hint={`$${PRICING.webScraperCost.toFixed(2)} each`}
                    icon={Globe}
                  >
                    <NumberInput
                      value={webScrapes}
                      onChange={setWebScrapes}
                      min={0}
                    />
                  </Field>
                </div>
              </section>

              <section className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold tracking-tight text-foreground">
                    Discounts
                  </h2>
                </div>

                <div className="flex flex-col gap-3">
                  <Toggle
                    icon={Moon}
                    label="Night-time discount"
                    description={
                      endpoint === 'swarm'
                        ? '50% off token cost between 8 PM – 6 AM PT (Swarm Completions only).'
                        : 'Only applies to Swarm Completions.'
                    }
                    checked={nightMode}
                    onChange={setNightMode}
                    disabled={endpoint !== 'swarm'}
                  />
                  <Toggle
                    icon={Sparkles}
                    label="Frenzy Mode"
                    description="All requests free during Black Friday (24h)."
                    checked={frenzyMode}
                    onChange={setFrenzyMode}
                  />
                </div>
              </section>
            </div>

            {/* Summary */}
            <aside className="lg:col-span-2 space-y-4 lg:sticky lg:top-24 self-start">
              <div className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Coins className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold tracking-tight text-foreground">
                    Estimate
                  </h2>
                </div>

                <div className="mb-4">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                    Total cost
                  </div>
                  <div className="text-3xl font-semibold tabular-nums text-foreground">
                    {formatUSD(calc.total)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatUSD(calc.perRequest)} per request ×{' '}
                    <span className="tabular-nums">{requests}</span>
                  </div>
                </div>

                <div className="divide-y divide-border border-t border-border">
                  <Row
                    label="Input tokens"
                    sub={`${inputTokens.toLocaleString()} × $${PRICING.inputPer1M}/M`}
                    value={calc.tokenInputBase}
                  />
                  <Row
                    label="Output tokens"
                    sub={`${outputTokens.toLocaleString()} × $${PRICING.outputPer1M}/M`}
                    value={calc.tokenOutputBase}
                  />
                  {nightDiscountApplies && (
                    <Row
                      label="Night discount"
                      sub="-50% on token cost"
                      value={-(calc.tokensBase - calc.tokensDiscounted)}
                      tone="success"
                    />
                  )}
                  {agentCostApplies && agents > 0 && (
                    <Row
                      label={
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="w-3 h-3 text-muted-foreground" />
                          Agents
                        </span>
                      }
                      sub={`${agents} × $${PRICING.agentCost}`}
                      value={calc.agentCost}
                    />
                  )}
                  {images > 0 && (
                    <Row
                      label="Images"
                      sub={`${images} × $${PRICING.imageCost}`}
                      value={calc.imageCost}
                    />
                  )}
                  {mcpCalls > 0 && (
                    <Row
                      label="MCP calls"
                      sub={`${mcpCalls} × $${PRICING.mcpCost}`}
                      value={calc.mcpCost}
                    />
                  )}
                  {exaSearches > 0 && (
                    <Row
                      label="Exa searches"
                      sub={`${exaSearches} × $${PRICING.exaSearchCost}`}
                      value={calc.exaCost}
                    />
                  )}
                  {webScrapes > 0 && (
                    <Row
                      label="Web scrapes"
                      sub={`${webScrapes} × $${PRICING.webScraperCost}`}
                      value={calc.scraperCost}
                    />
                  )}
                  <Row
                    label="Per-request subtotal"
                    sub=""
                    value={calc.perRequest}
                    strong
                  />
                  <Row
                    label={`× ${requests} requests`}
                    sub={frenzyMode ? 'Frenzy Mode: free' : ''}
                    value={calc.total}
                    strong
                  />
                </div>
              </div>

              <div className="rounded-lg border border-border bg-subtle p-4 text-xs text-muted-foreground flex gap-2">
                <Info className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p>
                  Estimates only. Final billing uses model-specific tokenizers
                  and current pricing from{' '}
                  <code className="text-foreground">/v1/usage/costs</code>.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  hint,
  icon: Icon,
  children,
}: {
  label: string;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-foreground inline-flex items-center gap-1.5">
        {Icon && <Icon className="w-3 h-3 text-muted-foreground" />}
        {label}
      </label>
      {children}
      {hint && (
        <span className="text-[11px] text-muted-foreground">{hint}</span>
      )}
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  min,
  step = 1,
  disabled,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  step?: number;
  disabled?: boolean;
}) {
  return (
    <input
      type="number"
      inputMode="numeric"
      value={Number.isFinite(value) ? value : 0}
      min={min}
      step={step}
      disabled={disabled}
      onChange={(e) => {
        const n = Number(e.target.value);
        onChange(Number.isFinite(n) ? n : 0);
      }}
      className="w-full h-9 px-3 rounded-md border border-border bg-input text-foreground text-sm tabular-nums focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50"
    />
  );
}

function Toggle({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex items-start gap-3 p-3 rounded-md border border-border bg-subtle/40 cursor-pointer transition-colors hover:bg-muted ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="mt-0.5 w-3.5 h-3.5 accent-accent"
      />
      <div className="flex flex-col gap-0.5 min-w-0">
        <div className="text-sm font-medium text-foreground inline-flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 text-muted-foreground" />
          {label}
        </div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </label>
  );
}

function Row({
  label,
  sub,
  value,
  strong,
  tone,
}: {
  label: React.ReactNode;
  sub: string;
  value: number;
  strong?: boolean;
  tone?: 'success';
}) {
  return (
    <div className="flex items-start justify-between py-2 gap-3">
      <div className="min-w-0">
        <div
          className={`text-sm ${
            strong ? 'font-medium text-foreground' : 'text-foreground'
          }`}
        >
          {label}
        </div>
        {sub && (
          <div className="text-[11px] text-muted-foreground tabular-nums">
            {sub}
          </div>
        )}
      </div>
      <div
        className={`text-sm tabular-nums ${
          tone === 'success'
            ? 'text-success'
            : strong
            ? 'font-semibold text-foreground'
            : 'text-foreground'
        }`}
      >
        {formatUSD(value)}
      </div>
    </div>
  );
}

function formatUSD(value: number): string {
  const abs = Math.abs(value);
  const digits = abs > 0 && abs < 0.01 ? 6 : abs < 1 ? 4 : 2;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}
