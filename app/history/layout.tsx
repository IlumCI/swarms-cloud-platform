import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Execution history',
  description:
    'Full API request log for every agent and swarm execution on Swarms Cloud — sortable, searchable, and exportable. Inspect inputs, outputs, tokens, and cost per run.',
  path: '/history',
  keywords: [
    'agent execution history',
    'API request logs',
    'swarm logs',
    'agent observability',
    'execution analytics',
  ],
});

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
