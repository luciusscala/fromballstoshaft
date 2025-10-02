// Flight block component focused on timing for trip planning
import { Group, Rect, Text, Line } from 'react-konva';
import type { Block } from '../lib/types/block';
import { useTimelineStore } from '../lib/timelineStore';
import { FLIGHT_COLORS, LAYOUT, TEXT_STYLES, getSegmentColor, getSegmentType } from '../lib/constants/flightTheme';

interface FlightBlockProps {
  block: Block;
  isHovered: boolean;
  onDragStart: () => void;
  onDragEnd: (e: { target: { x(): number; y(): number } }) => void;
  onClick: (e: { cancelBubble: boolean }) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function FlightBlock({ 
  block, 
  isHovered, 
  onDragStart, 
  onDragEnd, 
  onClick, 
  onMouseEnter, 
  onMouseLeave 
}: FlightBlockProps) {
  const { pixelsPerHour } = useTimelineStore();
  const flightData = block.flightData;
 
  if (!flightData) {
    return null;
  }

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  // Calculate total flight width for centering and connecting rectangle
  const firstSegment = flightData.segments[0];
  const lastSegment = flightData.segments[flightData.segments.length - 1];
  
  const totalTimeSpan = (lastSegment.arrivalTime.getTime() - firstSegment.departureTime.getTime()) / (1000 * 60 * 60); // hours
  const totalWidth = totalTimeSpan * pixelsPerHour;
  const centerX = totalWidth / 2;

  return (
    <Group
      x={block.x}
      y={block.y}
      draggable
      onClick={onClick}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >

      {/* Day markers spanning the entire flight timeline */}
      {(() => {
        const startDate = new Date(firstSegment.departureTime);
        const endDate = new Date(lastSegment.arrivalTime);
        
        // Get the start and end of the day range
        const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const endDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        
        const dayMarkers = [];
        const currentDay = new Date(startDay);
        
        while (currentDay <= endDay) {
          const dayStart = new Date(currentDay);
          const dayEnd = new Date(currentDay.getTime() + 24 * 60 * 60 * 1000);
          
          // Calculate position and width for this day - show full day width
          const dayStartHours = (dayStart.getTime() - block.startTime.getTime()) / (1000 * 60 * 60);
          const dayEndHours = (dayEnd.getTime() - block.startTime.getTime()) / (1000 * 60 * 60);
          
          // Only show if the day overlaps with the flight timeline
          if (dayEndHours > 0 && dayStartHours < totalTimeSpan) {
            const dayX = dayStartHours * pixelsPerHour;
            const dayWidth = 24 * pixelsPerHour; // Full 24-hour day width
            
            if (dayWidth > 0) {
              dayMarkers.push(
                <Group key={currentDay.toISOString().split('T')[0]}>
                  {/* Day background - only within flight timeline */}
                  <Rect
                    x={dayX}
                    y={LAYOUT.dayMarkerY}
                    width={dayWidth}
                    height={LAYOUT.dayMarkerHeight}
                    fill={FLIGHT_COLORS.dayMarkerBg}
                    cornerRadius={LAYOUT.dayMarkerCornerRadius}
                    listening={false}
                  />
                  
                  {/* Day start vertical line */}
                  <Line
                    points={[dayX, LAYOUT.dayMarkerY, dayX, LAYOUT.dayMarkerLineY]}
                    stroke={FLIGHT_COLORS.dayMarker}
                    strokeWidth={1}
                    listening={false}
                  />
                  
                  {/* Day label - properly centered vertically */}
                  <Text
                    x={dayX + Math.max(2, dayWidth / 2 - 12)}
                    y={LAYOUT.dayMarkerTextY}
                    text={currentDay.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                    fontSize={TEXT_STYLES.sizes.dayMarker}
                    fontFamily={TEXT_STYLES.fontFamily}
                    fill={FLIGHT_COLORS.dayMarker}
                    fontStyle={TEXT_STYLES.weights.bold}
                    verticalAlign="middle"
                    listening={false}
                  />
                </Group>
              );
            }
          }
          
          currentDay.setDate(currentDay.getDate() + 1);
        }
        
        return dayMarkers;
      })()}

      {/* Render each segment as a separate rectangle */}
      {flightData.segments.map((segment, index) => {
        // Calculate width based on duration and global scale
        const segmentWidth = segment.duration * pixelsPerHour;
        
        // Calculate position based on actual time difference from block start
        const timeDiffHours = (segment.departureTime.getTime() - block.startTime.getTime()) / (1000 * 60 * 60);
        const segmentX = timeDiffHours * pixelsPerHour;

        // Get segment color using abstracted logic
        const segmentColor = getSegmentColor(segment, index, flightData.segments.length);
        
        return (
          <Group key={segment.id}>
            {/* Segment rectangle - clean, no labels */}
            <Rect
              x={segmentX}
              y={0}
              width={segmentWidth}
              height={block.height}
              fill={segmentColor}
              stroke={isHovered ? FLIGHT_COLORS.primaryHover : FLIGHT_COLORS.primaryStroke}
              strokeWidth={isHovered ? 2 : 1}
              cornerRadius={LAYOUT.segmentCornerRadius}
              shadowColor={FLIGHT_COLORS.shadow}
              shadowBlur={isHovered ? 8 : 4}
              shadowOffset={{ x: 0, y: 2 }}
              shadowOpacity={1}
            />
          </Group>
        );
      })}
      
      {/* Large floating label with color legend */}
      <Group>
        {/* Calculate label content */}
        {(() => {
          // Create color legend for segments with specific labels and times
          const colorLegend = flightData.segments.map((segment, index) => {
            const segmentTime = formatDuration(segment.duration);
            const segmentType = getSegmentType(segment, index, flightData.segments.length);
            const segmentColor = getSegmentColor(segment, index, flightData.segments.length);
            
            if (segmentType === 'layover') {
              return { 
                color: segmentColor, 
                label: `Layover (${segment.departureAirport}) - ${segmentTime}` 
              };
            } else if (segmentType === 'outbound') {
              return { 
                color: segmentColor, 
                label: `Outbound (${segment.departureAirport} → ${segment.arrivalAirport}) - ${segmentTime}` 
              };
            } else if (segmentType === 'return') {
              return { 
                color: segmentColor, 
                label: `Return (${segment.departureAirport} → ${segment.arrivalAirport}) - ${segmentTime}` 
              };
            } else {
              return { 
                color: segmentColor, 
                label: `Connection (${segment.departureAirport} → ${segment.arrivalAirport}) - ${segmentTime}` 
              };
            }
          });
          
          // Remove duplicates based on label
          const uniqueLegend = colorLegend.filter((item, index, self) => 
            index === self.findIndex(t => t.label === item.label)
          );
          
          // Calculate label dimensions using constants - made bigger
          const labelWidth = LAYOUT.labelWidth + 100; // Increased width
          const legendHeight = uniqueLegend.length * (LAYOUT.labelSpacing + 4); // Increased spacing
          const labelHeight = LAYOUT.labelHeaderHeight + 20 + legendHeight; // Increased height
          const labelX = centerX - (labelWidth / 2);
          const labelY = -labelHeight - 40; // Moved higher
          
          return (
            <>
              
              {/* Label background */}
              <Rect
                x={labelX}
                y={labelY}
                width={labelWidth}
                height={labelHeight}
                fill={FLIGHT_COLORS.labelBg}
                stroke={FLIGHT_COLORS.labelBorder}
                strokeWidth={2}
                cornerRadius={LAYOUT.labelCornerRadius}
                shadowColor={FLIGHT_COLORS.labelShadow}
                shadowBlur={8}
                shadowOffset={{ x: 0, y: 4 }}
                shadowOpacity={1}
                listening={false}
              />
              
              {/* Flight type badge */}
              <Rect
                x={labelX + LAYOUT.labelPadding}
                y={labelY + 8}
                width={LAYOUT.badgeSize + 2}
                height={LAYOUT.badgeSize + 2}
                fill={FLIGHT_COLORS.primary}
                cornerRadius={LAYOUT.badgeCornerRadius}
                listening={false}
              />
              
              <Text
                x={labelX + LAYOUT.labelPadding + 12}
                y={labelY + 6}
                text="FLIGHT"
                fontSize={TEXT_STYLES.sizes.labelHeader + 2}
                fontFamily={TEXT_STYLES.fontFamily}
                fill={FLIGHT_COLORS.primary}
                fontStyle={TEXT_STYLES.weights.bold}
                listening={false}
              />
              
              {/* Flight route */}
              <Text
                x={labelX + LAYOUT.labelPadding}
                y={labelY + 28}
                text={`${flightData.departureAirport} → ${flightData.arrivalAirport}`}
                fontSize={TEXT_STYLES.sizes.labelRoute + 4}
                fontFamily={TEXT_STYLES.fontFamily}
                fill={FLIGHT_COLORS.labelText}
                fontStyle={TEXT_STYLES.weights.bold}
                width={labelWidth - (LAYOUT.labelPadding * 2)}
                align="center"
                listening={false}
              />
              
              {/* Color legend */}
              {uniqueLegend.map((item, index) => (
                <Group key={item.label}>
                  <Rect
                    x={labelX + LAYOUT.labelPadding}
                    y={labelY + 50 + (index * (LAYOUT.legendItemSpacing + 4))}
                    width={LAYOUT.legendItemHeight + 2}
                    height={LAYOUT.legendItemHeight + 2}
                    fill={item.color}
                    cornerRadius={2}
                    listening={false}
                  />
                  <Text
                    x={labelX + LAYOUT.labelPadding + 14}
                    y={labelY + 52 + (index * (LAYOUT.legendItemSpacing + 4))}
                    text={item.label}
                    fontSize={TEXT_STYLES.sizes.legend + 2}
                    fontFamily={TEXT_STYLES.fontFamily}
                    fill={FLIGHT_COLORS.legendText}
                    fontStyle={TEXT_STYLES.weights.bold}
                    listening={false}
                  />
                </Group>
              ))}
            </>
          );
        })()}
      </Group>
    </Group>
  );
}
