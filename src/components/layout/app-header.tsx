
'use client';

import { Rocket, History, Info, Github, PlayCircle, MessageSquarePlus, Bug, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link';
import { APP_CONFIG, TEXT_CONSTANTS } from '@/lib/constants';

export function AppHeader() {
  const { setTheme } = useTheme();

  const startTour = () => {
    if (typeof window !== 'undefined' && (window as any).startTour) {
      (window as any).startTour();
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" data-testid="app-header">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2 cursor-pointer" data-testid="home-link">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="font-bold hidden sm:inline-block">{TEXT_CONSTANTS.headerTitle}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/history" className="transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer" data-testid="header-history-link">
              <History className="inline-block h-4 w-4 mr-1" />
              {TEXT_CONSTANTS.historyLink}
            </Link>
            <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer" data-testid="header-about-link">
              <Info className="inline-block h-4 w-4 mr-1" />
              {TEXT_CONSTANTS.aboutLink}
            </Link>
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={startTour} data-testid="start-tour-button">
                <PlayCircle className='h-4 w-4 mr-2'/>
                {TEXT_CONSTANTS.startTourButton}
            </Button>

            <a href={APP_CONFIG.githubUrl} target="_blank" rel="noopener noreferrer" data-testid="github-link">
                <Button variant="ghost" size="icon" aria-label="View on GitHub">
                    <Github className="h-5 w-5" />
                </Button>
            </a>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="theme-switcher-trigger" aria-label="Toggle theme">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" data-testid="theme-switcher-content">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" data-testid="mobile-menu-trigger" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" data-testid="mobile-menu-content">
                <Link href="/history"><DropdownMenuItem><History className="mr-2 h-4 w-4" />{TEXT_CONSTANTS.historyLink}</DropdownMenuItem></Link>
                <Link href="/about"><DropdownMenuItem><Info className="mr-2 h-4 w-4" />{TEXT_CONSTANTS.aboutLink}</DropdownMenuItem></Link>
                <DropdownMenuSeparator />
                <a href={APP_CONFIG.bugReportUrl} target="_blank" rel="noopener noreferrer">
                  <DropdownMenuItem>
                    <Bug className="mr-2 h-4 w-4" />
                    Report a Bug
                  </DropdownMenuItem>
                </a>
                <a href={APP_CONFIG.featureRequestUrl} target="_blank" rel="noopener noreferrer">
                  <DropdownMenuItem>
                    <MessageSquarePlus className="mr-2 h-4 w-4" />
                    Request a Feature
                  </DropdownMenuItem>
                </a>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
