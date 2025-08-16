'use client';

import React, { useState } from 'react';
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
  const { t } = useTranslation();

  return (
    <>
      <div
        className="fixed bottom-6 right-6 z-[999]"
        data-testid="quick-access-button-container"
      >
        <div className="relative group">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <Button
            size="icon"
            onClick={() => setOpen(true)}
            className="relative w-16 h-16 rounded-full bg-slate-900 hover:bg-slate-800 text-white leading-none flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            aria-label={t('quickAccess.title')}
          >
            <Compass className="w-8 h-8 transition-transform duration-500 group-hover:rotate-12" />
          </Button>
        </div>
      </div>

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
