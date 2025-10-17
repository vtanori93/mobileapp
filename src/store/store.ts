import { configureStore } from "@reduxjs/toolkit";
import flightReducer from "../presentation/viewmodels/flightSlice";

export const store = configureStore({ reducer: { flights: flightReducer } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
