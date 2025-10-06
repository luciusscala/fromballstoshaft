// Base Block component with common functionality
import { useState } from 'react';
import type { Block } from '../lib/types/block';
import { useCanvasStore } from '../lib/canvasStore';
import { canAddToSnapGroup } from '../lib/utils/timingUtils';
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
    updateSnapTarget,
    blocks,
    draggedBlockId
  } = useCanvasStore();
  const [isHovered, setIsHovered] = useState(false);
  const isSelected = selectedBlockId === block.id;
  const isDragging = draggedBlockId === block.id;

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
    if (!isDragging) return;
    
    // Check for nearby blocks to snap to
    const currentX = e.target.x();
    const currentY = e.target.y();
    const snapThreshold = 80; // pixels
    
    let nearestBlock = null;
    let minDistance = Infinity;
    
    // Find the closest block that's not the current block
    for (const otherBlock of blocks) {
      if (otherBlock.id === block.id) continue; // Skip self
      
      const distance = Math.sqrt(
        Math.pow(currentX - otherBlock.x, 2) + Math.pow(currentY - otherBlock.y, 2)
      );
      
      if (distance < snapThreshold && distance < minDistance) {
        minDistance = distance;
        nearestBlock = otherBlock;
      }
    }
    
    if (nearestBlock) {
      // Check if snapping is allowed (no timing conflicts)
      const conflict = canAddToSnapGroup(block, [nearestBlock]);
      const canSnap = conflict.type === 'none';
      
      updateSnapTarget(nearestBlock.id, canSnap);
    } else {
      updateSnapTarget(null, false);
    }
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Common props for all block types
  const commonProps = {
    block,
    isHovered,
    isSelected,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    onDragMove: handleDragMove,
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