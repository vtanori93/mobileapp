import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, View, Text, StyleSheet } from "react-native";
import { useAppSelector } from "../../store/hooks";
import { useTranslation } from "react-i18next";

export default function FlightListScreen() {
  const { flights } = useAppSelector((state) => state.flights);
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <FlatList
        contentInsetAdjustmentBehavior="never"
        data={flights}
        keyExtractor={(item, index) => `${item.flightNumber}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.number}>{item.flightNumber}</Text>
            <Text>{`${item.departureAirport} → ${item.arrivalAirport}`}</Text>
            <Text>
              {t("results.departure")}: {item.departureTime}
            </Text>
            <Text>
              {t("results.arrival")}: {item.arrivalTime}
            </Text>
            <Text>
              {t("results.status")}: {item.status}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>{t("search.no_results")}</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  card: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    margin: 8,
    borderRadius: 10,
    elevation: 2,
  },
  number: { fontWeight: "bold", fontSize: 18, color: "#003366", marginBottom: 4 },
  empty: { textAlign: "center", marginTop: 40, color: "#777", fontSize: 16 },
});
