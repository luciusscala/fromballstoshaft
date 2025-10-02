import { create } from 'zustand';

interface TimelineState {
  pixelsPerHour: number;
  pixelsPerMinute: number;
  setPixelsPerHour: (value: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  pixelsPerHour: 7, // 1 hour = 7px
  pixelsPerMinute: 7 / 60, // 1 minute = 0.12px
  
  setPixelsPerHour: (value) => set({ 
    pixelsPerHour: value, 
    pixelsPerMinute: value / 60 
  }),
  
  zoomIn: () => set((state) => ({ 
    pixelsPerHour: state.pixelsPerHour * 1.2,
    pixelsPerMinute: (state.pixelsPerHour * 1.2) / 60
  })),
  
  zoomOut: () => set((state) => ({ 
    pixelsPerHour: state.pixelsPerHour / 1.2,
    pixelsPerMinute: (state.pixelsPerHour / 1.2) / 60
  })),
  
  resetZoom: () => set({ 
    pixelsPerHour: 7,
    pixelsPerMinute: 7 / 60
  }),
}));
