import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./translations/en.json";
import es from "./translations/es.json";

// ✅ Configuración limpia y moderna sin 'compatibilityJSON'
i18n
  .use(initReactI18next)
  .init({
    lng: "es", // Idioma predeterminado
    fallbackLng: "en", // Idioma de respaldo
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    interpolation: {
      escapeValue: false, // React ya maneja el escape de XSS
    },
  });

export default i18n;
