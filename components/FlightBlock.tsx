// Flight block component focused on timing for trip planning
import { Group, Rect, Text, Line } from 'react-konva';
import type { Block } from '../lib/types/block';
import { useTimelineStore } from '../lib/timelineStore';

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
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
              {/* Render each segment as a separate rectangle */}
              {flightData.segments.map((segment, index) => {
                // Calculate width based on duration and global scale
                const segmentWidth = segment.duration * pixelsPerHour;
                
                // Calculate position based on actual time difference from block start
                const timeDiffHours = (segment.departureTime.getTime() - block.startTime.getTime()) / (1000 * 60 * 60);
                const segmentX = timeDiffHours * pixelsPerHour;

                // Define unique colors for each segment type
                const segmentColors = [
                  "#3b82f6", // Blue - Outbound
                  "#f59e0b", // Orange - Layover
                  "#10b981", // Green - Return
                  "#8b5cf6", // Purple - Connection
                  "#ef4444", // Red - Additional segments
                  "#06b6d4", // Cyan - Extra segments
                ];
                
                const isLayover = segment.isLayover || false;
                let segmentColor;
                
                if (isLayover) {
                  segmentColor = segmentColors[1]; // Orange
                } else if (index === 0) {
                  segmentColor = segmentColors[0]; // Blue - Outbound
                } else if (index === flightData.segments.length - 1) {
                  segmentColor = segmentColors[2]; // Green - Return
                } else {
                  segmentColor = segmentColors[3]; // Purple - Connection
                }
        
        return (
          <Group key={segment.id}>
                    {/* Segment rectangle - clean, no labels */}
                    <Rect
                      x={segmentX}
                      y={0}
                      width={segmentWidth}
                      height={block.height}
                      fill={segmentColor}
                      stroke={isHovered ? '#1d4ed8' : '#1e40af'}
                      strokeWidth={isHovered ? 2 : 1}
                      cornerRadius={6}
                      shadowColor="rgba(0, 0, 0, 0.2)"
                      shadowBlur={isHovered ? 8 : 4}
                      shadowOffset={{ x: 0, y: 2 }}
                      shadowOpacity={1}
                    />

          </Group>
        );
      })}
      
      {/* Large floating label with color legend */}
      <Group>
        {/* Calculate total flight width for centering */}
        {(() => {
          // Calculate width based on actual time span from first departure to last arrival
          const firstSegment = flightData.segments[0];
          const lastSegment = flightData.segments[flightData.segments.length - 1];
          
          const totalTimeSpan = (lastSegment.arrivalTime.getTime() - firstSegment.departureTime.getTime()) / (1000 * 60 * 60); // hours
          const totalWidth = totalTimeSpan * pixelsPerHour;
          
          const centerX = totalWidth / 2;
          
          // Define unique colors for each segment type
          const segmentColors = [
            "#3b82f6", // Blue - Outbound
            "#f59e0b", // Orange - Layover
            "#10b981", // Green - Return
            "#8b5cf6", // Purple - Connection
            "#ef4444", // Red - Additional segments
            "#06b6d4", // Cyan - Extra segments
          ];
          
          // Create color legend for segments with specific labels
          const colorLegend = flightData.segments.map((segment, index) => {
            if (segment.isLayover) {
              return { 
                color: segmentColors[1], 
                label: `Layover (${segment.departureAirport})` 
              };
            } else if (index === 0) {
              return { 
                color: segmentColors[0], 
                label: `Outbound (${segment.departureAirport} → ${segment.arrivalAirport})` 
              };
            } else if (index === flightData.segments.length - 1) {
              return { 
                color: segmentColors[2], 
                label: `Return (${segment.departureAirport} → ${segment.arrivalAirport})` 
              };
            } else {
              return { 
                color: segmentColors[3], 
                label: `Connection (${segment.departureAirport} → ${segment.arrivalAirport})` 
              };
            }
          });
          
          // Remove duplicates based on label
          const uniqueLegend = colorLegend.filter((item, index, self) => 
            index === self.findIndex(t => t.label === item.label)
          );
          
          // Calculate label dimensions
          const labelWidth = 200;
          const legendHeight = uniqueLegend.length * 16;
          const labelHeight = 60 + legendHeight;
          const labelX = centerX - (labelWidth / 2);
          const labelY = -labelHeight - 20;
          
          return (
            <>
              {/* Connection line to center of block */}
              <Line
                points={[centerX, -15, centerX, 0]}
                stroke="#3b82f6"
                strokeWidth={2}
                dash={[3, 3]}
                listening={false}
              />
              
              {/* Label background */}
              <Rect
                x={labelX}
                y={labelY}
                width={labelWidth}
                height={labelHeight}
                fill="rgba(255, 255, 255, 0.95)"
                stroke="#3b82f6"
                strokeWidth={2}
                cornerRadius={8}
                shadowColor="rgba(0, 0, 0, 0.15)"
                shadowBlur={8}
                shadowOffset={{ x: 0, y: 4 }}
                shadowOpacity={1}
                listening={false}
              />
              
              {/* Flight type badge */}
              <Rect
                x={labelX + 8}
                y={labelY + 6}
                width={6}
                height={6}
                fill="#3b82f6"
                cornerRadius={3}
                listening={false}
              />
              
              <Text
                x={labelX + 18}
                y={labelY + 4}
                text="FLIGHT"
                fontSize={9}
                fontFamily="Inter, system-ui, sans-serif"
                fill="#3b82f6"
                fontStyle="bold"
                listening={false}
              />
              
              {/* Flight route */}
              <Text
                x={labelX + 8}
                y={labelY + 20}
                text={`${flightData.departureAirport} → ${flightData.arrivalAirport}`}
                fontSize={14}
                fontFamily="Inter, system-ui, sans-serif"
                fill="#374151"
                fontStyle="bold"
                width={labelWidth - 16}
                align="center"
                listening={false}
              />
              
              {/* Duration */}
              <Text
                x={labelX + 8}
                y={labelY + 38}
                text={formatDuration(block.duration)}
                fontSize={11}
                fontFamily="Inter, system-ui, sans-serif"
                fill="#6b7280"
                width={labelWidth - 16}
                align="center"
                listening={false}
              />
              
              {/* Color legend */}
              {uniqueLegend.map((item, index) => (
                <Group key={item.label}>
                  <Rect
                    x={labelX + 8}
                    y={labelY + 52 + (index * 16)}
                    width={8}
                    height={8}
                    fill={item.color}
                    cornerRadius={2}
                    listening={false}
                  />
                  <Text
                    x={labelX + 20}
                    y={labelY + 54 + (index * 16)}
                    text={item.label}
                    fontSize={9}
                    fontFamily="Inter, system-ui, sans-serif"
                    fill="#6b7280"
                    fontStyle="bold"
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
