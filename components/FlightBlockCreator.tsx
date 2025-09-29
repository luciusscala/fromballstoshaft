'use client'

import { useState } from 'react'
import { useCanvasStore } from '@/lib/canvasStore'
import type { FlightFormData, FlightSegmentFormData, createFlightBlock } from '@/lib/types/flight'

export function FlightBlockCreator() {
  const { addBlock } = useCanvasStore()
  const [formData, setFormData] = useState<FlightFormData>({
    user_id: 'current-user', // TODO: Get from auth context
    price: '',
    link: '',
    segments: [
      {
        id: '1',
        type: 'outbound',
        airline: '',
        flight_number: '',
        departure_airport: '',
        arrival_airport: '',
        departure_time: '',
        arrival_time: '',
        duration: '',
        layover: ''
      }
    ]
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const addSegment = () => {
    const newSegment: FlightSegmentFormData = {
      id: Date.now().toString(),
      type: 'connecting',
      airline: '',
      flight_number: '',
      departure_airport: '',
      arrival_airport: '',
      departure_time: '',
      arrival_time: '',
      duration: '',
      layover: ''
    }
    setFormData(prev => ({
      ...prev,
      segments: [...prev.segments, newSegment]
    }))
  }

  const removeSegment = (segmentId: string) => {
    if (formData.segments.length > 1) {
      setFormData(prev => ({
        ...prev,
        segments: prev.segments.filter(seg => seg.id !== segmentId)
      }))
    }
  }

  const updateSegment = (segmentId: string, field: keyof FlightSegmentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      segments: prev.segments.map(seg =>
        seg.id === segmentId ? { ...seg, [field]: value } : seg
      )
    }))
  }

  const updateSegmentType = (segmentId: string, type: 'outbound' | 'return' | 'connecting') => {
    setFormData(prev => ({
      ...prev,
      segments: prev.segments.map(seg =>
        seg.id === segmentId ? { ...seg, type } : seg
      )
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Import the utility function dynamically to avoid circular imports
      const { createFlightBlock } = await import('@/lib/types/flight')
      
      // Create the flight block using the utility function
      const flightBlock = createFlightBlock(formData)

      // Add to canvas
      addBlock(flightBlock)
      
      // Reset form
      setFormData({
        user_id: 'current-user', // TODO: Get from auth context
        price: '',
        link: '',
        segments: [
          {
            id: '1',
            type: 'outbound',
            airline: '',
            flight_number: '',
            departure_airport: '',
            arrival_airport: '',
            departure_time: '',
            arrival_time: '',
            duration: '',
            layover: ''
          }
        ]
      })
    } catch (error) {
      console.error('Error creating flight block:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Flight Block</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Flight Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              placeholder="e.g., $299.99"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Booking Link
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Flight Segments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-medium text-gray-700">Flight Segments</h3>
            <button
              type="button"
              onClick={addSegment}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              + Add Segment
            </button>
          </div>

          <div className="space-y-4">
            {formData.segments.map((segment, index) => (
              <div key={segment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-600">
                    Segment {index + 1}
                  </h4>
                  {formData.segments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSegment(segment.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Segment Type */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Type
                    </label>
                    <select
                      value={segment.type}
                      onChange={(e) => updateSegmentType(segment.id, e.target.value as any)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="outbound">Outbound</option>
                      <option value="connecting">Connecting</option>
                      <option value="return">Return</option>
                    </select>
                  </div>

                  {/* Airline */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Airline
                    </label>
                    <input
                      type="text"
                      value={segment.airline}
                      onChange={(e) => updateSegment(segment.id, 'airline', e.target.value)}
                      placeholder="e.g., American Airlines"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Flight Number */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Flight Number
                    </label>
                    <input
                      type="text"
                      value={segment.flight_number}
                      onChange={(e) => updateSegment(segment.id, 'flight_number', e.target.value)}
                      placeholder="e.g., AA123"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Duration (hours)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={segment.duration}
                      onChange={(e) => updateSegment(segment.id, 'duration', e.target.value)}
                      placeholder="e.g., 2.5"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Departure Airport */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Departure
                    </label>
                    <input
                      type="text"
                      value={segment.departure_airport}
                      onChange={(e) => updateSegment(segment.id, 'departure_airport', e.target.value)}
                      placeholder="e.g., JFK"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Arrival Airport */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Arrival
                    </label>
                    <input
                      type="text"
                      value={segment.arrival_airport}
                      onChange={(e) => updateSegment(segment.id, 'arrival_airport', e.target.value)}
                      placeholder="e.g., LAX"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Departure Time */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Departure Time
                    </label>
                    <input
                      type="datetime-local"
                      value={segment.departure_time}
                      onChange={(e) => updateSegment(segment.id, 'departure_time', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Arrival Time */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Arrival Time
                    </label>
                    <input
                      type="datetime-local"
                      value={segment.arrival_time}
                      onChange={(e) => updateSegment(segment.id, 'arrival_time', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Layover (only for connecting flights) */}
                  {segment.type === 'connecting' && (
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Layover (hours)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={segment.layover || ''}
                        onChange={(e) => updateSegment(segment.id, 'layover', e.target.value)}
                        placeholder="e.g., 1.5"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating...' : 'Create Flight Block'}
        </button>
      </form>
    </div>
  )
}
