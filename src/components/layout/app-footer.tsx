'use client';

import { Rocket } from 'lucide-react';
import Link from 'next/link';

export function AppFooter() {
  return (
    <footer className="border-t border-border/40 py-6 md:py-8">
      <div className="container max-w-screen-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">
              K6 Commander &copy; {new Date().getFullYear()}
            </p>
          </div>
          <nav className="flex items-center gap-4 md:gap-6 text-sm">
            <Link href="/terms" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Terms of Service
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Privacy Policy
            </Link>
            <Link href="/security" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Security
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
