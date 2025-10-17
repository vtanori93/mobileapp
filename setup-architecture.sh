#!/bin/bash
echo "🚀 Configurando arquitectura Clean (React Native CLI 0.82.0) con dependencias modernas..."

# ==========================
#  DEPENDENCIAS PRINCIPALES
# ==========================
echo "📦 Instalando dependencias..."

npm install @react-navigation/native @react-navigation/native-stack \
react-native-screens react-native-safe-area-context \
@reduxjs/toolkit react-redux react-hook-form i18next react-i18next

npm install --save-dev jest @testing-library/react-native @testing-library/jest-native @types/jest ts-jest

# ==========================
#  ESTRUCTURA DE CARPETAS
# ==========================
echo "📁 Creando estructura de carpetas..."

mkdir -p src/{data/{sources/mocks,repositories},domain/{entities,repositories,usecases},presentation/{viewmodels,screens,components},navigation,store,localization/translations,tests}

# ==========================
#  ARCHIVOS BASE
# ==========================

# --- App.tsx ---
cat > src/App.tsx << 'EOF'
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "./store/store";
import AppNavigator from "./navigation/AppNavigator";
import "./localization/i18n";

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    </SafeAreaProvider>
  );
}
EOF

# --- i18n setup ---
cat > src/localization/i18n.ts << 'EOF'
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./translations/en.json";
import es from "./translations/es.json";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  lng: "es",
  fallbackLng: "en",
  resources: { en: { translation: en }, es: { translation: es } },
  interpolation: { escapeValue: false },
});
export default i18n;
EOF

# --- Translations ---
cat > src/localization/translations/en.json << 'EOF'
{
  "home": {
    "title": "Flight Search",
    "byNumber": "By Flight Number",
    "byRoute": "By Origin & Destination"
  },
  "search": {
    "placeholderNumber": "e.g. AM500",
    "button": "Search",
    "loading": "Loading..."
  }
}
EOF

cat > src/localization/translations/es.json << 'EOF'
{
  "home": {
    "title": "Buscar Vuelos",
    "byNumber": "Por Número de Vuelo",
    "byRoute": "Por Origen y Destino"
  },
  "search": {
    "placeholderNumber": "Ej. AM500",
    "button": "Buscar",
    "loading": "Cargando..."
  }
}
EOF

# --- store ---
cat > src/store/store.ts << 'EOF'
import { configureStore } from "@reduxjs/toolkit";
import flightReducer from "../presentation/viewmodels/flightSlice";

