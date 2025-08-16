import React, { useState, useEffect } from 'react';
import { Rocket, Terminal, Zap, Code, Activity } from 'lucide-react';

export function Preloader() {
  const [currentStatus, setCurrentStatus] = useState(0);
  const [progress, setProgress] = useState(0);

  const statusMessages = [
    "Initializing K6 Runtime...",
    "Loading Test Scripts...",
    "Configuring Environment...",
    "Establishing Connections...",
    "System Ready"
  ];

  useEffect(() => {
    const statusInterval = setInterval(() => {
      setCurrentStatus(prev => (prev + 1) % statusMessages.length);
    }, 1500);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + Math.random() * 3;
      });
    }, 100);

    return () => {
      clearInterval(statusInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-slate-950 font-mono text-slate-100 overflow-hidden relative">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }}></div>
      </div>

      {/* Floating Code Snippets */}
      <div className="absolute top-20 left-20 text-xs text-slate-400 opacity-30 animate-float-1">
        <Code className="h-4 w-4 mb-1" />
        <div>import k6 from 'k6';</div>
      </div>
      <div className="absolute top-32 right-24 text-xs text-slate-400 opacity-30 animate-float-2">
        <Terminal className="h-4 w-4 mb-1" />
        <div>k6 run script.js</div>
      </div>
      <div className="absolute bottom-32 left-16 text-xs text-slate-400 opacity-30 animate-float-3">
        <Activity className="h-4 w-4 mb-1" />
        <div>checks: 100%</div>
      </div>

      {/* Main Content */}
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
        {/* Radial Gradient Background */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-950/30 via-slate-950/50 to-slate-950"></div>

        {/* Rocket Launch Animation */}
        <div className="z-10 flex flex-col items-center gap-8 text-center">
          <div className="relative">
            {/* Outer Glow Ring */}
            <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl animate-pulse-glow"></div>
            
            {/* Rotating Technical Ring */}
            <div className="absolute -inset-6 rounded-full border border-blue-500/30 animate-spin-slow"></div>
            <div className="absolute -inset-4 rounded-full border-2 border-dashed border-blue-400/20 animate-spin-reverse"></div>
            
            {/* Inner Glow */}
            <div className="absolute -inset-3 rounded-full bg-blue-500/10 blur-xl animate-pulse-fast"></div>
            
            {/* Rocket Container */}
            <div className="relative rounded-full bg-gradient-to-br from-slate-800 to-slate-900 p-8 border border-blue-500/50 shadow-2xl backdrop-blur-sm">
              <Rocket className="h-20 w-20 text-blue-400 animate-rocket-float" />
              
              {/* Thrust Effect */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-12 bg-gradient-to-t from-orange-500/80 via-yellow-500/60 to-transparent rounded-full animate-thrust blur-sm"></div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-8 bg-gradient-to-t from-white/90 via-yellow-400/80 to-transparent rounded-full animate-thrust-core"></div>
            </div>

            {/* Orbiting Elements */}
            <div className="absolute -inset-12 animate-orbit">
              <Zap className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-4 text-yellow-400" />
            </div>
            <div className="absolute -inset-12 animate-orbit-reverse">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full"></div>
            </div>
          </div>

          {/* Title with Glitch Effect */}
          <div className="relative">
            <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 animate-gradient-shift">
              K6 Commander
            </h1>
            <div className="absolute inset-0 text-5xl font-bold tracking-tight text-blue-400 opacity-20 animate-glitch">
              K6 Commander
            </div>
          </div>
          
          <p className="text-slate-400 text-lg">Performance Testing Suite</p>
        </div>

        {/* Enhanced Smoke/Particle Effects */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute bottom-[35%] left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-t from-slate-600/30 to-transparent animate-smoke-drift-${i % 3 + 1}`}
            style={{
              width: `${12 + i * 4}px`,
              height: `${12 + i * 4}px`,
              animationDelay: `${i * 0.3}s`,
              left: `${50 + (i - 3) * 3}%`
            }}
          ></div>
        ))}

        {/* Status Panel */}
        <div className="absolute bottom-20 z-20 flex flex-col items-center w-96">
          {/* Status Text */}
          <div className="mb-4 text-center">
            <p className="text-blue-400 text-sm font-semibold mb-1">SYSTEM STATUS</p>
            <p className="text-slate-300 text-lg font-mono animate-type-writer">
              {statusMessages[currentStatus]}
            </p>
          </div>
          
          {/* Progress Bar Container */}
          <div className="w-full bg-slate-800 rounded-full border border-slate-700 overflow-hidden backdrop-blur-sm">
            <div 
              className="h-3 bg-gradient-to-r from-blue-500 via-blue-400 to-purple-500 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              {/* Scanning effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-scan"></div>
            </div>
          </div>
          
          {/* Progress Percentage */}
          <p className="text-slate-400 text-sm font-mono mt-2">
            {Math.floor(progress)}% Complete
          </p>
          
          {/* System Indicators */}
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-400">ENGINE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <span className="text-xs text-slate-400">RUNTIME</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <span className="text-xs text-slate-400">NETWORK</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-2deg); }
        }
        
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        
        @keyframes pulse-fast {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        
        @keyframes rocket-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(1deg); }
          75% { transform: translateY(3px) rotate(-1deg); }
        }
        
        @keyframes thrust {
          0%, 100% { opacity: 0.8; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.2); }
        }
        
        @keyframes thrust-core {
          0%, 100% { opacity: 0.9; transform: scaleY(1) scaleX(1); }
          50% { opacity: 1; transform: scaleY(1.3) scaleX(0.8); }
        }
        
        @keyframes orbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes orbit-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-1px, 1px); }
          40% { transform: translate(1px, -1px); }
          60% { transform: translate(-1px, -1px); }
          80% { transform: translate(1px, 1px); }
        }
        
        @keyframes smoke-drift-1 {
          0% { opacity: 0; transform: translate(-50%, 0) scale(0.5); }
          20% { opacity: 0.6; }
          100% { opacity: 0; transform: translate(-50%, -100px) scale(2); }
        }
        
        @keyframes smoke-drift-2 {
          0% { opacity: 0; transform: translate(-50%, 0) scale(0.3); }
          30% { opacity: 0.4; }
          100% { opacity: 0; transform: translate(-50%, -120px) scale(2.5); }
        }
        
        @keyframes smoke-drift-3 {
          0% { opacity: 0; transform: translate(-50%, 0) scale(0.4); }
          25% { opacity: 0.5; }
          100% { opacity: 0; transform: translate(-50%, -80px) scale(1.8); }
        }
        
        @keyframes type-writer {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-float-1 { animation: float-1 4s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 5s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 4.5s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-pulse-fast { animation: pulse-fast 1.5s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 12s linear infinite; }
        .animate-rocket-float { animation: rocket-float 3s ease-in-out infinite; }
        .animate-thrust { animation: thrust 0.3s ease-in-out infinite; }
        .animate-thrust-core { animation: thrust-core 0.2s ease-in-out infinite; }
        .animate-orbit { animation: orbit 6s linear infinite; }
        .animate-orbit-reverse { animation: orbit-reverse 8s linear infinite; }
        .animate-gradient-shift { animation: gradient-shift 3s ease-in-out infinite; background-size: 200% 200%; }
        .animate-glitch { animation: glitch 2s infinite linear alternate-reverse; }
        .animate-smoke-drift-1 { animation: smoke-drift-1 2s ease-out infinite; }
        .animate-smoke-drift-2 { animation: smoke-drift-2 2.5s ease-out infinite; }
        .animate-smoke-drift-3 { animation: smoke-drift-3 2.2s ease-out infinite; }
        .animate-type-writer { animation: type-writer 2s ease-in-out infinite; }
        .animate-scan { animation: scan 2s linear infinite; }
        
        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}
