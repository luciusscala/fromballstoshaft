'use client'

import { useRef, useState, useCallback } from 'react'
import { Stage, Layer, Circle } from 'react-konva'

interface CanvasProps {
  width: number
  height: number
}

export function Canvas({ width, height }: CanvasProps) {
  const stageRef = useRef<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 })
  const [stageScale, setStageScale] = useState(1)
  const [isPanMode, setIsPanMode] = useState(true)

  // Handle wheel zoom - much simpler
  const handleWheel = useCallback((e: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    e.evt.preventDefault()
    
    const scaleBy = 1.1
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
    const clampedScale = Math.max(0.1, Math.min(3, newScale))
    
    setStageScale(clampedScale)
    setStagePosition({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    })
  }, [])

  // Simple zoom controls
  const handleZoomIn = useCallback(() => {
    setStageScale(prev => Math.min(3, prev * 1.2))
  }, [])

  const handleZoomOut = useCallback(() => {
    setStageScale(prev => Math.max(0.1, prev * 0.8))
  }, [])

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
        onWheel={handleWheel}
        className={isPanMode ? "cursor-grab active:cursor-grabbing" : "cursor-default"}
      >
        <Layer>
          {/* Infinite dot grid using Konva */}
          {(() => {
            const dots = []
            const spacing = 20
            const gridSize = Math.max(width, height) * 3 // Much larger grid
            const startX = -gridSize
            const startY = -gridSize
            const endX = gridSize
            const endY = gridSize
            
            for (let x = startX; x <= endX; x += spacing) {
              for (let y = startY; y <= endY; y += spacing) {
                dots.push(
                  <Circle
                    key={`dot-${x}-${y}`}
                    x={x}
                    y={y}
                    radius={1.5}
                    fill="#d1d5db"
                    listening={false}
                  />
                )
              }
            }
            return dots
          })()}
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
