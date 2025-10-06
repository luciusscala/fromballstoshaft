// Canvas component
import { useRef, useState, useCallback } from 'react';
import { Stage, Layer } from 'react-konva';
import { useCanvasStore } from '../lib/canvasStore';
import { Block } from './Block';
import { ControlPanel } from './ControlPanel';
import { SnapPreview } from './SnapPreview';

interface CanvasProps {
  width: number;
  height: number;
}


export function Canvas({ width, height }: CanvasProps) {
  const { blocks, addBlock, isDragging } = useCanvasStore();
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [stageScale, setStageScale] = useState(1);
  const [isControlPanelVisible, setIsControlPanelVisible] = useState(true);
  const stageRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

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
      {/* Control Panel Toggle */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => setIsControlPanelVisible(!isControlPanelVisible)}
          className="bg-white hover:bg-gray-50 text-gray-700 p-2 rounded-lg shadow-lg border border-gray-200 transition-colors"
          title={isControlPanelVisible ? "Hide Control Panel" : "Show Control Panel"}
        >
          {isControlPanelVisible ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Control Panel */}
      {isControlPanelVisible && (
        <div className="absolute top-4 left-16 z-10">
          <ControlPanel onCreateBlock={addBlock} />
        </div>
      )}


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
        className="cursor-grab active:cursor-grabbing"
      >
        <Layer>
          {blocks.map((block) => (
            <Block key={block.id} block={block} />
          ))}
          <SnapPreview />
        </Layer>
      </Stage>
    </div>
  );
}
