import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { FlightRepositoryImpl } from "../../data/repositories/FlightRepositoryImpl";
import { Flight } from "../../domain/entities/Flight";

// Repositorio
const repo = new FlightRepositoryImpl();

interface FlightState {
  flights: Flight[];
  loading: boolean;
  error: string | null;
}

const initialState: FlightState = {
  flights: [],
  loading: false,
  error: null,
};

// 🔍 Buscar por número
export const fetchFlightsByNumber = createAsyncThunk<Flight[], string>(
  "flights/byNumber",
  async (number: string) => {
    const result = await repo.getFlightsByNumber(number);
    return result;
  }
);

// 🔍 Buscar por origen y destino
export const fetchFlightsByRoute = createAsyncThunk<
  Flight[],
  { origin: string; destination: string }
>("flights/byRoute", async ({ origin, destination }) => {
  const result = await repo.getFlightsByRoute(origin, destination);
  return result;
});

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
    builder
      // 🔹 Por número
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
        state.error = action.error.message || "FETCH_NUMBER_ERROR";
      });

    // 🔹 Por ruta
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
        state.error = action.error.message || "FETCH_ROUTE_ERROR";
      });
  },
});

export const { clearFlights } = flightSlice.actions;
export default flightSlice.reducer;
