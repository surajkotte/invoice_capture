import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./locales/en/translation.json";
import translationDE from "./locales/de/translation.json";

const resources = {
  en: { translation: translationEN },
  de: { translation: translationDE },
};

i18n
  // Detects user language from browser settings
  .use(LanguageDetector)
  // Passes i18n down to react-i18next
  .use(initReactI18next)
  .init({
    resources,
    detection: {
      order: ["cookie", "htmlTag", "localStorage", "path", "subdomain"],
      caches: ["cookie"], // This ensures it writes back to the cookie if changed
      lookupCookie: "i18next",
    },
    fallbackLng: "en", // Use English if the detected language isn't supported
    interpolation: {
      escapeValue: false, // React already protects against XSS
    },
  });

export default i18n;
