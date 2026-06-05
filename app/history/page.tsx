'use client';

import React, { useMemo, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { LogCard } from '@/components/outputs/LogCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { Pagination } from '@/components/ui/Pagination';
import { useSwarmLogs } from '@/lib/hooks/useSwarmLogs';
import {
  Clock,
  Loader2,
  RefreshCw,
  XCircle,
} from 'lucide-react';

export default function HistoryPage() {
  const { logs, count, isLoading, error, refetch } = useSwarmLogs();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;
    const query = searchQuery.toLowerCase().trim();
    return logs.filter((log) => {
      const name = log.agentName?.toLowerCase() || '';
      const endpoint = log.endpoint?.toLowerCase() || '';
      const id = log.id.toLowerCase();
      const timestamp = log.timestamp?.toLowerCase() || '';
      const task = log.task?.toLowerCase() || '';
      const raw =
        log.raw && typeof log.raw === 'object'
          ? JSON.stringify(log.raw).toLowerCase()
          : '';
      return (
        name.includes(query) ||
        endpoint.includes(query) ||
        id.includes(query) ||
        timestamp.includes(query) ||
        task.includes(query) ||
        raw.includes(query)
      );
    });
  }, [logs, searchQuery]);

  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="page-main px-4 sm:px-6 lg:px-8 py-6 lg:py-8 box-border">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col gap-1 mb-6">
            <p className="text-xs text-muted-foreground">Activity</p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Execution history
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              API request logs from{' '}
              <code className="text-foreground">/v1/swarm/logs</code>, sorted by
              recency.
            </p>
          </div>

          {!(isLoading && logs.length === 0) && (
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-border">
              <span className="px-2 h-6 rounded-md border border-border bg-subtle inline-flex items-center text-xs tabular-nums text-muted-foreground flex-shrink-0">
                {filteredLogs.length} of {count ?? logs.length}
              </span>
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by agent, endpoint, ID, task, or timestamp…"
                className="flex-1"
              />
              <button
                type="button"
                onClick={refetch}
                disabled={isLoading}
                aria-label="Refresh"
                title="Refresh"
                className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 flex-shrink-0"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`}
                />
              </button>
            </div>
          )}

          {isLoading && logs.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-10 text-center">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading logs…</p>
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
          ) : logs.length === 0 ? (
            <EmptyState
              title="No execution history"
              description="Execute agents to see their history here."
            />
          ) : filteredLogs.length === 0 ? (
            <EmptyState
              title="No logs match"
              description="Try a different search query."
            />
          ) : (
            <>
              <div className="space-y-3">
                {paginatedLogs.map((log) => (
                  <LogCard key={log.id} entry={log} />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredLogs.length}
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
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] rounded-lg border border-dashed border-border bg-subtle/50 p-10">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Clock className="w-5 h-5 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold tracking-tight text-foreground mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        {description}
      </p>
    </div>
  );
}
