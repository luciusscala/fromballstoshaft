// Activity presets for easy test data generation
import type { ActivityPreset } from '../types/activityConfig';

export const ACTIVITY_PRESETS: Record<string, ActivityPreset> = {
  'museum-visit': {
    id: 'museum-visit',
    name: 'Museum Visit',
    description: '2-hour museum tour',
    config: {
      name: 'Metropolitan Museum of Art',
      location: 'New York, NY',
      startTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
      endTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
      category: 'sightseeing',
      description: 'Explore world-class art collection',
      notes: ['Audio guide available', 'Photography allowed']
    }
  },

  'restaurant-dinner': {
    id: 'restaurant-dinner',
    name: 'Fine Dining',
    description: '2-hour dinner reservation',
    config: {
      name: 'Le Bernardin',
      location: 'New York, NY',
      startTime: new Date(Date.now() + 7 * 60 * 60 * 1000), // 7 hours from now
      endTime: new Date(Date.now() + 9 * 60 * 60 * 1000), // 9 hours from now
      category: 'dining',
      description: 'Michelin-starred seafood restaurant',
      notes: ['Dress code: smart casual', 'Reservation required']
    }
  },

  'business-meeting': {
    id: 'business-meeting',
    name: 'Business Meeting',
    description: '1-hour client meeting',
    config: {
      name: 'Client Presentation',
      location: 'Conference Room A',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      endTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
      category: 'business',
      description: 'Quarterly business review meeting',
      notes: ['Presentation materials ready', 'Video conference available']
    }
  },

  'city-tour': {
    id: 'city-tour',
    name: 'City Walking Tour',
    description: '3-hour guided city tour',
    config: {
      name: 'Historic Downtown Tour',
      location: 'Boston, MA',
      startTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      endTime: new Date(Date.now() + 7 * 60 * 60 * 1000), // 7 hours from now
      category: 'sightseeing',
      description: 'Guided walking tour of historic sites',
      notes: ['Comfortable walking shoes', 'Weather dependent']
    }
  },

  'shopping-trip': {
    id: 'shopping-trip',
    name: 'Shopping Spree',
    description: '2-hour shopping session',
    config: {
      name: 'Fifth Avenue Shopping',
      location: 'New York, NY',
      startTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
      category: 'shopping',
      description: 'Luxury shopping on Fifth Avenue',
      notes: ['Multiple stores planned', 'Budget: $500']
    }
  },

  'theater-show': {
    id: 'theater-show',
    name: 'Broadway Show',
    description: '3-hour theater performance',
    config: {
      name: 'Hamilton',
      location: 'Richard Rodgers Theatre, NYC',
      startTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
      endTime: new Date(Date.now() + 11 * 60 * 60 * 1000), // 11 hours from now
      category: 'entertainment',
      description: 'Award-winning musical performance',
      notes: ['Dress code: smart casual', 'No photography during show']
    }
  },

  'gym-workout': {
    id: 'gym-workout',
    name: 'Gym Session',
    description: '1.5-hour workout',
    config: {
      name: 'Morning Workout',
      location: 'Hotel Fitness Center',
      startTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
      endTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000), // 2.5 hours from now
      category: 'sports',
      description: 'Cardio and strength training',
      notes: ['Bring workout clothes', 'Water bottle recommended']
    }
  },

  'coffee-meeting': {
    id: 'coffee-meeting',
    name: 'Coffee Meeting',
    description: '1-hour casual meeting',
    config: {
      name: 'Coffee with Colleague',
      location: 'Starbucks Downtown',
      startTime: new Date(Date.now() + 1.5 * 60 * 60 * 1000), // 1.5 hours from now
      endTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000), // 2.5 hours from now
      category: 'business',
      description: 'Informal work discussion',
      notes: ['Casual dress', 'WiFi available']
    }
  },

  'beach-relaxation': {
    id: 'beach-relaxation',
    name: 'Beach Time',
    description: '4-hour beach relaxation',
    config: {
      name: 'Miami Beach',
      location: 'Miami, FL',
      startTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
      endTime: new Date(Date.now() + 9 * 60 * 60 * 1000), // 9 hours from now
      category: 'leisure',
      description: 'Relaxing beach day',
      notes: ['Sunscreen essential', 'Beach towels provided']
    }
  },

  'conference-attendance': {
    id: 'conference-attendance',
    name: 'Tech Conference',
    description: '6-hour conference day',
    config: {
      name: 'TechCrunch Disrupt',
      location: 'Moscone Center, San Francisco',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
      category: 'business',
      description: 'Technology conference and networking',
      notes: ['Business cards ready', 'Networking lunch included']
    }
  }
};

export const getActivityPreset = (id: string): ActivityPreset | undefined => {
  return ACTIVITY_PRESETS[id];
};

export const getAllActivityPresets = (): ActivityPreset[] => {
  return Object.values(ACTIVITY_PRESETS);
};
