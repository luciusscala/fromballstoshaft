// Minimal block system for visual trip planning
export interface Block {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  type: 'flight' | 'hotel' | 'activity';
  color: string;
  // Time context for this block
  startTime: Date;
  endTime: Date;
  duration: number; // in hours
  // Flight-specific data (only present when type is 'flight')
  flightData?: FlightData;
  // Snapping system
  snapGroupId?: string; // ID of the snap group this block belongs to
  isSnapped: boolean; // Whether this block is currently snapped
  snapPosition?: 'left' | 'right' | 'center'; // Position within snap group
}

export interface FlightData {
  segments: FlightSegment[];
  departureTime: Date;
  arrivalTime: Date;
  departureAirport: string;
  arrivalAirport: string;
}

export interface FlightSegment {
  id: string;
  departureTime: Date;
  arrivalTime: Date;
  departureAirport: string;
  arrivalAirport: string;
  duration: number; // in hours
  layover?: number; // in hours, only for connecting flights
  isLayover?: boolean; // true for layover segments
  // Width and height are calculated at render time using global scale
}

// Snap group for blocks that are snapped together
export interface SnapGroup {
  id: string;
  blockIds: string[]; // IDs of blocks in this group
  startTime: Date; // Earliest start time in the group
  endTime: Date; // Latest end time in the group
  totalDuration: number; // Total duration of the group
  x: number; // Group position
  y: number; // Group position
  width: number; // Total width of the group
  height: number; // Height of the group
  isConflictFree: boolean; // Whether all blocks in group have no timing conflicts
}