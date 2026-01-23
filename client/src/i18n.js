import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

import enTranslation from './locales/en/translation.json';
import hiTranslation from './locales/hi/translation.json';
import teTranslation from './locales/te/translation.json';

// Since we are bundling locally, we can load resources directly or use the http-backend.
// For simplicity in this project structure, let's load them directly to avoid public folder serving issues initially, 
// OR we can correct the backend if we move files to public. 
// Given the user directed /src/locales, importing them directly is safer for Vite build unless configured otherwise.
// However, standard i18next-http-backend looks in /public/locales.
// Let's use resources object for now which is robust.

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslation },
            hi: { translation: hiTranslation },
            te: { translation: teTranslation }
        },
        fallbackLng: 'en',
        debug: true,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        }
    });

export default i18n;
