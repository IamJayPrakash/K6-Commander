import { Rocket } from 'lucide-react';

export function Preloader() {
  return (
    <div className="flex h-screen items-center justify-center bg-background font-mono text-primary preloader-grid">
      <div className="w-full max-w-md p-8 text-left">
        <div className="overflow-hidden">
          <p className="animate-typewriter whitespace-nowrap overflow-hidden">
            &gt; Initializing K6 Commander...
          </p>
          <p
            className="animate-typewriter whitespace-nowrap overflow-hidden"
            style={{ animationDelay: '2s' }}
          >
            &gt; Booting local-first test environment...
          </p>
          <p
            className="animate-typewriter whitespace-nowrap overflow-hidden"
            style={{ animationDelay: '4s' }}
          >
            &gt; Calibrating performance metrics...
          </p>
          <p
            className="animate-typewriter whitespace-nowrap overflow-hidden text-green-400"
            style={{ animationDelay: '6s' }}
          >
            &gt; System ready. Welcome, Commander.
            <span
              className="blinking-cursor"
              style={{ animationDelay: '6s', animationIterationCount: 'infinite' }}
            ></span>
          </p>
        </div>
      </div>
    </div>
  );
}
