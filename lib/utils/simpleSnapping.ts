import type { 
  CanvasBlock, 
  FlightBlock, 
  HotelBlock, 
  ActivityBlock
} from './types/index';
import { getBlockRelationships, type BlockRelationship } from './blockRelationships';

type AnyBlock = CanvasBlock | FlightBlock | HotelBlock | ActivityBlock;

// Type guard to check if a block has contextBarHeight
function hasContextBarHeight(block: AnyBlock): block is FlightBlock | HotelBlock {
  return 'contextBarHeight' in block;
}

// Type guard to check if a block has segmentHeight
function hasSegmentHeight(block: AnyBlock): block is FlightBlock {
  return 'segmentHeight' in block;
}

export interface SimpleSnapResult {
  shouldSnap: boolean;
  snapX: number;
  snapY: number;
  parentId?: string;
  snapType: 'none' | 'flight' | 'hotel' | 'activity';
  childPositions?: Array<{ id: string; newX: number; newY: number }>;
}

// Check if a block can be snapped into a parent context
export function canSnapToParent(
  draggedBlock: AnyBlock,
  parentBlock: AnyBlock
): boolean {
  // Check if dragged block can be a child of parent block
  if (canBeChildOf(draggedBlock, parentBlock)) {
    return true;
  }
  
  // Check if parent block can be a parent of dragged block (reverse relationship)
  if (canBeChildOf(parentBlock, draggedBlock)) {
    return true;
  }
  
  return false;
}

// Check if one block can be a child of another
function canBeChildOf(childBlock: AnyBlock, parentBlock: AnyBlock): boolean {
  // Flight blocks can contain hotels and activities
  if ('type' in parentBlock && parentBlock.type === 'flight') {
    return ('type' in childBlock) && (childBlock.type === 'hotel' || childBlock.type === 'activity');
  }
  
  // Hotel blocks can contain activities
  if ('type' in parentBlock && parentBlock.type === 'hotel') {
    return ('type' in childBlock) && childBlock.type === 'activity';
  }
  
  // Regular blocks can contain any type
  if (!('type' in parentBlock)) {
    return true;
  }
  
  return false;
}

// Check for temporal conflicts when snapping
export function hasTemporalConflict(
  draggedBlock: AnyBlock,
  targetBlock: AnyBlock,
  allBlocks: AnyBlock[]
): boolean {
  if (!draggedBlock.dateRange || !targetBlock.dateRange) {
    return false; // No temporal data, no conflict
  }

  // Determine which is parent and which is child
  const isDraggedBlockParent = canBeChildOf(targetBlock, draggedBlock);
  const isDraggedBlockChild = canBeChildOf(draggedBlock, targetBlock);

  let childStart, childEnd, parentStart, parentEnd;

  if (isDraggedBlockChild) {
    // Dragged block is child, target is parent
    childStart = draggedBlock.dateRange.start;
    childEnd = draggedBlock.dateRange.end;
    parentStart = targetBlock.dateRange.start;
    parentEnd = targetBlock.dateRange.end;
  } else if (isDraggedBlockParent) {
    // Dragged block is parent, target is child
    childStart = targetBlock.dateRange.start;
    childEnd = targetBlock.dateRange.end;
    parentStart = draggedBlock.dateRange.start;
    parentEnd = draggedBlock.dateRange.end;
  } else {
    return false; // No valid relationship, no conflict
  }

  console.log('Temporal conflict check:', {
    childStart: childStart.toISOString(),
    childEnd: childEnd.toISOString(),
    parentStart: parentStart.toISOString(),
    parentEnd: parentEnd.toISOString(),
    childWithinParent: childStart >= parentStart && childEnd <= parentEnd
  });

  // Child must be completely within parent's time range
  if (childStart < parentStart || childEnd > parentEnd) {
    console.log('Temporal conflict: child outside parent range');
    return true; // Temporal conflict - child outside parent's range
  }

  return false; // No conflicts found
}

// Calculate snap position when a parent block is moved
export function calculateParentMoveSnap(
  parentBlock: AnyBlock,
  relationship: BlockRelationship,
  draggedX: number,
  draggedY: number
): SimpleSnapResult {
  // Calculate the offset from the parent's original position
  const deltaX = draggedX - parentBlock.x;
  const deltaY = draggedY - parentBlock.y;
  
  // Calculate new positions for all children
  const childPositions = relationship.children.map(child => ({
    id: child.id,
    newX: child.x + deltaX,
    newY: child.y + deltaY
  }));
  
  return {
    shouldSnap: true,
    snapX: draggedX,
    snapY: draggedY,
    parentId: parentBlock.id,
    snapType: 'none', // This is a parent move, not a child snap
    childPositions // Include child positions for the store to update
  };
}

