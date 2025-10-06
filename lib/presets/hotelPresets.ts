// Hotel presets for easy test data generation
import type { HotelPreset } from '../types/hotelConfig';

export const HOTEL_PRESETS: Record<string, HotelPreset> = {
  'business-nyc': {
    id: 'business-nyc',
    name: 'Business Hotel NYC',
    description: '2-night business trip in Manhattan',
    config: {
      name: 'The Plaza Hotel',
      location: 'New York, NY',
      checkInDate: new Date(Date.now() + (6 * 24 + 2) * 60 * 60 * 1000), // 6 days + 2 hours from now (after flight returns)
      checkOutDate: new Date(Date.now() + (8 * 24 + 2) * 60 * 60 * 1000), // 8 days + 2 hours from now
      roomType: 'Business Suite',
      guests: 1,
      amenities: ['WiFi', 'Business Center', 'Gym', 'Concierge']
    }
  },

  'vacation-miami': {
    id: 'vacation-miami',
    name: 'Vacation Resort Miami',
    description: '5-day beach vacation in Miami',
    config: {
      name: 'Fontainebleau Miami Beach',
      location: 'Miami Beach, FL',
      checkInDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      checkOutDate: new Date(Date.now() + (5 * 24 + 4) * 60 * 60 * 1000), // 5 days + 4 hours from now
      roomType: 'Ocean View Suite',
      guests: 2,
      amenities: ['Pool', 'Spa', 'Restaurant', 'Room Service', 'WiFi', 'Beach Access']
    }
  },

  'luxury-paris': {
    id: 'luxury-paris',
    name: 'Luxury Hotel Paris',
    description: '3-night luxury stay in Paris',
    config: {
      name: 'The Ritz Paris',
      location: 'Paris, France',
      checkInDate: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
      checkOutDate: new Date(Date.now() + (3 * 24 + 6) * 60 * 60 * 1000), // 3 days + 6 hours from now
      roomType: 'Presidential Suite',
      guests: 2,
      amenities: ['Butler Service', 'Private Pool', 'Spa', 'Fine Dining', 'Concierge', 'WiFi']
    }
  },

  'budget-tokyo': {
    id: 'budget-tokyo',
    name: 'Budget Hotel Tokyo',
    description: '4-night budget stay in Tokyo',
    config: {
      name: 'Capsule Hotel Shibuya',
      location: 'Tokyo, Japan',
      checkInDate: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
      checkOutDate: new Date(Date.now() + (4 * 24 + 8) * 60 * 60 * 1000), // 4 days + 8 hours from now
      roomType: 'Capsule Room',
      guests: 1,
      amenities: ['WiFi', 'Shared Bathroom', 'Locker', 'Common Area']
    }
  },

  'extended-stay-london': {
    id: 'extended-stay-london',
    name: 'Extended Stay London',
    description: '2-week extended stay in London',
    config: {
      name: 'Marriott Executive Apartments',
      location: 'London, UK',
      checkInDate: new Date(Date.now() + 10 * 60 * 60 * 1000), // 10 hours from now
      checkOutDate: new Date(Date.now() + (14 * 24 + 10) * 60 * 60 * 1000), // 14 days + 10 hours from now
      roomType: 'One-Bedroom Apartment',
      guests: 2,
      amenities: ['Kitchen', 'WiFi', 'Gym', 'Laundry', 'Concierge', 'Housekeeping']
    }
  },

  'boutique-barcelona': {
    id: 'boutique-barcelona',
    name: 'Boutique Hotel Barcelona',
    description: '3-night boutique hotel in Barcelona',
    config: {
      name: 'Casa Bonay',
      location: 'Barcelona, Spain',
      checkInDate: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
      checkOutDate: new Date(Date.now() + (3 * 24 + 12) * 60 * 60 * 1000), // 3 days + 12 hours from now
      roomType: 'Deluxe Room',
      guests: 2,
      amenities: ['Rooftop Bar', 'WiFi', 'Restaurant', 'Concierge', 'Bike Rental']
    }
  },

  'resort-maldives': {
    id: 'resort-maldives',
    name: 'Resort Maldives',
    description: '7-day luxury resort in Maldives',
    config: {
      name: 'Conrad Maldives Rangali Island',
      location: 'Maldives',
      checkInDate: new Date(Date.now() + 14 * 60 * 60 * 1000), // 14 hours from now
      checkOutDate: new Date(Date.now() + (7 * 24 + 14) * 60 * 60 * 1000), // 7 days + 14 hours from now
      roomType: 'Overwater Villa',
      guests: 2,
      amenities: ['Private Beach', 'Spa', 'Diving', 'WiFi', 'All-Inclusive', 'Seaplane Transfer']
    }
  },

  'city-break-berlin': {
    id: 'city-break-berlin',
    name: 'City Break Berlin',
    description: 'Weekend city break in Berlin',
    config: {
      name: 'Hotel Adlon Kempinski',
      location: 'Berlin, Germany',
      checkInDate: new Date(Date.now() + 16 * 60 * 60 * 1000), // 16 hours from now
      checkOutDate: new Date(Date.now() + (2 * 24 + 16) * 60 * 60 * 1000), // 2 days + 16 hours from now
      roomType: 'Superior Room',
      guests: 2,
      amenities: ['WiFi', 'Gym', 'Restaurant', 'Concierge', 'City Center Location']
    }
  }
};

export const getHotelPreset = (id: string): HotelPreset | undefined => {
  return HOTEL_PRESETS[id];
};

export const getAllHotelPresets = (): HotelPreset[] => {
  return Object.values(HOTEL_PRESETS);
};
