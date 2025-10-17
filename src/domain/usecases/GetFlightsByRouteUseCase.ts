import { FlightRepository } from "../repositories/FlightRepository";

export class GetFlightsByRouteUseCase {
  constructor(private repository: FlightRepository) {}
  async execute(origin: string, destination: string) {
    return await this.repository.getFlightsByRoute(origin, destination);
  }
}
