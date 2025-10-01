// Activity block component
import { Group, Rect, Text } from 'react-konva';
import type { Block } from '../lib/types/block';

interface ActivityBlockProps {
  block: Block;
  isHovered: boolean;
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
      {/* Main activity block */}
      <Rect
        width={block.width}
        height={block.height}
        fill="#f59e0b"
        stroke={isHovered ? '#d97706' : '#b45309'}
        strokeWidth={isHovered ? 2 : 1}
        cornerRadius={6}
        shadowColor="rgba(0, 0, 0, 0.2)"
        shadowBlur={isHovered ? 8 : 4}
        shadowOffset={{ x: 0, y: 2 }}
        shadowOpacity={1}
      />

      {/* Activity duration bar */}
      <Rect
        x={8}
        y={8}
        width={block.width - 16}
        height={8}
        fill="#b45309"
        cornerRadius={2}
      />

      {/* Activity title */}
      <Text
        x={8}
        y={block.height / 2 - 8}
        width={block.width - 16}
        height={16}
        text="Activity"
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
