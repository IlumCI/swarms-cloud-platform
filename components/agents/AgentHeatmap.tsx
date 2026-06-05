'use client';

import React from 'react';
import { useAgents } from '@/lib/hooks/useAgents';
import { Agent } from '@/types/agent';
import { Plus, Play, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AgentHeatmapProps {
  agents?: Agent[];
  onCreateAgent?: () => void;
  onEditAgent?: (agent: Agent) => void;
  onExecuteAgent?: (agent: Agent) => void;
}

export function AgentHeatmap({
  agents: providedAgents,
  onCreateAgent,
  onEditAgent,
  onExecuteAgent,
}: AgentHeatmapProps) {
  const { agents: hookAgents, removeAgent, duplicateAgent } = useAgents();
  const agents = providedAgents ?? hookAgents;

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-success border-success';
      case 'idle':
      case 'stopped':
      case 'error':
      case 'completed':
      default:
        return 'bg-danger/80 border-danger/50';
    }
  };

  // Get status glow effect
  const getStatusGlow = (status: string) => {
    if (status === 'running') {
      return 'animate-pulse-slow';
    }
    return '';
  };

  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        <div className="text-center">
          <div className="text-6xl mb-4 text-accent/20">
            <svg
              className="w-24 h-24 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-base font-semibold tracking-tight text-foreground mb-1.5">
            No agents yet
          </h3>
          <p className="text-muted-foreground text-sm mb-5">
            Create your first agent to begin orchestration.
          </p>
          <Button variant="primary" size="md" onClick={onCreateAgent}>
            <Plus className="w-3.5 h-3.5" />
            Create agent
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full min-w-0 overflow-hidden">
      {/* Header with Create Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground mb-0.5">
              Agent heatmap
            </h2>
            <p className="text-xs text-muted-foreground">
              {agents.length} agent{agents.length !== 1 ? 's' : ''} •
              <span className="text-success ml-2">
                {agents.filter(a => a.status === 'running').length} running
              </span>
              <span className="text-danger ml-2">
                {agents.filter(a => a.status !== 'running').length} inactive
              </span>
            </p>
          </div>
        </div>
        <Button variant="primary" onClick={onCreateAgent}>
          <Plus className="w-4 h-4" />
          NEW AGENT
        </Button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 bg-card border border-border p-3 rounded">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-success rounded border border-success"></div>
          <span className="text-xs font-mono text-muted-foreground">Running</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-danger/80 rounded border border-danger/50"></div>
          <span className="text-xs font-mono text-muted-foreground">Inactive</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="bg-card border border-border rounded-lg p-3 sm:p-4 overflow-auto max-w-full min-w-0">
        <div
          className="grid gap-2 min-w-0"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(68px, 1fr))',
            gridAutoRows: 'clamp(68px, 10vw, 84px)',
          }}
        >
          {agents.map((agent) => {
            const isRunning = agent.status === 'running';

            return (
              <div
                key={agent.id}
                className={`
                  relative group border rounded-md transition-colors duration-150
                  ${getStatusColor(agent.status)}
                  hover:border-border-strong cursor-pointer
                `}
                onClick={() => {
                  if (isRunning && onExecuteAgent) {
                    // Could show stop option here
                  } else if (onExecuteAgent) {
                    onExecuteAgent(agent);
                  }
                }}
              >
                {/* Agent Info Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/95 rounded-lg">
                  <div className="text-center space-y-1">
                    <div className="text-xs font-mono font-bold text-foreground truncate w-full px-1">
                      {agent.config.agent_name}
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground uppercase">
                      {agent.status}
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {!isRunning && onExecuteAgent && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onExecuteAgent(agent);
                          }}
                          className="p-1 bg-success/20 hover:bg-success/40 rounded transition-colors"
                          title="Execute"
                        >
                          <Play className="w-3 h-3 text-success" />
                        </button>
                      )}
                      {onEditAgent && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditAgent(agent);
                          }}
                          className="p-1 bg-accent/20 hover:bg-accent/40 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3 h-3 text-accent" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAgent(agent.id);
                        }}
                        className="p-1 bg-danger/20 hover:bg-danger/40 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3 text-danger" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="absolute top-1 right-1">
                  {isRunning ? (
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  ) : (
                    <div className="w-2 h-2 bg-danger rounded-full"></div>
                  )}
                </div>

                {/* Agent Name (visible when not hovering) */}
                <div className="absolute bottom-1 left-1 right-1 opacity-60 group-hover:opacity-0 transition-opacity">
                  <div className="text-[10px] font-mono text-foreground truncate text-center">
                    {agent.config.agent_name.slice(0, 8)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-card border border-border p-3 rounded">
          <div className="text-xs text-muted-foreground font-mono mb-1">Total</div>
          <div className="text-lg font-bold text-accent font-mono">
            {agents.length}
          </div>
        </div>
        <div className="bg-card border border-success p-3 rounded">
          <div className="text-xs text-muted-foreground font-mono mb-1">Running</div>
          <div className="text-lg font-bold text-success font-mono">
            {agents.filter(a => a.status === 'running').length}
          </div>
        </div>
        <div className="bg-card border border-danger p-3 rounded">
          <div className="text-xs text-muted-foreground font-mono mb-1">Inactive</div>
          <div className="text-lg font-bold text-danger font-mono">
            {agents.filter(a => a.status !== 'running').length}
          </div>
        </div>
        <div className="bg-card border border-border p-3 rounded">
          <div className="text-xs text-muted-foreground font-mono mb-1">Success Rate</div>
          <div className="text-lg font-bold text-accent font-mono">
            {agents.length > 0
              ? Math.round(
                  (agents.filter(a => a.status === 'completed').length / agents.length) * 100
                )
              : 0}%
          </div>
        </div>
      </div>
    </div>
  );
}
