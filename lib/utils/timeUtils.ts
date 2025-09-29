// Time utilities for date-based positioning and calculations

export interface DateRange {
  start: Date;
  end: Date;
  duration: { hours: number };
}

export interface TripTimeline {
  startDate: Date;
  endDate: Date;
  totalHours: number;
  scale: number; // pixels per hour
}

export interface BlockPosition {
  startHour: number;
  durationHours: number;
  x: number;
  width: number;
}

// Calculate duration between two dates in hours
export function calculateDurationHours(startDate: Date, endDate: Date): number {
  const diffMs = endDate.getTime() - startDate.getTime();
  return diffMs / (1000 * 60 * 60); // Convert milliseconds to hours
}

// Create a DateRange from start and end dates
export function createDateRange(start: Date, end: Date): DateRange {
  return {
    start,
    end,
    duration: { hours: calculateDurationHours(start, end) }
  };
}

// Calculate hours from trip start date
export function calculateHoursFromTripStart(
  date: Date, 
  tripStartDate: Date
): number {
  return calculateDurationHours(tripStartDate, date);
}

// Calculate block position from time data
export function calculateBlockPosition(
  startHour: number,
  durationHours: number,
  scale: number,
  y: number = 0
): BlockPosition {
  return {
    startHour,
    durationHours,
    x: startHour * scale,
    width: durationHours * scale,
  };
}

// Create a trip timeline with unified scale
export function createTripTimeline(
  startDate: Date,
  endDate: Date,
  scale: number = 20 // pixels per hour
): TripTimeline {
  const totalHours = calculateDurationHours(startDate, endDate);
  
  return {
    startDate,
    endDate,
    totalHours,
    scale
  };
}

// Format hours to human-readable string
export function formatDuration(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)}m`;
  } else if (hours < 24) {
    return `${Math.round(hours * 10) / 10}h`;
  } else {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (remainingHours === 0) {
      return `${days}d`;
    } else {
      return `${days}d ${Math.round(remainingHours)}h`;
    }
  }
}
