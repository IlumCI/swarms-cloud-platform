import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'API Keys',
  description:
    'View, create, and revoke the API keys that authenticate your apps against the Swarms API.',
  path: '/api-keys',
  // Private user state; no need to index.
  index: false,
  keywords: ['Swarms API keys', 'create API key', 'revoke API key'],
});

export default function ApiKeysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
