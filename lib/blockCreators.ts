// Block creators
import type { Block } from './types/block';

export function createFlightBlock(x: number, y: number): Block {
  const now = new Date();
  const departureTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
  const arrivalTime = new Date(departureTime.getTime() + 5.5 * 60 * 60 * 1000); // 5.5 hours later
  
  return {
    id: `flight-${Date.now()}`,
    x,
    y,
    width: 280,
    height: 120,
    title: 'Flight',
    type: 'flight',
    color: '#3b82f6',
    flightData: {
      segments: [
        {
          id: `segment-${Date.now()}-1`,
          departure: {
            airport: 'JFK',
            terminal: '4',
            gate: 'A12',
            time: departureTime
          },
          arrival: {
            airport: 'LAX',
            terminal: '1',
            gate: 'B8',
            time: arrivalTime
          },
          airline: 'American Airlines',
          flightNumber: 'AA123',
          aircraft: 'Boeing 737',
          duration: 5.5,
          class: 'economy'
        }
      ],
      totalDuration: 5.5,
      departureAirport: 'JFK',
      arrivalAirport: 'LAX',
      airline: 'American Airlines',
      flightNumber: 'AA123',
      price: 450,
      bookingReference: 'ABC123'
    }
  };
}

export function createHotelBlock(x: number, y: number): Block {
  return {
    id: `hotel-${Date.now()}`,
    x,
    y,
    width: 180,
    height: 60,
    title: 'Hotel',
    type: 'hotel',
    color: '#10b981'
  };
}

export function createActivityBlock(x: number, y: number): Block {
  return {
    id: `activity-${Date.now()}`,
    x,
    y,
    width: 120,
    height: 50,
    title: 'Activity',
    type: 'activity',
    color: '#f59e0b'
  };
}
