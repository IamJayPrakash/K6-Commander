
'use client';

import {
  Rocket,
  History,
  Info,
  Github,
  MessageSquarePlus,
  Bug,
  Menu,
  Languages,
  Beaker,
  Sun,
  Moon,
  Compass,
} from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import QuickAccessMenu from './quick-access-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/lib/constants';
import Link from 'next/link';
import { useTheme } from 'next-themes';

export function AppHeader() {
  const { t, i18n } = useTranslation();
  const { setTheme } = useTheme();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

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

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      data-testid="app-header"
    >
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <QuickAccessMenu />
        <div className="mr-4 flex items-center">
          <Link
            href="/"
            className="mr-6 flex items-center space-x-2 cursor-pointer"
            data-testid="home-link"
          >
            <Rocket className="h-6 w-6 text-primary" />
            <span className="font-bold hidden sm:inline-block">{t('header.title')}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm" aria-label="Main navigation">
            <Link
              href="/api-tester"
              className="transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer"
              data-testid="header-api-tester-link"
            >
              <Beaker className="inline-block h-4 w-4 mr-1" />
              {t('header.apiTesterLink')}
            </Link>
            <Link
              href="/history"
              className="transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer"
              data-testid="header-history-link"
            >
              <History className="inline-block h-4 w-4 mr-1" />
              {t('header.historyLink')}
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer"
              data-testid="header-about-link"
            >
              <Info className="inline-block h-4 w-4 mr-1" />
              {t('header.aboutLink')}
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t('header.startTourLabel')}>
                <Compass className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('header.startTourLabel')}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={APP_CONFIG.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="github-link"
                aria-label={t('header.githubLabel')}
              >
                <Button variant="ghost" size="icon">
                  <Github className="h-5 w-5" />
                </Button>
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('header.githubLabel')}</p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t('header.toggleThemeLabel')}>
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">{t('header.toggleThemeLabel')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t('header.toggleLanguageLabel')}>
                <Languages className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem key={lang.code} onClick={() => changeLanguage(lang.code)}>
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                data-testid="mobile-menu-trigger"
                aria-label={t('header.mobileMenuLabel')}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">{t('header.mobileMenuLabel')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" data-testid="mobile-menu-content">
              <Link href="/api-tester">
                <DropdownMenuItem data-testid="mobile-menu-api-tester">
                  <Beaker className="mr-2 h-4 w-4" />
                  {t('header.apiTesterLink')}
                </DropdownMenuItem>
              </Link>
              <Link href="/history">
                <DropdownMenuItem data-testid="mobile-menu-history">
                  <History className="mr-2 h-4 w-4" />
                  {t('header.historyLink')}
                </DropdownMenuItem>
              </Link>
              <Link href="/about">
                <DropdownMenuItem data-testid="mobile-menu-about">
                  <Info className="mr-2 h-4 w-4" />
                  {t('header.aboutLink')}
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <a href={APP_CONFIG.bugReportUrl} target="_blank" rel="noopener noreferrer">
                <DropdownMenuItem data-testid="mobile-menu-bug-report">
                  <Bug className="mr-2 h-4 w-4" />
                  {t('header.bugReport')}
                </DropdownMenuItem>
              </a>
              <a href={APP_CONFIG.featureRequestUrl} target="_blank" rel="noopener noreferrer">
                <DropdownMenuItem data-testid="mobile-menu-feature-request">
                  <MessageSquarePlus className="mr-2 h-4 w-4" />
                  {t('header.featureRequest')}
                </DropdownMenuItem>
              </a>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

