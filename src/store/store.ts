import { configureStore } from "@reduxjs/toolkit";
import flightReducer from "../presentation/viewmodels/flightSlice";
import themeReducer from "./themeSlice";

export const store = configureStore({
  reducer: {
    flights: flightReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
