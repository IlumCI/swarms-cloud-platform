'use client';

import React, { useMemo } from 'react';
import { useAgentStore } from '@/lib/store/agent-store';
import { useUIStore } from '@/lib/store/ui-store';
import { ExecutionCard } from './ExecutionCard';
import { X, ScrollText } from 'lucide-react';

export function OutputsPanel() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);
  const agents = useAgentStore((state) => state.agents);

  const allExecutions = useMemo(() => {
    const executions: Array<{
      execution: any;
      agentName: string;
      agentId: string;
    }> = [];

    agents.forEach((agent) => {
      agent.execution_history.forEach((execution) => {
        executions.push({
          execution,
          agentName: agent.config.agent_name,
          agentId: agent.id,
        });
      });
    });

    return executions.sort((a, b) => {
      const timeA = new Date(a.execution.timestamp).getTime();
      const timeB = new Date(b.execution.timestamp).getTime();
      return timeB - timeA;
    });
  }, [agents]);

  if (!sidebarOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-foreground/30 dark:bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
        onClick={() => setSidebarOpen(false)}
      />

      <div
        className="fixed right-0 top-14 w-full max-w-[100vw] sm:max-w-[95vw] md:max-w-[500px] lg:w-[500px] 2xl:w-[560px] lg:max-w-none h-[calc(100dvh-3.5rem)] bg-background border-l border-border z-50 flex flex-col shadow-lg"
        style={{ maxHeight: '100dvh' }}
      >
        <div className="flex items-center justify-between gap-2 px-4 h-14 border-b border-border bg-subtle flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <ScrollText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <h2 className="text-sm font-semibold tracking-tight text-foreground truncate">
              Outputs
            </h2>
            <span className="inline-flex items-center px-1.5 h-4 rounded text-[10px] tabular-nums font-medium bg-muted text-muted-foreground border border-border">
              {allExecutions.length}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 -mr-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3 min-h-0 sidebar-scroll">
          {allExecutions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-1">
                <ScrollText className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">No executions yet</p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Agent outputs will appear here in real time.
              </p>
            </div>
          ) : (
            allExecutions.map((item, index) => (
              <ExecutionCard
                key={`${item.agentId}-${item.execution.job_id || item.execution.timestamp}-${index}`}
                execution={item.execution}
                agentName={item.agentName}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
