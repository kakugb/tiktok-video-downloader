import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi)
  .use(LanguageDetector) // No custom detectors
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'de', 'id', 'uk', 'ko', 'ja', 'pl', 'ar', 'nl', 'tr', 'pt', 'it', 'es', 'fr'],
    fallbackLng: 'en',
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie'],
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    debug: true,
  });

export default i18n;
