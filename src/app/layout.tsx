
import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ClientLayout } from '@/components/layout/client-layout';
import i18n from '@/lib/i18n';
import { cookies } from 'next/headers';
import fs from 'node:fs/promises';
import path from 'node:path';

export const metadata: Metadata = {
  metadataBase: new URL('https://k6commander.netlify.app'),
  title: {
    default: 'K6 Commander',
    template: `%s | K6 Commander`,
  },
  description:
    'Configure, run, and analyze load tests, Lighthouse audits, and SEO checks with a sleek web UI powered by k6, InfluxDB, and Grafana.',
  keywords: [
    'k6',
    'Lighthouse',
    'SEO',
    'load testing',
    'performance',
    'Next.js',
    'Docker',
    'Grafana',
  ],
  themeColor: '#7DF9FF',
  openGraph: {
    title: 'K6 Commander',
    description: 'Configure, run, and analyze load tests, Lighthouse audits, and SEO checks.',
    url: 'https://k6commander.netlify.app',
    siteName: 'K6 Commander',
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        'data-ai-hint': 'technology abstract',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'K6 Commander',
    description: 'Local-first, authorized load-testing platform.',
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        'data-ai-hint': 'technology abstract',
      },
    ],
  },
  icons: {
    icon: '/favicon.ico',
  },
  verification: {
    google: 'hRF32kvBOeN6Y3-sNwzJL6RPFn9Nbm9qZtVn144VEuk',
  },
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

// This function fetches translations from the local file system.
async function getTranslations(locale: string) {
  const localePath = path.resolve(process.cwd(), `public/locales/${locale}.json`);
  try {
    const data = await fs.readFile(localePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the specific locale file doesn't exist, fall back to English.
    console.warn(`Could not load locale ${locale}, falling back to 'en'`);
    const fallbackPath = path.resolve(process.cwd(), 'public/locales/en.json');
    const data = await fs.readFile(fallbackPath, 'utf-8');
    return JSON.parse(data);
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Determine the language from cookies or use the default.
  const cookieStore = cookies();
  const lang = cookieStore.get('i18next')?.value || i18n.language;

  // Pre-load the translations on the server.
  const initialResources = await getTranslations(lang);

  return (
    <html lang={lang} className="dark" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <ClientLayout initialLang={lang} initialResources={initialResources}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
