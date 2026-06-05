import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Workbench',
  description:
    'Build, configure, and run agents on Swarms Cloud. Tune model, prompt, temperature, and tools, then execute against the production Swarms API in one click.',
  path: '/workbench',
  keywords: [
    'agent workbench',
    'AI agent builder',
    'configure agents',
    'prompt engineering',
    'agent IDE',
  ],
});

export default function WorkbenchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
