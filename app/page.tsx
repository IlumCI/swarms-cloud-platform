'use client';

import React, { useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { RateLimitCard } from '@/components/dashboard/RateLimitCard';
import { useAgentStore } from '@/lib/store/agent-store';
import { useRateLimits } from '@/lib/hooks/useRateLimits';
import {
  Users,
  Plus,
  Activity,
  CheckCircle2,
  XCircle,
  Zap,
  Loader2,
  RefreshCw,
} from 'lucide-react';

export default function DashboardPage() {
  const agents = useAgentStore((state) => state.agents);
  const { rateLimits, isLoading, error, refetch } = useRateLimits();

  const metrics = useMemo(() => {
    const totalAgents = agents.length;
    const runningAgents = agents.filter((a) => a.status === 'running').length;
    const completedAgents = agents.filter((a) => a.status === 'completed').length;
    const errorAgents = agents.filter((a) => a.status === 'error').length;
    const idleAgents = agents.filter((a) => a.status === 'idle').length;

    const totalExecutions = agents.reduce(
      (sum, agent) => sum + agent.execution_history.length,
      0
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const agentsCreatedToday = agents.filter((agent) => {
      const createdDate = new Date(agent.created_at);
      createdDate.setHours(0, 0, 0, 0);
      return createdDate.getTime() === today.getTime();
    }).length;

    const successRate =
      totalAgents > 0 ? Math.round((completedAgents / totalAgents) * 100) : 0;

    return {
      totalAgents,
      agentsCreatedToday,
      runningAgents,
      completedAgents,
      errorAgents,
      idleAgents,
      totalExecutions,
      successRate,
    };
  }, [agents]);

  return (
    <div className="page-wrapper">
      <Navbar />

      <main className="page-main px-4 sm:px-6 lg:px-8 py-6 lg:py-8 box-border">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">Overview</p>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                Dashboard
              </h1>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Real-time analytics and rate-limit monitoring across your workspace.
              </p>
            </div>
            <button
              type="button"
              onClick={refetch}
              disabled={isLoading}
              className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-border bg-card text-foreground text-sm hover:bg-muted transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Primary metrics grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <MetricsCard
              title="Total agents"
              value={metrics.totalAgents}
              icon={Users}
              subtitle="All agents in workspace"
            />
            <MetricsCard
              title="Created today"
              value={metrics.agentsCreatedToday}
              icon={Plus}
              subtitle="New agents today"
            />
            <MetricsCard
              title="Running"
              value={metrics.runningAgents}
              icon={Activity}
              subtitle="Currently active"
            />
            <MetricsCard
              title="Executions"
              value={metrics.totalExecutions}
              icon={Zap}
              subtitle="All-time"
            />
          </div>

          {/* Status grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
            <MetricsCard
              title="Completed"
              value={metrics.completedAgents}
              icon={CheckCircle2}
              subtitle={`${metrics.successRate}% success rate`}
            />
            <MetricsCard
              title="Idle"
              value={metrics.idleAgents}
              icon={Users}
              subtitle="Waiting for tasks"
            />
            <MetricsCard
              title="Errors"
              value={metrics.errorAgents}
              icon={XCircle}
              subtitle="Failed agents"
            />
          </div>

          {/* Rate limits */}
          <section className="mb-6">
            <div className="flex items-end justify-between gap-3 mb-3">
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                Rate limits
              </h2>
              {rateLimits?.tier && (
                <span className="inline-flex items-center gap-1.5 px-2 h-6 rounded-md border border-border bg-subtle text-xs">
                  <span className="text-muted-foreground">Tier</span>
                  <span className="font-medium text-foreground">
                    {rateLimits.tier.toUpperCase()}
                  </span>
                </span>
              )}
            </div>

            {isLoading && !rateLimits ? (
              <div className="rounded-lg border border-border bg-card p-10 text-center">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading rate limits…</p>
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
            ) : rateLimits ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <RateLimitCard title="Per minute" window={rateLimits.rate_limits.minute} />
                <RateLimitCard title="Per hour" window={rateLimits.rate_limits.hour} />
                <RateLimitCard title="Per day" window={rateLimits.rate_limits.day} />
              </div>
            ) : null}
          </section>

          {/* Limit configuration */}
          {rateLimits?.limits && (
            <section className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-sm font-semibold tracking-tight text-foreground mb-4">
                Limit configuration
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <ConfigStat
                  label="Max / min"
                  value={rateLimits.limits.maximum_requests_per_minute}
                />
                <ConfigStat
                  label="Max / hour"
                  value={rateLimits.limits.maximum_requests_per_hour}
                />
                <ConfigStat
                  label="Max / day"
                  value={rateLimits.limits.maximum_requests_per_day}
                />
                <ConfigStat
                  label="Tokens / agent"
                  value={rateLimits.limits.tokens_per_agent}
                />
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function ConfigStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </div>
      <div className="text-lg font-semibold tabular-nums text-foreground">{value}</div>
    </div>
  );
}
