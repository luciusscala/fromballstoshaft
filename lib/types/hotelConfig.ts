// Hotel configuration types for the builder system
export interface HotelBuilderConfig {
  name: string;
  location: string;
  checkInDate: Date;
  checkOutDate: Date;
  roomType?: string;
  guests?: number;
  amenities?: string[];
}

export interface HotelPreset {
  id: string;
  name: string;
  description: string;
  config: HotelBuilderConfig;
}

export type HotelType = 'business' | 'vacation' | 'luxury' | 'budget' | 'extended-stay';
