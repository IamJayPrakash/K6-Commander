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
    <div className="flex h-screen items-center justify-center bg-black font-mono text-green-400">
      <div className="w-full max-w-md p-4">
        <div className="flex items-center gap-4 mb-4 border-b border-green-700/50 pb-2">
          <Rocket className="h-8 w-8 text-green-400" />
          <h1 className="text-2xl font-bold">K6 Commander</h1>
        </div>
        <div className="text-sm">
          {bootSequence.map((item, index) => (
            <p
              key={index}
              className="overflow-hidden whitespace-nowrap animate-typewriter"
              style={{
                animationDelay: `${item.delay}ms`,
                animationTimingFunction: `steps(${item.text.length}, end)`,
                animationDuration: `${item.text.length * 50}ms`,
                width: '0',
              }}
            >
              <span className="text-green-600/80 mr-2">&gt;</span>
              {item.text}
            </p>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span>Awaiting final handshake</span>
          <div className="w-2.5 h-4 bg-green-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
