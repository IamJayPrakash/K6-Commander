
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
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
  Languages,
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
import { ScrollArea } from '../ui/scroll-area';

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

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'zh', name: '中文 (Chinese)' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語 (Japanese)' },
  { code: 'ru', name: 'Русский (Russian)' },
  { code: 'ko', name: '한국어 (Korean)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
];

export default function QuickAccessMenu() {
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const nodeRef = useRef(null);
  const { setTheme } = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <>
      <Draggable
        nodeRef={nodeRef}
        axis="x"
        bounds="parent"
        defaultPosition={{ x: 0, y: 0 }}
      >
        <div
          ref={nodeRef}
          className="absolute top-full w-24 h-12 cursor-grab active:cursor-grabbing z-[100] group"
          onClick={() => setOpen(true)}
          role="button"
          aria-label={t('quickAccess.title')}
          data-testid="quick-access-menu-button"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  'w-full h-full transition-all duration-300 active:scale-90 animate-tilt',
                  'hover:[&>svg]:scale-105'
                )}
              >
                <svg
                  viewBox="0 0 100 45"
                  className="w-full h-full absolute top-0 left-0 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_hsl(var(--primary))] filter"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 50 45 L 25 30 V 0 H 75 V 30 L 50 45 Z"
                    className="fill-background/80 backdrop-blur-sm stroke-border/60 group-hover:stroke-primary transition-all"
                    strokeWidth="1"
                  />
                  <foreignObject x="25" y="0" width="50" height="30">
                    <div className="w-full h-full bg-honeycomb opacity-10"></div>
                  </foreignObject>
                  <circle
                    cx="50"
                    cy="18"
                    r="8"
                    className="fill-primary/20 stroke-primary/50 group-hover:fill-primary/30 transition-colors"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="50"
                    cy="18"
                    r="4"
                    className="fill-primary animate-pulse-glow transition-all"
                  />
                </svg>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('quickAccess.menuTooltip')}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </Draggable>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-md bg-background/90 backdrop-blur-xl border-border/50"
          data-testid="quick-access-dialog"
        >
          <DialogHeader className="space-y-2 text-center">
            <div className="inline-block mx-auto p-3 bg-primary/10 rounded-full border border-primary/20">
              <Rocket className="w-8 h-8 text-primary" />
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
                        data-testid={`quick-access-link-${item.href.replace('/', '') || 'new-test'}`}
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

            <div className="grid grid-cols-3 gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-auto py-2 flex flex-col gap-2 hover:bg-accent/10 w-full"
                      >
                        <Sun className="h-6 w-6" />
                        <span className="text-xs">{t('quickAccess.themeAction')}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('system')}>
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
                    className="h-auto py-2 flex flex-col gap-2 hover:bg-accent/10 w-full"
                    onClick={handleToggleFullscreen}
                  >
                    {isFullscreen ? (
                      <Minimize className="h-6 w-6" />
                    ) : (
                      <Maximize className="h-6 w-6" />
                    )}
                    <span className="text-xs">
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-auto py-2 flex flex-col gap-2 hover:bg-accent/10 w-full"
                      >
                        <Languages className="h-6 w-6" />
                        <span className="text-xs">{t('quickAccess.languageAction')}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <ScrollArea className="h-48">
                        {languages.map((lang) => (
                          <DropdownMenuItem
                            key={lang.code}
                            onClick={() => i18n.changeLanguage(lang.code)}
                          >
                            {lang.name}
                          </DropdownMenuItem>
                        ))}
                      </ScrollArea>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('quickAccess.languageTooltip')}</p>
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
            <span className="text-xs text-muted-foreground">{t('header.title')}</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