// Calculate snap position when a parent block is dragged onto a child
export function calculateReverseSnapPosition(
  parentBlock: AnyBlock,
  childBlock: AnyBlock,
  draggedX: number,
  draggedY: number
): SimpleSnapResult {
  console.log('calculateReverseSnapPosition called:', {
    parentBlock: parentBlock.id,
    childBlock: childBlock.id,
    draggedX,
    draggedY
  });

  // Check if blocks have time data
  if (!parentBlock.dateRange || !childBlock.dateRange) {
    console.log('Missing date ranges');
    return {
      shouldSnap: false,
      snapX: draggedX,
      snapY: draggedY,
      snapType: 'none'
    };
  }
  
  // Check if child can fit within parent's time range
  const childStart = childBlock.dateRange.start;
  const childEnd = childBlock.dateRange.end;
  const parentStart = parentBlock.dateRange.start;
  const parentEnd = parentBlock.dateRange.end;
  
  console.log('Date ranges:', {
    childStart: childStart.toISOString(),
    childEnd: childEnd.toISOString(),
    parentStart: parentStart.toISOString(),
    parentEnd: parentEnd.toISOString()
  });
  
  // Child must be completely within parent's time range
  if (childStart < parentStart || childEnd > parentEnd) {
    console.log('Child outside parent range, no snap');
    return {
      shouldSnap: false,
      snapX: draggedX,
      snapY: draggedY,
      snapType: 'none'
    };
  }
  
  // Calculate position for parent block so that child appears in the right place
  const parentDuration = parentEnd.getTime() - parentStart.getTime();
  const childOffset = childStart.getTime() - parentStart.getTime();
  const relativePosition = childOffset / parentDuration;
  
  // Calculate X position for parent so child appears at the right spot
  const childTargetX = childBlock.x;
  const parentX = childTargetX - (relativePosition * parentBlock.width);
  
  // Calculate Y position based on block type hierarchy
  const parentY = calculateVerticalSnapPosition(
    ('type' in childBlock) ? childBlock.type : 'regular',
    parentBlock
  ) - (hasContextBarHeight(parentBlock) ? parentBlock.contextBarHeight : 0);
  
  console.log('Calculated positions:', {
    parentDuration,
    childOffset,
    relativePosition,
    childTargetX,
    parentX,
    parentY
  });
  
  const result = {
    shouldSnap: true,
    snapX: parentX,
    snapY: parentY,
    parentId: parentBlock.id,
    snapType: (('type' in childBlock) ? childBlock.type : 'regular') as 'hotel' | 'activity'
  };
  
  console.log('Reverse snap result:', result);
  return result;
}

// Check if dragged block is over a parent block
export function isOverParent(
  draggedBlock: AnyBlock,
  parentBlock: AnyBlock,
  draggedX: number,
  draggedY: number
): boolean {
  const parentLeft = parentBlock.x;
  const parentRight = parentBlock.x + parentBlock.width;
  const parentTop = parentBlock.y;
  const parentBottom = parentBlock.y + parentBlock.height;
  
  const draggedLeft = draggedX;
  const draggedRight = draggedX + draggedBlock.width;
  const draggedTop = draggedY;
  const draggedBottom = draggedY + draggedBlock.height;
  
  // Check if dragged block overlaps with parent block
  return !(draggedRight < parentLeft || 
           draggedLeft > parentRight || 
           draggedBottom < parentTop || 
           draggedTop > parentBottom);
}

// Calculate snap position within parent based on time constraints
export function calculateSnapPosition(
  draggedBlock: AnyBlock,
  parentBlock: AnyBlock,
  draggedX: number,
  draggedY: number
): SimpleSnapResult {
  // Check if blocks have time data
  if (!draggedBlock.dateRange || !parentBlock.dateRange) {
    return {
      shouldSnap: false,
      snapX: draggedX,
      snapY: draggedY,
      snapType: 'none'
    };
  }
  
  // Check if child can fit within parent's time range
  const childStart = draggedBlock.dateRange.start;
  const childEnd = draggedBlock.dateRange.end;
  const parentStart = parentBlock.dateRange.start;
  const parentEnd = parentBlock.dateRange.end;
  
  // Child must be completely within parent's time range
  if (childStart < parentStart || childEnd > parentEnd) {
    return {
      shouldSnap: false,
      snapX: draggedX,
      snapY: draggedY,
      snapType: 'none'
    };
  }
  
  // Calculate position within parent based on actual dates
  const parentDuration = parentEnd.getTime() - parentStart.getTime();
  const childOffset = childStart.getTime() - parentStart.getTime();
  const relativePosition = childOffset / parentDuration;
  
  // Calculate X position within parent
  const snapX = parentBlock.x + (relativePosition * parentBlock.width);
  
  // Calculate Y position based on block type hierarchy
  const snapY = calculateVerticalSnapPosition(
    ('type' in draggedBlock) ? draggedBlock.type : 'regular',
    parentBlock
  );
  
  return {
    shouldSnap: true,
    snapX,
    snapY,
    parentId: parentBlock.id,
    snapType: (('type' in draggedBlock) ? draggedBlock.type : 'regular') as 'hotel' | 'activity'
  };
}

