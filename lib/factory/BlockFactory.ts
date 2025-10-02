// Centralized block factory for creating all types of blocks
import type { Block } from '../types/block';
import { FlightBuilder } from '../builders/FlightBuilder';
import { createHotelBlock, createActivityBlock } from '../blockCreators';
import { getFlightPreset } from '../presets/flightPresets';
import type { FlightBuilderConfig } from '../types/flightConfig';

export class BlockFactory {
  /**
   * Create a flight block using the FlightBuilder
   */
  static createFlight(config: FlightBuilderConfig, x: number, y: number): Block {
    return FlightBuilder.createFromConfig(config, x, y);
  }

  /**
   * Create a flight block from a preset
   */
  static createFlightFromPreset(presetId: string, x: number, y: number): Block | null {
    const preset = getFlightPreset(presetId);
    if (!preset) return null;
    
    return FlightBuilder.createFromConfig(preset.config, x, y);
  }

  /**
   * Create a one-way flight
   */
  static createOneWayFlight(
    departureAirport: string,
    arrivalAirport: string,
    departureDate: Date,
    duration: number,
    x: number,
    y: number
  ): Block {
    return FlightBuilder.createOneWay(departureAirport, arrivalAirport, departureDate, duration, x, y);
  }

  /**
   * Create a round-trip flight
   */
  static createRoundTripFlight(
    departureAirport: string,
    arrivalAirport: string,
    departureDate: Date,
    returnDate: Date,
    outboundDuration: number,
    returnDuration: number,
    layoverDuration: number = 1,
    x: number,
    y: number
  ): Block {
    return FlightBuilder.createRoundTrip(
      departureAirport,
      arrivalAirport,
      departureDate,
      returnDate,
      outboundDuration,
      returnDuration,
      layoverDuration,
      x,
      y
    );
  }

  /**
   * Create a multi-city flight
   */
  static createMultiCityFlight(
    segments: Array<{
      departureAirport: string;
      arrivalAirport: string;
      departureTime: Date;
      duration: number;
      isLayover?: boolean;
    }>,
    x: number,
    y: number
  ): Block {
    return FlightBuilder.createMultiCity(segments, x, y);
  }

  /**
   * Create a hotel block
   */
  static createHotel(x: number, y: number): Block {
    return createHotelBlock(x, y);
  }

  /**
   * Create an activity block
   */
  static createActivity(x: number, y: number): Block {
    return createActivityBlock(x, y);
  }
}