export const store = configureStore({ reducer: { flights: flightReducer } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
EOF

cat > src/store/hooks.ts << 'EOF'
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
EOF

# --- navigation ---
cat > src/navigation/AppNavigator.tsx << 'EOF'
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../presentation/screens/HomeScreen";
import SearchByNumberScreen from "../presentation/screens/SearchByNumberScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SearchByNumber" component={SearchByNumberScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
EOF

# --- domain ---
cat > src/domain/entities/Flight.ts << 'EOF'
export interface Flight {
  flightNumber: string;
  status: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  delayInMinutes: number;
}
EOF

cat > src/domain/repositories/FlightRepository.ts << 'EOF'
import { Flight } from "../entities/Flight";

export interface FlightRepository {
  getFlightsByNumber(flightNumber: string): Promise<Flight[]>;
  getFlightsByRoute(origin: string, destination: string): Promise<Flight[]>;
}
EOF

cat > src/domain/usecases/GetFlightsByNumberUseCase.ts << 'EOF'
import { FlightRepository } from "../repositories/FlightRepository";

export class GetFlightsByNumberUseCase {
  constructor(private repository: FlightRepository) {}
  async execute(flightNumber: string) {
    return await this.repository.getFlightsByNumber(flightNumber);
  }
}
EOF

cat > src/domain/usecases/GetFlightsByRouteUseCase.ts << 'EOF'
import { FlightRepository } from "../repositories/FlightRepository";

export class GetFlightsByRouteUseCase {
  constructor(private repository: FlightRepository) {}
  async execute(origin: string, destination: string) {
    return await this.repository.getFlightsByRoute(origin, destination);
  }
}
EOF

# --- data ---
cat > src/data/sources/FlightMockDataSource.ts << 'EOF'
import numberData from './mocks/NumerodeVueloResponse.json';
import routeData from './mocks/OrigenDestinoResponse.json';
import { Flight } from '../../domain/entities/Flight';

export class FlightMockDataSource {
  async getFlightsByNumber(): Promise<Flight[]> {
    const flights = (numberData as any).flightStatusCollection;
    return flights.map((item: any) => this.mapToFlight(item));
  }

  async getFlightsByRoute(): Promise<Flight[]> {
    const flights = (routeData as any).flightStatusCollection;
    return flights.map((item: any) => this.mapToFlight(item));
  }

  private mapToFlight(item: any): Flight {
    return {
      flightNumber: `${item.segment.operatingCarrier}${item.segment.operatingFlightCode}`,
      status: item.status,
      departureAirport: item.segment.departureAirport,
      arrivalAirport: item.segment.arrivalAirport,
      departureTime: item.segment.departureDateTime,
      arrivalTime: item.segment.arrivalDateTime,
      delayInMinutes: item.delayInMinutes,
    };
  }
}
EOF

cat > src/data/repositories/FlightRepositoryImpl.ts << 'EOF'
import { FlightRepository } from "../../domain/repositories/FlightRepository";
import { FlightMockDataSource } from "../sources/FlightMockDataSource";

export class FlightRepositoryImpl implements FlightRepository {
  private ds = new FlightMockDataSource();
  async getFlightsByNumber(flightNumber: string) { return this.ds.getFlightsByNumber(); }
  async getFlightsByRoute(origin: string, destination: string) { return this.ds.getFlightsByRoute(); }
}
EOF

cat > src/data/sources/mocks/NumerodeVueloResponse.json << 'EOF'
{ "flightStatusCollection": [] }
EOF

cat > src/data/sources/mocks/OrigenDestinoResponse.json << 'EOF'
{ "flightStatusCollection": [] }
EOF

# --- redux slice ---
cat > src/presentation/viewmodels/flightSlice.ts << 'EOF'
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FlightRepositoryImpl } from "../../data/repositories/FlightRepositoryImpl";
import { Flight } from "../../domain/entities/Flight";

const repo = new FlightRepositoryImpl();

export const fetchFlightsByNumber = createAsyncThunk(
  "flights/byNumber",
  async (number: string) => repo.getFlightsByNumber(number)
);

interface FlightState { flights: Flight[]; loading: boolean; error: string | null; }
const initialState: FlightState = { flights: [], loading: false, error: null };

const flightSlice = createSlice({
  name: "flights",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlightsByNumber.pending, (s) => { s.loading = true; })
      .addCase(fetchFlightsByNumber.fulfilled, (s, a) => { s.loading = false; s.flights = a.payload; });
  },
});

export default flightSlice.reducer;
EOF

# --- HomeScreen con SafeAreaView moderno + Pressable ---
cat > src/presentation/screens/HomeScreen.tsx << 'EOF'
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{t("home.title")}</Text>

        <Pressable style={styles.button} onPress={() => navigation.navigate("SearchByNumber")}>
          <Text style={styles.buttonText}>{t("home.byNumber")}</Text>
        </Pressable>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>{t("home.byRoute")}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 30, color: "#003366" },
  button: { backgroundColor: "#0070f3", padding: 15, borderRadius: 8, marginBottom: 15, width: "70%", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
EOF

# --- SearchByNumberScreen actualizado ---
cat > src/presentation/screens/SearchByNumberScreen.tsx << 'EOF'
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Pressable, Text, FlatList, View, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchFlightsByNumber } from "../viewmodels/flightSlice";

export default function SearchByNumberScreen() {
  const { control, handleSubmit } = useForm();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { flights, loading } = useAppSelector((state) => state.flights);

  const onSubmit = (data: any) => dispatch(fetchFlightsByNumber(data.flightNumber));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Controller
          control={control}
          name="flightNumber"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder={t("search.placeholderNumber")}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>{t("search.button")}</Text>
        </Pressable>

        {loading && <Text style={styles.loading}>{t("search.loading")}</Text>}

        <FlatList
          data={flights}
          keyExtractor={(item) => item.flightNumber}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.flight}>{item.flightNumber} - {item.status}</Text>
              <Text style={styles.route}>{item.departureAirport} ➜ {item.arrivalAirport}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 10 },
  button: { backgroundColor: "#003366", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  loading: { marginTop: 10 },
  card: { marginTop: 15, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 15 },
  flight: { fontWeight: "bold", fontSize: 16 },
  route: { color: "#333", marginVertical: 5 },
});
EOF

# --- test config ---
cat > jest.config.js << 'EOF'
module.exports = {
  preset: "react-native",
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  transformIgnorePatterns: ["node_modules/(?!react-native|@react-native|@react-navigation)"],
};
EOF

echo "✅ Arquitectura creada con éxito."
echo "👉 Ejecuta: npx pod-install ios"
echo "👉 Luego: npm run ios o npm run android"
