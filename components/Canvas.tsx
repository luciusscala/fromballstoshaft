// Canvas component
import { useRef, useState, useCallback } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { useCanvasStore } from '../lib/canvasStore';
import { Block } from './Block';
import { createFlightBlock, createHotelBlock, createActivityBlock } from '../lib/blockCreators';

interface CanvasProps {
  width: number;
  height: number;
}

// Grid
function Grid({ width, height }: { width: number; height: number }) {
  const lines = [];
  const spacing = 20;
  
  for (let i = 0; i <= width; i += spacing) {
    lines.push(
      <Line
        key={`v-${i}`}
        points={[i, 0, i, height]}
        stroke="#e5e7eb"
        strokeWidth={1}
        listening={false}
      />
    );
  }
  
  for (let i = 0; i <= height; i += spacing) {
    lines.push(
      <Line
        key={`h-${i}`}
        points={[0, i, width, i]}
        stroke="#e5e7eb"
        strokeWidth={1}
        listening={false}
      />
    );
  }
  
  return <>{lines}</>;
}

export function Canvas({ width, height }: CanvasProps) {
  const { blocks, addBlock, isDragging } = useCanvasStore();
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [stageScale, setStageScale] = useState(1);
  const stageRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  // Handle double click to add blocks
  const handleStageClick = useCallback((e: { evt: { detail: number } }) => {
    if (e.evt.detail === 2) { // Double click
      const stage = stageRef.current;
      if (!stage) return;
      
      const pointer = stage.getPointerPosition();
      
      const x = (pointer.x - stagePosition.x) / stageScale;
      const y = (pointer.y - stagePosition.y) / stageScale;
      
      // Cycle through block types
      const blockType = blocks.length % 3;
      if (blockType === 0) {
        addBlock(createFlightBlock(x, y));
      } else if (blockType === 1) {
        addBlock(createHotelBlock(x, y));
      } else {
        addBlock(createActivityBlock(x, y));
      }
    }
  }, [blocks.length, addBlock, stagePosition, stageScale]);

  // Handle wheel zoom with dampening
  const handleWheel = useCallback((e: { evt: { preventDefault(): void; deltaY: number } }) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    
    // Figma-like zoom sensitivity (much more gradual)
    const scaleBy = 1.03;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    
    // Get the current stage position from the stage itself (more reliable)
    const currentX = stage.x();
    const currentY = stage.y();
    
    // Calculate the point in the stage content that the mouse is pointing to
    const mousePointTo = {
      x: (pointer.x - currentX) / oldScale,
      y: (pointer.y - currentY) / oldScale,
    };
    
    // Calculate new scale
    const zoomFactor = e.evt.deltaY > 0 ? 1 / scaleBy : scaleBy;
    const newScale = oldScale * zoomFactor;
    const clampedScale = Math.max(0.1, Math.min(10, newScale)); // Figma-like zoom range
    
    // Calculate new position to keep the mouse point in the same place
    const newPosition = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };
    
    setStageScale(clampedScale);
    setStagePosition(newPosition);
  }, []);

  return (
    <div className="h-screen bg-gray-50">
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePosition.x}
        y={stagePosition.y}
        draggable={!isDragging}
        onWheel={handleWheel}
        onClick={handleStageClick}
        className="cursor-grab active:cursor-grabbing"
      >
        <Layer>
          <Grid width={width} height={height} />
          
          {blocks.map((block) => (
            <Block key={block.id} block={block} />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
