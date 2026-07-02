'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export function FreedomModeCard() {
  const now = new Date();
  const month = now.getMonth();
  const date = now.getDate();

  if (month !== 6 || date < 2 || date > 6) return null;

  return (
    <section className="relative overflow-hidden rounded-xl border border-[#B22234]/30 bg-card p-6 sm:p-8 mb-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            'linear-gradient(135deg, #B22234 0%, #fff 40%, #3C3B6E 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 80% 0%, rgba(59, 130, 246, 0.3), transparent 70%)',
        }}
      />

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#B22234]/10 border border-[#B22234]/30 flex-shrink-0">
          <span className="text-3xl">🇺🇸</span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full border border-[#B22234]/30 bg-[#B22234]/10 text-[11px] font-medium tracking-wide uppercase text-[#B22234]">
            <Sparkles className="w-3 h-3" />
            Freedom Mode
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground leading-tight">
            All API requests are FREE — July 2–6
          </h2>

          <p className="text-sm text-muted-foreground max-w-2xl">
            To celebrate America&apos;s 250th birthday, all API requests are free for all models and
            swarm endpoints. Enjoy the freedom!
          </p>
        </div>
      </div>
    </section>
  );
}
