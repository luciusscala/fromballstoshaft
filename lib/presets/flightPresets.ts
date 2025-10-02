// Flight presets for easy test data generation
import type { FlightPreset, FlightBuilderConfig } from '../types/flightConfig';

export const FLIGHT_PRESETS: Record<string, FlightPreset> = {
  'round-trip-jfk-lax': {
    id: 'round-trip-jfk-lax',
    name: 'Round Trip JFK → LAX',
    description: '5-day business trip with layover',
    config: {
      type: 'round-trip',
      departureAirport: 'JFK',
      arrivalAirport: 'LAX',
      departureDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      returnDate: new Date(Date.now() + (5 * 24 + 2) * 60 * 60 * 1000), // 5 days + 2 hours from now
      segments: [
        // Outbound: JFK → LAX (direct)
        {
          departureAirport: 'JFK',
          arrivalAirport: 'LAX',
          departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
          duration: 6
        },
        // Return: LAX → Denver
        {
          departureAirport: 'LAX',
          arrivalAirport: 'DEN',
          departureTime: new Date(Date.now() + (5 * 24 + 2) * 60 * 60 * 1000),
          duration: 2.5
        },
        // Layover in Denver
        {
          departureAirport: 'DEN',
          arrivalAirport: 'DEN',
          departureTime: new Date(Date.now() + (5 * 24 + 4.5) * 60 * 60 * 1000),
          duration: 1,
          isLayover: true
        },
        // Return: Denver → JFK
        {
          departureAirport: 'DEN',
          arrivalAirport: 'JFK',
          departureTime: new Date(Date.now() + (5 * 24 + 5.5) * 60 * 60 * 1000),
          duration: 3.5
        }
      ]
    }
  },

  'one-way-nyc-sf': {
    id: 'one-way-nyc-sf',
    name: 'One-Way NYC → SF',
    description: 'Direct flight from New York to San Francisco',
    config: {
      type: 'one-way',
      departureAirport: 'JFK',
      arrivalAirport: 'SFO',
      departureDate: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
      segments: [{
        departureAirport: 'JFK',
        arrivalAirport: 'SFO',
        departureTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
        duration: 5.5
      }]
    }
  },

  'multi-city-europe': {
    id: 'multi-city-europe',
    name: 'Multi-City Europe',
    description: 'London → Paris → Rome → London',
    config: {
      type: 'multi-city',
      departureAirport: 'LHR',
      arrivalAirport: 'LHR',
      departureDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      segments: [
        {
          departureAirport: 'LHR',
          arrivalAirport: 'CDG',
          departureTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
          duration: 1.5
        },
        {
          departureAirport: 'CDG',
          arrivalAirport: 'FCO',
          departureTime: new Date(Date.now() + (2 * 24 + 4) * 60 * 60 * 1000), // 2 days later
          duration: 2
        },
        {
          departureAirport: 'FCO',
          arrivalAirport: 'LHR',
          departureTime: new Date(Date.now() + (5 * 24 + 4) * 60 * 60 * 1000), // 5 days later
          duration: 2.5
        }
      ]
    }
  },

  'business-trip': {
    id: 'business-trip',
    name: 'Business Trip',
    description: 'Quick 2-day business trip with connections',
    config: {
      type: 'round-trip',
      departureAirport: 'ORD',
      arrivalAirport: 'LAX',
      departureDate: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
      returnDate: new Date(Date.now() + (2 * 24 + 1) * 60 * 60 * 1000), // 2 days later
      segments: [
        {
          departureAirport: 'ORD',
          arrivalAirport: 'DEN',
          departureTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
          duration: 2.5
        },
        {
          departureAirport: 'DEN',
          arrivalAirport: 'LAX',
          departureTime: new Date(Date.now() + (1 * 24 + 3.5) * 60 * 60 * 1000),
          duration: 2
        },
        {
          departureAirport: 'LAX',
          arrivalAirport: 'ORD',
          departureTime: new Date(Date.now() + (2 * 24 + 1) * 60 * 60 * 1000),
          duration: 4
        }
      ]
    }
  },

  'vacation-package': {
    id: 'vacation-package',
    name: 'Vacation Package',
    description: '10-day vacation with multiple destinations',
    config: {
      type: 'multi-city',
      departureAirport: 'JFK',
      arrivalAirport: 'JFK',
      departureDate: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
      segments: [
        {
          departureAirport: 'JFK',
          arrivalAirport: 'LAX',
          departureTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
          duration: 6
        },
        {
          departureAirport: 'LAX',
          arrivalAirport: 'HNL',
          departureTime: new Date(Date.now() + (3 * 24 + 6) * 60 * 60 * 1000), // 3 days later
          duration: 5.5
        },
        {
          departureAirport: 'HNL',
          arrivalAirport: 'JFK',
          departureTime: new Date(Date.now() + (10 * 24 + 6) * 60 * 60 * 1000), // 10 days later
          duration: 10
        }
      ]
    }
  }
};

export const getFlightPreset = (id: string): FlightPreset | undefined => {
  return FLIGHT_PRESETS[id];
};

export const getAllFlightPresets = (): FlightPreset[] => {
  return Object.values(FLIGHT_PRESETS);
};
