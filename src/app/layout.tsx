
'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Providers } from './providers';
import { AppHeader } from '@/components/layout/app-header';
import { AppFooter } from '@/components/layout/app-footer';
import { useCallback, Suspense } from 'react';
import { ProgressBar } from '@/components/layout/progress-bar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

// Metadata and viewport can't be in a client component, but since layout is now client, we'll manage titles dynamically if needed.
// For now, we are keeping the static metadata approach, but it will cause a warning.
/*
export const metadata: Metadata = {
  title: {
    default: 'K6 Commander',
    template: '%s | K6 Commander',
  },
  description: 'A lightweight, production-ready load testing platform. Run k6 performance tests, Lighthouse audits, and SEO analysis with a single tool.',
  keywords: ['k6', 'load testing', 'performance', 'lighthouse', 'seo', 'docker', 'nextjs'],
  authors: [{ name: 'K6 Commander Team' }],
  creator: 'K6 Commander Team',
  publisher: 'K6 Commander Team',
  robots: 'index, follow',
  openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'http://localhost:3000', // Replace with production URL
      title: 'K6 Commander',
      description: 'The ultimate local-first platform for web performance and SEO testing.',
      siteName: 'K6 Commander',
      images: [
        {
          url: '/og-image.png', // Create this image
          width: 1200,
          height: 630,
          alt: 'K6 Commander Banner',
        },
      ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'K6 Commander',
    description: 'The ultimate local-first platform for web performance and SEO testing.',
    images: ['/twitter-image.png'], // Create this image
    creator: '@k6_commander', // Replace with actual handle
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#28282B',
  colorScheme: 'dark',
};
*/

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Using useCallback to ensure the function reference is stable
  const setView = useCallback(() => {
    // This function is now just a placeholder for the prop,
    // as navigation is handled by Next.js router.
  }, []);

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        <Providers>
           <div className="flex flex-col min-h-screen bg-gradient-to-br from-black to-[#1a1a1a]">
              <Suspense>
                <ProgressBar />
              </Suspense>
              <AppHeader setView={setView} />
              <main className="flex-1 container mx-auto px-4 md:px-6 lg:px-8 py-8">
                {children}
              </main>
              <AppFooter />
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
