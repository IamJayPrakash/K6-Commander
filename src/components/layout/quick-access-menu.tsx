
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Home,
  Beaker,
  History,
  Info,
  Github,
  Compass,
  Sun,
  Moon,
  Maximize,
  Minimize,
  Shield,
  FileText,
  Lock,
  Rocket,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { APP_CONFIG } from '@/lib/constants';
import Draggable, { type DraggableData, type DraggableEvent } from 'react-draggable';
import { Separator } from '../ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { href: '/', icon: Home, labelKey: 'quickAccess.home' },
  { href: '/api-tester', icon: Beaker, labelKey: 'quickAccess.apiTester' },
  { href: '/history', icon: History, labelKey: 'quickAccess.history' },
  { href: '/about', icon: Info, labelKey: 'quickAccess.about' },
];

const externalLinks = [
  { href: '/terms', icon: FileText, labelKey: 'footer.termsLink' },
  { href: '/privacy', icon: Shield, labelKey: 'footer.privacyLink' },
  { href: '/security', icon: Lock, labelKey: 'footer.securityLink' },
];

export default function QuickAccessMenu({
  onThemeToggle,
  onFullscreenToggle,
  isFullscreen,
}: {
  onThemeToggle: (theme: string) => void;
  onFullscreenToggle: () => void;
  isFullscreen: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const nodeRef = useRef(null);
  const [position, setPosition] = useState({ x: window.innerWidth - 60, y: window.innerHeight / 2 - 56 });
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStop = (e: DraggableEvent, data: DraggableData) => {
    setIsDragging(false);
    // Snap to the nearest vertical edge
    if (data.x < window.innerWidth / 2) {
      setPosition({ x: 0, y: data.y });
    } else {
      setPosition({ x: window.innerWidth - 60, y: data.y });
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleClick = () => {
    if (!isDragging) {
      setOpen(true);
    }
  };

  // Adjust position on window resize
  useEffect(() => {
    const handleResize = () => {
      setPosition((pos) => {
        // If it's on the right edge, keep it on the right edge
        if (pos.x > window.innerWidth / 2) {
          return { x: window.innerWidth - 60, y: pos.y };
        }
        return { x: 0, y: pos.y };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const attachedToLeft = position.x < window.innerWidth / 2;

  return (
    <>
      <Draggable
        nodeRef={nodeRef}
        handle=".handle"
        position={position}
        onStop={handleDragStop}
        onStart={handleDragStart}
        onDrag={(e, data) => setPosition({ x: data.x, y: data.y })}
        bounds="parent" // This will be constrained by the new parent in client-layout
      >
        <div
          ref={nodeRef}
          className="fixed z-[9999] cursor-grab active:cursor-grabbing w-[60px] h-[112px] group"
          data-testid="quick-access-button-container"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="handle w-full h-full"
                  onClick={handleClick}
                  role="button"
                  aria-label={t('quickAccess.title')}
                >
                  <div className="relative w-full h-full text-primary-foreground/80 hover:text-primary-foreground focus:outline-none transition-all duration-300 transform active:scale-90">
                    <div className="absolute inset-0.5 animate-ripple-1 rounded-full group-hover:bg-primary/20"></div>
                    <div className="absolute inset-0.5 animate-ripple-2 rounded-full group-hover:bg-primary/20"></div>
                    <div className="absolute inset-0.5 animate-ripple-3 rounded-full group-hover:bg-primary/20"></div>
                    <svg
                      viewBox="0 0 60 112"
                      className="absolute inset-0 w-full h-full"
                      style={{ transform: attachedToLeft ? 'scaleX(-1)' : 'scaleX(1)' }}
                    >
                      <path
                        d="M60 112C60 112 0 112 0 112 0 112 0 97 0 87 0 56 30 56 30 56 60 56 60 25 60 0 60 0 60 112 60 112Z"
                        className="fill-primary/80 backdrop-blur-md transition-colors duration-300 group-hover:fill-primary animate-tilt"
                      />
                    </svg>
                    <div
                      className="relative w-full h-full flex items-center justify-center"
                      style={{ transform: attachedToLeft ? 'scaleX(-1)' : 'scaleX(1)' }}
                    >
                      <Compass className="w-7 h-7 transition-transform duration-500 group-hover:rotate-12" />
                    </div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side={attachedToLeft ? 'right' : 'left'}>
                <p>{t('quickAccess.title')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Draggable>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-md bg-background/90 backdrop-blur-xl border-border/50"
          data-testid="quick-access-dialog"
        >
          <DialogHeader className="space-y-2 text-center">
            <div className="inline-block mx-auto p-3 bg-primary/10 rounded-full border border-primary/20">
              <Compass className="text-primary w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-bold">{t('quickAccess.title')}</DialogTitle>
            <DialogDescription>{t('quickAccess.description')}</DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {navItems.map((item) => (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link href={item.href} onClick={() => setOpen(false)}>
                      <div
                        className="group flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-muted/50 hover:bg-accent/10 border border-transparent hover:border-accent/50 transition-all duration-300 h-full"
                        data-testid={`quick-access-link-${item.href}`}
                      >
                        <item.icon className="w-7 h-7 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
                        <span className="text-sm font-medium text-foreground group-hover:text-accent-foreground transition-colors duration-300 text-center">
                          {t(item.labelKey)}
                        </span>
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t(item.labelKey)}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-auto py-2 flex flex-col gap-2 hover:bg-accent/10"
                      >
                        <Sun className="h-6 w-6" />
                        <span>{t('quickAccess.themeAction')}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => onThemeToggle('light')}>
                        Light
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onThemeToggle('dark')}>Dark</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onThemeToggle('system')}>
                        System
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('quickAccess.themeTooltip')}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-auto py-2 flex flex-col gap-2 hover:bg-accent/10"
                    onClick={onFullscreenToggle}
                  >
                    {isFullscreen ? (
                      <Minimize className="h-6 w-6" />
                    ) : (
                      <Maximize className="h-6 w-6" />
                    )}
                    <span>
                      {isFullscreen
                        ? t('header.exitFullscreenLabel')
                        : t('header.enterFullscreenLabel')}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isFullscreen
                      ? t('header.exitFullscreenLabel')
                      : t('header.enterFullscreenLabel')}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>

            <Separator />

            <div className="flex justify-center gap-4">
              {externalLinks.map((item) => (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link href={item.href} onClick={() => setOpen(false)}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex flex-col gap-1 h-auto p-2"
                      >
                        <item.icon className="w-5 h-5 text-muted-foreground" />
                        <span className="text-xs">{t(item.labelKey)}</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t(item.labelKey)}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href={APP_CONFIG.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm" className="flex flex-col gap-1 h-auto p-2">
                      <Github className="w-5 h-5 text-muted-foreground" />
                      <span className="text-xs">GitHub</span>
                    </Button>
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('header.githubLabel')}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 pt-4 border-t border-border/30">
            <Rocket className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">K6 Commander</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
