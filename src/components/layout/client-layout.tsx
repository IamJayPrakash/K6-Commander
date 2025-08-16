
'use client';

import { useState, useEffect } from 'react';
import i18n from '@/lib/i18n';
import { I18nextProvider } from 'react-i18next';
import { AppHeader } from './app-header';
import { AppFooter } from './app-footer';
import { Toaster } from '../ui/toaster';
import { Providers } from '@/app/providers';
import { ProgressBar } from './progress-bar';
import { Preloader } from './preloader';
import { TooltipProvider } from '../ui/tooltip';

interface ClientLayoutProps {
  children: React.ReactNode;
  initialLang: string;
}

export function ClientLayout({ children, initialLang }: ClientLayoutProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeI18n = async (lang: string) => {
      try {
        const resources = await import(`@/../public/locales/${lang}.json`);
        await i18n.init({
          lng: lang,
          resources: {
            [lang]: {
              translation: resources.default,
            },
          },
          fallbackLng: 'en',
          interpolation: {
            escapeValue: false, // React already safes from xss
          },
          react: {
            useSuspense: false,
          },
        });
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize i18n, falling back to English.', error);
        // Fallback to English if the desired language fails to load
        const resources = await import(`@/../public/locales/en.json`);
        await i18n.init({
          lng: 'en',
          resources: {
            en: {
              translation: resources.default,
            },
          },
          fallbackLng: 'en',
        });
        setIsInitialized(true);
      }
    };

    if (!i18n.isInitialized) {
      initializeI18n(initialLang);
    } else {
      setIsInitialized(true);
    }
  }, [initialLang]);

  useEffect(() => {
    const onLanguageChanged = async (lng: string) => {
      // Check if resources for the new language are already loaded
      if (!i18n.hasResourceBundle(lng, 'translation')) {
        try {
          // Dynamically import the new locale file
          const newResources = await import(`@/../public/locales/${lng}.json`);
          i18n.addResourceBundle(lng, 'translation', newResources.default);
          i18n.changeLanguage(lng); // Change language after loading
        } catch (error) {
          console.error(`Failed to load locale ${lng}`, error);
        }
      }
    };

    i18n.on('languageChanged', onLanguageChanged);
    return () => {
      i18n.off('languageChanged', onLanguageChanged);
    };
  }, []);

  if (!isInitialized) {
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
            <Toaster />
          </div>
        </TooltipProvider>
      </Providers>
    </I18nextProvider>
  );
}
