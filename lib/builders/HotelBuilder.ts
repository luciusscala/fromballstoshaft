// Hotel builder for creating hotel blocks from configuration
import type { Block } from '../types/block';
import type { HotelBuilderConfig } from '../types/hotelConfig';

export class HotelBuilder {
  static createFromConfig(config: HotelBuilderConfig, x: number, y: number): Block {
    const checkInTime = new Date(config.checkInDate);
    const checkOutTime = new Date(config.checkOutDate);
    const duration = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60); // in hours

    return {
      id: `hotel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x,
      y,
      width: 200, // Default width, will be calculated based on duration
      height: 60, // Default height
      title: `${config.name} - ${config.location}`,
      type: 'hotel',
      color: '#10b981', // Green color for hotels
      startTime: checkInTime,
      endTime: checkOutTime,
      duration,
      // Snapping system
      isSnapped: false,
      snapGroupId: undefined,
      snapPosition: undefined
    };
  }

  static createHotel(
    name: string,
    location: string,
    checkInDate: Date,
    checkOutDate: Date,
    x: number,
    y: number,
    roomType?: string,
    guests?: number
  ): Block {
    const config: HotelBuilderConfig = {
      name,
      location,
      checkInDate,
      checkOutDate,
      roomType,
      guests
    };

    return this.createFromConfig(config, x, y);
  }

  static createBusinessHotel(
    name: string,
    location: string,
    checkInDate: Date,
    checkOutDate: Date,
    x: number,
    y: number
  ): Block {
    const config: HotelBuilderConfig = {
      name,
      location,
      checkInDate,
      checkOutDate,
      roomType: 'Business Suite',
      guests: 1,
      amenities: ['WiFi', 'Business Center', 'Gym', 'Concierge']
    };

    return this.createFromConfig(config, x, y);
  }

  static createVacationHotel(
    name: string,
    location: string,
    checkInDate: Date,
    checkOutDate: Date,
    x: number,
    y: number,
    guests: number = 2
  ): Block {
    const config: HotelBuilderConfig = {
      name,
      location,
      checkInDate,
      checkOutDate,
      roomType: 'Deluxe Room',
      guests,
      amenities: ['Pool', 'Spa', 'Restaurant', 'Room Service', 'WiFi']
    };

    return this.createFromConfig(config, x, y);
  }

  static createLuxuryHotel(
    name: string,
    location: string,
    checkInDate: Date,
    checkOutDate: Date,
    x: number,
    y: number,
    guests: number = 2
  ): Block {
    const config: HotelBuilderConfig = {
      name,
      location,
      checkInDate,
      checkOutDate,
      roomType: 'Presidential Suite',
      guests,
      amenities: ['Butler Service', 'Private Pool', 'Spa', 'Fine Dining', 'Concierge', 'WiFi']
    };

    return this.createFromConfig(config, x, y);
  }
}
