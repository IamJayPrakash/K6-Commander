
'use client';

import { useState } from 'react';
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
  initialResources: any;
}

// This function initializes the i18n instance. It's called only once.
const initializeI18n = (lang: string, resources: any) => {
  if (!i18n.isInitialized) {
    i18n.init({
      lng: lang,
      resources: {
        [lang]: {
          translation: resources,
        },
      },
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // React already safes from xss
      },
      react: {
        useSuspense: false, // This is important to avoid issues with server-side rendering
      },
    });
  }
  return i18n;
};

export function ClientLayout({ children, initialLang, initialResources }: ClientLayoutProps) {
  // Initialize i18n synchronously with the resources from the server.
  // The useState initializer ensures this runs only once on the client.
  const [i18nInstance] = useState(() => initializeI18n(initialLang, initialResources));

  if (!i18n.isInitialized) {
    return <Preloader />;
  }

  return (
    <I18nextProvider i18n={i18nInstance}>
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
