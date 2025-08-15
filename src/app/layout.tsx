'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Providers } from './providers';
import { AppHeader } from '@/components/layout/app-header';
import { AppFooter } from '@/components/layout/app-footer';
import { Suspense, useEffect, useState } from 'react';
import { ProgressBar } from '@/components/layout/progress-bar';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

// Helper function to load translations
async function loadTranslations(locale: string) {
  try {
    const response = await fetch(`/locales/${locale}.json`);
    if (!response.ok) {
      // Fallback to English if the locale is not found
      console.warn(`Locale '${locale}' not found, falling back to 'en'.`);
      const fallbackResponse = await fetch(`/locales/en.json`);
      return await fallbackResponse.json();
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to load translations, falling back to English.', error);
    // Fallback to English in case of any network error
    try {
      const fallbackResponse = await fetch(`/locales/en.json`);
      return await fallbackResponse.json();
    } catch (fallbackError) {
      console.error('Failed to load fallback English translations.', fallbackError);
      return {}; // Return empty object if even fallback fails
    }
  }
}

export const metadata: Metadata = {
  title: {
    default: 'K6 Commander',
    template: `%s | K6 Commander`,
  },
  description:
    'A lightweight, local-first, authorized load-testing platform. Configure, run, and analyze k6 load tests, Lighthouse audits, and SEO checks from a sleek web UI.',
  keywords: [
    'k6',
    'Lighthouse',
    'SEO',
    'load testing',
    'performance',
    'auditing',
    'developer tools',
    'Next.js',
    'Grafana',
  ],
  applicationName: 'K6 Commander',
  authors: [{ name: 'Your Name', url: 'https://github.com/your-username/k6-commander' }],
  creator: 'Your Name',
  publisher: 'Your Name',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#222326' },
  ],
  openGraph: {
    type: 'website',
    url: 'https://your-domain.com', // Replace with your actual domain
    title: 'K6 Commander',
    description:
      'A lightweight, local-first, authorized load-testing platform. Configure, run, and analyze k6 load tests, Lighthouse audits, and SEO checks from a sleek web UI.',
    siteName: 'K6 Commander',
    images: [
      {
        url: 'https://your-domain.com/og-image.png', // Replace with your actual OG image URL
        width: 1200,
        height: 630,
        alt: 'K6 Commander Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'K6 Commander',
    description:
      'A lightweight, local-first, authorized load-testing platform. Configure, run, and analyze k6 load tests, Lighthouse audits, and SEO checks from a sleek web UI.',
    creator: '@your_twitter_handle', // Replace with your Twitter handle
    images: ['https://your-domain.com/twitter-image.png'], // Replace with your actual Twitter image URL
  },
  icons: {
    icon: '/favicon.ico', // Make sure to add a favicon to your public folder
    apple: '/apple-touch-icon.png', // Make sure to add an apple touch icon
  },
  manifest: '/manifest.json', // Make sure to add a web app manifest
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    const init = async () => {
      const lng = i18n.language || 'en';
      if (!i18n.hasResourceBundle(lng, 'translation')) {
        const translations = await loadTranslations(lng);
        i18n.addResourceBundle(lng, 'translation', translations, true, true);
      }
      if (i18n.language !== lng) {
        await i18n.changeLanguage(lng);
      }
      setCurrentLanguage(lng);
      setIsI18nInitialized(true);
    };

    init();

    const onLanguageChanged = async (lng: string) => {
      if (!i18n.hasResourceBundle(lng, 'translation')) {
        const translations = await loadTranslations(lng);
        i18n.addResourceBundle(lng, 'translation', translations, true, true);
      }
      setCurrentLanguage(lng);
    };

    i18n.on('languageChanged', onLanguageChanged);

    return () => {
      i18n.off('languageChanged', onLanguageChanged);
    };
  }, []);

  return (
    <html lang={currentLanguage} className="dark" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        {!isI18nInitialized ? (
          <div className="flex items-center justify-center min-h-screen"></div>
        ) : (
          <I18nextProvider i18n={i18n}>
            <Providers>
              <div className="relative flex flex-col min-h-screen">
                <Suspense>
                  <ProgressBar />
                </Suspense>
                <AppHeader />
                <main className="flex-1 container max-w-screen-2xl mx-auto p-4 md:p-6 lg:p-8">
                  {children}
                </main>
                <AppFooter />
              </div>
            </Providers>
            <Toaster />
          </I18nextProvider>
        )}
      </body>
    </html>
  );
}
