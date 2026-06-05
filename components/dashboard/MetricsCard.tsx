'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  className?: string;
}

export function MetricsCard({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  className = '',
}: MetricsCardProps) {
  return (
    <div className={`rounded-lg border border-border bg-card p-4 sm:p-5 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
          {title}
        </span>
      </div>
      <div className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">
        {value}
      </div>
      {subtitle && (
        <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
      )}
      {trend && (
        <div
          className={`text-xs font-medium mt-2 tabular-nums ${
            trend.isPositive ? 'text-success' : 'text-danger'
          }`}
        >
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
        </div>
      )}
    </div>
  );
}
