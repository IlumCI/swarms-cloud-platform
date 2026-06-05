import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Pricing calculator',
  description:
    'Estimate Swarms API costs by tokens, agents, and tools. Models the unified $6.50/M input and $18.50/M output token rate, agent cost, image, MCP, Exa search, and web-scraper add-ons, plus night-time discount and Frenzy Mode.',
  path: '/pricing',
  keywords: [
    'Swarms API pricing',
    'token pricing calculator',
    'AI cost estimator',
    'multi-agent pricing',
    'LLM cost calculator',
    'API cost calculator',
    'night-time discount',
    'batch pricing',
  ],
});

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
