// Simple, effective canvas store
import { create } from 'zustand';
import type { Block } from './types/block';
import { findSnapTarget, type SnapResult } from './utils/simpleSnapping';

interface CanvasState {
  blocks: Block[];
  selectedBlockId: string | null;
  draggedBlockId: string | null;
  snapPreview: SnapResult | null;
}

interface CanvasActions {
  addBlock: (block: Block) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  removeBlock: (id: string) => void;
  selectBlock: (id: string | null) => void;
  // Simple snapping actions
  startDrag: (blockId: string) => void;
  endDrag: (blockId: string, x: number, y: number) => void;
  updateSnapPreview: (snapResult: SnapResult | null) => void;
}

export const useCanvasStore = create<CanvasState & CanvasActions>((set, get) => ({
  blocks: [],
  selectedBlockId: null,
  draggedBlockId: null,
  snapPreview: null,

  addBlock: (block) => set((state) => ({
    blocks: [...state.blocks, block]
  })),

  updateBlock: (id, updates) => set((state) => ({
    blocks: state.blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    )
  })),

  removeBlock: (id) => set((state) => ({
    blocks: state.blocks.filter(block => block.id !== id),
    selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId
  })),

  selectBlock: (id) => set({ selectedBlockId: id }),

  startDrag: (blockId) => set({
    draggedBlockId: blockId,
    snapPreview: null
  }),

  endDrag: (blockId, x, y) => set((state) => {
    const { snapPreview } = state;
    
    if (snapPreview?.shouldSnap) {
      // Snap the block to the calculated position
      get().updateBlock(blockId, { x: snapPreview.snapX, y: snapPreview.snapY });
    } else {
      // Just update position
      get().updateBlock(blockId, { x, y });
    }
    
    return {
      draggedBlockId: null,
      snapPreview: null
    };
  }),

  updateSnapPreview: (snapResult) => set({
    snapPreview: snapResult
  })
}));