import numberData from "./mocks/NumerodeVueloResponse.json";
import routeData from "./mocks/OrigenDestinoResponse.json";
import { Flight } from "../../domain/entities/Flight";

export class FlightMockDataSource {
  // 🔢 Buscar por número de vuelo
  async getFlightsByNumber(flightNumber: string): Promise<Flight[]> {
    const flights = (numberData as any).flightStatusCollection ?? [];

    return this.filterAndMap(flights, (item: any) => {
      const code = `${item.segment.operatingCarrier}${item.segment.operatingFlightCode}`.toUpperCase();
      return code === flightNumber.toUpperCase();
    });
  }

  // 🌍 Buscar por origen y destino
  async getFlightsByRoute(origin: string, destination: string): Promise<Flight[]> {
    const flights = (routeData as any).flightStatusCollection ?? [];

    return this.filterAndMap(flights, (item: any) => {
      const dep = item.segment.departureAirport?.toUpperCase();
      const arr = item.segment.arrivalAirport?.toUpperCase();
      return dep === origin.toUpperCase() && arr === destination.toUpperCase();
    });
  }

  // ♻️ Método reutilizable
  private filterAndMap(flights: any[], predicate: (item: any) => boolean): Flight[] {
    return flights.filter(predicate).map((item) => this.mapToFlight(item));
  }

  private mapToFlight(item: any): Flight {
    return {
      flightNumber: `${item.segment.operatingCarrier}${item.segment.operatingFlightCode}`,
      status: item.status,
      departureAirport: item.segment.departureAirport,
      arrivalAirport: item.segment.arrivalAirport,
      departureTime: item.segment.departureDateTime,
      arrivalTime: item.segment.arrivalDateTime,
      delayInMinutes: item.delayInMinutes,
    };
  }
}
