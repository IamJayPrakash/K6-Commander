
'use client';

import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Beaker,
  History,
  Info,
  Github,
  Sun,
  Moon,
  Maximize,
  Minimize,
  Shield,
  FileText,
  Lock,
  Rocket,
  TestTube,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { APP_CONFIG } from '@/lib/constants';
import Draggable from 'react-draggable';
import { Separator } from '../ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: TestTube, labelKey: 'quickAccess.newTest' },
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

  const handleHandleClick = () => {
    setOpen(true);
  };

  return (
    <>
      <Draggable nodeRef={nodeRef} axis="x" bounds="parent" defaultPosition={{ x: 0, y: 0 }}>
        <div
          ref={nodeRef}
          className="absolute top-full w-[120px] h-[55px] cursor-grab active:cursor-grabbing z-[9999]"
          role="button"
          aria-label={t('quickAccess.title')}
          onClick={handleHandleClick}
          data-testid="quick-access-menu-button"
        >
          <div
            className={cn(
              'w-full h-full group transition-all duration-300 active:scale-90',
              'hover:[&>svg]:scale-110 hover:[&>svg]:-translate-y-1'
            )}
          >
            <svg
              viewBox="0 0 120 55"
              className="w-full h-full absolute top-0 left-0 transition-all duration-300 animate-tilt"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M0 0 H120 V20 Q110 25 100 20 T80 20 T60 20 T40 20 T20 20 Q10 25 0 20 V0 Z"
                className="fill-background/80 backdrop-blur-sm stroke-border/60"
                strokeWidth="1.5"
              />
              <path
                d="M30 40 Q40 55 60 55 T90 40"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                fill="none"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                filter="url(#glow)"
              />
              <path
                d="M40 35 Q50 50 60 50 T80 35"
                stroke="hsl(var(--accent))"
                strokeWidth="1.5"
                fill="none"
                className="opacity-0 group-hover:opacity-80 transition-opacity duration-300"
                style={{ animationDelay: '0.2s' }}
                filter="url(#glow)"
              />
            </svg>

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/50 group-hover:bg-primary/30 transition-colors">
              <div className="w-5 h-5 rounded-full bg-primary animate-pulse-glow" />
            </div>
          </div>
        </div>
      </Draggable>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-md bg-background/90 backdrop-blur-xl border-border/50"
          data-testid="quick-access-dialog"
        >
          <DialogHeader className="space-y-2 text-center">
            <div className="inline-block mx-auto p-3 bg-primary/10 rounded-full border border-primary/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <path d="m3.27 6.96 8.73 5.05 8.73-5.05" />
                <path d="M12 22.08V12" />
              </svg>
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
                        data-testid={`quick-access-link-${item.href.replace('/', '')}`}
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
