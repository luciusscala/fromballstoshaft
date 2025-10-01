// Minimal block system for visual trip planning
export interface Block {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  type: 'flight' | 'hotel' | 'activity';
  color: string;
}

// Simple trip data
export interface Trip {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  blocks: Block[];
}
