import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../../localization/i18n";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { t, i18n } = useTranslation();

  const handleLanguageChange = async () => {
    const newLang = i18n.language === "es" ? "en" : "es";
    await changeLanguage(newLang);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{t("home.title")}</Text>

        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("SearchByNumber")}
        >
          <Text style={styles.buttonText}>{t("home.byNumber")}</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("SearchByRoute")}
        >
          <Text style={styles.buttonText}>{t("home.byRoute")}</Text>
        </Pressable>

        {/* 🌐 Botón para cambiar idioma dinámicamente */}
        <Pressable style={styles.langButton} onPress={handleLanguageChange}>
          <Text style={styles.langText}>
            {i18n.language === "es" ? "🇬🇧 English" : "🇪🇸 Español"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
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
    color: "#003366",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#0070f3",
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
  langText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
});
