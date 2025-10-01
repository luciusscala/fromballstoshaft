// Base Block component with common functionality
import { useState } from 'react';
import type { Block } from '../lib/types/block';
import { useCanvasStore } from '../lib/canvasStore';
import { FlightBlock } from './FlightBlock';
import { HotelBlock } from './HotelBlock';
import { ActivityBlock } from './ActivityBlock';

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

  // Common props for all block types
  const commonProps = {
    block,
    isHovered,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave
  };

  // Render type-specific component
  switch (block.type) {
    case 'flight':
      return <FlightBlock {...commonProps} />;
    case 'hotel':
      return <HotelBlock {...commonProps} />;
    case 'activity':
      return <ActivityBlock {...commonProps} />;
    default:
      return null;
  }
}