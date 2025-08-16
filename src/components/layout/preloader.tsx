import { Rocket } from 'lucide-react';

export function Preloader() {
  return (
    <div className="flex h-screen items-center justify-center bg-background font-mono text-primary">
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-radial-gradient"></div>

        <div className="z-10 flex flex-col items-center gap-6 text-center">
          {/* Pulsing/Glowing Logo */}
          <div className="relative">
            <div className="absolute -inset-2 rounded-full bg-primary/20 blur-2xl animate-pulse-slow"></div>
            <div className="relative rounded-full bg-primary/10 p-6 border-2 border-primary/30">
              <Rocket className="h-16 w-16 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tighter text-foreground">K6 Commander</h1>
          <p className="text-lg text-muted-foreground">Initializing Test Environment</p>

          {/* Progress Bar and Status */}
          <div className="w-64 overflow-hidden rounded-full bg-primary/10 mt-4">
            <div className="h-2 animate-progress rounded-full bg-gradient-to-r from-primary/50 to-primary"></div>
          </div>
          <p className="text-sm text-muted-foreground animate-status-text">
            System check complete...
          </p>
        </div>
      </div>
    </div>
  );
}
