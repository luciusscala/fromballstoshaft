// Timing conflict detection utilities
import type { Block } from '../types/block';

export interface TimingConflict {
  type: 'overlap' | 'insufficient_gap' | 'none';
  conflictingBlocks: string[];
  message: string;
}

// Check if two blocks have timing conflicts
export function checkTimingConflict(block1: Block, block2: Block): TimingConflict {
  const start1 = block1.startTime.getTime();
  const end1 = block1.endTime.getTime();
  const start2 = block2.startTime.getTime();
  const end2 = block2.endTime.getTime();

  // Check for overlap
  if ((start1 < end2 && end1 > start2)) {
    return {
      type: 'overlap',
      conflictingBlocks: [block1.id, block2.id],
      message: `${block1.title} overlaps with ${block2.title}`
    };
  }

  // Check for insufficient gap (less than 30 minutes between blocks)
  const minGap = 30 * 60 * 1000; // 30 minutes in milliseconds
  const gap1 = Math.abs(end1 - start2);
  const gap2 = Math.abs(end2 - start1);
  const minGapBetween = Math.min(gap1, gap2);

  if (minGapBetween > 0 && minGapBetween < minGap) {
    return {
      type: 'insufficient_gap',
      conflictingBlocks: [block1.id, block2.id],
      message: `Insufficient time between ${block1.title} and ${block2.title}`
    };
  }

  return {
    type: 'none',
    conflictingBlocks: [],
    message: 'No timing conflicts'
  };
}

// Check if a block can be added to a snap group without conflicts
export function canAddToSnapGroup(block: Block, groupBlocks: Block[]): TimingConflict {
  for (const groupBlock of groupBlocks) {
    const conflict = checkTimingConflict(block, groupBlock);
    if (conflict.type !== 'none') {
      return conflict;
    }
  }
  return {
    type: 'none',
    conflictingBlocks: [],
    message: 'No timing conflicts'
  };
}

// Calculate the optimal position for a block within a snap group
export function calculateSnapPosition(block: Block, groupBlocks: Block[]): 'left' | 'right' | 'center' {
  if (groupBlocks.length === 0) return 'center';
  
  // Sort blocks by start time
  const sortedBlocks = [...groupBlocks, block].sort((a, b) => 
    a.startTime.getTime() - b.startTime.getTime()
  );
  
  const blockIndex = sortedBlocks.findIndex(b => b.id === block.id);
  
  if (blockIndex === 0) return 'left';
  if (blockIndex === sortedBlocks.length - 1) return 'right';
  return 'center';
}

// Calculate snap group dimensions and timing
export function calculateSnapGroupMetrics(blocks: Block[]) {
  if (blocks.length === 0) {
    return {
      startTime: new Date(),
      endTime: new Date(),
      totalDuration: 0,
      width: 0,
      height: 0
    };
  }

  const startTimes = blocks.map(b => b.startTime.getTime());
  const endTimes = blocks.map(b => b.endTime.getTime());
  
  const earliestStart = Math.min(...startTimes);
  const latestEnd = Math.max(...endTimes);
  
  const startTime = new Date(earliestStart);
  const endTime = new Date(latestEnd);
  const totalDuration = (latestEnd - earliestStart) / (1000 * 60 * 60); // in hours
  
  // Calculate width based on total duration (will be scaled by pixelsPerHour)
  const width = totalDuration * 7; // Base width, will be scaled
  const height = Math.max(...blocks.map(b => b.height));

  return {
    startTime,
    endTime,
    totalDuration,
    width,
    height
  };
}
