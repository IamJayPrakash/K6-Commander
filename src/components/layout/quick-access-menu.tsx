'use client';

import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Home,
  Beaker,
  History,
  Info,
  Github,
  Bug,
  MessageSquarePlus,
  Compass,
  Zap,
  Rocket,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { APP_CONFIG } from '@/lib/constants';

const menuItems = [
  { href: '/', icon: Home, labelKey: 'quickAccess.home' },
  { href: '/api-tester', icon: Beaker, labelKey: 'quickAccess.apiTester' },
  { href: '/history', icon: History, labelKey: 'quickAccess.history' },
  { href: '/about', icon: Info, labelKey: 'quickAccess.about' },
];

const externalLinks = [
  { href: APP_CONFIG.githubUrl, icon: Github, labelKey: 'quickAccess.github' },
  { href: APP_CONFIG.bugReportUrl, icon: Bug, labelKey: 'quickAccess.bugReport' },
  {
    href: APP_CONFIG.featureRequestUrl,
    icon: MessageSquarePlus,
    labelKey: 'quickAccess.featureRequest',
  },
];

export default function QuickAccessMenu() {
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 200 });
  const [edgeAttached, setEdgeAttached] = useState('left');
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useTranslation();
  const nodeRef = useRef(null);

  const handleDrag = (e: any, data: any) => {
    setPosition({ x: data.x, y: data.y });
    const windowWidth = window.innerWidth;
    if (data.x + 35 < windowWidth / 2) {
      setEdgeAttached('left');
    } else {
      setEdgeAttached('right');
    }
  };

  const handleStopDrag = (e: any, data: any) => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    let finalX;
    if (data.x < windowWidth / 2) {
      finalX = -25;
    } else {
      finalX = windowWidth - 45;
    }
    const finalY = Math.max(20, Math.min(windowHeight - 70, data.y));
    setPosition({ x: finalX, y: finalY });
    setTimeout(() => setIsDragging(false), 100);
  };

  const handleClick = () => {
    if (!isDragging) {
      setOpen(true);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDragging && !open) {
        setIsVisible(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isDragging, open, position]);

  return (
    <>
      <Draggable
        nodeRef={nodeRef}
        onStart={() => {
          setIsDragging(true);
          setIsVisible(true);
        }}
        onDrag={handleDrag}
        onStop={handleStopDrag}
        position={position}
        bounds="body"
      >
        <div
          ref={nodeRef}
          className={`fixed z-[9999] cursor-grab active:cursor-grabbing transition-transform duration-500 ease-out ${
            isVisible
              ? 'translate-x-0'
              : edgeAttached === 'left'
                ? '-translate-x-10'
                : 'translate-x-10'
          }`}
          onMouseEnter={() => setIsVisible(true)}
          data-testid="quick-access-button-container"
        >
          <div className="relative group">
            <div
              className={`relative w-16 h-16 transition-all duration-300 ${
                isDragging ? 'scale-110' : 'scale-100'
              }`}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 animate-gradient-shift shadow-2xl animate-wavy-border"></div>
              <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-xl animate-pulse-glow"></div>
              <div className="absolute inset-1 rounded-full border-2 border-white/20 backdrop-blur-sm"></div>
              <Button
                size="icon"
                className="absolute inset-0 w-full h-full rounded-full bg-transparent hover:bg-white/10 border-0 shadow-none transition-all duration-300"
                onClick={handleClick}
                aria-label={t('quickAccess.title')}
              >
                <Compass
                  className={`w-7 h-7 text-white transition-transform duration-300 ${
                    isDragging ? 'rotate-45 scale-110' : 'rotate-0 scale-100'
                  }`}
                />
              </Button>
            </div>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-1 h-1 bg-white/60 rounded-full animate-float-particle-${
                  i + 1
                }`}
                style={{
                  top: `${20 + i * 10}%`,
                  left: `${30 + i * 15}%`,
                  animationDelay: `${i * 0.7}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </Draggable>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-xl blur-xl"></div>
          <div className="relative">
            <DialogHeader className="space-y-4">
              <DialogTitle className="flex items-center gap-3 text-2xl text-white">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm"></div>
                  <div className="relative bg-slate-800 p-2 rounded-full">
                    <Compass className="text-blue-400 w-6 h-6" />
                  </div>
                </div>
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {t('quickAccess.title')}
                </span>
              </DialogTitle>
              <DialogDescription className="text-slate-300">
                {t('quickAccess.description')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 pt-6">
              {menuItems.map((item, index) => (
                <Link href={item.href} key={item.href} onClick={() => setOpen(false)}>
                  <div
                    className="group relative flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-700/60 border border-slate-700/30 hover:border-blue-500/30 transition-all duration-300 overflow-hidden"
                    data-testid={`quick-access-link-${item.labelKey}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 p-2 rounded-lg bg-slate-700/50 group-hover:bg-blue-500/20 transition-colors duration-300">
                      <item.icon className="w-6 h-6 text-slate-300 group-hover:text-blue-400 transition-colors duration-300" />
                    </div>
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors duration-300 text-center">
                      {t(item.labelKey)}
                    </span>
                    <div className="absolute inset-0 rounded-xl border border-blue-500/0 group-hover:border-blue-500/30 transition-colors duration-300"></div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-t-slate-700"></div>
              </div>
              <div className="relative flex justify-center">
                <div className="bg-slate-900 px-4">
                  <Zap className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {externalLinks.map((item, index) => (
                <a
                  href={item.href}
                  key={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                >
                  <div
                    className="group relative flex flex-col items-center justify-center gap-2 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700/20 hover:border-purple-500/30 transition-all duration-300"
                    data-testid={`quick-access-external-link-${item.labelKey}`}
                    style={{ animationDelay: `${(index + 4) * 0.1}s` }}
                  >
                    <item.icon className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors duration-300" />
                    <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors duration-300 text-center leading-tight">
                      {t(item.labelKey)}
                    </span>
                  </div>
                </a>
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-slate-700/30">
              <Rocket className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-500">K6 Commander</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}