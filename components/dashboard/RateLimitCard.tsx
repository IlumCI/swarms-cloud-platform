'use client';

import React from 'react';
import { RateLimitWindow } from '@/types/api';
import { Clock, AlertTriangle } from 'lucide-react';

interface RateLimitCardProps {
  title: string;
  window: RateLimitWindow;
  className?: string;
}

export function RateLimitCard({ title, window, className = '' }: RateLimitCardProps) {
  const percentage = (window.count / window.limit) * 100;
  const isWarning = percentage >= 75;
  const isExceeded = window.exceeded;

  const barColor = isExceeded
    ? 'bg-danger'
    : isWarning
    ? 'bg-warning'
    : 'bg-success';

  const tone = isExceeded
    ? 'text-danger'
    : isWarning
    ? 'text-warning'
    : 'text-foreground';

  const formatResetTime = (resetTime: string) => {
    try {
      const date = new Date(resetTime);
      const now = new Date();
      const diff = date.getTime() - now.getTime();

      if (diff < 0) return 'Reset';

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      if (minutes > 0) return `${minutes}m ${seconds}s`;
      return `${seconds}s`;
    } catch {
      return resetTime;
    }
  };

  return (
    <div className={`rounded-lg border border-border bg-card p-4 sm:p-5 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {isExceeded ? (
            <AlertTriangle className="w-3.5 h-3.5 text-danger" />
          ) : (
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          )}
          <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
            {title}
          </span>
        </div>
        {isExceeded && (
          <span className="text-[11px] text-danger font-medium uppercase tracking-wider">
            Exceeded
          </span>
        )}
      </div>

      <div className="space-y-2.5">
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-muted-foreground">Usage</span>
          <span className={`tabular-nums font-medium ${tone}`}>
            {window.count} / {window.limit}
          </span>
        </div>

        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-[width] duration-300 ${barColor}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Remaining{' '}
            <span className={`tabular-nums ${tone}`}>{window.remaining}</span>
          </span>
          <span className="tabular-nums">Resets in {formatResetTime(window.reset_time)}</span>
        </div>
      </div>
    </div>
  );
}
