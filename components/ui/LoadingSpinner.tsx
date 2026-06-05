import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  /** Kept for back-compat; visual mapping is neutralised under the new design. */
  color?: 'cyan' | 'purple' | 'green' | 'red';
  className?: string;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
};

const colorMap = {
  cyan: 'text-accent',
  purple: 'text-accent',
  green: 'text-success',
  red: 'text-danger',
};

export function LoadingSpinner({
  size = 'md',
  color = 'cyan',
  className = '',
}: LoadingSpinnerProps) {
  return (
    <Loader2 className={`animate-spin ${sizeMap[size]} ${colorMap[color]} ${className}`} />
  );
}
