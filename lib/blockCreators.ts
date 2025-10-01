// Block creators
import type { Block } from './types/block';

export function createFlightBlock(x: number, y: number): Block {
  return {
    id: `flight-${Date.now()}`,
    x,
    y,
    width: 200,
    height: 80,
    title: 'Flight',
    type: 'flight',
    color: '#3b82f6'
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
