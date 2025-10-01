// Hotel block component
import { Group, Rect, Text } from 'react-konva';
import type { Block } from '../lib/types/block';

interface HotelBlockProps {
  block: Block;
  isHovered: boolean;
  onDragStart: () => void;
  onDragEnd: (e: { target: { x(): number; y(): number } }) => void;
  onClick: (e: { cancelBubble: boolean }) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function HotelBlock({ 
  block, 
  isHovered, 
  onDragStart, 
  onDragEnd, 
  onClick, 
  onMouseEnter, 
  onMouseLeave 
}: HotelBlockProps) {
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
      {/* Main hotel block */}
      <Rect
        width={block.width}
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

      {/* Check-in/out bars */}
      <Rect
        x={8}
        y={8}
        width={block.width - 16}
        height={12}
        fill="#047857"
        cornerRadius={2}
      />

      <Rect
        x={8}
        y={24}
        width={block.width - 16}
        height={12}
        fill="#047857"
        cornerRadius={2}
      />

      {/* Hotel title */}
      <Text
        x={8}
        y={block.height / 2 - 8}
        width={block.width - 16}
        height={16}
        text="Hotel"
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
