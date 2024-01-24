import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import translationVI from "./locales/vi/translation.json";
import translationEN from "./locales/en/translation.json";
const resources = {
  en: {
    translation: translationEN,
  },
  vi: {
    translation: translationVI,
  },
};
i18n
  .use(Backend) // Load translations from a backend (replace with your backend configuration)
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: resources,
    lng: "en", // if you're using a language detector, do not define the lng option
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });
export default i18n;
