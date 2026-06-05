'use client';

import React, { useMemo } from 'react';
import { useAgents } from '@/lib/hooks/useAgents';
import { Agent, KanbanStatus } from '@/types/agent';
import { AgentCard } from './AgentCard';
import { Card } from '@/components/ui/Card';
import { useAgentStore } from '@/lib/store/agent-store';
import { Plus, Circle, CheckCircle2, Play, Clock } from 'lucide-react';

interface AgentKanbanProps {
  onCreateAgent?: () => void;
  onEditAgent?: (agent: Agent) => void;
  onExecuteAgent?: (agent: Agent) => void;
}

interface KanbanColumn {
  id: KanbanStatus;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export function AgentKanban({
  onCreateAgent,
  onEditAgent,
  onExecuteAgent,
}: AgentKanbanProps) {
  const { agents, removeAgent, duplicateAgent, updateAgent } = useAgents();

  const columns: KanbanColumn[] = [
    {
      id: 'idle',
      title: 'Idle',
      icon: Circle,
      color: 'accent',
    },
    {
      id: 'todo',
      title: 'Todo',
      icon: Clock,
      color: 'accent',
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      icon: Play,
      color: 'success',
    },
    {
      id: 'done',
      title: 'Done',
      icon: CheckCircle2,
      color: 'success',
    },
  ];

  // Group agents by kanban status
  const agentsByStatus = useMemo(() => {
    const grouped: Record<KanbanStatus, Agent[]> = {
      idle: [],
      todo: [],
      in_progress: [],
      done: [],
    };

    agents.forEach((agent) => {
      let kanbanStatus = agent.kanbanStatus || 'idle';

      // Auto-update kanban status based on execution status
      if (agent.status === 'running') {
        kanbanStatus = 'in_progress';
        if (agent.kanbanStatus !== 'in_progress') {
          updateAgent(agent.id, { kanbanStatus: 'in_progress' });
        }
      } else if (agent.status === 'completed') {
        kanbanStatus = 'done';
        if (agent.kanbanStatus !== 'done') {
          updateAgent(agent.id, { kanbanStatus: 'done' });
        }
      }

      grouped[kanbanStatus].push({ ...agent, kanbanStatus });
    });

    return grouped;
  }, [agents, updateAgent]);

  const handleStatusChange = (agentId: string, newStatus: KanbanStatus) => {
    updateAgent(agentId, { kanbanStatus: newStatus });
  };

  const getColumnColor = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      accent: {
        bg: 'bg-accent/10',
        border: 'border-accent',
        text: 'text-accent',
      },
      success: {
        bg: 'bg-success/10',
        border: 'border-success',
        text: 'text-success',
      },
    };
    return colors[color] || colors['accent'];
  };

  return (
    <div className="space-y-6 w-full min-w-0 overflow-hidden">
      {/* Kanban Board - horizontal scroll on smaller screens */}
      <div className="overflow-x-auto pb-1">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 min-w-0 md:min-w-[860px] xl:min-w-0">
        {columns.map((column) => {
          const columnAgents = agentsByStatus[column.id];
          const columnColors = getColumnColor(column.color);
          const Icon = column.icon;

          return (
            <div key={column.id} className="flex flex-col h-full min-h-[500px]">
              {/* Column Header */}
              <div className="mb-3 px-3 h-10 rounded-md border border-border bg-subtle flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${columnColors.text}`} />
                  <h3 className="text-sm font-medium text-foreground">
                    {column.title}
                  </h3>
                </div>
                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded text-[11px] tabular-nums font-medium bg-muted text-muted-foreground border border-border">
                  {columnAgents.length}
                </span>
              </div>

              {/* Column Content */}
              <div className="flex-1 space-y-3 overflow-y-auto sidebar-scroll min-h-0">
                {columnAgents.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border bg-subtle/50 p-6 text-center">
                    <p className="text-xs text-muted-foreground">No agents</p>
                  </div>
                ) : (
                  columnAgents.map((agent) => (
                    <div
                      key={agent.id}
                      className="cursor-move"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('agentId', agent.id);
                        e.dataTransfer.setData('currentStatus', agent.kanbanStatus || 'idle');
                        e.currentTarget.style.opacity = '0.5';
                      }}
                      onDragEnd={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      <AgentCard
                        agent={agent}
                        onExecute={(agent) => {
                          // When executing from todo, it will auto-move to in_progress via the hook
                          if (onExecuteAgent) {
                            onExecuteAgent(agent);
                          }
                        }}
                        onEdit={onEditAgent}
                        onDelete={(agent) => removeAgent(agent.id)}
                        onDuplicate={(agent) => duplicateAgent(agent.id)}
                      />
                    </div>
                  ))
                )}
              </div>

              {/* Drop Zone */}
              <div
                className="mt-2 h-10 rounded-md border border-dashed border-border opacity-0 hover:opacity-100 hover:border-border-strong transition-[opacity,border-color]"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('opacity-50');
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('opacity-50');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('opacity-50');
                  const agentId = e.dataTransfer.getData('agentId');
                  if (agentId) {
                    handleStatusChange(agentId, column.id);
                  }
                }}
              />
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
