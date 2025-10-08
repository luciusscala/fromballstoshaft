// Simple, effective snapping utility
import type { Block } from '../types/block';

export interface SnapResult {
  shouldSnap: boolean;
  snapX: number;
  snapY: number;
  targetBlockId?: string;
  snapType: 'none' | 'flight' | 'hotel' | 'activity';
  conflict?: string;
}

// Check if blocks can snap together (no timing conflicts)
export function canBlocksSnap(block1: Block, block2: Block): boolean {
  if (!block1.startTime || !block1.endTime || !block2.startTime || !block2.endTime) {
    return true; // No time data, allow snapping
  }

  // Check if blocks have overlapping time ranges
  const block1Start = block1.startTime.getTime();
  const block1End = block1.endTime.getTime();
  const block2Start = block2.startTime.getTime();
  const block2End = block2.endTime.getTime();

  // Check for overlap
  const hasOverlap = !(block1End <= block2Start || block2End <= block1Start);
  
  return !hasOverlap; // Can snap if no overlap
}

// Find the best snap target for a dragged block
export function findSnapTarget(
  draggedBlock: Block,
  allBlocks: Block[],
  draggedX: number,
  draggedY: number
): SnapResult {
  const snapThreshold = 80; // pixels
  
  for (const targetBlock of allBlocks) {
    if (targetBlock.id === draggedBlock.id) continue;
    
    // Calculate distance between block centers
    const targetCenterX = targetBlock.x + targetBlock.width / 2;
    const targetCenterY = targetBlock.y + targetBlock.height / 2;
    
    const distance = Math.sqrt(
      Math.pow(draggedX - targetCenterX, 2) + Math.pow(draggedY - targetCenterY, 2)
    );
    
    if (distance < snapThreshold) {
      // Check if blocks can snap (no timing conflicts)
      const canSnap = canBlocksSnap(draggedBlock, targetBlock);
      
      if (canSnap) {
        // Calculate snap position (side by side)
        const spacing = 20;
        const snapX = targetBlock.x + targetBlock.width + spacing;
        const snapY = targetBlock.y; // Align vertically
        
        return {
          shouldSnap: true,
          snapX,
          snapY,
          targetBlockId: targetBlock.id,
          snapType: targetBlock.type as 'flight' | 'hotel' | 'activity'
        };
      } else {
        // Timing conflict
        return {
          shouldSnap: false,
          snapX: draggedX,
          snapY: draggedY,
          snapType: 'none',
          conflict: 'Timing conflict - blocks overlap in time'
        };
      }
    }
  }
  
  // No valid snap target found
  return {
    shouldSnap: false,
    snapX: draggedX,
    snapY: draggedY,
    snapType: 'none'
  };
}
