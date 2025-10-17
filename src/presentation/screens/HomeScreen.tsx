import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable, StyleSheet, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleTheme } from "../../store/themeSlice";
import { changeLanguage } from "../../localization/i18n";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  const isDark = theme === "dark";

  const handleLanguageChange = async () => {
    const newLang = i18n.language === "es" ? "en" : "es";
    await changeLanguage(newLang);
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isDark ? "#000" : "#fff" },
      ]}
    >
      <View style={styles.container}>
        <Text
          style={[
            styles.title,
            { color: isDark ? "#fff" : "#003366" },
          ]}
        >
          {t("home.title")}
        </Text>

        <Pressable
          style={[
            styles.button,
            { backgroundColor: isDark ? "#444" : "#0070f3" },
          ]}
          onPress={() => navigation.navigate("SearchByNumber")}
        >
          <Text style={styles.buttonText}>{t("home.byNumber")}</Text>
        </Pressable>

        <Pressable
          style={[
            styles.button,
            { backgroundColor: isDark ? "#444" : "#0070f3" },
          ]}
          onPress={() => navigation.navigate("SearchByRoute")}
        >
          <Text style={styles.buttonText}>{t("home.byRoute")}</Text>
        </Pressable>

        {/* 🌐 Cambio de idioma */}
        <Pressable style={styles.langButton} onPress={handleLanguageChange}>
          <Text style={{ color: isDark ? "#fff" : "#333" }}>
            {i18n.language === "es" ? "🇬🇧 English" : "🇪🇸 Español"}
          </Text>
        </Pressable>

        {/* 🌗 Modo oscuro */}
        <View style={styles.switchContainer}>
          <Text style={{ color: isDark ? "#fff" : "#333" }}>
            {isDark ? t("theme.dark_mode") : t("theme.light_mode")}
          </Text>
          <Switch value={isDark} onValueChange={handleToggleTheme} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    width: "80%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  langButton: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#E5E5E5",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
});
