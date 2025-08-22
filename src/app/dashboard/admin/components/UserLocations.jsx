'use client';

import { useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { FaMapMarkerAlt, FaFilter, FaInfoCircle } from 'react-icons/fa';

// Dynamic import for the map component to avoid SSR issues
const MapComponent = dynamic(
  () => import('./MapComponent'),
  { ssr: false }
);

// Zone boundaries for Bulihan, Silang, Cavite
const ZONE_BOUNDARIES = {
  'Zone 1': {
    bounds: [
      [14.286, 120.990],
      [14.286, 120.994],
      [14.282, 120.994],
      [14.282, 120.990],
    ],
    color: '#3b82f6',
  },
  // Add other zones with their respective boundaries
  // This is a simplified example - you'll need to get accurate coordinates for each zone
};

// Mock user data - replace with actual data from your database
const MOCK_USERS = [
  {
    id: '1',
    name: 'Katkai',
    email: 'maricarcaratao11@gmail.com',
    zone: 'Zone 5',
    status: 'active',
    coordinates: [14.282, 120.994],
  },
  // Add more mock users as needed
];

export default function UserLocations() {
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showZoneBoundaries, setShowZoneBoundaries] = useState(true);
  const [map, setMap] = useState(null);

  // Filter users based on selected zone
  const filteredUsers = useMemo(() => {
    if (selectedZone === 'all') return MOCK_USERS;
    return MOCK_USERS.filter(user => user.zone === selectedZone);
  }, [selectedZone]);

  // Handle map initialization
  const handleMapReady = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  // Handle zone filter change
  const handleZoneFilter = (zone) => {
    setSelectedZone(zone);
    
    // If a specific zone is selected, fly to that zone
    if (zone !== 'all' && ZONE_BOUNDARIES[zone]?.bounds && map) {
      const bounds = L.latLngBounds(ZONE_BOUNDARIES[zone].bounds);
      map.flyToBounds(bounds, { padding: [50, 50] });
    }
  };

  // Handle user marker click
  const handleUserClick = (user) => {
    setSelectedUser(user);
    if (map && user.coordinates) {
      map.flyTo(user.coordinates, 16, {
        duration: 1,
        animate: true,
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-800">User Locations</h1>
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <FaMapMarkerAlt className="mr-1" />
          <span>Bulihan, Silang, Cavite</span>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 border-b flex flex-wrap items-center gap-4">
        <div className="flex items-center">
          <FaFilter className="mr-2 text-gray-500" />
          <select
            value={selectedZone}
            onChange={(e) => handleZoneFilter(e.target.value)}
            className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Zones</option>
            {Object.keys(ZONE_BOUNDARIES).map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="showZones"
            checked={showZoneBoundaries}
            onChange={(e) => setShowZoneBoundaries(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="showZones" className="ml-2 text-sm text-gray-700">
            Show Zone Boundaries
          </label>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div className="absolute inset-0">
          <MapComponent
            users={filteredUsers}
            onUserClick={handleUserClick}
            showZones={showZoneBoundaries}
            zoneBoundaries={ZONE_BOUNDARIES}
            onMapReady={handleMapReady}
            center={[14.282, 120.994]} // Center of Bulihan
            selectedUser={selectedUser}
          />
        </div>

        {/* User Info Panel */}
        {selectedUser && (
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 w-64 z-10">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-800">User Details</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <div className="font-medium text-gray-600">Name</div>
                <div>{selectedUser.name}</div>
              </div>
              <div>
                <div className="font-medium text-gray-600">Email</div>
                <div className="truncate">{selectedUser.email}</div>
              </div>
              <div>
                <div className="font-medium text-gray-600">Zone</div>
                <div>{selectedUser.zone}</div>
              </div>
              <div>
                <div className="font-medium text-gray-600">Status</div>
                <div className="flex items-center">
                  <span 
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      selectedUser.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  />
                  {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 text-sm z-10">
          <div className="font-medium mb-2">Legend</div>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span>User Location</span>
            </div>
            {showZoneBoundaries && (
              <div className="flex items-center">
                <div className="w-3 h-3 border border-blue-500 bg-blue-100 mr-2"></div>
                <span>Zone Boundary</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
