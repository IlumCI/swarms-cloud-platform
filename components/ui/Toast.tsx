'use client';

import React from 'react';
import { useUIStore } from '@/lib/store/ui-store';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const accentMap = {
  success: 'text-success',
  error: 'text-danger',
  warning: 'text-warning',
  info: 'text-accent',
};

export function ToastContainer() {
  const toasts = useUIStore((state) => state.toasts);
  const removeToast = useUIStore((state) => state.removeToast);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type];
        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-card text-card-foreground border border-border rounded-lg shadow-md px-3.5 py-3 flex items-start gap-3 animate-slide-up"
          >
            <div className={`flex-shrink-0 mt-0.5 ${accentMap[toast.type]}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 text-sm leading-relaxed">{toast.message}</div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 -mr-1 -mt-1 p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
