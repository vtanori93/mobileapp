import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
}

const initialState: ThemeState = { mode: "light" };

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      AsyncStorage.setItem("themeMode", action.payload);
    },
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      AsyncStorage.setItem("themeMode", state.mode);
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
