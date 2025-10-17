import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../presentation/screens/HomeScreen";
import SearchByNumberScreen from "../presentation/screens/SearchByNumberScreen";
import SearchByRouteScreen from "../presentation/screens/SearchByRouteScreen";
import FlightListScreen from "../presentation/screens/FlightListScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Inicio" }} />
        <Stack.Screen name="SearchByNumber" component={SearchByNumberScreen} options={{ title: "Por Número" }} />
        {/* ✅ FIX: registra la pantalla por Origen/Destino */}
        <Stack.Screen name="SearchByRoute" component={SearchByRouteScreen} options={{ title: "Por Ruta" }} />
        <Stack.Screen name="FlightList" component={FlightListScreen} options={{ title: "Resultados" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
