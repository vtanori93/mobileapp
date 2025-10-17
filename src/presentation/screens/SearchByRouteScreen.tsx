import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchFlightsByRoute } from "../viewmodels/flightSlice";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { colors } from "../../theme/colors";

type FormValues = { origin: string; destination: string };

export default function SearchByRouteScreen() {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: { origin: "", destination: "" },
  });
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  // 🌗 Tema actual desde Redux
  const { mode } = useAppSelector((state) => state.theme);
  const isDark = mode === "dark";
  const themeColors = colors[isDark ? "dark" : "light"];

  const onSubmit = async ({ origin, destination }: FormValues) => {
    const action = await dispatch(fetchFlightsByRoute({ origin, destination }));

    if (fetchFlightsByRoute.fulfilled.match(action)) {
      const flights = action.payload ?? [];
      if (flights.length === 0) {
        Alert.alert(t("alerts.no_results_title"), t("alerts.no_results_route"));
      } else {
        navigation.navigate("FlightList");
      }
    } else {
      Alert.alert(t("alerts.error_title"), t("alerts.error_route"));
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: themeColors.background }]}
      edges={["bottom"]}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          {t("searchRoute.title")}
        </Text>

        <Controller
          control={control}
          name="origin"
          rules={{ required: t("validation.required") }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: themeColors.border,
                  color: themeColors.text,
                  backgroundColor: themeColors.card,
                },
              ]}
              placeholder={t("searchRoute.origin_placeholder")}
              placeholderTextColor={themeColors.placeholder}
              autoCapitalize="characters"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="destination"
          rules={{ required: t("validation.required") }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: themeColors.border,
                  color: themeColors.text,
                  backgroundColor: themeColors.card,
                },
              ]}
              placeholder={t("searchRoute.destination_placeholder")}
              placeholderTextColor={themeColors.placeholder}
              autoCapitalize="characters"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Pressable
          style={[styles.button, { backgroundColor: themeColors.button }]}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={[styles.buttonText, { color: themeColors.buttonText }]}>
            {t("searchRoute.button")}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { fontWeight: "bold", fontSize: 16 },
});