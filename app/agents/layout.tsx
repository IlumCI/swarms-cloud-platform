import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Agents',
  description:
    'Manage every AI agent in your Swarms Cloud workspace. Browse, edit, and orchestrate agent configurations powered by the Swarms API.',
  path: '/agents',
  keywords: [
    'AI agent management',
    'agent configurations',
    'agent dashboard',
    'list agents',
    'Swarms agents',
  ],
});

export default function AgentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
