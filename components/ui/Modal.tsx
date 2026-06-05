'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'default' | 'large';
}

export function Modal({ isOpen, onClose, title, children, footer, size = 'default' }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      style={{
        paddingLeft: 'max(0.75rem, env(safe-area-inset-left))',
        paddingRight: 'max(0.75rem, env(safe-area-inset-right))',
        paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
      }}
    >
      <div
        className="absolute inset-0 bg-foreground/30 dark:bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div
        className={[
          'relative w-full max-h-[90vh] max-h-[90dvh] overflow-hidden flex flex-col',
          'bg-card text-card-foreground border border-border rounded-xl shadow-lg',
          'animate-slide-up',
          size === 'large' ? 'max-w-[min(96vw,72rem)]' : 'max-w-[min(96vw,36rem)]',
        ].join(' ')}
      >
        {title && (
          <div className="flex items-center justify-between gap-3 px-5 h-14 border-b border-border flex-shrink-0">
            <h2 className="text-sm font-semibold tracking-tight truncate min-w-0">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors -mr-1.5"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="px-5 py-5 overflow-y-auto overflow-x-hidden flex-1 min-h-0">
          {children}
        </div>

        {footer && (
          <div className="flex items-center justify-end gap-2 px-5 h-14 border-t border-border flex-shrink-0 bg-subtle/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
