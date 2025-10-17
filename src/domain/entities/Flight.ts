export interface Flight {
  flightNumber: string;
  status: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  delayInMinutes?: number;
}
