import React from 'react';
import { InputProps } from '@/types/ui';

export function Input({
  label,
  error,
  icon,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={[
            'w-full h-9 rounded-md border bg-input text-foreground text-sm',
            'placeholder:text-muted-foreground',
            'transition-colors duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            icon ? 'pl-9 pr-3' : 'px-3',
            error ? 'border-danger focus-visible:ring-danger' : 'border-border',
            className,
          ].join(' ')}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-danger">{error}</span>
      )}
    </div>
  );
}
