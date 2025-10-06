// Canvas store
import { create } from 'zustand';
import type { Block, SnapGroup } from './types/block';
import { canAddToSnapGroup, calculateSnapGroupMetrics } from './utils/timingUtils';

interface CanvasState {
  blocks: Block[];
  selectedBlockId: string | null;
  draggedBlockId: string | null;
  snapTargetId: string | null;
  snapValid: boolean;
}

interface CanvasActions {
  addBlock: (block: Block) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  removeBlock: (id: string) => void;
  selectBlock: (id: string | null) => void;
  // Simplified snapping actions
  startDrag: (blockId: string) => void;
  endDrag: (blockId: string, x: number, y: number) => void;
  updateSnapTarget: (targetId: string | null, isValid: boolean) => void;
  snapBlocks: (blockId1: string, blockId2: string) => void;
  unsnapBlock: (blockId: string) => void;
}

export const useCanvasStore = create<CanvasState & CanvasActions>((set, get) => ({
  blocks: [],
  selectedBlockId: null,
  draggedBlockId: null,
  snapTargetId: null,
  snapValid: false,

  addBlock: (block) => set((state) => ({
    blocks: [...state.blocks, block]
  })),

  updateBlock: (id, updates) => set((state) => ({
    blocks: state.blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    )
  })),

  removeBlock: (id) => set((state) => {
    const block = state.blocks.find(b => b.id === id);
    if (block?.snapGroupId) {
      // Unsnap all blocks in the same group
      const snapGroupId = block.snapGroupId;
      const updatedBlocks = state.blocks
        .filter(b => b.id !== id) // Remove the block
        .map(b => 
          b.snapGroupId === snapGroupId 
            ? { ...b, snapGroupId: undefined, isSnapped: false, snapPosition: undefined }
            : b
        );
      
      return { blocks: updatedBlocks };
    }
    
    return {
      blocks: state.blocks.filter(block => block.id !== id)
    };
  }),

  selectBlock: (id) => set({ selectedBlockId: id }),

  startDrag: (blockId) => set((state) => {
    const block = state.blocks.find(b => b.id === blockId);
    
    // If the block is snapped, unsnap it immediately
    if (block?.isSnapped && block.snapGroupId) {
      const snapGroupId = block.snapGroupId;
      const updatedBlocks = state.blocks.map(b => 
        b.snapGroupId === snapGroupId
          ? { ...b, snapGroupId: undefined, isSnapped: false, snapPosition: undefined }
          : b
      );
      
      return {
        blocks: updatedBlocks,
        draggedBlockId: blockId,
        snapTargetId: null,
        snapValid: false
      };
    }
    
    return {
      draggedBlockId: blockId,
      snapTargetId: null,
      snapValid: false
    };
  }),

  endDrag: (blockId, x, y) => set((state) => {
    const { snapTargetId, snapValid } = state;
    
    if (snapTargetId && snapValid) {
      // Snap the blocks together
      get().snapBlocks(blockId, snapTargetId);
    } else {
      // Just update position
      get().updateBlock(blockId, { x, y });
    }
    
    return {
      draggedBlockId: null,
      snapTargetId: null,
      snapValid: false
    };
  }),

  updateSnapTarget: (targetId, isValid) => set({
    snapTargetId: targetId,
    snapValid: isValid
  }),

  snapBlocks: (blockId1, blockId2) => set((state) => {
    const block1 = state.blocks.find(b => b.id === blockId1);
    const block2 = state.blocks.find(b => b.id === blockId2);
    
    if (!block1 || !block2) return state;

    // Check if blocks can be snapped (no timing conflicts)
    const conflict = canAddToSnapGroup(block1, [block2]);
    
    if (conflict.type !== 'none') {
      console.log('Cannot snap due to timing conflict:', conflict.message);
      return state;
    }

    // Create a snap group ID for these two blocks
    const snapGroupId = `snap-${Date.now()}`;

    // Snap blocks together by positioning them side by side
    // Keep the dragged block's position, position the target block next to it
    const spacing = 20; // pixels between snapped blocks
    const block1Right = block1.x + block1.width;
    const newBlock2X = block1Right + spacing;
    const newBlock2Y = block1.y; // Align vertically

    const updatedBlocks = state.blocks.map(block => {
      if (block.id === blockId1) {
        return {
          ...block,
          snapGroupId,
          isSnapped: true,
          snapPosition: 'left'
        };
      }
      if (block.id === blockId2) {
        return {
          ...block,
          x: newBlock2X,
          y: newBlock2Y,
          snapGroupId,
          isSnapped: true,
          snapPosition: 'right'
        };
      }
      return block;
    });

    console.log('Snapped blocks together:', blockId1, blockId2);

    return {
      blocks: updatedBlocks
    };
  }),

  unsnapBlock: (blockId) => set((state) => {
    const block = state.blocks.find(b => b.id === blockId);
    if (!block?.snapGroupId) return state;

    // Find all blocks in the same snap group
    const snapGroupId = block.snapGroupId;
    const blocksInGroup = state.blocks.filter(b => b.snapGroupId === snapGroupId);

    // Unsnap all blocks in the group
    const updatedBlocks = state.blocks.map(block => 
      block.snapGroupId === snapGroupId
        ? { ...block, snapGroupId: undefined, isSnapped: false, snapPosition: undefined }
        : block
    );

    console.log('Unsnapped blocks from group:', snapGroupId);

    return {
      blocks: updatedBlocks
    };
  }),
}));
