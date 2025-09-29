'use client'

import { create } from 'zustand'
import type { FlightBlock, FlightSegment } from './types/flight'

export interface CanvasBlock {
  id: string
  x: number
  y: number
  width: number
  height: number
  title: string
  color?: string
}

export type Block = CanvasBlock | FlightBlock

interface CanvasStore {
  blocks: Block[]
  addBlock: (block: Block) => void
  updateBlock: (id: string, updates: Partial<Block>) => void
  removeBlock: (id: string) => void
  selectedBlockId: string | null
  setSelectedBlock: (id: string | null) => void
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  blocks: [],
  selectedBlockId: null,
  
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
  
  setSelectedBlock: (id) => set({ selectedBlockId: id })
}))
