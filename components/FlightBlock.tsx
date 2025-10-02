// Flight block component with detailed flight information
import { Group, Rect, Text, Line } from 'react-konva';
import type { Block } from '../lib/types/block';

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
  const flightData = block.flightData;
  
  if (!flightData) {
    // Fallback for blocks without flight data
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
        <Rect
          width={block.width}
          height={block.height}
          fill="#3b82f6"
          stroke={isHovered ? '#1d4ed8' : '#1e40af'}
          strokeWidth={isHovered ? 2 : 1}
          cornerRadius={6}
        />
        <Text
          x={8}
          y={block.height / 2 - 8}
          width={block.width - 16}
          height={16}
          text="Flight"
          fontSize={14}
          fontFamily="Inter, system-ui, sans-serif"
          fill="#fff"
          align="center"
          verticalAlign="middle"
        />
      </Group>
    );
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
      {/* Main flight block */}
      <Rect
        width={block.width}
        height={block.height}
        fill="#3b82f6"
        stroke={isHovered ? '#1d4ed8' : '#1e40af'}
        strokeWidth={isHovered ? 2 : 1}
        cornerRadius={8}
        shadowColor="rgba(0, 0, 0, 0.2)"
        shadowBlur={isHovered ? 8 : 4}
        shadowOffset={{ x: 0, y: 2 }}
        shadowOpacity={1}
      />

      {/* Header with airline and flight number */}
      <Rect
        x={0}
        y={0}
        width={block.width}
        height={32}
        fill="#1e40af"
        cornerRadius={[8, 8, 0, 0]}
      />
      
      <Text
        x={12}
        y={8}
        text={`${flightData.airline} ${flightData.flightNumber}`}
        fontSize={14}
        fontFamily="Inter, system-ui, sans-serif"
        fill="#fff"
        fontStyle="bold"
      />

      <Text
        x={12}
        y={22}
        text={`${flightData.departureAirport} → ${flightData.arrivalAirport}`}
        fontSize={12}
        fontFamily="Inter, system-ui, sans-serif"
        fill="#e0e7ff"
      />

      {/* Flight segments */}
      {flightData.segments.map((segment, index) => (
        <Group key={segment.id}>
          {/* Segment background */}
          <Rect
            x={12}
            y={40 + (index * 35)}
            width={block.width - 24}
            height={30}
            fill="#1e40af"
            cornerRadius={4}
            opacity={0.8}
          />

          {/* Departure info */}
          <Text
            x={16}
            y={45 + (index * 35)}
            text={`${segment.departure.airport} ${formatTime(segment.departure.time)}`}
            fontSize={12}
            fontFamily="Inter, system-ui, sans-serif"
            fill="#fff"
            fontStyle="bold"
          />

          <Text
            x={16}
            y={58 + (index * 35)}
            text={`Gate ${segment.departure.gate || 'TBD'}`}
            fontSize={10}
            fontFamily="Inter, system-ui, sans-serif"
            fill="#e0e7ff"
          />

          {/* Flight duration line */}
          <Line
            points={[block.width / 2 - 20, 55 + (index * 35), block.width / 2 + 20, 55 + (index * 35)]}
            stroke="#e0e7ff"
            strokeWidth={1}
          />

          <Text
            x={block.width / 2 - 15}
            y={50 + (index * 35)}
            text={formatDuration(segment.duration)}
            fontSize={10}
            fontFamily="Inter, system-ui, sans-serif"
            fill="#e0e7ff"
            align="center"
          />

          {/* Arrival info */}
          <Text
            x={block.width - 80}
            y={45 + (index * 35)}
            text={`${segment.arrival.airport} ${formatTime(segment.arrival.time)}`}
            fontSize={12}
            fontFamily="Inter, system-ui, sans-serif"
            fill="#fff"
            fontStyle="bold"
            align="right"
          />

          <Text
            x={block.width - 80}
            y={58 + (index * 35)}
            text={`Gate ${segment.arrival.gate || 'TBD'}`}
            fontSize={10}
            fontFamily="Inter, system-ui, sans-serif"
            fill="#e0e7ff"
            align="right"
          />
        </Group>
      ))}

      {/* Footer with price and booking reference */}
      <Rect
        x={0}
        y={block.height - 24}
        width={block.width}
        height={24}
        fill="#1e40af"
        cornerRadius={[0, 0, 8, 8]}
        opacity={0.9}
      />

      {flightData.price && (
        <Text
          x={12}
          y={block.height - 18}
          text={`$${flightData.price}`}
          fontSize={12}
          fontFamily="Inter, system-ui, sans-serif"
          fill="#fff"
          fontStyle="bold"
        />
      )}

      {flightData.bookingReference && (
        <Text
          x={block.width - 80}
          y={block.height - 18}
          text={`Ref: ${flightData.bookingReference}`}
          fontSize={10}
          fontFamily="Inter, system-ui, sans-serif"
          fill="#e0e7ff"
          align="right"
        />
      )}
    </Group>
  );
}
