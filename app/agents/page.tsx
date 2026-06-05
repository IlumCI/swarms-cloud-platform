'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { AgentTable } from '@/components/agents/AgentTable';
import { SearchBar } from '@/components/ui/SearchBar';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/Button';
import { useAgentConfigsList } from '@/lib/hooks/useAgentConfigsList';
import { Agent, AgentConfig } from '@/types/agent';
import {
  Plus,
  Users,
  Loader2,
  RefreshCw,
  XCircle,
} from 'lucide-react';

function configToDisplayAgent(config: AgentConfig, idx: number): Agent {
  const id =
    (config as unknown as { id?: string }).id ||
    `${config.agent_name || 'agent'}-${idx}`;
  return {
    id,
    config,
    status: 'idle',
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
    execution_history: [],
  };
}

export default function AgentsPage() {
  const { configs, isLoading, error, refetch } = useAgentConfigsList();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const agents = useMemo(
    () => configs.map((c, i) => configToDisplayAgent(c, i)),
    [configs]
  );

  const filteredAgents = useMemo(() => {
    if (!searchQuery.trim()) return agents;
    const query = searchQuery.toLowerCase().trim();
    return agents.filter((agent) => {
      const name = agent.config.agent_name?.toLowerCase() || '';
      const description = agent.config.description?.toLowerCase() || '';
      const model = agent.config.model_name?.toLowerCase() || '';
      const role = agent.config.role?.toLowerCase() || '';
      return (
        name.includes(query) ||
        description.includes(query) ||
        model.includes(query) ||
        role.includes(query)
      );
    });
  }, [agents, searchQuery]);

  const paginatedAgents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAgents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAgents, currentPage, itemsPerPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);

  const handleEditAgent = (agent: Agent) => {
    console.log('Edit agent:', agent);
  };

  const handleExecuteAgent = (agent: Agent) => {
    console.log('Execute agent:', agent);
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="page-main px-4 sm:px-6 lg:px-8 py-6 lg:py-8 box-border">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">Agents</p>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                All agents
              </h1>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Agent configurations from your Swarms account
                (<code className="text-foreground">/v1/agents/list</code>).
              </p>
            </div>
            <button
              type="button"
              onClick={refetch}
              disabled={isLoading}
              className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-border bg-card text-foreground text-sm hover:bg-muted transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`}
              />
              Refresh
            </button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-5 pb-4 border-b border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {agents.length > 0 && (
                <span className="px-2 h-6 rounded-md border border-border bg-subtle inline-flex items-center tabular-nums">
                  {filteredAgents.length} of {agents.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {agents.length > 0 && (
                <div className="flex-1 lg:w-64">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search agents…"
                  />
                </div>
              )}
              <Link href="/">
                <Button variant="primary" size="md">
                  <Plus className="w-3.5 h-3.5" />
                  New agent
                </Button>
              </Link>
            </div>
          </div>

          {isLoading && agents.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-10 text-center">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Loading agent configurations…
              </p>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-border bg-card p-10 text-center">
              <XCircle className="w-5 h-5 mx-auto mb-3 text-danger" />
              <p className="text-sm text-foreground mb-2">{error}</p>
              <button
                type="button"
                onClick={refetch}
                className="text-sm text-accent hover:underline"
              >
                Retry
              </button>
            </div>
          ) : agents.length === 0 ? (
            <EmptyState
              title="No agents yet"
              description="Create your first agent to begin orchestration."
              showCta
            />
          ) : filteredAgents.length === 0 ? (
            <EmptyState
              title="No agents match"
              description="Try a different search query."
            />
          ) : (
            <>
              <AgentTable
                agents={paginatedAgents}
                onEditAgent={handleEditAgent}
                onExecuteAgent={handleExecuteAgent}
                showCreateButton={false}
              />
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredAgents.length}
                  onItemsPerPageChange={(newItemsPerPage) => {
                    setItemsPerPage(newItemsPerPage);
                    setCurrentPage(1);
                  }}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function EmptyState({
  title,
  description,
  showCta,
}: {
  title: string;
  description: string;
  showCta?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] rounded-lg border border-dashed border-border bg-subtle/50 p-10">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Users className="w-5 h-5 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold tracking-tight text-foreground mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mb-5 text-center max-w-sm">
        {description}
      </p>
      {showCta && (
        <Link href="/">
          <Button variant="primary" size="md">
            <Plus className="w-3.5 h-3.5" />
            Create agent
          </Button>
        </Link>
      )}
    </div>
  );
}
