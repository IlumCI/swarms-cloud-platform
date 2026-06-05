'use client';

import React from 'react';
import { useAgents } from '@/lib/hooks/useAgents';
import { AgentCard } from './AgentCard';
import { Agent } from '@/types/agent';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AgentGridProps {
  agents?: Agent[];
  onCreateAgent?: () => void;
  onEditAgent?: (agent: Agent) => void;
  onExecuteAgent?: (agent: Agent) => void;
}

export function AgentGrid({
  agents: providedAgents,
  onCreateAgent,
  onEditAgent,
  onExecuteAgent,
}: AgentGridProps) {
  const { agents: hookAgents, removeAgent, duplicateAgent } = useAgents();
  const agents = providedAgents ?? hookAgents;

  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] rounded-lg border border-dashed border-border bg-subtle/50 p-10">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Users className="w-5 h-5 text-muted-foreground" />
        </div>
        <h3 className="text-base font-semibold tracking-tight text-foreground mb-1.5">
          No agents yet
        </h3>
        <p className="text-sm text-muted-foreground mb-5 text-center max-w-sm">
          Create your first agent to begin orchestrating multi-agent workflows.
        </p>
        <Button variant="primary" size="md" onClick={onCreateAgent}>
          <Plus className="w-3.5 h-3.5" />
          Create agent
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          onExecute={onExecuteAgent}
          onEdit={onEditAgent}
          onDelete={(a) => removeAgent(a.id)}
          onDuplicate={(a) => duplicateAgent(a.id)}
        />
      ))}
    </div>
  );
}
