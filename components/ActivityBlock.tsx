// Activity block component - simple solid period of time
import { Group, Rect, Text } from 'react-konva';
import type { Block } from '../lib/types/block';
import { useTimelineStore } from '../lib/timelineStore';
import { FLIGHT_COLORS, LAYOUT, TEXT_STYLES } from '../lib/constants/flightTheme';

interface ActivityBlockProps {
  block: Block;
  isHovered: boolean;
  isSelected: boolean;
  onDragStart: () => void;
  onDragEnd: (e: { target: { x(): number; y(): number } }) => void;
  onClick: (e: { cancelBubble: boolean }) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function ActivityBlock({ 
  block, 
  isHovered, 
  onDragStart, 
  onDragEnd, 
  onClick, 
  onMouseEnter, 
  onMouseLeave 
}: ActivityBlockProps) {
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
      {/* Main activity block - solid rectangle */}
      <Rect
        x={0}
        y={0}
        width={blockWidth}
        height={block.height}
        fill="#8b5cf6" // Purple color for activities
        stroke={isHovered ? '#7c3aed' : '#6d28d9'}
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
          // Calculate label dimensions
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
                stroke="#8b5cf6"
                strokeWidth={2}
                cornerRadius={LAYOUT.labelCornerRadius}
                shadowColor={FLIGHT_COLORS.labelShadow}
                shadowBlur={8}
                shadowOffset={{ x: 0, y: 4 }}
                shadowOpacity={1}
                listening={false}
              />
              
              {/* Activity type badge */}
              <Rect
                x={labelX + LAYOUT.labelPadding}
                y={labelY + 8}
                width={LAYOUT.badgeSize + 2}
                height={LAYOUT.badgeSize + 2}
                fill="#8b5cf6"
                cornerRadius={LAYOUT.badgeCornerRadius}
                listening={false}
              />
              
              <Text
                x={labelX + LAYOUT.labelPadding + 12}
                y={labelY + 6}
                text="ACTIVITY"
                fontSize={TEXT_STYLES.sizes.labelHeader + 2}
                fontFamily={TEXT_STYLES.fontFamily}
                fill="#8b5cf6"
                fontStyle={TEXT_STYLES.weights.bold}
                listening={false}
              />
              
              {/* Activity name and location */}
              <Text
                x={labelX + LAYOUT.labelPadding}
                y={labelY + 28}
                text={block.title}
                fontSize={TEXT_STYLES.sizes.labelRoute + 4}
                fontFamily={TEXT_STYLES.fontFamily}
                fill={FLIGHT_COLORS.labelText}
                fontStyle={TEXT_STYLES.weights.bold}
                width={labelWidth - (LAYOUT.labelPadding * 2)}
                align="center"
                listening={false}
              />
              
              {/* Time range */}
              <Text
                x={labelX + LAYOUT.labelPadding}
                y={labelY + 50}
                text={`${formatTime(block.startTime)} - ${formatTime(block.endTime)}`}
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