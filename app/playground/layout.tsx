import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

// The playground reads useSearchParams() — opt out of prerender so SEO
// metadata still applies without forcing a Suspense rewrite of the page.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildMetadata({
  title: 'Playground',
  description:
    'Compose, configure, and run multi-agent swarms in the browser. Experiment with collaboration patterns, models, and tools on Swarms Cloud — no setup required.',
  path: '/playground',
  keywords: [
    'agent playground',
    'swarm playground',
    'multi-agent demo',
    'agent prototype',
    'AI sandbox',
    'try Swarms',
  ],
});

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
