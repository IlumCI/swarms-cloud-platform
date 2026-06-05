'use client';

import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCharCount?: boolean;
  maxLength?: number;
}

export function Textarea({
  label,
  error,
  helperText,
  showCharCount = false,
  maxLength,
  className = '',
  ...props
}: TextareaProps) {
  const value = (props.value as string) || '';
  const charCount = value.length;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-medium text-foreground">{label}</label>
      )}
      <div className="relative">
        <textarea
          className={[
            'w-full rounded-md border bg-input text-foreground text-sm px-3 py-2.5',
            'placeholder:text-muted-foreground resize-none',
            'transition-colors duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-danger focus-visible:ring-danger' : 'border-border',
            className,
          ].join(' ')}
          maxLength={maxLength}
          {...props}
        />
        {showCharCount && (
          <div className="absolute bottom-2 right-3 text-[10px] text-muted-foreground tabular-nums">
            {charCount}
            {maxLength ? ` / ${maxLength}` : ''}
          </div>
        )}
      </div>
      {error && <span className="text-xs text-danger">{error}</span>}
      {helperText && !error && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
