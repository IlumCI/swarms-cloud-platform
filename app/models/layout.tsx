import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'AI model catalog',
  description:
    'Browse every AI model available on Swarms Cloud — GPT, Claude, Gemini, Llama, and more — ready to plug into agent and swarm configurations through the Swarms API.',
  path: '/models',
  keywords: [
    'AI model catalog',
    'LLM catalog',
    'GPT-4o',
    'Claude Sonnet',
    'Claude Opus',
    'Gemini',
    'Llama',
    'model selection',
    'OpenAI compatible',
  ],
});

export default function ModelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
