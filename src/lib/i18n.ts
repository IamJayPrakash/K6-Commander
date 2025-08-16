
'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // Enable automatic language detection
  .use(LanguageDetector)
  // Connect with React
  .use(initReactI18next)
  .init({
    // We don't need resources here as they are passed from the server layout
    // to the client layout and initialized there.
    fallbackLng: 'en',
    detection: {
      order: ['cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie', 'localStorage'],
    },
    interpolation: {
      escapeValue: false, // React already protects from xss
    },
  });

export default i18n;
