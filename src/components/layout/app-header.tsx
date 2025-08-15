
'use client';

import { Rocket, History, Info, Github, PlayCircle, MessageSquarePlus, Bug, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link';
import { useSidebar } from '../ui/sidebar';

export function AppHeader() {
  const { setTheme } = useTheme();
  const { toggleSidebar } = useSidebar();

  const startTour = () => {
    if (typeof window !== 'undefined' && (window as any).startTour) {
      (window as any).startTour();
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
           <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
              <PanelLeft className="h-6 w-6" />
              <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <Link href="/" className="mr-6 flex items-center space-x-2 cursor-pointer">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="font-bold hidden sm:inline-block">K6 Commander</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/history" className="transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer">
              <History className="inline-block h-4 w-4 mr-1" />
              History
            </Link>
            <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer">
              <Info className="inline-block h-4 w-4 mr-1" />
              About
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={startTour}>
                <PlayCircle className='h-4 w-4 mr-2'/>
                Start Tour
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Feedback
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <a href="https://github.com/IamJayPrakash/K6-Commander/issues/new?template=bug_report.md" target="_blank" rel="noopener noreferrer">
                  <DropdownMenuItem>
                    <Bug className="mr-2 h-4 w-4" />
                    Report a Bug
                  </DropdownMenuItem>
                </a>
                <a href="https://github.com/IamJayPrakash/K6-Commander/issues/new?template=feature_request.md" target="_blank" rel="noopener noreferrer">
                  <DropdownMenuItem>
                    <MessageSquarePlus className="mr-2 h-4 w-4" />
                    Request a Feature
                  </DropdownMenuItem>
                </a>
              </DropdownMenuContent>
            </DropdownMenu>

             <a href="https://github.com/IamJayPrakash/K6-Commander" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                </Button>
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
        </div>
      </div>
    </header>
  );
}
