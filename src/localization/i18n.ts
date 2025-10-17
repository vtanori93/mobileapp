import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import es from "./locales/es.json";

// ✅ Configuración moderna sin compatibilityJSON
i18n
  .use(initReactI18next)
  .init({
    lng: "es", // idioma por defecto
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    interpolation: {
      escapeValue: false, // necesario para React Native
    },
    // ✅ Puedes activar debug temporalmente durante desarrollo:
    // debug: true,
  });

// ✅ Función utilitaria para cambiar idioma desde cualquier parte
export const changeLanguage = async (lang: "en" | "es") => {
  await i18n.changeLanguage(lang);
};

export default i18n;
