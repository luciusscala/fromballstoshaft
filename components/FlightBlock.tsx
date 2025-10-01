// Flight block component
import { Group, Rect, Text } from 'react-konva';
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
        cornerRadius={6}
        shadowColor="rgba(0, 0, 0, 0.2)"
        shadowBlur={isHovered ? 8 : 4}
        shadowOffset={{ x: 0, y: 2 }}
        shadowOpacity={1}
      />

      {/* Flight segments */}
      <Rect
        x={8}
        y={8}
        width={block.width - 16}
        height={20}
        fill="#1e40af"
        cornerRadius={3}
      />

      <Rect
        x={8}
        y={32}
        width={block.width - 16}
        height={20}
        fill="#1e40af"
        cornerRadius={3}
      />

      {/* Flight title */}
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
        wrap="none"
        ellipsis={true}
      />
    </Group>
  );
}
