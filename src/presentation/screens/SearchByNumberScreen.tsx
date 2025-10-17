import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchFlightsByNumber } from "../viewmodels/flightSlice";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { colors } from "../../theme/colors";

type FormValues = { flightNumber: string };

export default function SearchByNumberScreen() {
  const { control, handleSubmit } = useForm<FormValues>({ defaultValues: { flightNumber: "" } });
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const { mode } = useAppSelector((state) => state.theme);
  const isDark = mode === "dark";
  const themeColors = colors[isDark ? "dark" : "light"];

  const [loading, setLoading] = useState(false);

  // ✅ FIX: envolver resolve en una función sin argumentos
  const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), ms));

  const onSubmit = async ({ flightNumber }: FormValues) => {
    try {
      setLoading(true);
      await delay(2000); // ⏳ 2 segundos

      const action = await dispatch(fetchFlightsByNumber(flightNumber));
      setLoading(false);

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
    } catch {
      setLoading(false);
      Alert.alert(t("alerts.error_title"), t("alerts.error_message"));
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]} edges={["bottom"]}>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={themeColors.accent} />
            <Text style={[styles.loadingText, { color: themeColors.text }]}>{t("loading.message")}</Text>
          </View>
        ) : (
          <>
            <Text style={[styles.title, { color: themeColors.text }]}>{t("searchNumber.title")}</Text>

            <Controller
              control={control}
              name="flightNumber"
              rules={{ required: t("validation.required") as unknown as string }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    { borderColor: themeColors.border, color: themeColors.text, backgroundColor: themeColors.card },
                  ]}
                  placeholder={t("searchNumber.placeholder")}
                  placeholderTextColor={themeColors.placeholder}
                  autoCapitalize="characters"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <Pressable style={[styles.button, { backgroundColor: themeColors.button }]} onPress={handleSubmit(onSubmit)}>
              <Text style={[styles.buttonText, { color: themeColors.buttonText }]}>{t("searchNumber.button")}</Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 10 },
  button: { padding: 14, borderRadius: 8, alignItems: "center" },
  buttonText: { fontWeight: "bold", fontSize: 16 },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { marginTop: 12, fontSize: 16 },
});
