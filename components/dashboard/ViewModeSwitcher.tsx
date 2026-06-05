'use client';

import React from 'react';
import { useUIStore } from '@/lib/store/ui-store';
import { LayoutGrid, Table2, Grid3x3, Columns } from 'lucide-react';

const viewModes = [
  { mode: 'grid' as const, icon: LayoutGrid, label: 'Grid' },
  { mode: 'table' as const, icon: Table2, label: 'Table' },
  { mode: 'heatmap' as const, icon: Grid3x3, label: 'Heatmap' },
  { mode: 'kanban' as const, icon: Columns, label: 'Kanban' },
];

export function ViewModeSwitcher() {
  const viewMode = useUIStore((state) => state.viewMode);
  const setViewMode = useUIStore((state) => state.setViewMode);

  return (
    <div
      role="radiogroup"
      aria-label="View mode"
      className="inline-flex items-center gap-0.5 rounded-md border border-border bg-subtle p-0.5"
    >
      {viewModes.map(({ mode, icon: Icon, label }) => {
        const active = viewMode === mode;
        return (
          <button
            key={mode}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setViewMode(mode)}
            className={`inline-flex items-center justify-center gap-1.5 px-2.5 h-7 rounded text-xs font-medium transition-colors ${
              active
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title={label}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
