
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
  Maximize,
  Minimize,
  Sun,
  Moon,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { APP_CONFIG } from '@/lib/constants';
import { useTranslation } from 'react-i18next';
import { ScrollArea } from '../ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import QuickAccessMenu from './quick-access-menu';

export function AppHeader() {
  const { t, i18n } = useTranslation();
  const { setTheme } = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
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

  const handleSetTheme = (theme: string) => {
    setTheme(theme);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      data-testid="app-header"
    >
      <div className="container flex h-16 max-w-screen-2xl items-center">
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

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleFullscreen}
                data-testid="fullscreen-toggle-button"
                aria-label={
                  isFullscreen
                    ? t('header.exitFullscreenLabel')
                    : t('header.enterFullscreenLabel')
                }
              >
                {isFullscreen ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
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
                    variant="ghost"
                    size="icon"
                    aria-label={t('header.changeLanguageLabel')}
                    data-testid="language-switcher-trigger"
                  >
                    <Languages className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" data-testid="language-switcher-content">
                  <ScrollArea className="h-72 w-48 rounded-md">
                    {languages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        data-testid={`language-switcher-item-${lang.code}`}
                      >
                        {lang.name}
                      </DropdownMenuItem>
                    ))}
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('header.changeLanguageLabel')}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    data-testid="theme-switcher-trigger"
                    aria-label={t('header.toggleThemeLabel')}
                  >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">{t('header.toggleThemeLabel')}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" data-testid="theme-switcher-content">
                  <DropdownMenuItem
                    onClick={() => handleSetTheme('light')}
                    data-testid="theme-switcher-light"
                  >
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSetTheme('dark')}
                    data-testid="theme-switcher-dark"
                  >
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSetTheme('system')}
                    data-testid="theme-switcher-system"
                  >
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('header.toggleThemeLabel')}</p>
            </TooltipContent>
          </Tooltip>

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
      <QuickAccessMenu
        onThemeToggle={handleSetTheme}
        onFullscreenToggle={handleToggleFullscreen}
        isFullscreen={isFullscreen}
      />
    </header>
  );
}

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
