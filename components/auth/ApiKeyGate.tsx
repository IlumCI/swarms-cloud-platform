'use client';

import React, { useState } from 'react';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';
import { Button } from '@/components/ui/Button';

export function ApiKeyGate() {
  const swarmsApiKey = useUIStore((state) => state.swarmsApiKey);
  const setSwarmsApiKey = useUIStore((state) => state.setSwarmsApiKey);
  const addToast = useUIStore((state) => state.addToast);

  const [apiKeyInput, setApiKeyInput] = useState('');

  if (swarmsApiKey) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = apiKeyInput.trim();

    if (!trimmed) {
      addToast({
        type: 'error',
        message: 'Please enter your swarms_api_key.',
        duration: 4000,
      });
      return;
    }

    setSwarmsApiKey(trimmed);
    addToast({
      type: 'success',
      message: 'API key saved for this browser.',
      duration: 3000,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/30 dark:bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-lg animate-slide-up">
        <div className="flex items-start gap-3 mb-5">
          <div className="p-2 rounded-md bg-accent/10 border border-accent/30">
            <ShieldCheck className="w-4 h-4 text-accent" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Connect your API key
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Provide your Swarms API key to unlock agent execution and analytics.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <label className="block">
            <span className="text-xs font-medium text-foreground mb-1.5 inline-flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-muted-foreground" />
              swarms_api_key
            </span>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="Paste your key…"
              className="w-full h-9 px-3 rounded-md border border-border bg-input text-foreground text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
              autoFocus
            />
          </label>

          <div className="flex items-center justify-between gap-3 pt-1">
            <p className="text-[11px] text-muted-foreground">
              Cached locally in your browser.
            </p>
            <Button type="submit" size="md" variant="primary">
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
