// Flight builder for creating configurable flight blocks
import type { Block } from '../types/block';
import type { FlightBuilderConfig, FlightSegmentConfig } from '../types/flightConfig';

export class FlightBuilder {
  /**
   * Create a flight block from a configuration
   */
  static createFromConfig(config: FlightBuilderConfig, x: number, y: number): Block {
    const segments = this.buildSegments(config);
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];
    
    const totalDuration = (lastSegment.arrivalTime.getTime() - firstSegment.departureTime.getTime()) / (1000 * 60 * 60);
    
    return {
      id: `flight-${Date.now()}`,
      x,
      y,
      width: 200, // Initial width (will be recalculated based on scale)
      height: 60,
      title: this.getFlightTitle(config),
      type: 'flight',
      color: '#3b82f6',
      startTime: firstSegment.departureTime,
      endTime: lastSegment.arrivalTime,
      duration: totalDuration,
      flightData: {
        segments,
        departureTime: firstSegment.departureTime,
        arrivalTime: lastSegment.arrivalTime,
        departureAirport: firstSegment.departureAirport,
        arrivalAirport: lastSegment.arrivalAirport
      },
      // Snapping system
      isSnapped: false,
      snapGroupId: undefined,
      snapPosition: undefined
    };
  }

  /**
   * Create a one-way flight
   */
  static createOneWay(
    departureAirport: string,
    arrivalAirport: string,
    departureDate: Date,
    duration: number,
    x: number,
    y: number
  ): Block {
    const arrivalDate = new Date(departureDate.getTime() + duration * 60 * 60 * 1000);
    
    return this.createFromConfig({
      type: 'one-way',
      departureAirport,
      arrivalAirport,
      departureDate,
      segments: [{
        departureAirport,
        arrivalAirport,
        departureTime: departureDate,
        duration
      }]
    }, x, y);
  }

  /**
   * Create a round-trip flight
   */
  static createRoundTrip(
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
    const outboundArrival = new Date(departureDate.getTime() + outboundDuration * 60 * 60 * 1000);
    const returnDeparture = new Date(returnDate.getTime());
    const returnArrival = new Date(returnDeparture.getTime() + returnDuration * 60 * 60 * 1000);
    
    // Add layover if there's a gap between outbound arrival and return departure
    const segments: FlightSegmentConfig[] = [
      {
        departureAirport,
        arrivalAirport,
        departureTime: departureDate,
        duration: outboundDuration
      }
    ];

    // Add layover if there's a significant gap
    const gapHours = (returnDeparture.getTime() - outboundArrival.getTime()) / (1000 * 60 * 60);
    if (gapHours > 2) { // Only add layover if gap is more than 2 hours
      segments.push({
        departureAirport: arrivalAirport,
        arrivalAirport: arrivalAirport,
        departureTime: outboundArrival,
        duration: gapHours,
        isLayover: true
      });
    }

    segments.push({
      departureAirport: arrivalAirport,
      arrivalAirport: departureAirport,
      departureTime: returnDeparture,
      duration: returnDuration
    });

    return this.createFromConfig({
      type: 'round-trip',
      departureAirport,
      arrivalAirport,
      departureDate,
      returnDate,
      segments
    }, x, y);
  }

  /**
   * Create a multi-city flight
   */
  static createMultiCity(
    segments: FlightSegmentConfig[],
    x: number,
    y: number
  ): Block {
    return this.createFromConfig({
      type: 'multi-city',
      departureAirport: segments[0].departureAirport,
      arrivalAirport: segments[segments.length - 1].arrivalAirport,
      departureDate: segments[0].departureTime,
      segments
    }, x, y);
  }

  /**
   * Build segments from configuration
   */
  private static buildSegments(config: FlightBuilderConfig): Array<{
    id: string;
    departureTime: Date;
    arrivalTime: Date;
    departureAirport: string;
    arrivalAirport: string;
    duration: number;
    isLayover?: boolean;
  }> {
    if (config.segments) {
      return config.segments.map((segment, index) => ({
        id: segment.id || `segment-${Date.now()}-${index}`,
        departureTime: segment.departureTime,
        arrivalTime: new Date(segment.departureTime.getTime() + segment.duration * 60 * 60 * 1000),
        departureAirport: segment.departureAirport,
        arrivalAirport: segment.arrivalAirport,
        duration: segment.duration,
        isLayover: segment.isLayover
      }));
    }

    // Fallback to simple one-way
    const arrivalTime = new Date(config.departureDate.getTime() + 6 * 60 * 60 * 1000); // Default 6 hours
    return [{
      id: `segment-${Date.now()}-1`,
      departureTime: config.departureDate,
      arrivalTime,
      departureAirport: config.departureAirport,
      arrivalAirport: config.arrivalAirport,
      duration: 6
    }];
  }

  /**
   * Get flight title based on configuration
   */
  private static getFlightTitle(config: FlightBuilderConfig): string {
    switch (config.type) {
      case 'one-way':
        return 'One-Way Flight';
      case 'round-trip':
        return 'Round Trip Flight';
      case 'multi-city':
        return 'Multi-City Flight';
      default:
        return 'Flight';
    }
  }
}
