import { FlightRepository } from "../repositories/FlightRepository";

export class GetFlightsByNumberUseCase {
  constructor(private repository: FlightRepository) {}
  async execute(flightNumber: string) {
    return await this.repository.getFlightsByNumber(flightNumber);
  }
}
