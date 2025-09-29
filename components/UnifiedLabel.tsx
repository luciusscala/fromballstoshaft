import { Group, Rect, Text, Line } from 'react-konva';
import type { FlightBlock } from '@/lib/types/flight';

interface UnifiedLabelProps {
  block: FlightBlock;
  x: number;
  y: number;
  width: number;
}

// Color scheme for flight blocks
const getBlockColors = (isGrouped: boolean = false) => ({
  primary: '#3b82f6',
  accent: '#ef4444', 
  secondary: '#f8fafc',
  text: '#1f2937',
  textSecondary: '#6b7280',
  name: 'flight'
});

export function UnifiedLabel({ block, x, y, width }: UnifiedLabelProps) {
  const colors = getBlockColors();
  
  // Get the main title and subtitle
  const { title, subtitle, details } = getLabelContent(block);
  
  // Calculate label height based on content
  const baseHeight = 50;
  const detailsHeight = details ? 40 : 20;
  const colorLegend = getColorLegend(block, colors);
  const colorLegendHeight = colorLegend.length * 14;
  const totalHeight = baseHeight + detailsHeight + colorLegendHeight;
  
  // Position the label floating above the blocks
  const labelY = y - totalHeight - 30; // 30px gap above blocks
  
  return (
    <Group>
      {/* Connection line from label to blocks */}
      <Line
        points={[x + width / 2, labelY + totalHeight, x + width / 2, y]}
        stroke={colors.primary}
        strokeWidth={2}
        dash={[3, 3]}
        listening={false}
      />
      
      {/* Main label background */}
      <Rect
        x={x}
        y={labelY}
        width={width}
        height={totalHeight}
        fill={colors.secondary}
        stroke={colors.primary}
        strokeWidth={2}
        cornerRadius={8}
        shadowColor="rgba(0, 0, 0, 0.15)"
        shadowBlur={6}
        shadowOffset={{ x: 0, y: 3 }}
        shadowOpacity={1}
        listening={false}
      />
      
      {/* Type indicator badge */}
      <Rect
        x={x + 8}
        y={labelY + 6}
        width={6}
        height={6}
        fill={colors.accent}
        cornerRadius={3}
        listening={false}
      />
      
      {/* Type label */}
      <Text
        x={x + 18}
        y={labelY + 4}
        text="FLIGHT"
        fontSize={9}
        fontFamily="Inter, system-ui, sans-serif"
        fill={colors.text}
        fontStyle="bold"
        listening={false}
      />
      
      {/* Main title */}
      <Text
        x={x + 8}
        y={labelY + 18}
        text={title}
        fontSize={14}
        fontFamily="Inter, system-ui, sans-serif"
        fill={colors.text}
        fontStyle="bold"
        width={width - 16}
        wrap="none"
        ellipsis={true}
        listening={false}
      />
      
      {/* Subtitle */}
      <Text
        x={x + 8}
        y={labelY + 34}
        text={subtitle}
        fontSize={11}
        fontFamily="Inter, system-ui, sans-serif"
        fill={colors.textSecondary}
        width={width - 16}
        wrap="none"
        ellipsis={true}
        listening={false}
      />
      
      {/* Details */}
      {details && (
        <Text
          x={x + 8}
          y={labelY + 48}
          text={details}
          fontSize={10}
          fontFamily="Inter, system-ui, sans-serif"
          fill={colors.textSecondary}
          width={width - 16}
          wrap="none"
          ellipsis={true}
          listening={false}
        />
      )}
      
      {/* Color legend */}
      <Group>
        {colorLegend.map((legendItem, index) => {
          const legendY = labelY + (details ? 62 : 48) + (index * 14);
          
          return (
            <Group key={legendItem.label}>
              {/* Color indicator */}
              <Rect
                x={x + 8}
                y={legendY}
                width={8}
                height={8}
                fill={legendItem.color}
                cornerRadius={2}
                listening={false}
              />
              
              {/* Color label */}
              <Text
                x={x + 20}
                y={legendY + 2}
                text={legendItem.label}
                fontSize={9}
                fontFamily="Inter, system-ui, sans-serif"
                fill={colors.textSecondary}
                fontStyle="bold"
                listening={false}
              />
            </Group>
          );
        })}
      </Group>
    </Group>
  );
}

// Get the main content for the label
function getLabelContent(block: FlightBlock) {
  const title = `${block.title} - ${block.departureAirport} → ${block.arrivalAirport}`;
  const subtitle = `${block.segments.length} segment${block.segments.length > 1 ? 's' : ''} • ${block.totalHours}h`;
  
  // Add flight details
  const firstSegment = block.segments[0];
  let details = '';
  if (firstSegment) {
    details = `${firstSegment.flight_number} (${firstSegment.departure_airport}→${firstSegment.arrival_airport})`;
  }
  
  return {
    title,
    subtitle,
    details: details || null
  };
}

// Get color legend for the label
function getColorLegend(block: FlightBlock, colors: any): Array<{color: string, label: string}> {
  const legend: Array<{color: string, label: string}> = [];
  
  // Get unique segment types
  const segmentTypes = [...new Set(block.segments.map(s => s.type))];
  
  segmentTypes.forEach(segmentType => {
    const segmentColors = {
      outbound: colors.primary,
      return: colors.accent,
      connecting: colors.textSecondary
    };
    const labels = {
      outbound: 'Outbound Flight',
      return: 'Return Flight',
      connecting: 'Connecting Flight'
    };
    
    if (segmentType && segmentColors[segmentType as keyof typeof segmentColors]) {
      legend.push({
        color: segmentColors[segmentType as keyof typeof segmentColors],
        label: labels[segmentType as keyof typeof labels]
      });
    }
  });
  
  return legend;
}
