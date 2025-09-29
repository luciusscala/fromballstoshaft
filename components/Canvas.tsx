'use client'

import { useRef, useState, useCallback } from 'react'
import { Stage, Layer, Line, Rect, Text, Group } from 'react-konva'
import { useCanvasStore } from '@/lib/canvasStore'
import type { FlightBlock } from '@/lib/types/flight'

interface CanvasProps {
  width: number
  height: number
}

// Ultra-efficient static grid for buttery smooth performance
function SimpleGrid({ stageWidth, stageHeight }: { stageWidth: number; stageHeight: number }) {
  const lines = []
  
  // 3x bigger grid to ensure no whitespace even at max zoom out
  const gridSize = Math.max(stageWidth, stageHeight) * 6 // 3x bigger than before
  const spacing = 20
  const startX = -gridSize / 2
  const startY = -gridSize / 2
  const endX = gridSize / 2
  const endY = gridSize / 2

  // Vertical lines - minimal DOM elements
  for (let x = startX; x <= endX; x += spacing) {
    lines.push(
      <Line
        key={`v-${x}`}
        points={[x, startY, x, endY]}
        stroke="#e2e8f0"
        strokeWidth={0.5}
        listening={false}
      />
    )
  }

  // Horizontal lines - minimal DOM elements
  for (let y = startY; y <= endY; y += spacing) {
    lines.push(
      <Line
        key={`h-${y}`}
        points={[startX, y, endX, y]}
        stroke="#e2e8f0"
        strokeWidth={0.5}
        listening={false}
      />
    )
  }

  return lines
}

// Simple Flight Block Component
function FlightBlockComponent({ block }: { block: FlightBlock }) {
  const handleClick = (e: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    e.cancelBubble = true
    console.log('Flight block clicked:', block.id)
  }

  const getSegmentColors = (type: string) => {
    switch (type) {
      case 'outbound': return '#3b82f6'
      case 'return': return '#ef4444'
      case 'connecting': return '#6b7280'
      default: return '#9ca3af'
    }
  }

  return (
    <Group
      x={block.x}
      y={block.y}
      draggable
      onClick={handleClick}
    >
      {/* Context Bar - horizontal rectangle */}
      <Rect
        x={0}
        y={0}
        width={block.width}
        height={block.contextBarHeight}
        fill="#f3f4f6"
        stroke="#d1d5db"
        strokeWidth={1}
        cornerRadius={4}
      />
      
      {/* Title */}
      <Text
        x={8}
        y={4}
        text={block.title}
        fontSize={12}
        fontFamily="Inter, system-ui, sans-serif"
        fill="#1f2937"
      />

      {/* Flight Segments */}
      {block.segments.map((segment) => {
        const segmentX = ((segment.startTime || 0) / block.totalHours) * block.width
        const segmentWidth = (parseFloat(segment.duration || '0') / block.totalHours) * block.width
        
        return (
          <Group key={segment.id}>
            {/* Segment rectangle */}
            <Rect
              x={segmentX}
              y={0}
              width={segmentWidth}
              height={block.segmentHeight}
              fill={getSegmentColors(segment.type || 'connecting')}
              stroke="#ffffff"
              strokeWidth={1}
              cornerRadius={2}
            />
            
            {/* Flight number label */}
            <Text
              x={segmentX + 4}
              y={block.contextBarHeight + 4}
              text={segment.flight_number || ''}
              fontSize={10}
              fontFamily="Inter, system-ui, sans-serif"
              fill="#ffffff"
            />
          </Group>
        )
      })}
    </Group>
  )
}

