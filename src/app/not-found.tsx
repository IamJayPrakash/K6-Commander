'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, SatelliteDish, Zap, AlertTriangle, Terminal, Wifi } from 'lucide-react';

export default function NotFound() {
  const [glitchText, setGlitchText] = useState('404');
  const [scanningLine, setScanningLine] = useState(0);
  const [terminalText, setTerminalText] = useState('');

  const glitchVariations = ['404', '40#', '4⚡4', '#04', '404', '4Ø4', '404'];
  const terminalMessages = [
    '$ k6 run test.js',
    'ERROR: Resource not found',
    'Status: 404 - Signal Lost',
    'Retrying connection...',
    'Connection timeout',
    '$ ls -la /missing-resource',
    'ls: cannot access: No such file',
    '$ ping target-server',
    'Request timeout for icmp_seq 1',
    'Connection lost to remote host',
  ];

  useEffect(() => {
    // Glitch effect for 404 text
    const glitchInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * glitchVariations.length);
      setGlitchText(glitchVariations[randomIndex]);

      setTimeout(() => setGlitchText('404'), 150);
    }, 3000 + Math.random() * 2000);

    // Scanning line effect
    const scanInterval = setInterval(() => {
      setScanningLine((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 50);

    // Terminal text animation
    let terminalIndex = 0;
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (terminalIndex < terminalMessages.length) {
        const currentMessage = terminalMessages[terminalIndex];
        if (charIndex < currentMessage.length) {
          setTerminalText((prev) => prev + currentMessage[charIndex]);
          charIndex++;
        } else {
          setTerminalText((prev) => prev + '\n');
          terminalIndex++;
          charIndex = 0;
          if (terminalIndex >= terminalMessages.length) {
            setTimeout(() => {
              setTerminalText('');
              terminalIndex = 0;
            }, 3000);
          }
        }
      }
    }, 100);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(scanInterval);
      clearInterval(typeInterval);
    };
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center text-center px-4 font-mono relative overflow-hidden min-h-screen">

      {/* Floating Error Indicators */}
      <div className="absolute top-20 left-20 text-red-400 opacity-30 animate-float-error-1">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <div className="absolute top-32 right-24 text-yellow-400 opacity-30 animate-float-error-2">
        <Zap className="h-5 w-5" />
      </div>
      <div className="absolute bottom-32 left-16 text-red-500 opacity-30 animate-float-error-3">
        <Wifi className="h-5 w-5 animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-4xl mx-auto">
        <div className="max-w-xl mx-auto p-8 rounded-xl backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Card Glow Effect */}
          <div className="absolute -inset-1 from-red-500/20 via-yellow-500/20 to-red-500/20 rounded-xl blur-xl animate-pulse-error"></div>

          {/* Signal Animation Container */}
          <div className="relative mb-8 flex flex-col items-center justify-center">
            {/* Satellite Dish with Signal Rings */}
            <div className="relative mb-6">
              {/* Signal Rings */}
              <div className="absolute -inset-8 rounded-full border-2 border-red-500/20 animate-ping-slow"></div>
              <div className="absolute -inset-12 rounded-full border border-red-400/10 animate-ping-slower"></div>
              <div className="absolute -inset-6 rounded-full border-2 border-dashed border-yellow-500/30 animate-spin-slow"></div>

              {/* Satellite Container */}
              <div className="relative p-4 rounded-full bg-slate-800 border-2 border-red-500/50">
                <SatelliteDish className="w-16 h-16 text-red-400 animate-satellite-wobble" />

                {/* Disconnection Indicators */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>

            {/* Glitchy 404 Text */}
            <div className="relative mb-4">
              <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-400 to-red-400 tracking-tighter relative animate-gradient-shift">
                <span className="relative z-10">{glitchText}</span>
                <span className="absolute -top-1 -left-1 text-red-400/30 z-0">404</span>
                {/* <span className="absolute top-1 left-1 text-yellow-400/20 z-0 animate-glitch-reverse">404</span> */}
              </h1>

              {/* Static/Noise Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent animate-static"></div>
            </div>

            <div className="relative">
              <p className="text-2xl md:text-3xl font-semibold text-slate-200 mb-2">
                &lt;Signal Lost&gt;
              </p>
              <div className="flex items-center justify-center gap-2 text-red-400">
                <Terminal className="h-4 w-4" />
                <span className="text-sm font-mono animate-type-blink">CONNECTION_TIMEOUT</span>
              </div>
            </div>
          </div>

          {/* Error Description */}
          <div className="space-y-4 mb-8">
            <p className="text-slate-400 leading-relaxed">
              The requested resource is outside of our operational parameters. It may have been
              <span className="text-red-400 animate-pulse"> decommissioned</span>, moved to a different sector, or
              <span className="text-yellow-400"> never existed</span> in this timeline.
            </p>

            {/* Error Codes */}
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-500 uppercase tracking-wide">System Diagnostics</span>
              </div>
              <div className="text-xs font-mono text-slate-300 space-y-1">
                <div>HTTP_STATUS: <span className="text-red-400">404 NOT_FOUND</span></div>
                <div>PROTOCOL: <span className="text-yellow-400">K6_COMMANDER_v1.0</span></div>
                <div>TIMESTAMP: <span className="text-blue-400">{new Date().toISOString()}</span></div>
              </div>
            </div>
          </div>

          {/* Terminal Output Window */}
          <div className="bg-black/50 rounded-lg border border-slate-700/50 p-4 mb-6 min-h-[120px] relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3 border-b border-slate-700/50 pb-2">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-xs text-slate-400">terminal</span>
            </div>
            <div className="text-xs font-mono text-green-400 whitespace-pre-wrap">
              {terminalText}
              <span className="animate-terminal-cursor">█</span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            asChild
            size="lg"
            className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 group overflow-hidden"
            data-testid="return-home-button"
          >
            <Link href="/">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/10 to-blue-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <Home className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
              Return to Command Center
            </Link>
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes gridDrift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }

        @keyframes float-error-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(10deg); opacity: 0.6; }
        }

        @keyframes float-error-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-15px) rotate(-5deg); opacity: 0.5; }
        }

        @keyframes float-error-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-25px) rotate(8deg); opacity: 0.7; }
        }

        @keyframes pulse-error {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }

        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
        }

        @keyframes ping-slower {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes satellite-wobble {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes glitch-shadow {
          0%, 100% { transform: translate(0); opacity: 0.3; }
          20% { transform: translate(-2px, 2px); opacity: 0.8; }
          40% { transform: translate(2px, -2px); opacity: 0.4; }
          60% { transform: translate(-2px, -2px); opacity: 0.6; }
          80% { transform: translate(2px, 2px); opacity: 0.2; }
        }

        @keyframes glitch-reverse {
          0%, 100% { transform: translate(0); opacity: 0.2; }
          25% { transform: translate(2px, -2px); opacity: 0.6; }
          50% { transform: translate(-2px, 2px); opacity: 0.3; }
          75% { transform: translate(2px, 2px); opacity: 0.5; }
        }

        @keyframes static {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.1; }
        }

        @keyframes type-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }

        @keyframes terminal-cursor {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .animate-float-error-1 { animation: float-error-1 4s ease-in-out infinite; }
        .animate-float-error-2 { animation: float-error-2 5s ease-in-out infinite; }
        .animate-float-error-3 { animation: float-error-3 4.5s ease-in-out infinite; }
        .animate-pulse-error { animation: pulse-error 2s ease-in-out infinite; }
        .animate-ping-slow { animation: ping-slow 3s ease-out infinite; }
        .animate-ping-slower { animation: ping-slower 4s ease-out infinite; }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
        .animate-satellite-wobble { animation: satellite-wobble 3s ease-in-out infinite; }
        .animate-gradient-shift { animation: gradient-shift 3s ease-in-out infinite; background-size: 200% 200%; }
        .animate-glitch-shadow { animation: glitch-shadow 2s infinite linear alternate-reverse; }
        .animate-glitch-reverse { animation: glitch-reverse 2.5s infinite linear alternate; }
        .animate-static { animation: static 1s infinite linear; }
        .animate-type-blink { animation: type-blink 1.5s infinite; }
        .animate-terminal-cursor { animation: terminal-cursor 1s infinite; }
      `}</style>
    </div>
  );
}
