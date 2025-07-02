// i18n.js
// Internationalization (i18n) configuration for the frontend React app.
// Sets up language support using i18next and react-i18next.
// Loads translation resources for supported languages (English and Hebrew).
// Exports the configured i18n instance for use throughout the app.
//
// Usage:
// - Import this file at the app entry point to initialize translations.
// - Use the useTranslation hook in components to access translation functions and current language.

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import he from './locales/he.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      he: { translation: he },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
