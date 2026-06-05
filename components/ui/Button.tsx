'use client';

import React from 'react';
import { ButtonProps } from '@/types/ui';
import { Loader2 } from 'lucide-react';

const sizeStyles = {
  sm: 'h-7 px-2.5 text-xs gap-1.5',
  md: 'h-9 px-3.5 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
};

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-foreground text-background hover:bg-foreground/90 active:bg-foreground/80 border border-foreground',
  secondary:
    'bg-card text-foreground hover:bg-muted border border-border',
  outline:
    'bg-transparent text-foreground hover:bg-muted border border-border',
  danger:
    'bg-danger text-danger-foreground hover:bg-danger/90 border border-danger',
  success:
    'bg-success text-success-foreground hover:bg-success/90 border border-success',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'relative inline-flex items-center justify-center font-medium rounded-md ' +
    'transition-colors duration-150 select-none whitespace-nowrap ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ' +
    'disabled:opacity-50 disabled:pointer-events-none';

  return (
    <button
      className={`${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {children}
    </button>
  );
}
