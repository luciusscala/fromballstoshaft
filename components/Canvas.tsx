import { useRef, useState, useCallback, useEffect } from 'react';
import { Stage, Layer, Text, Line } from 'react-konva';
import { useCanvasStore } from '../lib/canvasStore';
import { FlightBlock } from './FlightBlock';
import type { FlightBlock as FlightBlockType, FlightSegment } from '../lib/types/index';
import { createDateRange, calculateHoursFromTripStart, calculateBlockPosition } from '../lib/utils/timeUtils';

// Efficient grid that covers the entire viewport
function SimpleGrid({ stageWidth, stageHeight, spacing = 20 }: { stageWidth: number; stageHeight: number; spacing?: number }) {
  const lines = [];
  
  // Calculate grid bounds based on current viewport
  const gridSize = Math.max(stageWidth, stageHeight) * 2; // 2x viewport for panning
  const startX = -gridSize / 2;
  const startY = -gridSize / 2;
  const endX = gridSize / 2;
  const endY = gridSize / 2;

  // Vertical lines
  for (let x = startX; x <= endX; x += spacing) {
    lines.push(
      <Line
        key={`v-${x}`}
        points={[x, startY, x, endY]}
        stroke="#e2e8f0"
        strokeWidth={0.5}
        listening={false} // Don't interfere with mouse events
      />
    );
  }

  // Horizontal lines
  for (let y = startY; y <= endY; y += spacing) {
    lines.push(
      <Line
        key={`h-${y}`}
        points={[startX, y, endX, y]}
        stroke="#e2e8f0"
        strokeWidth={0.5}
        listening={false} // Don't interfere with mouse events
      />
    );
  }

  return lines;
}

interface CanvasProps {
  width: number;
  height: number;
}

