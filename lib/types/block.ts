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
  // Time context for this block
  startTime: Date;
  endTime: Date;
  duration: number; // in hours
  // Flight-specific data (only present when type is 'flight')
  flightData?: FlightData;
}

export interface FlightData {
  segments: FlightSegment[];
  departureTime: Date;
  arrivalTime: Date;
  departureAirport: string;
  arrivalAirport: string;
}

export interface FlightSegment {
  id: string;
  departureTime: Date;
  arrivalTime: Date;
  departureAirport: string;
  arrivalAirport: string;
  duration: number; // in hours
  layover?: number; // in hours, only for connecting flights
  isLayover?: boolean; // true for layover segments
  // Width and height are calculated at render time using global scale
}