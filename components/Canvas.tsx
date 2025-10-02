// Canvas component
import { useRef, useState, useCallback } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { useCanvasStore } from '../lib/canvasStore';
import { useTimelineStore } from '../lib/timelineStore';
import { Block } from './Block';
import { createFlightBlock, createHotelBlock, createActivityBlock } from '../lib/blockCreators';

interface CanvasProps {
  width: number;
  height: number;
}


export function Canvas({ width, height }: CanvasProps) {
  const { blocks, addBlock, isDragging } = useCanvasStore();
  const { pixelsPerHour, zoomIn, zoomOut, resetZoom } = useTimelineStore();
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
    <div className="h-screen bg-gray-50 relative">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-2 flex gap-2">
        <button
          onClick={zoomOut}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium"
        >
          -
        </button>
        <span className="px-2 py-1 text-sm text-gray-600 min-w-[60px] text-center">
          {Math.round(pixelsPerHour)}px/h
        </span>
        <button
          onClick={zoomIn}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium"
        >
          +
        </button>
        <button
          onClick={resetZoom}
          className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm font-medium"
        >
          Reset
        </button>
      </div>

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
          {blocks.map((block) => (
            <Block key={block.id} block={block} />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
