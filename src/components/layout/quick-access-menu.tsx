
'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Home,
  Beaker,
  History,
  Info,
  Github,
  Compass,
  Zap,
  Rocket,
  Sun,
  Moon,
  Maximize,
  Minimize,
  Shield,
  FileText,
  Lock,
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

  return (
    <>
      <Draggable nodeRef={nodeRef} bounds="parent">
        <div
          ref={nodeRef}
          className="fixed bottom-6 right-6 z-[9999] cursor-grab active:cursor-grabbing"
          data-testid="quick-access-button-container"
        >
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <Button
              size="icon"
              onClick={() => setOpen(true)}
              className="relative w-16 h-16 rounded-full bg-background/80 backdrop-blur-md border border-primary/50 text-primary shadow-lg hover:shadow-primary/25 hover:border-primary transition-all duration-300 group-hover:scale-110"
              aria-label={t('quickAccess.title')}
            >
              <Compass className="w-8 h-8 transition-transform duration-500 group-hover:rotate-12" />
            </Button>
          </div>
        </div>
      </Draggable>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-md bg-background/90 backdrop-blur-xl border-border/50 shadow-2xl"
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
            {/* Navigation */}
            <div className="grid grid-cols-2 gap-3">
              {navItems.map((item) => (
                <Link href={item.href} key={item.href} onClick={() => setOpen(false)}>
                  <div
                    className="group flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-muted/50 hover:bg-accent/10 border border-transparent hover:border-accent/50 transition-all duration-300"
                    data-testid={`quick-access-link-${item.href}`}
                  >
                    <item.icon className="w-7 h-7 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
                    <span className="text-sm font-medium text-foreground group-hover:text-accent-foreground transition-colors duration-300 text-center">
                      {t(item.labelKey)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <Separator />

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-auto py-2 flex flex-col gap-2">
                    <Sun className="h-6 w-6" />
                    <span>{t('quickAccess.themeAction')}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onThemeToggle('light')}>Light</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onThemeToggle('dark')}>Dark</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onThemeToggle('system')}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                className="h-auto py-2 flex flex-col gap-2"
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
            </div>

            <Separator />

            {/* External Links */}
            <div className="flex justify-center gap-4">
              {externalLinks.map((item) => (
                <Link href={item.href} key={item.href} onClick={() => setOpen(false)}>
                  <Button variant="ghost" size="sm" className="flex flex-col gap-1 h-auto p-2">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs">{t(item.labelKey)}</span>
                  </Button>
                </Link>
              ))}
              <a href={APP_CONFIG.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="flex flex-col gap-1 h-auto p-2">
                  <Github className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs">GitHub</span>
                </Button>
              </a>
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
