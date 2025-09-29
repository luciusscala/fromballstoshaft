// Color utilities for consistent theming across the canvas

export const getBlockColors = (blockType: string, isGrouped: boolean = false, relationshipType?: string) => {
  const baseColors = {
    flight: {
      primary: '#dc2626', // Cleaner red for outbound
      accent: '#b91c1c', // Darker red for connecting
      secondary: '#f8fafc',
      text: '#1f2937',
      textSecondary: '#6b7280',
      name: 'flight'
    },
    hotel: {
      primary: '#10b981',
      accent: '#f59e0b',
      secondary: '#f0fdf4',
      text: '#1f2937',
      textSecondary: '#6b7280',
      name: 'hotel'
    },
    activity: {
      primary: '#8b5cf6',
      accent: '#ec4899',
      secondary: '#faf5ff',
      text: '#1f2937',
      textSecondary: '#6b7280',
      name: 'activity'
    }
  };

  const colors = baseColors[blockType as keyof typeof baseColors] || baseColors.flight;

  // If grouped, use relationship-specific colors
  if (isGrouped && relationshipType) {
    const groupedColors = {
      'flight-hotel': {
        primary: '#3b82f6',
        accent: '#10b981',
        secondary: '#f0f9ff',
        text: '#1f2937',
        textSecondary: '#6b7280',
        name: 'flight-hotel'
      },
      'flight-activity': {
        primary: '#3b82f6',
        accent: '#8b5cf6',
        secondary: '#f8fafc',
        text: '#1f2937',
        textSecondary: '#6b7280',
        name: 'flight-activity'
      }
    };

    return groupedColors[relationshipType as keyof typeof groupedColors] || colors;
  }

  return colors;
};

// Get segment colors for flight blocks
export const getSegmentColors = (colors: { primary: string; accent: string; textSecondary: string }) => ({
  outbound: colors.primary, // Red for outbound
  return: '#f87171', // Light red/pink for return
  connecting: colors.accent // Dark red for connecting
});
