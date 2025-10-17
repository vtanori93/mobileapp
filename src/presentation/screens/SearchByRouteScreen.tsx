import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch } from "../../store/hooks";
import { fetchFlightsByRoute } from "../viewmodels/flightSlice";
import { useNavigation } from "@react-navigation/native";

type FormValues = { origin: string; destination: string };

export default function SearchByRouteScreen() {
  const { control, handleSubmit } = useForm<FormValues>({ defaultValues: { origin: "", destination: "" } });
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();

  const onSubmit = async ({ origin, destination }: FormValues) => {
    const action = await dispatch(fetchFlightsByRoute({ origin, destination }));
    if (fetchFlightsByRoute.fulfilled.match(action)) {
      const flights = action.payload ?? [];
      if (flights.length === 0) {
        Alert.alert("Sin resultados", "No hay vuelos para esa ruta.");
      } else {
        navigation.navigate("FlightList");
      }
    } else {
      Alert.alert("Error", "No se pudo consultar la ruta.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Buscar por origen y destino</Text>

        <Controller
          control={control}
          name="origin"
          rules={{ required: "Campo requerido" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Origen (Ej. MEX)"
              autoCapitalize="characters"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="destination"
          rules={{ required: "Campo requerido" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Destino (Ej. CUN)"
              autoCapitalize="characters"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Buscar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, color: "#003366" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 10 },
  button: { backgroundColor: "#003366", padding: 14, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
