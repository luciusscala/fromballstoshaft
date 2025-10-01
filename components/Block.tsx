// Block component for all types
import { useState } from 'react';
import { Group, Rect, Text } from 'react-konva';
import type { Block } from '../lib/types/block';
import { useCanvasStore } from '../lib/canvasStore';

interface BlockProps {
  block: Block;
}

export function Block({ block }: BlockProps) {
  const { selectBlock, updateBlock, setDragging } = useCanvasStore();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: { cancelBubble: boolean }) => {
    e.cancelBubble = true;
    selectBlock(block.id);
  };

  const handleDragStart = () => {
    setDragging(true);
  };

  const handleDragEnd = (e: { target: { x(): number; y(): number } }) => {
    setDragging(false);
    updateBlock(block.id, {
      x: e.target.x(),
      y: e.target.y()
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <Group
      x={block.x}
      y={block.y}
      draggable
      onClick={handleClick}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Rect
        width={block.width}
        height={block.height}
        fill={block.color}
        stroke={isHovered ? '#000' : '#666'}
        strokeWidth={isHovered ? 2 : 1}
        cornerRadius={6}
        shadowColor="rgba(0, 0, 0, 0.2)"
        shadowBlur={isHovered ? 8 : 4}
        shadowOffset={{ x: 0, y: 2 }}
        shadowOpacity={1}
      />
      
      <Text
        x={8}
        y={block.height / 2 - 8}
        width={block.width - 16}
        height={16}
        text={block.title}
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
