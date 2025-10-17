import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { FlightRepositoryImpl } from "../../data/repositories/FlightRepositoryImpl";
import { Flight } from "../../domain/entities/Flight";

// Repositorio (fuente de datos)
const repo = new FlightRepositoryImpl();

// Estado global tipado
interface FlightState {
  flights: Flight[];
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: FlightState = {
  flights: [],
  loading: false,
  error: null,
};

// 🧩 AsyncThunk — Buscar por número de vuelo
export const fetchFlightsByNumber = createAsyncThunk<Flight[], string>(
  "flights/byNumber",
  async (number: string) => {
    const result = await repo.getFlightsByNumber(number);
    return result;
  }
);

// 🧩 AsyncThunk — Buscar por origen y destino
export const fetchFlightsByRoute = createAsyncThunk<
  Flight[],
  { origin: string; destination: string }
>("flights/byRoute", async ({ origin, destination }) => {
  const result = await repo.getFlightsByRoute(origin, destination);
  return result;
});

// Slice principal
const flightSlice = createSlice({
  name: "flights",
  initialState,
  reducers: {
    clearFlights: (state) => {
      state.flights = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Búsqueda por número
    builder
      .addCase(fetchFlightsByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFlightsByNumber.fulfilled,
        (state, action: PayloadAction<Flight[]>) => {
          state.loading = false;
          state.flights = action.payload;
        }
      )
      .addCase(fetchFlightsByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error al buscar por número";
      });

    // Búsqueda por ruta
    builder
      .addCase(fetchFlightsByRoute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFlightsByRoute.fulfilled,
        (state, action: PayloadAction<Flight[]>) => {
          state.loading = false;
          state.flights = action.payload;
        }
      )
      .addCase(fetchFlightsByRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error al buscar por ruta";
      });
  },
});

// Exportaciones
export const { clearFlights } = flightSlice.actions;
export default flightSlice.reducer;

