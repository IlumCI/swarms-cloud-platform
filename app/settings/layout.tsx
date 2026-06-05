import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Settings',
  description:
    'Manage your Swarms Cloud API key, view your credit balance across paid, free, and referral credits, and tune appearance and runtime preferences.',
  path: '/settings',
  // Private user state; no need to index.
  index: false,
  keywords: [
    'Swarms account settings',
    'API key management',
    'credit balance',
    'workspace preferences',
  ],
});

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
