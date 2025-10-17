import React from "react";
import { Provider, useSelector } from "react-redux";
import { store, RootState } from "../src/store/store";
import AppNavigator from "../src/navigation/AppNavigator";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { StatusBar } from "react-native";

function ThemedApp() {
  const theme = useSelector((state: RootState) => state.theme.mode);

  return (
    <NavigationContainer theme={theme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme === "dark" ? "#000" : "#fff"}
      />
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  );
}
