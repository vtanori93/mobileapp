import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

// ✅ Importaciones con rutas absolutas desde la raíz hacia src/
import { store } from "./src/store/store";
import AppNavigator from "./src/navigation/AppNavigator";
import "./src/localization/i18n"; // Inicializa los idiomas ES/EN

/**
 * Componente raíz de la aplicación.
 * Contiene los Providers globales:
 * - SafeAreaProvider: asegura que el contenido no se superponga con notch/barras.
 * - Redux Provider: maneja el estado global.
 * - i18n: habilita multilenguaje.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    </SafeAreaProvider>
  );
}
