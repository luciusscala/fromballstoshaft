// Minimal block system for visual trip planning
export interface Block {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  type: 'flight' | 'hotel' | 'activity';
  color: string;
  // Flight-specific data (only present when type is 'flight')
  flightData?: FlightData;
}

export interface FlightData {
  segments: FlightSegment[];
  totalDuration: number; // in hours
  departureAirport: string;
  arrivalAirport: string;
  airline: string;
  flightNumber: string;
  price?: number;
  bookingReference?: string;
}

export interface FlightSegment {
  id: string;
  departure: {
    airport: string;
    terminal?: string;
    gate?: string;
    time: Date;
  };
  arrival: {
    airport: string;
    terminal?: string;
    gate?: string;
    time: Date;
  };
  airline: string;
  flightNumber: string;
  aircraft?: string;
  duration: number; // in hours
  layover?: number; // in hours, only for connecting flights
  class: 'economy' | 'premium' | 'business' | 'first';
}