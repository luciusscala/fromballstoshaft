// Hotel block component
import { Group, Rect, Text, Line } from 'react-konva';
import type { Block } from '../lib/types/block';
import { useTimelineStore } from '../lib/timelineStore';
import { FLIGHT_COLORS, LAYOUT, TEXT_STYLES } from '../lib/constants/flightTheme';

interface HotelBlockProps {
  block: Block;
  isHovered: boolean;
  isSelected: boolean;
  onDragStart: () => void;
  onDragEnd: (e: { target: { x(): number; y(): number } }) => void;
  onClick: (e: { cancelBubble: boolean }) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function HotelBlock({ 
  block, 
  isHovered, 
  isSelected,
  onDragStart, 
  onDragEnd, 
  onClick, 
  onMouseEnter, 
  onMouseLeave 
}: HotelBlockProps) {
  const { pixelsPerHour } = useTimelineStore();
  
  // Calculate width based on duration and global scale
  const blockWidth = block.duration * pixelsPerHour;
  const centerX = blockWidth / 2;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

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
      {/* Day markers spanning the hotel stay */}
      {(() => {
        const startDate = new Date(block.startTime);
        const endDate = new Date(block.endTime);
        
        // Get the start and end of the day range
        const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const endDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        
        const dayMarkers = [];
        const currentDay = new Date(startDay);
        
        while (currentDay <= endDay) {
          const dayStart = new Date(currentDay);
          const dayEnd = new Date(currentDay.getTime() + 24 * 60 * 60 * 1000);
          
          // Calculate position and width for this day
          const dayStartHours = (dayStart.getTime() - block.startTime.getTime()) / (1000 * 60 * 60);
          const dayEndHours = (dayEnd.getTime() - block.startTime.getTime()) / (1000 * 60 * 60);
          
          // Only show if the day overlaps with the hotel stay
          if (dayEndHours > 0 && dayStartHours < block.duration) {
            const dayX = dayStartHours * pixelsPerHour;
            const dayWidth = 24 * pixelsPerHour; // Full 24-hour day width
            
            if (dayWidth > 0) {
              dayMarkers.push(
                <Group key={currentDay.toISOString().split('T')[0]}>
                  {/* Day background */}
                  <Rect
                    x={dayX}
                    y={LAYOUT.dayMarkerY}
                    width={dayWidth}
                    height={LAYOUT.dayMarkerHeight}
                    fill="rgba(16, 185, 129, 0.1)"
                    cornerRadius={LAYOUT.dayMarkerCornerRadius}
                    listening={false}
                  />
                  
                  {/* Day start vertical line */}
                  <Line
                    points={[dayX, LAYOUT.dayMarkerY, dayX, LAYOUT.dayMarkerLineY]}
                    stroke="#10b981"
                    strokeWidth={1}
                    listening={false}
                  />
                  
                  {/* Day label */}
                  <Text
                    x={dayX + Math.max(2, dayWidth / 2 - 12)}
                    y={LAYOUT.dayMarkerTextY}
                    text={currentDay.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                    fontSize={TEXT_STYLES.sizes.dayMarker}
                    fontFamily={TEXT_STYLES.fontFamily}
                    fill="#10b981"
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

      {/* Check-in segment */}
      <Rect
        x={0}
        y={0}
        width={blockWidth * 0.15} // 15% of total width for check-in
        height={block.height}
        fill="#10b981"
        stroke={isHovered ? '#059669' : '#047857'}
        strokeWidth={isHovered ? 2 : 1}
        cornerRadius={6}
        shadowColor="rgba(0, 0, 0, 0.2)"
        shadowBlur={isHovered ? 8 : 4}
        shadowOffset={{ x: 0, y: 2 }}
        shadowOpacity={1}
      />

      {/* Check-out segment */}
      <Rect
        x={blockWidth * 0.85}
        y={0}
        width={blockWidth * 0.15} // 15% of total width for check-out
        height={block.height}
        fill="#10b981"
        stroke={isHovered ? '#059669' : '#047857'}
        strokeWidth={isHovered ? 2 : 1}
        cornerRadius={6}
        shadowColor="rgba(0, 0, 0, 0.2)"
        shadowBlur={isHovered ? 8 : 4}
        shadowOffset={{ x: 0, y: 2 }}
        shadowOpacity={1}
      />
      
      {/* Floating label */}
      <Group>
        {/* Calculate label content */}
        {(() => {
          // Calculate label dimensions - made bigger like flight block
          const labelWidth = LAYOUT.labelWidth + 100;
          const labelHeight = LAYOUT.labelHeaderHeight + 20;
          const labelX = centerX - (labelWidth / 2);
          const labelY = -labelHeight - 40;
          
          return (
            <>
              {/* Label background */}
              <Rect
                x={labelX}
                y={labelY}
                width={labelWidth}
                height={labelHeight}
                fill={FLIGHT_COLORS.labelBg}
                stroke="#10b981"
                strokeWidth={2}
                cornerRadius={LAYOUT.labelCornerRadius}
                shadowColor={FLIGHT_COLORS.labelShadow}
                shadowBlur={8}
                shadowOffset={{ x: 0, y: 4 }}
                shadowOpacity={1}
                listening={false}
              />
              
              {/* Hotel type badge */}
              <Rect
                x={labelX + LAYOUT.labelPadding}
                y={labelY + 8}
                width={LAYOUT.badgeSize + 2}
                height={LAYOUT.badgeSize + 2}
                fill="#10b981"
                cornerRadius={LAYOUT.badgeCornerRadius}
                listening={false}
              />
              
              <Text
                x={labelX + LAYOUT.labelPadding + 12}
                y={labelY + 6}
                text="HOTEL"
                fontSize={TEXT_STYLES.sizes.labelHeader + 2}
                fontFamily={TEXT_STYLES.fontFamily}
                fill="#10b981"
                fontStyle={TEXT_STYLES.weights.bold}
                listening={false}
              />
              
              {/* Hotel stay info */}
              <Text
                x={labelX + LAYOUT.labelPadding}
                y={labelY + 28}
                text={`${formatDate(block.startTime)} - ${formatDate(block.endTime)}`}
                fontSize={TEXT_STYLES.sizes.labelRoute + 4}
                fontFamily={TEXT_STYLES.fontFamily}
                fill={FLIGHT_COLORS.labelText}
                fontStyle={TEXT_STYLES.weights.bold}
                width={labelWidth - (LAYOUT.labelPadding * 2)}
                align="center"
                listening={false}
              />
              
              {/* Check-in/out times */}
              <Text
                x={labelX + LAYOUT.labelPadding}
                y={labelY + 50}
                text={`Check-in: ${formatTime(block.startTime)} | Check-out: ${formatTime(block.endTime)}`}
                fontSize={TEXT_STYLES.sizes.legend + 2}
                fontFamily={TEXT_STYLES.fontFamily}
                fill={FLIGHT_COLORS.legendText}
                fontStyle={TEXT_STYLES.weights.bold}
                width={labelWidth - (LAYOUT.labelPadding * 2)}
                align="center"
                listening={false}
              />
            </>
          );
        })()}
      </Group>
    </Group>
  );
}
