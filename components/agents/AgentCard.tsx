'use client';

import React, { useState } from 'react';
import { Agent } from '@/types/agent';
import { AgentStatusIndicator } from './AgentStatusIndicator';
import { Play, Square, Edit, Trash2, Copy, MoreHorizontal, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AgentCardProps {
  agent: Agent;
  onExecute?: (agent: Agent) => void;
  onStop?: (agent: Agent) => void;
  onEdit?: (agent: Agent) => void;
  onDelete?: (agent: Agent) => void;
  onDuplicate?: (agent: Agent) => void;
}

export function AgentCard({
  agent,
  onExecute,
  onStop,
  onEdit,
  onDelete,
  onDuplicate,
}: AgentCardProps) {
  const isRunning = agent.status === 'running';
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuAction = (action?: () => void) => {
    action?.();
    setShowMenu(false);
  };

  return (
    <div className="group relative flex flex-col rounded-lg border border-border bg-card text-card-foreground transition-colors hover:border-border-strong">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 p-4 pb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <AgentStatusIndicator status={agent.status} />
            <h3 className="text-sm font-semibold tracking-tight text-foreground truncate">
              {agent.config.agent_name}
            </h3>
          </div>
          {agent.config.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {agent.config.description}
            </p>
          )}
        </div>

        {/* Menu */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setShowMenu((v) => !v)}
            className="p-1 -m-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Agent actions"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-7 z-20 min-w-[170px] bg-card border border-border rounded-md shadow-md overflow-hidden animate-slide-up">
                <MenuItem icon={Edit} label="Edit" onClick={() => handleMenuAction(() => onEdit?.(agent))} />
                <MenuItem icon={Copy} label="Duplicate" onClick={() => handleMenuAction(() => onDuplicate?.(agent))} />
                <div className="h-px bg-border" />
                <MenuItem
                  icon={Trash2}
                  label="Delete"
                  destructive
                  onClick={() => handleMenuAction(() => onDelete?.(agent))}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pb-3">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          <DetailRow label="Model" value={agent.config.model_name} mono />
          <DetailRow label="Role" value={agent.config.role || 'worker'} />
          <DetailRow label="Temp" value={String(agent.config.temperature ?? 0.5)} mono />
          <DetailRow label="Loops" value={String(agent.config.max_loops ?? 1)} mono />
        </dl>

        {agent.execution_history.length > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-3 pt-3 border-t border-border">
            <Clock className="w-3 h-3" />
            <span>
              {agent.execution_history.length} execution
              {agent.execution_history.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Footer / primary action */}
      <div className="px-4 pb-4 mt-auto">
        {!isRunning ? (
          <Button
            size="sm"
            variant="primary"
            onClick={() => onExecute?.(agent)}
            className="w-full"
          >
            <Play className="w-3.5 h-3.5" />
            Run agent
          </Button>
        ) : (
          <Button
            size="sm"
            variant="danger"
            onClick={() => onStop?.(agent)}
            className="w-full"
          >
            <Square className="w-3.5 h-3.5" />
            Stop agent
          </Button>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between min-w-0">
      <dt className="text-muted-foreground flex-shrink-0">{label}</dt>
      <dd
        className={`text-foreground truncate text-right ml-2 ${mono ? 'font-mono' : ''}`}
        title={value}
      >
        {value}
      </dd>
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  destructive,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
        destructive
          ? 'text-danger hover:bg-danger/10'
          : 'text-foreground hover:bg-muted'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}
