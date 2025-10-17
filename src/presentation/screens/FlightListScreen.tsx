import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, View, Text, StyleSheet } from "react-native";
import { useAppSelector } from "../../store/hooks";

export default function FlightListScreen() {
  const { flights } = useAppSelector((state) => state.flights);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={flights}
        keyExtractor={(item, index) => `${item.flightNumber}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.number}>{item.flightNumber}</Text>
            <Text>{`${item.departureAirport} → ${item.arrivalAirport}`}</Text>
            <Text>Salida: {item.departureTime}</Text>
            <Text>Llegada: {item.arrivalTime}</Text>
            <Text>Estado: {item.status}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Sin vuelos encontrados.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  card: { backgroundColor: "#f8f9fa", padding: 16, margin: 8, borderRadius: 10 },
  number: { fontWeight: "bold", fontSize: 18, color: "#003366", marginBottom: 4 },
  empty: { textAlign: "center", marginTop: 40, color: "#777" },
});
