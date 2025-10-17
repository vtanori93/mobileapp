import { FlightRepository } from "../../domain/repositories/FlightRepository";
import { FlightMockDataSource } from "../sources/FlightMockDataSource";

export class FlightRepositoryImpl implements FlightRepository {
  private ds = new FlightMockDataSource();

  async getFlightsByNumber(flightNumber: string) {
    return this.ds.getFlightsByNumber(flightNumber);
  }

  async getFlightsByRoute(origin: string, destination: string) {
    return this.ds.getFlightsByRoute(origin, destination);
  }
}