// Calculate vertical snap position based on block hierarchy
function calculateVerticalSnapPosition(
  childType: string,
  parentBlock: AnyBlock
): number {
  const snapOffsets: Record<string, (parent: AnyBlock) => number> = {
    'hotel': (parent) => hasContextBarHeight(parent) ? parent.contextBarHeight + 10 : 10,
    'activity': (parent) => {
      if ('type' in parent && parent.type === 'hotel') {
        return hasContextBarHeight(parent) ? parent.contextBarHeight + 10 : 10;
      } else if ('type' in parent && parent.type === 'flight') {
        return hasContextBarHeight(parent) && hasSegmentHeight(parent)
          ? parent.contextBarHeight + parent.segmentHeight + 10 
          : 10;
      }
      return hasContextBarHeight(parent) ? parent.contextBarHeight + 10 : 10;
    }
  };
  
  const offset = snapOffsets[childType]?.(parentBlock) || 0;
  return parentBlock.y + offset;
}

// Find the best snapping target when dragging over other blocks
export function findSnapTarget(
  draggedBlock: AnyBlock,
  allBlocks: AnyBlock[],
  draggedX: number,
  draggedY: number
): SimpleSnapResult {
  // First, check if this is a parent block being moved - if so, we need to move its children too
  const existingRelationships = getBlockRelationships(allBlocks);
  const parentRelationship = existingRelationships.find(rel => rel.parent.id === draggedBlock.id);
  
  if (parentRelationship) {
    // This is a parent block being moved - calculate new positions for children
    return calculateParentMoveSnap(draggedBlock, parentRelationship, draggedX, draggedY);
  }
  
  // Otherwise, look for blocks to snap to
  for (const block of allBlocks) {
    if (block.id === draggedBlock.id) continue;
    
    // Check if we can snap to this block
    if (!canSnapToParent(draggedBlock, block)) continue;
    
    // Check if we're over this block
    if (!isOverParent(draggedBlock, block, draggedX, draggedY)) continue;
    
    // Determine the relationship direction
    const isDraggedBlockParent = canBeChildOf(block, draggedBlock);
    const isDraggedBlockChild = canBeChildOf(draggedBlock, block);
    
    console.log('Snapping check:', {
      draggedBlock: draggedBlock.id,
      targetBlock: block.id,
      isDraggedBlockParent,
      isDraggedBlockChild,
      draggedType: 'type' in draggedBlock ? draggedBlock.type : 'regular',
      targetType: 'type' in block ? block.type : 'regular'
    });
    
    // Check for temporal conflicts
    if (hasTemporalConflict(draggedBlock, block, allBlocks)) {
      console.log('Temporal conflict detected, skipping');
      continue; // Skip this block due to temporal conflict
    }
    
    // Calculate snap position based on relationship direction
    let snapResult: SimpleSnapResult;
    
    if (isDraggedBlockChild) {
      // Dragged block is child, target is parent - normal snapping
      console.log('Normal snapping (child to parent)');
      snapResult = calculateSnapPosition(draggedBlock, block, draggedX, draggedY);
    } else if (isDraggedBlockParent) {
      // Dragged block is parent, target is child - reverse snapping
      console.log('Reverse snapping (parent to child)');
      snapResult = calculateReverseSnapPosition(draggedBlock, block, draggedX, draggedY);
    } else {
      console.log('No valid relationship');
      continue; // No valid relationship
    }
    
    console.log('Snap result:', {
      shouldSnap: snapResult.shouldSnap,
      snapX: snapResult.snapX,
      snapY: snapResult.snapY,
      snapType: snapResult.snapType,
      parentId: snapResult.parentId
    });
    
    if (snapResult.shouldSnap) {
      return snapResult;
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

// Validate that a block can be placed at a specific position
export function validatePlacement(
  draggedBlock: AnyBlock,
  targetX: number,
  targetY: number,
  allBlocks: AnyBlock[]
): { isValid: boolean; message?: string } {
  // Only check for actual spatial conflicts, not time-based positioning
  // For free movement, blocks can be placed anywhere unless there are real conflicts
  
  // Check for spatial overlaps with other blocks
  for (const block of allBlocks) {
    if (block.id === draggedBlock.id) continue;
    
    // Check if blocks overlap spatially
    const draggedLeft = targetX;
    const draggedRight = targetX + draggedBlock.width;
    const draggedTop = targetY;
    const draggedBottom = targetY + draggedBlock.height;
    
    const blockLeft = block.x;
    const blockRight = block.x + block.width;
    const blockTop = block.y;
    const blockBottom = block.y + block.height;
    
    // Check for spatial overlap
    if (!(draggedRight <= blockLeft || 
          draggedLeft >= blockRight || 
          draggedBottom <= blockTop || 
          draggedTop >= blockBottom)) {
      return {
        isValid: false,
        message: `Spatial conflict with ${('type' in block) ? block.type : 'regular'} block`
      };
    }
  }
  
  return { isValid: true };
}
