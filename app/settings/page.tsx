'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import { useUIStore } from '@/lib/store/ui-store';
import { useCredits } from '@/lib/hooks/useCredits';
import {
  KeyRound,
  ShieldCheck,
  Trash2,
  Palette,
  Wallet,
  RefreshCw,
  Loader2,
  XCircle,
  ExternalLink,
} from 'lucide-react';

export default function SettingsPage() {
  const swarmsApiKey = useUIStore((state) => state.swarmsApiKey);
  const setSwarmsApiKey = useUIStore((state) => state.setSwarmsApiKey);
  const clearSwarmsApiKey = useUIStore((state) => state.clearSwarmsApiKey);
  const addToast = useUIStore((state) => state.addToast);
  const { credits, isLoading: creditsLoading, error: creditsError, refetch: refetchCredits } =
    useCredits();

  const [inputKey, setInputKey] = useState(swarmsApiKey);

  const maskedKey = swarmsApiKey
    ? `${swarmsApiKey.slice(0, 6)}…${swarmsApiKey.slice(-4)}`
    : 'Not set';

  const handleSave = () => {
    const trimmed = inputKey.trim();
    if (!trimmed) {
      addToast({
        type: 'error',
        message: 'Please enter a valid API key.',
        duration: 4000,
      });
      return;
    }

    setSwarmsApiKey(trimmed);
    addToast({ type: 'success', message: 'API key updated.', duration: 3000 });
  };

  const handleClear = () => {
    clearSwarmsApiKey();
    setInputKey('');
    addToast({
      type: 'warning',
      message: 'API key cleared. You will be prompted again.',
      duration: 4000,
    });
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="page-main px-4 sm:px-6 lg:px-8 py-6 lg:py-8 box-border">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex flex-col gap-1 mb-6">
            <p className="text-xs text-muted-foreground">Workspace</p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage authentication and runtime preferences.
            </p>
          </div>

          {/* API key section */}
          <section className="mb-6 rounded-lg border border-border bg-card">
            <header className="flex items-start gap-3 px-5 py-4 border-b border-border">
              <div className="p-1.5 rounded-md bg-accent/10 border border-accent/30 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold tracking-tight text-foreground">
                  API key
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Cached locally in your browser. Used for all Swarms API requests.
                </p>
              </div>
            </header>

            <div className="p-5 space-y-4">
              <div className="rounded-md border border-border bg-subtle px-3 py-2.5">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                  Current key
                </div>
                <div className="text-sm font-mono text-foreground break-all">
                  {maskedKey}
                </div>
              </div>

              <label className="block">
                <span className="text-xs font-medium text-foreground mb-1.5 inline-flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-muted-foreground" />
                  Update API key
                </span>
                <input
                  type="password"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="Paste a new key…"
                  className="w-full h-9 px-3 rounded-md border border-border bg-input text-foreground text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
                />
              </label>

              <div className="flex items-center gap-2 pt-1">
                <Button variant="primary" size="md" onClick={handleSave}>
                  Save key
                </Button>
                <Button variant="outline" size="md" onClick={handleClear}>
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </Button>
              </div>
            </div>
          </section>

          {/* Credits section */}
          <section className="mb-6 rounded-lg border border-border bg-card">
            <header className="flex items-start gap-3 px-5 py-4 border-b border-border">
              <div className="p-1.5 rounded-md bg-accent/10 border border-accent/30 mt-0.5">
                <Wallet className="w-3.5 h-3.5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold tracking-tight text-foreground">
                  Credits
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Balance across paid, free, and referral credits. Refreshes every
                  30 seconds.
                </p>
              </div>
              <button
                type="button"
                onClick={refetchCredits}
                disabled={creditsLoading || !swarmsApiKey}
                className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 flex-shrink-0"
                aria-label="Refresh credits"
                title="Refresh"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${creditsLoading ? 'animate-spin' : ''}`}
                />
              </button>
            </header>

            <div className="p-5 space-y-4">
              {!swarmsApiKey ? (
                <div className="rounded-md border border-dashed border-border bg-subtle/50 px-3 py-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Set an API key above to view your credit balance.
                  </p>
                </div>
              ) : creditsLoading && !credits ? (
                <div className="rounded-md border border-border bg-subtle px-3 py-6 text-center">
                  <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Loading credits…</p>
                </div>
              ) : creditsError ? (
                <div className="rounded-md border border-danger/30 bg-danger/10 px-3 py-4 flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-danger mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{creditsError}</p>
                    <button
                      type="button"
                      onClick={refetchCredits}
                      className="text-xs text-accent hover:underline mt-1"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : credits ? (
                <>
                  <div className="rounded-md border border-border bg-subtle px-4 py-4">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                      Total balance
                    </div>
                    <div className="text-3xl font-semibold tabular-nums text-foreground">
                      ${credits.total_credits.toFixed(2)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <CreditStat label="Paid" value={credits.credit} />
                    <CreditStat label="Free" value={credits.free_credit} />
                    <CreditStat label="Referral" value={credits.referral_credits} />
                  </div>

                  {credits.total_credits < 1 && (
                    <div className="rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning">
                      Your balance is low. Top up to keep running agents and swarms.
                    </div>
                  )}
                </>
              ) : null}

              <div className="pt-1">
                <a
                  href="https://swarms.world/platform/account"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-border bg-card text-foreground text-sm hover:bg-muted transition-colors"
                >
                  Manage billing
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </section>

          {/* Appearance section */}
          <section className="rounded-lg border border-border bg-card">
            <header className="flex items-start gap-3 px-5 py-4 border-b border-border">
              <div className="p-1.5 rounded-md bg-accent/10 border border-accent/30 mt-0.5">
                <Palette className="w-3.5 h-3.5 text-accent" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold tracking-tight text-foreground">
                  Appearance
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Choose how Orchestrate looks. Follows your system by default.
                </p>
              </div>
            </header>

            <div className="p-5">
              <ThemeSwitcher compact={false} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function CreditStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border bg-subtle px-3 py-2.5">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </div>
      <div className="text-base font-semibold tabular-nums text-foreground">
        ${value.toFixed(2)}
      </div>
    </div>
  );
}
