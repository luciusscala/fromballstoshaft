// Simple Block component with working snapping
import { useState } from 'react';
import type { Block } from '../lib/types/block';
import { useCanvasStore } from '../lib/canvasStore';
import { findSnapTarget } from '../lib/utils/simpleSnapping';
import { FlightBlock } from './FlightBlock';
import { HotelBlock } from './HotelBlock';
import { ActivityBlock } from './ActivityBlock';

interface BlockProps {
  block: Block;
}

export function Block({ block }: BlockProps) {
  const { 
    selectBlock, 
    updateBlock, 
    selectedBlockId, 
    startDrag, 
    endDrag, 
    updateSnapPreview,
    blocks
  } = useCanvasStore();
  const [isHovered, setIsHovered] = useState(false);
  const isSelected = selectedBlockId === block.id;

  const handleClick = (e: { cancelBubble: boolean }) => {
    e.cancelBubble = true;
    selectBlock(block.id);
  };

  const handleDragStart = () => {
    startDrag(block.id);
  };

  const handleDragEnd = (e: { target: { x(): number; y(): number } }) => {
    endDrag(block.id, e.target.x(), e.target.y());
  };

  const handleDragMove = (e: { target: { x(): number; y(): number } }) => {
    const currentX = e.target.x();
    const currentY = e.target.y();
    
    // Find snap target
    const snapResult = findSnapTarget(block, blocks, currentX, currentY);
    updateSnapPreview(snapResult);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Common props for all block types
  const commonProps = {
    block,
    isHovered,
    isSelected,
    onClick: handleClick,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    onDragMove: handleDragMove,
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