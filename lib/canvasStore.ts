'use client'

import { create } from 'zustand'
import type { FlightBlock } from './types/flight'

export interface CanvasBlock {
  id: string
  x: number
  y: number
  width: number
  height: number
  title: string
  color?: string
}

export type Block = CanvasBlock | FlightBlock

interface CanvasStore {
  blocks: Block[]
  addBlock: (block: Block) => void
  updateBlock: (id: string, updates: Partial<Block>) => void
  removeBlock: (id: string) => void
  selectedBlockId: string | null
  setSelectedBlock: (id: string | null) => void
}

// Test flight data - Round trip with connections (freely positioned like canvas app)
const createTestFlightData = (): FlightBlock => {
  const flightId = 'test-flight-1'
  
  return {
    id: flightId,
    user_id: 'test-user',
    price: '1,247.50',
    link: 'https://example.com/booking/AA123456',
    // Canvas properties - freely positioned
    type: 'flight',
    x: 200, // Free position on canvas
    y: 200,
    width: 600, // Fixed width for the block
    height: 150,
    title: 'JFK → SFO (Round Trip)',
    color: '#f3f4f6',
    totalHours: 168, // 7 days in hours for internal scaling
    contextBarHeight: 24,
    segmentHeight: 80,
    departureAirport: 'JFK',
    arrivalAirport: 'JFK',
    startHour: 0, // Not used for positioning, just for internal scaling
    durationHours: 168, // Not used for positioning, just for internal scaling
    segments: [
      // Outbound: JFK → LAX (with connection)
      {
        id: 'segment-1',
        flight_id: flightId,
        segment_index: 0,
        airline: 'American Airlines',
        flight_number: 'AA123',
        departure_airport: 'JFK',
        arrival_airport: 'LAX',
        departure_time: '2024-12-15T08:00:00Z',
        arrival_time: '2024-12-15T11:30:00Z',
        duration: '5.5',
        layover: '2.5',
        startTime: 0, // Relative to flight start (0 hours into flight)
        type: 'outbound',
        label: 'AA123'
      },
      {
        id: 'segment-2',
        flight_id: flightId,
        segment_index: 1,
        airline: 'American Airlines',
        flight_number: 'AA456',
        departure_airport: 'LAX',
        arrival_airport: 'SFO',
        departure_time: '2024-12-15T14:00:00Z',
        arrival_time: '2024-12-15T15:30:00Z',
        duration: '1.5',
        startTime: 8, // 8 hours from flight start (5.5 + 2.5 layover)
        type: 'connecting',
        label: 'AA456'
      },
      // Stay in San Francisco (represented as a gap in the timeline)
      // Return: SFO → LAX → JFK
      {
        id: 'segment-3',
        flight_id: flightId,
        segment_index: 2,
        airline: 'American Airlines',
        flight_number: 'AA789',
        departure_airport: 'SFO',
        arrival_airport: 'LAX',
        departure_time: '2024-12-21T16:00:00Z',
        arrival_time: '2024-12-21T17:30:00Z',
        duration: '1.5',
        layover: '3.0',
        startTime: 152, // 6 days + 16 hours from flight start
        type: 'return',
        label: 'AA789'
      },
      {
        id: 'segment-4',
        flight_id: flightId,
        segment_index: 3,
        airline: 'American Airlines',
        flight_number: 'AA012',
        departure_airport: 'LAX',
        arrival_airport: 'JFK',
        departure_time: '2024-12-21T20:30:00Z',
        arrival_time: '2024-12-22T06:00:00Z',
        duration: '5.5',
        startTime: 156.5, // 6 days + 20.5 hours from flight start
        type: 'return',
        label: 'AA012'
      }
    ]
  }
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  blocks: [createTestFlightData()], // Start with test data
  selectedBlockId: null,
  
  addBlock: (block) => set((state) => ({
    blocks: [...state.blocks, block]
  })),
  
  updateBlock: (id, updates) => set((state) => ({
    blocks: state.blocks.map(block =>
      block.id === id ? { ...block, ...updates } : block
    )
  })),
  
  removeBlock: (id) => set((state) => ({
    blocks: state.blocks.filter(block => block.id !== id)
  })),
  
  setSelectedBlock: (id) => set({ selectedBlockId: id })
}))
