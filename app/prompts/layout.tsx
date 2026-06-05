import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Prompt generator',
  description:
    'Auto-generate production-grade system prompts for AI agents on Swarms Cloud. The specialized Prompt Architect agent (claude-sonnet-4-6) turns a one-line brief into a drop-in deployable prompt.',
  path: '/prompts',
  keywords: [
    'prompt generator',
    'system prompt generator',
    'AI prompt engineering',
    'prompt architect',
    'auto prompt',
    'claude sonnet',
    'production prompts',
  ],
});

export default function PromptsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
