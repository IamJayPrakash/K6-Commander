'use client';

import { use, useEffect, useState } from 'react';
import i18n from '@/lib/i18n';
import { I18nextProvider } from 'react-i18next';
import { AppHeader } from './app-header';
import { AppFooter } from './app-footer';
import { Toaster } from '../ui/toaster';
import { Providers } from '@/app/providers';
import { ProgressBar } from './progress-bar';
import { usePathname } from 'next/navigation';

async function fetchTranslations(locale: string) {
  const response = await fetch(`/locales/${locale}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load locale: ${locale}`);
  }
  return response.json();
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const initializeI18n = async () => {
      const detectedLng = i18n.language || 'en';
      if (!i18n.hasResourceBundle(detectedLng, 'translation')) {
        const resources = await fetchTranslations(detectedLng);
        i18n.addResourceBundle(detectedLng, 'translation', resources);
      }
      if (!i18n.isInitialized) {
        await i18n.init(); // Ensure init is called
      }
      setIsI18nInitialized(true);
    };

    initializeI18n();

    const languageChanged = async (lng: string) => {
      if (!i18n.hasResourceBundle(lng, 'translation')) {
        const resources = await fetchTranslations(lng);
        i18n.addResourceBundle(lng, 'translation', resources);
      }
      // Re-render will happen automatically by react-i18next
    };

    i18n.on('languageChanged', languageChanged);

    return () => {
      i18n.off('languageChanged', languageChanged);
    };
  }, []);

  useEffect(() => {
    if (isI18nInitialized) {
      let pageTitle = 'K6 Commander'; // Default title
      const pageKey = pathname.substring(1) || 'home';
      const potentialTitle = i18n.t(`pageTitles.${pageKey}`, {
        defaultValue: '',
      });

      if (potentialTitle) {
        pageTitle = `${potentialTitle} | K6 Commander`;
      }

      document.title = pageTitle;
    }
  }, [pathname, isI18nInitialized]);

  if (!isI18nInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      <Providers>
        <ProgressBar />
        <div className="relative flex min-h-screen flex-col bg-background">
          <AppHeader />
          <main className="flex-1 container max-w-screen-2xl py-8">{children}</main>
          <AppFooter />
        </div>
        <Toaster />
      </Providers>
    </I18nextProvider>
  );
}