export function Canvas({ width, height }: CanvasProps) {
  const stageRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [stageSize, setStageSize] = useState({ width, height });
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [stageScale, setStageScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [isDraggingBlock, setIsDraggingBlock] = useState(false);
  const [lastPointerPosition, setLastPointerPosition] = useState({ x: 0, y: 0 });

  const { blocks, addBlock, updateBlock, tripTimeline, initializeTripTimeline } = useCanvasStore();

  // Initialize trip timeline on component mount
  useEffect(() => {
    if (!tripTimeline) {
      // Create a 7-day trip from Dec 15-22, 2024
      const startDate = new Date('2024-12-15T00:00:00');
      const endDate = new Date('2024-12-22T23:59:59');
      initializeTripTimeline(startDate, endDate, 5); // 5 pixels per hour for smaller units
    }
  }, [tripTimeline, initializeTripTimeline]);

  // Update stage size when props change
  useEffect(() => {
    setStageSize({ width, height });
  }, [width, height]);

  // Callback to communicate drag state to blocks
  const handleBlockDragStart = useCallback(() => {
    setIsDraggingBlock(true);
  }, []);

  const handleBlockDragEnd = useCallback((snapResult: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    setIsDraggingBlock(false);
    
    // If this is a parent move with child positions, update all child blocks
    if (snapResult?.childPositions) {
      snapResult.childPositions.forEach((childPos: { id: string; newX: number; newY: number }) => {
        updateBlock(childPos.id, {
          x: childPos.newX,
          y: childPos.newY
        });
      });
    }
  }, [updateBlock]);

  // Create a sample flight block with date-based positioning
  const createFlightBlock = useCallback((_x: number, y: number): FlightBlockType => {
    if (!tripTimeline) {
      throw new Error('Trip timeline not initialized');
    }

    // Flight dates: Dec 15 departure, Dec 21 return
    const departureDate = new Date('2024-12-15T08:00:00');
    const returnDate = new Date('2024-12-21T18:00:00');
    
    const startHour = calculateHoursFromTripStart(departureDate, tripTimeline.startDate);
    const endHour = calculateHoursFromTripStart(returnDate, tripTimeline.startDate);
    const durationHours = endHour - startHour;

    const segments: FlightSegment[] = [
      {
        id: `segment-${Date.now()}-1`,
        startTime: 0, // Relative to flight start (0 hours into flight)
        duration: 2.5, // 2.5 hours
        type: 'outbound',
        flightNumber: 'AA123',
        departure: 'JFK',
        arrival: 'LAX',
        label: 'AA123',
        startHour: 0, // Relative to flight start
        durationHours: 2.5,
        dateRange: createDateRange(departureDate, new Date(departureDate.getTime() + 2.5 * 60 * 60 * 1000))
      },
      {
        id: `segment-${Date.now()}-2`,
        startTime: 2.5, // 2.5 hours into flight
        duration: 1.5, // 1.5 hours
        type: 'connecting',
        flightNumber: 'AA456',
        departure: 'LAX',
        arrival: 'SFO',
        label: 'AA456',
        startHour: 2.5, // Relative to flight start
        durationHours: 1.5,
        dateRange: createDateRange(
          new Date(departureDate.getTime() + 2.5 * 60 * 60 * 1000),
          new Date(departureDate.getTime() + 4 * 60 * 60 * 1000)
        )
      },
      {
        id: `segment-${Date.now()}-3`,
        startTime: durationHours - 5.5, // 5.5 hours before flight end
        duration: 5.5, // 5.5 hours
        type: 'return',
        flightNumber: 'AA789',
        departure: 'SFO',
        arrival: 'JFK',
        label: 'AA789',
        startHour: durationHours - 5.5, // Relative to flight start
        durationHours: 5.5,
        dateRange: createDateRange(
          new Date(returnDate.getTime() - 5.5 * 60 * 60 * 1000),
          returnDate
        )
      }
    ];

    // Calculate position based on time
    const position = calculateBlockPosition(startHour, durationHours, tripTimeline.scale);

    return {
      id: `flight-${Date.now()}`,
      type: 'flight',
      x: position.x,
      y: y,
      width: position.width,
      height: 150,
      title: 'Round Trip Flight',
      totalHours: durationHours,
      segments,
      contextBarHeight: 24,
      segmentHeight: 80,
      departureAirport: 'JFK',
      arrivalAirport: 'JFK',
      color: '#f3f4f6',
      // New date-based properties
      startHour,
      durationHours,
      dateRange: createDateRange(departureDate, returnDate)
    };
  }, [tripTimeline]);

  // Handle stage drag (panning) - only when not dragging blocks
  const handleStageDragStart = useCallback(() => {
    // Only start panning if we're not dragging a block
    if (isDraggingBlock) return;
    
    setIsPanning(true);
    setLastPointerPosition(stageRef.current.getPointerPosition());
  }, [isDraggingBlock]);

  const handleStageDragMove = useCallback(() => {
    if (!isPanning || isDraggingBlock) return;

    const stage = stageRef.current;
    const newPos = stage.getPointerPosition();
    const deltaX = newPos.x - lastPointerPosition.x;
    const deltaY = newPos.y - lastPointerPosition.y;

    // Apply pan sensitivity reduction
    const panSensitivity = 0.6; // Much lower = much less sensitive (0.5-1.0 range)
    const adjustedDeltaX = deltaX * panSensitivity;
    const adjustedDeltaY = deltaY * panSensitivity;

    // Update stage position directly for smooth panning
    stage.x(stage.x() + adjustedDeltaX);
    stage.y(stage.y() + adjustedDeltaY);
    
    // Update state for consistency
    setStagePosition({
      x: stage.x(),
      y: stage.y()
    });

    setLastPointerPosition(newPos);
  }, [isPanning, isDraggingBlock, lastPointerPosition]);

  const handleStageDragEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Handle wheel zoom - default sensitivity
  const handleWheel = useCallback((e: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    e.evt.preventDefault();

    const scaleBy = 1.1; // Default Konva sensitivity
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const deltaY = e.evt.deltaY;
    const scaleFactor = deltaY > 0 ? scaleBy : 1 / scaleBy;
    
    const newScale = oldScale * scaleFactor;
    const clampedScale = Math.max(0.1, Math.min(3, newScale));

    setStageScale(clampedScale);
    setStagePosition({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    });
  }, []);

  // Handle double click to add blocks
  const handleStageClick = useCallback((e: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (e.evt.detail === 2) { // Double click
      const stage = stageRef.current;
      const pointer = stage.getPointerPosition();
      
      // Convert stage coordinates to world coordinates
      const x = (pointer.x - stagePosition.x) / stageScale;
      const y = (pointer.y - stagePosition.y) / stageScale;
      
      // Snap to grid
      const snappedX = Math.round(x / 20) * 20;
      const snappedY = Math.round(y / 20) * 20;

      // Create a flight block
      const flightBlock = createFlightBlock(snappedX, snappedY);
      addBlock(flightBlock);
    }
  }, [stagePosition, stageScale, addBlock, createFlightBlock]);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Canvas Area */}
      <div className="flex-1 relative">
        {/* Instructions */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-gray-200 z-10">
          <p className="text-sm text-gray-600">
            <strong>Canvas Controls:</strong><br />
            • Double-click to add flight blocks<br />
            • Drag to pan, scroll to zoom<br />
            • Drag blocks to move them
          </p>
        </div>

      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePosition.x}
        y={stagePosition.y}
        draggable={!isDraggingBlock}
        onDragStart={handleStageDragStart}
        onDragMove={handleStageDragMove}
        onDragEnd={handleStageDragEnd}
        onWheel={handleWheel}
        onClick={handleStageClick}
        className={isDraggingBlock ? "cursor-default" : "cursor-grab active:cursor-grabbing"}
      >
        <Layer>
          {/* Grid background */}
          <SimpleGrid stageWidth={stageSize.width} stageHeight={stageSize.height} />
          
          {/* Instructions text */}
          <Text
            x={20}
            y={20}
            text="Double-click to add flight blocks • Drag to pan • Scroll to zoom"
            fontSize={14}
            fill="#64748b"
            listening={false}
          />
          
          {/* Render blocks */}
          {blocks.map((block) => {
            if ('type' in block && block.type === 'flight') {
              return (
                <FlightBlock
                  key={block.id}
                  block={block as FlightBlockType}
                  onDragStart={handleBlockDragStart}
                  onDragEnd={() => handleBlockDragEnd({})}
                />
              );
            }
            return null;
          })}
        </Layer>
      </Stage>
      </div>
    </div>
  );
}