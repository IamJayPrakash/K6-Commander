import { Rocket } from 'lucide-react';

export function Preloader() {
  return (
    <div className="flex h-screen items-center justify-center bg-background font-mono text-primary preloader-grid">
      <div className="w-full max-w-md p-8 text-center">
        <div className="inline-block relative">
          <Rocket className="h-20 w-20 text-primary animate-pulse" style={{ animationDuration: '1.5s' }} />
           <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping -z-10"></div>
        </div>
        <h1 className="text-4xl font-bold tracking-wider text-foreground mt-6">K6 Commander</h1>
        <p className="text-muted-foreground mt-2 animate-pulse" style={{ animationDelay: '500ms' }}>
          Initializing application...
        </p>
      </div>
    </div>
  );
}
