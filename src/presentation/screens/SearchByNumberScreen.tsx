import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchFlightsByNumber } from "../viewmodels/flightSlice";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { colors } from "../../theme/colors"; // 🎨 paleta de colores global

type FormValues = { flightNumber: string };

export default function SearchByNumberScreen() {
  const { control, handleSubmit } = useForm<FormValues>({ defaultValues: { flightNumber: "" } });
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  // 🌗 Obtener el modo actual desde Redux
  const { mode } = useAppSelector((state) => state.theme);
  const isDark = mode === "dark";
  const themeColors = colors[isDark ? "dark" : "light"];

  const onSubmit = async ({ flightNumber }: FormValues) => {
    const action = await dispatch(fetchFlightsByNumber(flightNumber));

    if (fetchFlightsByNumber.fulfilled.match(action)) {
      const flights = action.payload ?? [];
      if (flights.length === 0) {
        Alert.alert(t("alerts.no_results_title"), t("alerts.no_results_message"));
      } else {
        navigation.navigate("FlightList");
      }
    } else {
      Alert.alert(t("alerts.error_title"), t("alerts.error_message"));
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: themeColors.background }]}
      edges={["bottom"]}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          {t("searchNumber.title")}
        </Text>

        <Controller
          control={control}
          name="flightNumber"
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
              placeholder={t("searchNumber.placeholder")}
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
            {t("searchNumber.button")}
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
