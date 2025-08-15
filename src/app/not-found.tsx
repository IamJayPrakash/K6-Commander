'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, SatelliteDish } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center text-center px-4 font-mono">
      <div className="max-w-xl p-8 rounded-lg shadow-2xl bg-card/50 backdrop-blur-sm border border-border/20">
        <div className="relative mb-8 flex flex-col items-center justify-center">
          <SatelliteDish className="w-24 h-24 text-destructive/70 mb-6 animate-pulse" />
          <h1 className="text-9xl font-bold text-primary tracking-tighter relative">
            <span className="relative z-10">404</span>
            <span className="absolute -top-1 -left-1 text-accent/50 z-0 animate-pulse">404</span>
          </h1>
          <p className="text-3xl font-semibold mt-2 text-foreground">&lt;Signal Lost&gt;</p>
        </div>

        <p className="text-muted-foreground mt-4 mb-8">
          The requested resource is outside of our operational parameters. It may have been
          decommissioned, moved to a different sector, or never existed in this timeline.
        </p>

        <Button asChild size="lg">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Return to Command Center
          </Link>
        </Button>
      </div>
    </div>
  );
}
