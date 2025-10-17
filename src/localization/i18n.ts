import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as RNLocalize from "react-native-localize";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "./locales/en.json";
import es from "./locales/es.json";

const LANGUAGE_KEY = "app_language";

const resources = {
  en: { translation: en },
  es: { translation: es },
};

const getDeviceLanguage = () => {
  const locales = RNLocalize.getLocales();
  if (locales && locales.length > 0) {
    const lang = locales[0].languageCode;
    return Object.keys(resources).includes(lang) ? lang : "en";
  }
  return "en";
};

const initLanguage = async () => {
  try {
    const storedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
    const lang = storedLang || getDeviceLanguage();

    await i18n.use(initReactI18next).init({
      resources,
      lng: lang,
      fallbackLng: "en",
      interpolation: { escapeValue: false },
    });
  } catch (error) {
    console.error("Error initializing i18n:", error);
  }
};

initLanguage();

export const changeLanguage = async (lang: string) => {
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  await i18n.changeLanguage(lang);
};

export default i18n;
