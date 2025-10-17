import { Flight } from "../entities/Flight";

export interface FlightRepository {
  getFlightsByNumber(flightNumber: string): Promise<Flight[]>;
  getFlightsByRoute(origin: string, destination: string): Promise<Flight[]>;
}
