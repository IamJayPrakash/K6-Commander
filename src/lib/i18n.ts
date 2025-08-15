
'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // We do not provide a backend because we are loading the translations manually
    // in the root layout. This is a common pattern for Next.js App Router.
    detection: {
      order: ['cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie', 'localStorage'],
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    resources: {
      // The resources will be loaded dynamically
    },
  });

export default i18n;
