
'use client';

import { useEffect, useState } from 'react';
import i18n from '@/lib/i18n';
import { I18nextProvider } from 'react-i18next';
import { AppHeader } from './app-header';
import { AppFooter } from './app-footer';
import { Toaster } from '../ui/toaster';
import { Providers } from '@/app/providers';
import { ProgressBar } from './progress-bar';
import { usePathname } from 'next/navigation';
import { Preloader } from './preloader';
import { TooltipProvider } from '../ui/tooltip';

async function fetchTranslations(locale: string) {
  try {
    let res = await fetch(`/locales/${locale}.json`);
    if (!res.ok) {
      const baseLocale = locale.split('-')[0];
      res = await fetch(`/locales/${baseLocale}.json`);
      if (!res.ok) {
        res = await fetch(`/locales/en.json`);
      }
    }
    return res.json();
  } catch (error) {
    console.error('Failed to fetch translations, loading fallback.', error);
    const res = await fetch(`/locales/en.json`);
    return res.json();
  }
}

interface ClientLayoutProps {
  children: React.ReactNode;
  initialLang: string;
  initialResources: any;
}

export function ClientLayout({ children, initialLang, initialResources }: ClientLayoutProps) {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const initI18n = async () => {
      // Initialize with the resources passed from the server.
      await i18n.init({
        lng: initialLang,
        resources: {
          [initialLang]: {
            translation: initialResources,
          },
        },
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false, // React already safes from xss
        },
      });
      setIsI18nInitialized(true);
    };

    initI18n();

    const onLanguageChanged = async (lng: string) => {
      if (!i18n.hasResourceBundle(lng, 'translation')) {
        const resources = await fetchTranslations(lng);
        i18n.addResourceBundle(lng, 'translation', resources, true, true);
      }
      i18n.changeLanguage(lng); // This will trigger re-renders
    };

    i18n.on('languageChanged', onLanguageChanged);

    return () => {
      i18n.off('languageChanged', onLanguageChanged);
    };
  }, [initialLang, initialResources]);

  useEffect(() => {
    if (isI18nInitialized) {
      const pageKey = pathname.substring(1) || 'home';
      const title = i18n.t(`pageTitles.${pageKey}`, { defaultValue: 'K6 Commander' });

      if (title && title !== `pageTitles.${pageKey}`) {
        document.title = `${title} | K6 Commander`;
      } else {
        document.title = 'K6 Commander';
      }
      document.documentElement.lang = i18n.language;
    }
  }, [pathname, isI18nInitialized, i18n.language]);

  if (!isI18nInitialized) {
    return <Preloader />;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <Providers>
        <TooltipProvider>
          <div className="relative flex flex-col min-h-screen bg-background">
            <ProgressBar />
            <AppHeader />
            <main className="flex-1 container max-w-screen-2xl py-8 flex flex-col">
              {children}
            </main>
            <AppFooter />
          </div>
          <Toaster />
        </TooltipProvider>
      </Providers>
    </I18nextProvider>
  );
}