export function Canvas({ width, height }: CanvasProps) {
  const stageRef = useRef<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 })
  const [stageScale, setStageScale] = useState(1)
  const [isPanMode, setIsPanMode] = useState(true)
  const { blocks } = useCanvasStore()

  // Correct pan limits - ensures grid always covers viewport
  const getPanLimits = useCallback(() => {
    // Grid extends 3x viewport in each direction (6x total)
    const gridSize = Math.max(width, height) * 6
    const halfGrid = gridSize / 2 // 3x viewport radius
    
    // At current zoom level, how much world space does the viewport cover?
    const viewportWorldWidth = width / stageScale
    const viewportWorldHeight = height / stageScale
    
    // Pan limits: ensure viewport never goes beyond grid boundaries
    // minX = gridLeft + viewportWidth/2 (so viewport right edge hits grid left)
    // maxX = gridRight - viewportWidth/2 (so viewport left edge hits grid right)
    const minX = -halfGrid + (viewportWorldWidth / 2)
    const maxX = halfGrid - (viewportWorldWidth / 2)
    const minY = -halfGrid + (viewportWorldHeight / 2)
    const maxY = halfGrid - (viewportWorldHeight / 2)
    
    return { minX, maxX, minY, maxY }
  }, [width, height, stageScale])

  // Dampened wheel zoom with strict 50% minimum limit
  const handleWheel = useCallback((e: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    e.evt.preventDefault()
    
    // Dampened zoom sensitivity for smoother control
    const scaleBy = 1.05 // Reduced from 1.1 for smoother zooming
    const stage = stageRef.current
    const oldScale = stage.scaleX()
    const pointer = stage.getPointerPosition()
    
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }
    
    const deltaY = e.evt.deltaY
    const scaleFactor = deltaY > 0 ? scaleBy : 1 / scaleBy
    const newScale = oldScale * scaleFactor
    
    // Calculate max zoom to ensure grid always covers viewport
    const gridSize = Math.max(width, height) * 6
    const halfGrid = gridSize / 2
    const maxViewportSize = Math.max(width, height)
    const maxScale = (halfGrid * 2) / maxViewportSize // Grid diameter / viewport size
    
    // Strict limits: 0.5 (50%) minimum, calculated maximum
    const clampedScale = Math.max(0.5, Math.min(maxScale, newScale))
    
    const newX = pointer.x - mousePointTo.x * clampedScale
    const newY = pointer.y - mousePointTo.y * clampedScale
    
    // Apply pan limits
    const limits = getPanLimits()
    const constrainedX = Math.max(limits.minX, Math.min(limits.maxX, newX))
    const constrainedY = Math.max(limits.minY, Math.min(limits.maxY, newY))
    
    setStageScale(clampedScale)
    setStagePosition({
      x: constrainedX,
      y: constrainedY,
    })
  }, [getPanLimits, width, height])

  // Handle stage drag start
  const handleStageDragStart = useCallback(() => {
    // Just ensure pan mode is active
  }, [])

  // Handle stage drag move with pan limits
  const handleStageDragMove = useCallback(() => {
    if (!isPanMode) return
    
    const stage = stageRef.current
    const newPos = stage.position()
    const limits = getPanLimits()
    
    // Constrain position to pan limits
    const constrainedX = Math.max(limits.minX, Math.min(limits.maxX, newPos.x))
    const constrainedY = Math.max(limits.minY, Math.min(limits.maxY, newPos.y))
    
    stage.position({ x: constrainedX, y: constrainedY })
    setStagePosition({ x: constrainedX, y: constrainedY })
  }, [isPanMode, getPanLimits])

  // Handle stage drag end
  const handleStageDragEnd = useCallback(() => {
    // Update state to match actual position
    const stage = stageRef.current
    if (stage) {
      setStagePosition({ x: stage.x(), y: stage.y() })
    }
  }, [])

  // Dampened zoom controls with proper limits
  const handleZoomIn = useCallback(() => {
    const gridSize = Math.max(width, height) * 6
    const halfGrid = gridSize / 2
    const maxViewportSize = Math.max(width, height)
    const maxScale = (halfGrid * 2) / maxViewportSize
    
    const newScale = Math.min(maxScale, stageScale * 1.1)
    
    const limits = getPanLimits()
    const constrainedX = Math.max(limits.minX, Math.min(limits.maxX, stagePosition.x))
    const constrainedY = Math.max(limits.minY, Math.min(limits.maxY, stagePosition.y))
    
    setStageScale(newScale)
    setStagePosition({ x: constrainedX, y: constrainedY })
  }, [stageScale, stagePosition, getPanLimits, width, height])

  const handleZoomOut = useCallback(() => {
    const newScale = Math.max(0.5, stageScale * 0.9) // 50% minimum
    
    const limits = getPanLimits()
    const constrainedX = Math.max(limits.minX, Math.min(limits.maxX, stagePosition.x))
    const constrainedY = Math.max(limits.minY, Math.min(limits.maxY, stagePosition.y))
    
    setStageScale(newScale)
    setStagePosition({ x: constrainedX, y: constrainedY })
  }, [stageScale, stagePosition, getPanLimits])

  const handleResetZoom = useCallback(() => {
    setStageScale(1)
    setStagePosition({ x: 0, y: 0 })
  }, [])

  const togglePanMode = useCallback(() => {
    setIsPanMode(prev => !prev)
  }, [])

  return (
    <div className="w-full h-full bg-white relative overflow-hidden">
      {/* Konva Stage with Grid - Everything in one place */}
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePosition.x}
        y={stagePosition.y}
        draggable={isPanMode}
        onDragStart={handleStageDragStart}
        onDragMove={handleStageDragMove}
        onDragEnd={handleStageDragEnd}
        onWheel={handleWheel}
        className={isPanMode ? "cursor-grab active:cursor-grabbing" : "cursor-default"}
      >
        <Layer>
          {/* Ultra-efficient static grid */}
          <SimpleGrid stageWidth={width} stageHeight={height} />
          
          {/* Render blocks */}
          {blocks.map((block: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
            if (block.type === 'flight') {
              return (
                <FlightBlockComponent
                  key={block.id}
                  block={block as FlightBlock}
                />
              )
            }
            return null
          })}
        </Layer>
      </Stage>

      {/* Tool controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        {/* Pan mode toggle */}
        <button
          onClick={togglePanMode}
          className={`w-8 h-8 border rounded shadow-sm flex items-center justify-center text-xs font-medium ${
            isPanMode 
              ? 'bg-indigo-600 text-white border-indigo-600' 
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
          title={isPanMode ? 'Pan mode active' : 'Click to enable pan mode'}
        >
          ✋
        </button>
        
        {/* Zoom controls */}
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 flex items-center justify-center text-gray-600"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 flex items-center justify-center text-gray-600"
        >
          −
        </button>
        <button
          onClick={handleResetZoom}
          className="w-8 h-8 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 flex items-center justify-center text-gray-600 text-xs"
        >
          ⌂
        </button>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 bg-white border border-gray-300 rounded px-2 py-1 text-xs text-gray-600 shadow-sm">
        {Math.round(stageScale * 100)}%
      </div>
    </div>
  )
}
