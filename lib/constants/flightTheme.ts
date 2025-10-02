// Flight block theme constants
export const FLIGHT_COLORS = {
  // Segment colors
  outbound: "#3b82f6",     // Blue
  layover: "#f59e0b",      // Orange
  return: "#10b981",       // Green
  connection: "#8b5cf6",   // Purple
  additional: "#ef4444",   // Red
  extra: "#06b6d4",        // Cyan
  
  // UI colors
  primary: "#3b82f6",      // Blue
  primaryHover: "#1d4ed8", // Darker blue
  primaryStroke: "#1e40af", // Even darker blue
  dayMarker: "#3b82f6",    // Blue for day markers
  dayMarkerBg: "rgba(59, 130, 246, 0.1)", // Light blue background
  
  // Label colors
  labelBg: "rgba(255, 255, 255, 0.95)",
  labelBorder: "#3b82f6",
  labelText: "#374151",
  legendText: "#6b7280",
  
  // Shadow
  shadow: "rgba(0, 0, 0, 0.2)",
  labelShadow: "rgba(0, 0, 0, 0.15)",
} as const;

export const LAYOUT = {
  // Label dimensions
  labelWidth: 200,
  labelPadding: 8,
  labelSpacing: 18,
  labelHeaderHeight: 50,
  
  // Day markers
  dayMarkerHeight: 12,
  dayMarkerY: -16,
  dayMarkerTextY: -14,
  dayMarkerLineY: -4,
  
  // Segments
  segmentCornerRadius: 6,
  labelCornerRadius: 8,
  dayMarkerCornerRadius: 2,
  
  // Badge
  badgeSize: 6,
  badgeCornerRadius: 3,
  
  // Legend
  legendItemHeight: 8,
  legendItemSpacing: 18,
} as const;

export const TEXT_STYLES = {
  fontFamily: "Inter, system-ui, sans-serif",
  sizes: {
    dayMarker: 8,
    labelHeader: 9,
    labelRoute: 14,
    legend: 9,
  },
  weights: {
    normal: "normal",
    bold: "bold",
  },
} as const;

// Segment type definitions
export type SegmentType = 'outbound' | 'layover' | 'return' | 'connection';

// Get segment color based on type and position
export const getSegmentColor = (
  segment: { isLayover?: boolean },
  index: number,
  totalSegments: number
): string => {
  if (segment.isLayover) return FLIGHT_COLORS.layover;
  if (index === 0) return FLIGHT_COLORS.outbound;
  if (index === totalSegments - 1) return FLIGHT_COLORS.return;
  return FLIGHT_COLORS.connection;
};

// Get segment type for labeling
export const getSegmentType = (
  segment: { isLayover?: boolean },
  index: number,
  totalSegments: number
): SegmentType => {
  if (segment.isLayover) return 'layover';
  if (index === 0) return 'outbound';
  if (index === totalSegments - 1) return 'return';
  return 'connection';
};
