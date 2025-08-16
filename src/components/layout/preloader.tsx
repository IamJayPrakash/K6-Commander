import { Rocket } from 'lucide-react';

const bootSequence = [
  { text: 'K6C_CORE::BOOTING...', delay: 100 },
  { text: 'INITIATING_SEQUENCE...', delay: 200 },
  { text: 'VERIFYING_DOCKER_DAEMON...[OK]', delay: 300 },
  { text: 'LOADING_K6_MODULES...[OK]', delay: 400 },
  { text: 'CONNECTING_GRAFANA_DS...[OK]', delay: 500 },
  { text: 'INITIALIZING_KERNELS...[OK]', delay: 600 },
  { text: 'DECRYPTING_UI_ASSETS...[OK]', delay: 700 },
  { text: 'BOOTING_UI...[OK]', delay: 800 },
];

export function Preloader() {
  return (
    <div className="flex h-screen items-center justify-center bg-background font-mono text-primary preloader-grid">
      <div className="w-full max-w-lg p-8 rounded-lg bg-background/80 backdrop-blur-sm border border-primary/20 glow-shadow">
        <div className="flex items-center gap-4 mb-6 border-b border-primary/20 pb-4">
          <Rocket className="h-8 w-8 text-primary animate-pulse" />
          <h1 className="text-3xl font-bold tracking-wider">K6 Commander</h1>
        </div>
        <div className="text-sm space-y-1">
          {bootSequence.map((item, index) => (
            <p
              key={index}
              className="overflow-hidden whitespace-nowrap animate-typewriter"
              style={{
                animationDelay: `${item.delay}ms`,
                animationTimingFunction: `steps(${item.text.length}, end)`,
                animationDuration: `${item.text.length * 40}ms`,
                width: '0',
              }}
            >
              <span className="text-primary/50 mr-2">&gt;</span>
              <span className="text-foreground/80">{item.text}</span>
            </p>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-2 text-base text-foreground animate-pulse" style={{ animationDelay: '1200ms' }}>
          <span>Awaiting final handshake</span>
          <span className="blinking-cursor" />
        </div>
      </div>
    </div>
  );
}
