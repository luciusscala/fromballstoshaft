// Flight configuration types for the builder system
export interface FlightSegmentConfig {
  id?: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: Date;
  duration: number; // in hours
  isLayover?: boolean;
}

export interface FlightBuilderConfig {
  type: 'one-way' | 'round-trip' | 'multi-city';
  departureAirport: string;
  arrivalAirport: string;
  departureDate: Date;
  returnDate?: Date; // Only for round-trip
  segments?: FlightSegmentConfig[]; // For multi-city
  layoverDuration?: number; // Default layover time in hours
}

export interface FlightPreset {
  id: string;
  name: string;
  description: string;
  config: FlightBuilderConfig;
}

export type FlightType = 'one-way' | 'round-trip' | 'multi-city';
