// Control panel for creating and managing flight and hotel blocks
import { useState } from 'react';
import { FlightBuilder } from '../lib/builders/FlightBuilder';
import { HotelBuilder } from '../lib/builders/HotelBuilder';
import { getAllFlightPresets, getFlightPreset } from '../lib/presets/flightPresets';
import { getAllHotelPresets, getHotelPreset } from '../lib/presets/hotelPresets';
import type { Block } from '../lib/types/block';

interface ControlPanelProps {
  onCreateBlock: (block: Block) => void;
  className?: string;
}

export function ControlPanel({ onCreateBlock, className = '' }: ControlPanelProps) {
  const [flightLink, setFlightLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const flightPresets = getAllFlightPresets();
  const hotelPresets = getAllHotelPresets();


  const handleLoadFlightPreset = (presetId: string) => {
    const preset = getFlightPreset(presetId);
    if (!preset) return;

    const x = Math.random() * 400 + 100; // Random position
    const y = Math.random() * 300 + 100;

    const block = FlightBuilder.createFromConfig(preset.config, x, y);
    onCreateBlock(block);
  };

  const handleLoadHotelPreset = (presetId: string) => {
    const preset = getHotelPreset(presetId);
    if (!preset) return;

    const x = Math.random() * 400 + 100; // Random position
    const y = Math.random() * 300 + 100;

    const block = HotelBuilder.createFromConfig(preset.config, x, y);
    onCreateBlock(block);
  };

  const handlePasteFlightLink = async () => {
    if (!flightLink.trim()) return;

    setIsLoading(true);
    
    try {
      // TODO: Replace with actual backend call
      // const response = await fetch('/api/parse-flight', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ url: flightLink })
      // });
      // const flightData = await response.json();
      
      // For now, simulate parsing with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate creating a block from parsed data
      const x = Math.random() * 400 + 100;
      const y = Math.random() * 300 + 100;
      
      // Create a mock flight block (replace with actual parsed data)
      const mockBlock = FlightBuilder.createRoundTrip(
        'JFK',
        'LAX', 
        new Date(Date.now() + 2 * 60 * 60 * 1000),
        new Date(Date.now() + (5 * 24 + 2) * 60 * 60 * 1000),
        6,
        5.5,
        1,
        x,
        y
      );
      
      onCreateBlock(mockBlock);
      setFlightLink(''); // Clear the input
    } catch (error) {
      console.error('Failed to parse flight link:', error);
      // TODO: Show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 max-w-md ${className}`}>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Add Blocks</h2>

      {/* Flight Link Parser */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Paste Flight Link</h3>
        <div className="space-y-2">
          <input
            type="url"
            value={flightLink}
            onChange={(e) => setFlightLink(e.target.value)}
            placeholder="https://expedia.com/flight/..."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <button
            onClick={handlePasteFlightLink}
            disabled={!flightLink.trim() || isLoading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Parsing Flight...
              </div>
            ) : (
              'Parse & Add Flight'
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Paste any flight booking link to automatically create a flight block
        </p>
      </div>

      {/* Flight Test Data Presets */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Flight Test Data</h3>
        <div className="space-y-2">
          {flightPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleLoadFlightPreset(preset.id)}
              className="w-full text-left bg-blue-50 hover:bg-blue-100 text-gray-700 text-sm py-2 px-3 rounded-md transition-colors"
            >
              <div className="font-medium">{preset.name}</div>
              <div className="text-xs text-gray-500">{preset.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Hotel Test Data Presets */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Hotel Test Data</h3>
        <div className="space-y-2">
          {hotelPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleLoadHotelPreset(preset.id)}
              className="w-full text-left bg-green-50 hover:bg-green-100 text-gray-700 text-sm py-2 px-3 rounded-md transition-colors"
            >
              <div className="font-medium">{preset.name}</div>
              <div className="text-xs text-gray-500">{preset.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
