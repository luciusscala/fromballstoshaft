// Activity configuration types for the builder system
export interface ActivityBuilderConfig {
  name: string;
  location: string;
  startTime: Date;
  endTime: Date;
  category?: string;
  description?: string;
  notes?: string[];
}

export interface ActivityPreset {
  id: string;
  name: string;
  description: string;
  config: ActivityBuilderConfig;
}

export type ActivityType = 'sightseeing' | 'dining' | 'entertainment' | 'shopping' | 'transport' | 'business' | 'leisure' | 'sports';
