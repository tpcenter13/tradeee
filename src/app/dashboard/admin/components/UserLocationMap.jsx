'use client';

import { useState, useMemo } from 'react';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Marker, Popup, NavigationControl, FullscreenControl } from 'react-map-gl';
import { FaMapMarkerAlt, FaUser, FaEnvelope, FaMapMarkedAlt, FaCircle } from 'react-icons/fa';

const BULIHAN_CENTER = {
  latitude: 14.2826,
  longitude: 120.9976,
};

// Get Mapbox token from environment variables
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

if (!MAPBOX_TOKEN) {
  console.error('Mapbox token is not defined. Please set NEXT_PUBLIC_MAPBOX_TOKEN in .env.local');
}

const MAP_STYLE = 'mapbox://styles/mapbox/streets-v11';

const bounds = [
  [120.9776, 14.2626], // southwest
  [121.0176, 14.3026], // northeast
];

const UserLocationMap = ({ users = [] }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedZone, setSelectedZone] = useState('All');
  const [isMapLocked, setIsMapLocked] = useState(true);

  // Filter users by selected zone
  const filteredUsers = useMemo(() => {
    return selectedZone === 'All' 
      ? users 
      : users.filter(user => user.zone === selectedZone);
  }, [users, selectedZone]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800">Mapbox Token Required</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>To use the map, you need to add your Mapbox access token.</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Get a free access token from <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Mapbox</a></li>
                  <li>Create a <code className="bg-gray-100 px-1 rounded">.env.local</code> file in your project root</li>
                  <li>Add this line to the file: <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here</code></li>
                  <li>Restart your development server</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-gray-50 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <FaMapMarkerAlt className="text-indigo-600 mr-2 text-xl" />
          <h1 className="text-2xl font-bold text-gray-800">User Locations</h1>
        </div>
        
        {/* Zone Filter */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <label htmlFor="zone-filter" className="sr-only">Filter by Zone</label>
            <div className="px-3 py-2 bg-gray-50 border-r border-gray-200">
              <FaMapMarkedAlt className="text-gray-500" />
            </div>
            <select
              id="zone-filter"
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="pl-3 pr-8 py-2 appearance-none bg-white text-sm font-medium text-gray-700 focus:outline-none"
            >
              <option value="All">All Zones</option>
              {[...Array(11)].map((_, i) => (
                <option key={`zone-${i + 1}`} value={`Zone ${i + 1}`}>
                  Zone {i + 1}
                </option>
              ))}
            </select>
          </div>
          
          {/* Map Lock Toggle */}
          <button
            onClick={() => setIsMapLocked(!isMapLocked)}
            className={`p-2 rounded-md ${isMapLocked ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'} hover:bg-indigo-50 transition-colors`}
            title={isMapLocked ? 'Unlock Map Movement' : 'Lock Map to Bulihan'}
          >
            {isMapLocked ? '🔒' : '🔓'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row gap-4">
        {/* Map Container */}
        <div className="flex-1 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
          <Map
            initialViewState={{
              ...BULIHAN_CENTER,
              zoom: 15,
            }}
            mapboxAccessToken={MAPBOX_TOKEN}
            mapStyle={MAP_STYLE}
            style={{ width: '100%', height: '100%' }}
            maxBounds={isMapLocked ? bounds : null}
            minZoom={14}
            maxZoom={18}
            dragPan={!isMapLocked}
            scrollZoom={!isMapLocked}
            onClick={() => setSelectedUser(null)}
          >
            <NavigationControl position="top-right" showCompass={false} />
            <FullscreenControl position="top-right" />
            
            {filteredUsers.map((user) => (
              <Marker
                key={`${user.id}-${user.lat}-${user.lng}`}
                longitude={user.lng}
                latitude={user.lat}
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setSelectedUser(user);
                }}
              >
                <div 
                  className={`w-5 h-5 rounded-full border-2 border-white shadow-lg cursor-pointer transform transition-transform hover:scale-125 ${
                    user.status === 'Active' ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
                  }`}
                  title={`${user.name} (${user.zone})`}
                />
              </Marker>
            ))}

            {selectedUser && (
              <Popup
                anchor="top"
                longitude={selectedUser.lng}
                latitude={selectedUser.lat}
                onClose={() => setSelectedUser(null)}
                closeButton={false}
                closeOnClick={false}
                className="popup-card"
              >
                <div className="p-3 max-w-xs">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-full">
                      <FaUser className="text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-bold text-gray-900">{selectedUser.name}</h3>
                      <div className="mt-1 flex items-center text-sm text-gray-600">
                        <FaEnvelope className="mr-1.5 h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                        <span className="truncate">{selectedUser.email}</span>
                      </div>
                      <div className="mt-1 flex items-center text-sm">
                        <FaMapMarkedAlt className="mr-1.5 h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                        <span className="font-medium text-gray-900">Zone: </span>
                        <span className="ml-1 text-gray-600">{selectedUser.zone}</span>
                      </div>
                      <div className="mt-1 flex items-center text-sm">
                        <FaCircle className={`mr-1.5 h-3 w-3 flex-shrink-0 ${
                          selectedUser.status === 'Active' ? 'text-green-500' : 'text-gray-400'
                        }`} />
                        <span className="font-medium text-gray-900">Status: </span>
                        <span className={`ml-1 ${
                          selectedUser.status === 'Active' ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {selectedUser.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Popup>
            )}
          </Map>
        </div>

        {/* User List / Legend Panel */}
        <div className="w-full md:w-80 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">User List</h3>
            <p className="text-sm text-gray-500">Showing {filteredUsers.length} users</p>
          </div>
          
          <div className="overflow-y-auto max-h-96">
            {filteredUsers.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <li 
                    key={user.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedUser?.id === user.id ? 'bg-indigo-50' : ''
                    }`}
                    onClick={() => {
                      setSelectedUser(user);
                    }}
                  >
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        user.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.zone}</p>
                      </div>
                      <div className="ml-auto text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        {user.status}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center">
                <FaMapMarkerAlt className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                <p className="mt-1 text-sm text-gray-500">Try changing your filter criteria</p>
              </div>
            )}
          </div>
          
          {/* Legend */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-xs text-gray-600">Active User</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                <span className="text-xs text-gray-600">Offline User</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-indigo-100 border-2 border-indigo-500 mr-2"></div>
                <span className="text-xs text-gray-600">Selected User</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map Controls Info */}
      <div className="mt-3 text-xs text-gray-500 text-center">
        <p>Map is currently <span className="font-medium">{isMapLocked ? 'locked' : 'unlocked'}</span> to Bulihan, Silang, Cavite. {isMapLocked ? 'Click the unlock button to enable panning.' : 'Click the lock button to restrict movement.'}</p>
      </div>
    </div>
  );
};

export default UserLocationMap;
