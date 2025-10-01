// Canvas store
import { create } from 'zustand';
import type { Block } from './types/block';

interface CanvasState {
  blocks: Block[];
  selectedBlockId: string | null;
  isDragging: boolean;
}

interface CanvasActions {
  addBlock: (block: Block) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  removeBlock: (id: string) => void;
  selectBlock: (id: string | null) => void;
  setDragging: (isDragging: boolean) => void;
}

export const useCanvasStore = create<CanvasState & CanvasActions>((set) => ({
  blocks: [],
  selectedBlockId: null,
  isDragging: false,

  addBlock: (block) => set((state) => ({
    blocks: [...state.blocks, block]
  })),

  updateBlock: (id, updates) => set((state) => ({
    blocks: state.blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    )
  })),

  removeBlock: (id) => set((state) => ({
    blocks: state.blocks.filter(block => block.id !== id)
  })),

  selectBlock: (id) => set({ selectedBlockId: id }),

  setDragging: (isDragging) => set({ isDragging }),
}));
