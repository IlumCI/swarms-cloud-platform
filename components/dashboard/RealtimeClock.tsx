'use client';

import React from 'react';
import { useRealtimeClock } from '@/lib/hooks/useRealtimeClock';

export function RealtimeClock() {
  const { time, formatTime, formatDate, isClient } = useRealtimeClock();

  if (!isClient || !time) {
    return (
      <div className="hidden md:flex items-center text-xs text-muted-foreground tabular-nums">
        --:--
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-3 text-xs">
      <span className="font-mono tabular-nums text-foreground" suppressHydrationWarning>
        {formatTime(time)}
      </span>
      <span className="hidden lg:inline text-muted-foreground" suppressHydrationWarning>
        {formatDate(time)}
      </span>
    </div>
  );
}
