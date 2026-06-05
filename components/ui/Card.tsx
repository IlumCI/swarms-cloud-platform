'use client';

import React from 'react';
import { CardProps } from '@/types/ui';

export function Card({
  children,
  variant = 'glass',
  neonColor: _neonColor,
  className = '',
  ...props
}: CardProps) {
  const base =
    'rounded-lg border border-border bg-card text-card-foreground transition-colors';
  const padding = 'p-4 sm:p-5';
  const elevation = variant === 'solid' ? 'shadow-xs' : '';

  return (
    <div className={`${base} ${padding} ${elevation} ${className}`} {...props}>
      {children}
    </div>
  );
}
