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

  // Handle wheel zoom
  const handleWheel = useCallback((e: { evt: { preventDefault(): void; deltaY: number } }) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = stageRef.current;
    if (!stage) return;
    
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    
    const mousePointTo = {
      x: (pointer.x - stagePosition.x) / oldScale,
      y: (pointer.y - stagePosition.y) / oldScale,
    };
    
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    const clampedScale = Math.max(0.1, Math.min(3, newScale));
    
    setStageScale(clampedScale);
    setStagePosition({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    });
  }, [stagePosition]);

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
