import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

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
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
