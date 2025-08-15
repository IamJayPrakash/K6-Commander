'use client';

import { Rocket, History, Info, HelpCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type AppHeaderProps = {
  setView: (view: 'form' | 'history' | 'about' | 'help' | 'contact') => void;
};

export function AppHeader({ setView }: AppHeaderProps) {
  const { setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <a className="mr-6 flex items-center space-x-2 cursor-pointer" onClick={() => setView('form')}>
            <Rocket className="h-6 w-6 text-primary" />
            <span className="font-bold">K6 Commander</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a onClick={() => setView('history')} className="transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer">
              <History className="inline-block h-4 w-4 mr-1" />
              History
            </a>
            <a onClick={() => setView('about')} className="transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer">
              <Info className="inline-block h-4 w-4 mr-1" />
              About
            </a>
             <a onClick={() => setView('help')} className="transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer">
              <HelpCircle className="inline-block h-4 w-4 mr-1" />
              Help
            </a>
            <a onClick={() => setView('contact')} className="transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer">
              <Mail className="inline-block h-4 w-4 mr-1" />
              Contact
            </a>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end">
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
