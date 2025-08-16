
'use client';

import React, { useState, useRef } from 'react';
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
  Rocket,
  Home,
  Beaker,
  History,
  Info,
  Github,
  Bug,
  MessageSquarePlus,
  Compass,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { APP_CONFIG } from '@/lib/constants';
import { Separator } from '../ui/separator';

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
  const { t } = useTranslation();
  const nodeRef = useRef(null);

  const handleStopDrag = () => {
    setTimeout(() => {
      setIsDragging(false);
    }, 0);
  };

  const handleClick = () => {
    if (!isDragging) {
      setOpen(true);
    }
  };

  return (
    <>
      <Draggable
        nodeRef={nodeRef}
        onStart={() => setIsDragging(true)}
        onStop={handleStopDrag}
        bounds="parent"
        defaultPosition={{ x: 20, y: 200 }}
      >
        <div
          ref={nodeRef}
          className="fixed z-50 cursor-grab active:cursor-grabbing"
          data-testid="quick-access-button-container"
        >
          <Button
            size="icon"
            className="w-14 h-14 rounded-full shadow-lg"
            onClick={handleClick}
            aria-label={t('quickAccess.title')}
          >
            <Compass className="w-7 h-7" />
          </Button>
        </div>
      </Draggable>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-testid="quick-access-dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Compass className="text-primary" /> {t('quickAccess.title')}
            </DialogTitle>
            <DialogDescription>{t('quickAccess.description')}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 pt-4">
            {menuItems.map((item) => (
              <Link href={item.href} key={item.href} onClick={() => setOpen(false)}>
                <div
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-md bg-muted/50 hover:bg-accent hover:text-accent-foreground transition-colors"
                  data-testid={`quick-access-link-${item.labelKey}`}
                >
                  <item.icon className="w-8 h-8" />
                  <span className="text-sm font-medium">{t(item.labelKey)}</span>
                </div>
              </Link>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-3 gap-2">
            {externalLinks.map((item) => (
              <a
                href={item.href}
                key={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
              >
                <div
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-md bg-muted/50 hover:bg-accent hover:text-accent-foreground transition-colors"
                  data-testid={`quick-access-external-link-${item.labelKey}`}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-xs font-medium text-center">{t(item.labelKey)}</span>
                </div>
              </a>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
