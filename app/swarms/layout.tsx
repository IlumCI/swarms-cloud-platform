import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Swarm types',
  description:
    'Explore every multi-agent architecture supported by the Swarms API — Hierarchical Swarm, Sequential Workflow, Concurrent Workflow, Mixture of Agents, Council as a Judge, Debate with Judge, Multi-Agent Router, Auto Swarm Builder, and more.',
  path: '/swarms',
  keywords: [
    'multi-agent architectures',
    'swarm topologies',
    'HierarchicalSwarm',
    'SequentialWorkflow',
    'ConcurrentWorkflow',
    'MixtureOfAgents',
    'CouncilAsAJudge',
    'DebateWithJudge',
    'MultiAgentRouter',
    'AutoSwarmBuilder',
    'BatchedGridWorkflow',
    'MajorityVoting',
    'PlannerWorkerSwarm',
    'RoundRobin',
    'agent collaboration patterns',
  ],
});

export default function SwarmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
