'use client';

import React from 'react';
import { AgentStatus } from '@/types/agent';

interface AgentStatusIndicatorProps {
  status: AgentStatus;
  showLabel?: boolean;
}

const statusConfig: Record<
  AgentStatus,
  { dot: string; label: string; pill: string; pulse?: boolean }
> = {
  idle: {
    dot: 'bg-muted-foreground/60',
    label: 'Idle',
    pill: 'text-muted-foreground bg-muted border-border',
  },
  running: {
    dot: 'bg-success ring-2 ring-success/15',
    label: 'Running',
    pill: 'text-success bg-success/10 border-success/30',
    pulse: true,
  },
  stopped: {
    dot: 'bg-muted-foreground',
    label: 'Stopped',
    pill: 'text-muted-foreground bg-muted border-border',
  },
  error: {
    dot: 'bg-danger ring-2 ring-danger/15',
    label: 'Error',
    pill: 'text-danger bg-danger/10 border-danger/30',
    pulse: true,
  },
  completed: {
    dot: 'bg-accent ring-2 ring-accent/15',
    label: 'Completed',
    pill: 'text-accent bg-accent/10 border-accent/30',
  },
};

export function AgentStatusIndicator({ status, showLabel = false }: AgentStatusIndicatorProps) {
  const cfg = statusConfig[status] ?? statusConfig.idle;

  if (showLabel) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 h-5 rounded-full border text-[11px] font-medium ${cfg.pill}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${cfg.pulse ? 'animate-pulse' : ''}`} />
        {cfg.label}
      </span>
    );
  }

  return (
    <div
      className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot} ${cfg.pulse ? 'animate-pulse' : ''}`}
      title={cfg.label}
    />
  );
}
