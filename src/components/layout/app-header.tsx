
'use client';

import { Rocket, History, Info, HelpCircle, Mail, PlayCircle } from 'lucide-react';
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

type AppHeaderProps = {
  setView: (view: 'form' | 'history' | 'about' | 'help' | 'contact') => void;
};

export function AppHeader({ setView }: AppHeaderProps) {
  const { setTheme } = useTheme();

  const startTour = () => {
    if (typeof window !== 'undefined' && (window as any).startTour) {
      (window as any).startTour();
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2 cursor-pointer">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="font-bold">K6 Commander</span>
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
