'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Canvas } from '@/components/Canvas'
import { ProtectedRoute } from '@/components/ProtectedRoute'

function WorkspaceContent() {
  const { } = useAuth()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Calculate canvas dimensions (full viewport)
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 80 // Account for header
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  return (
    <div className="h-screen bg-gray-50">
      {/* Simple header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Trip Planner</h1>
        <p className="text-gray-600">Double-click to add blocks • Drag to move • Scroll to zoom</p>
      </div>

      {/* Full canvas */}
      <div className="h-[calc(100vh-80px)]">
        {dimensions.width > 0 && (
          <Canvas width={dimensions.width} height={dimensions.height} />
        )}
      </div>
    </div>
  )
}

export default function Workspace() {
  return (
    <ProtectedRoute>
      <WorkspaceContent />
    </ProtectedRoute>
  )
}