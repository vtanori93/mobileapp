import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, View, Text, StyleSheet } from "react-native";
import { useAppSelector } from "../../store/hooks";
import { useTranslation } from "react-i18next";
import { colors } from "../../theme/colors";

export default function FlightListScreen() {
  const { flights } = useAppSelector((state) => state.flights);
  const { mode } = useAppSelector((state) => state.theme);
  const { t } = useTranslation();

  const isDark = mode === "dark";
  const themeColors = colors[isDark ? "dark" : "light"];

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: themeColors.background }]}
      edges={["bottom"]}
    >
      <FlatList
        contentInsetAdjustmentBehavior="never"
        data={flights}
        keyExtractor={(item, index) => `${item.flightNumber}-${index}`}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              { backgroundColor: themeColors.card, borderColor: themeColors.border },
            ]}
          >
            <Text
              style={[
                styles.number,
                { color: themeColors.accent },
              ]}
            >
              {item.flightNumber}
            </Text>

            <Text style={[styles.text, { color: themeColors.text }]}>
              {`${item.departureAirport} → ${item.arrivalAirport}`}
            </Text>

            <Text style={[styles.text, { color: themeColors.text }]}>
              {t("results.departure")}: {item.departureTime}
            </Text>

            <Text style={[styles.text, { color: themeColors.text }]}>
              {t("results.arrival")}: {item.arrivalTime}
            </Text>

            <Text style={[styles.text, { color: themeColors.text }]}>
              {t("results.status")}: {item.status}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text
            style={[styles.empty, { color: themeColors.placeholder }]}
          >
            {t("results.no_results")}
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  card: {
    padding: 16,
    margin: 8,
    borderRadius: 10,
    elevation: 2,
    borderWidth: 1,
  },
  number: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 4,
  },
  text: {
    fontSize: 15,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
});
