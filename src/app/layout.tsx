
'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Providers } from './providers';
import { AppHeader } from '@/components/layout/app-header';
import { AppFooter } from '@/components/layout/app-footer';
import { Suspense } from 'react';
import { ProgressBar } from '@/components/layout/progress-bar';
import { SidebarProvider } from '@/components/ui/sidebar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        <Providers>
          <SidebarProvider>
            <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-black to-[#1a1a1a]">
                <Suspense>
                  <ProgressBar />
                </Suspense>
                <AppHeader />
                <main className="flex-1 container mx-auto px-4 md:px-6 lg:px-8 py-8">
                  {children}
                </main>
                <AppFooter />
            </div>
          </SidebarProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
