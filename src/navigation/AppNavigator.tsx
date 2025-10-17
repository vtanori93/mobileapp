import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../presentation/screens/HomeScreen";
import SearchByNumberScreen from "../presentation/screens/SearchByNumberScreen";
import SearchByRouteScreen from "../presentation/screens/SearchByRouteScreen";
import FlightListScreen from "../presentation/screens/FlightListScreen";
import { useTranslation } from "react-i18next";
import i18n from "../localization/i18n";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { t } = useTranslation();

  // 🧠 Forzamos actualización de títulos al cambiar idioma
  useEffect(() => {
    const handleLanguageChange = () => {
      // Esto asegura que se re-rendericen los títulos cuando cambia el idioma
    };
    i18n.on("languageChanged", handleLanguageChange);
    return () => i18n.off("languageChanged", handleLanguageChange);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: t("home.title") }}
        />
        <Stack.Screen
          name="SearchByNumber"
          component={SearchByNumberScreen}
          options={{ title: t("home.search_by_number") }}
        />
        <Stack.Screen
          name="SearchByRoute"
          component={SearchByRouteScreen}
          options={{ title: t("home.search_by_route") }}
        />
        <Stack.Screen
          name="FlightList"
          component={FlightListScreen}
          options={{ title: t("results.title") }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
