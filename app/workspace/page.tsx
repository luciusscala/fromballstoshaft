'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Canvas } from '@/components/Canvas'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { FlightBlockCreator } from '@/components/FlightBlockCreator'

function WorkspaceContent() {
  const { user } = useAuth()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Calculate canvas dimensions (75% of viewport)
  useEffect(() => {
    const updateDimensions = () => {
      const controlPanelWidth = window.innerWidth * 0.25
      const canvasWidth = window.innerWidth - controlPanelWidth
      setDimensions({
        width: canvasWidth,
        height: window.innerHeight
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Control Panel - 25% width */}
      <div className="w-1/4 bg-white border-r border-gray-200 shadow-sm overflow-y-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Workspace</h1>
          <p className="text-gray-600 mb-6">Welcome back, {user?.email}</p>
          
          {/* Block Creator */}
          <div className="space-y-6">
            <FlightBlockCreator />
          </div>
        </div>
      </div>

      {/* Canvas Area - 75% width */}
      <div className="flex-1 relative">
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