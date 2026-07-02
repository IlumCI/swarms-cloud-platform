'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExternalLink, Activity } from 'lucide-react';

const HIDE_ON_PATHS = ['/login', '/signup', '/auth'];

export function Footer() {
  const pathname = usePathname();
  if (pathname && HIDE_ON_PATHS.some((p) => pathname.startsWith(p))) return null;

  const year = new Date().getFullYear();
  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-30 w-full bg-subtle/95 backdrop-blur border-t border-border"
      style={{
        paddingLeft: 'max(0.75rem, env(safe-area-inset-left))',
        paddingRight: 'max(0.75rem, env(safe-area-inset-right))',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="h-9 w-full min-w-0 px-3 sm:px-4 flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 overflow-x-auto sidebar-scroll">
          <Link
            href="/learn-more"
            className="hover:text-foreground transition-colors whitespace-nowrap"
          >
            Learn More
          </Link>
          <a
            href="https://docs.swarms.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors whitespace-nowrap"
          >
            Docs
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <a
            href="https://status.swarms.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors whitespace-nowrap"
          >
            <Activity className="w-2.5 h-2.5" />
            Status
          </a>
          <a
            href="https://github.com/kyegomez/swarms"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors whitespace-nowrap"
          >
            GitHub
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          <span className="hidden sm:inline whitespace-nowrap">
            © {year}, Swarms Corporation. or its affiliates.
          </span>
          <span className="sm:hidden whitespace-nowrap">© {year} Swarms</span>
          <Link
            href="/privacy"
            className="hover:text-foreground transition-colors whitespace-nowrap"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="hover:text-foreground transition-colors whitespace-nowrap"
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
