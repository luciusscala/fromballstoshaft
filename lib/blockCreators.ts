// Block creators
import type { Block } from './types/block';

export function createFlightBlock(x: number, y: number): Block {
  const now = new Date();
  
  // Outbound flight: JFK → LAX (direct)
  const outboundDeparture = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
  const outboundArrival = new Date(outboundDeparture.getTime() + 6 * 60 * 60 * 1000); // 6 hours later
  
  // Trip duration: 5 days in LA
  const tripDuration = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds
  
  // Return flight: LAX → JFK (with layover in Denver)
  const returnDeparture = new Date(outboundArrival.getTime() + tripDuration); // 5 days after arrival
  const denverArrival = new Date(returnDeparture.getTime() + 2.5 * 60 * 60 * 1000); // 2.5 hours later
  const denverDeparture = new Date(denverArrival.getTime() + 1 * 60 * 60 * 1000); // 1 hour layover
  const returnArrival = new Date(denverDeparture.getTime() + 3.5 * 60 * 60 * 1000); // 3.5 hours later
  
  // Calculate total duration for the entire trip
  const totalDuration = (returnArrival.getTime() - outboundDeparture.getTime()) / (1000 * 60 * 60);
  
  // Create segments without hardcoded widths
  const segments = [
    // Outbound: JFK → LAX (direct)
    {
      id: `segment-${Date.now()}-1`,
      departureTime: outboundDeparture,
      arrivalTime: outboundArrival,
      departureAirport: 'JFK',
      arrivalAirport: 'LAX',
      duration: 6
    },
    // Return: LAX → Denver
    {
      id: `segment-${Date.now()}-2`,
      departureTime: returnDeparture,
      arrivalTime: denverArrival,
      departureAirport: 'LAX',
      arrivalAirport: 'DEN',
      duration: 2.5
    },
    // Layover in Denver
    {
      id: `layover-${Date.now()}-1`,
      departureTime: denverArrival,
      arrivalTime: denverDeparture,
      departureAirport: 'DEN',
      arrivalAirport: 'DEN',
      duration: 1,
      isLayover: true
    },
    // Return: Denver → JFK
    {
      id: `segment-${Date.now()}-3`,
      departureTime: denverDeparture,
      arrivalTime: returnArrival,
      departureAirport: 'DEN',
      arrivalAirport: 'JFK',
      duration: 3.5
    }
  ];

  return {
    id: `flight-${Date.now()}`,
    x,
    y,
    width: 200, // Initial width (will be recalculated based on scale)
    height: 60,
    title: 'Round Trip Flight',
    type: 'flight',
    color: '#3b82f6',
    // Time context for this block
    startTime: outboundDeparture,
    endTime: returnArrival,
    duration: totalDuration,
    flightData: {
      segments,
      departureTime: outboundDeparture,
      arrivalTime: returnArrival,
      departureAirport: 'JFK',
      arrivalAirport: 'JFK' // Round trip returns to origin
    }
  };
}

export function createHotelBlock(x: number, y: number): Block {
  const now = new Date();
  const checkIn = new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 hours from now
  const checkOut = new Date(checkIn.getTime() + 72 * 60 * 60 * 1000); // 3 days later
  const duration = 72; // 3 days in hours
  
  return {
    id: `hotel-${Date.now()}`,
    x,
    y,
    width: 180, // Initial width (will be recalculated based on scale)
    height: 60,
    title: 'Hotel',
    type: 'hotel',
    color: '#10b981',
    // Time context for this block
    startTime: checkIn,
    endTime: checkOut,
    duration: duration
  };
}

export function createActivityBlock(x: number, y: number): Block {
  const now = new Date();
  const startTime = new Date(now.getTime() + 6 * 60 * 60 * 1000); // 6 hours from now
  const endTime = new Date(startTime.getTime() + 3 * 60 * 60 * 1000); // 3 hours later
  const duration = 3; // 3 hours
  
  return {
    id: `activity-${Date.now()}`,
    x,
    y,
    width: 120, // Initial width (will be recalculated based on scale)
    height: 50,
    title: 'Activity',
    type: 'activity',
    color: '#f59e0b',
    // Time context for this block
    startTime: startTime,
    endTime: endTime,
    duration: duration
  };
}
