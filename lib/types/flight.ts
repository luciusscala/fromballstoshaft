// Flight-related data models and types

export interface FlightSegment {
  id: string
  flight_id: string // References the parent flight
  segment_index: number // Order of segment in the flight
  airline: string
  flight_number: string
  departure_airport: string
  arrival_airport: string
  departure_time: string // ISO string format
  arrival_time: string // ISO string format
  duration: string // Duration in hours as string (e.g., "2.5")
  layover?: string // Layover time in hours as string (e.g., "1.5")
  // Canvas-specific properties
  startTime?: number // Start time in hours from trip start (for canvas rendering)
  type?: 'outbound' | 'return' | 'connecting' // For canvas rendering
  label?: string // For canvas rendering
}

export interface FlightBlock {
  id: string
  user_id: string
  price: string // Numeric as string for form handling
  link: string
  // Canvas-specific properties
  type: 'flight'
  x: number
  y: number
  width: number
  height: number
  title: string
  color?: string
  totalHours: number // Total time span in hours (calculated)
  segments: FlightSegment[]
  contextBarHeight: number
  segmentHeight: number
  departureAirport: string // Calculated from first segment
  arrivalAirport: string // Calculated from last segment
  startHour: number // Hours from trip start (for canvas)
  durationHours: number // Total flight duration (calculated)
}

// Form data interfaces for the creator
export interface FlightSegmentFormData {
  id: string
  type: 'outbound' | 'return' | 'connecting'
  airline: string
  flight_number: string
  departure_airport: string
  arrival_airport: string
  departure_time: string
  arrival_time: string
  duration: string // in hours
  layover?: string // in hours
}

export interface FlightFormData {
  user_id: string
  price: string
  link: string
  segments: FlightSegmentFormData[]
}

// Utility functions for flight data
export const createFlightSegment = (formData: FlightSegmentFormData, flightId: string, index: number): FlightSegment => {
  const startTime = formData.departure_time ? 
    new Date(formData.departure_time).getTime() / (1000 * 60 * 60) : 0
  
  return {
    id: `segment-${Date.now()}-${index}`,
    flight_id: flightId,
    segment_index: index,
    airline: formData.airline,
    flight_number: formData.flight_number,
    departure_airport: formData.departure_airport,
    arrival_airport: formData.arrival_airport,
    departure_time: formData.departure_time,
    arrival_time: formData.arrival_time,
    duration: formData.duration,
    layover: formData.layover,
    // Canvas-specific properties
    startTime,
    type: formData.type,
    label: formData.flight_number
  }
}

export const createFlightBlock = (formData: FlightFormData): FlightBlock => {
  const totalDuration = formData.segments.reduce((total, segment) => {
    return total + parseFloat(segment.duration || '0')
  }, 0)

  const flightId = `flight-${Date.now()}`
  const segments = formData.segments.map((segment, index) => 
    createFlightSegment(segment, flightId, index)
  )

  return {
    id: flightId,
    user_id: formData.user_id,
    price: formData.price,
    link: formData.link,
    // Canvas-specific properties
    type: 'flight',
    x: 100, // Default position - will be updated when placed on canvas
    y: 100,
    width: Math.max(400, totalDuration * 50), // Scale width based on duration
    height: 150,
    title: `${formData.segments[0]?.departure_airport} → ${formData.segments[formData.segments.length - 1]?.arrival_airport}`,
    color: '#f3f4f6',
    totalHours: totalDuration,
    segments,
    contextBarHeight: 24,
    segmentHeight: 80,
    departureAirport: formData.segments[0]?.departure_airport || '',
    arrivalAirport: formData.segments[formData.segments.length - 1]?.arrival_airport || '',
    startHour: 0, // Will be calculated when placed on timeline
    durationHours: totalDuration
  }
}
