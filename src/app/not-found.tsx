
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFound() {
  return (
        <div className="flex-1 flex items-center justify-center text-center px-4">
        <div className="max-w-md p-8 rounded-lg shadow-2xl bg-card/50 backdrop-blur-sm border border-border/20">
          <div className="relative mb-8 flex items-center justify-center">
            <AlertTriangle className="w-16 h-16 text-destructive animate-pulse mr-4" />
            <div>
              <h1 className="text-8xl font-bold text-primary tracking-tighter">404</h1>
              <p className="text-2xl font-semibold mt-2">Resource Lost</p>
            </div>
          </div>

          <p className="text-muted-foreground mt-4 mb-8">
            The resource you're looking for has been misplaced in the digital void. It may have been moved, deleted, or never existed.
          </p>

          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Return to Command Center
            </Link>
          </Button>
        </div>
      </div>
  );
}
