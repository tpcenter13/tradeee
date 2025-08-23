"use client";
import { Map, Marker, Overlay } from "pigeon-maps";
import { useState, useEffect } from "react";

const BULIHAN_CENTER = [14.2826, 120.9976];

const bounds = {
  minLat: 14.2626,
  maxLat: 14.3026,
  minLng: 120.9776,
  maxLng: 121.0176,
};

export default function UserLocationMap() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedZone, setSelectedZone] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [mapCenter, setMapCenter] = useState(BULIHAN_CENTER);
  const [zoom, setZoom] = useState(15);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const url = selectedZone === "All" ? '/api/users' : `/api/users?zone=${selectedZone}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const userData = await response.json();
        setUsers(userData);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // Remove selectedZone dependency to avoid too many API calls

  // Separate effect to refetch when zone changes (optional)
  const refetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const userData = await response.json();
      setUsers(userData);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers =
    selectedZone === "All"
      ? users
      : users.filter((u) => u.zone === selectedZone);

  const handleBounds = ([lat, lng]) => {
    // Lock pan within Bulihan
    const latFixed = Math.min(Math.max(lat, bounds.minLat), bounds.maxLat);
    const lngFixed = Math.min(Math.max(lng, bounds.minLng), bounds.maxLng);
    return [latFixed, lngFixed];
  };

  // Get unique zones from users data
  const availableZones = [...new Set(users.map(user => user.zone))].sort();

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      {/* Zone Filter */}
      <div className="p-2 flex gap-2 items-center">
        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="border p-1 rounded text-sm"
        >
          <option>All</option>
          {availableZones.map((zone) => (
            <option key={zone} value={zone}>{zone}</option>
          ))}
        </select>
        <span className="text-sm text-gray-600">
          Showing {filteredUsers.length} of {users.length} users
        </span>
        <button 
          onClick={refetchUsers}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Main Map */}
      <Map
        center={mapCenter}
        zoom={zoom}
        onBoundsChanged={({ center, zoom }) => {
          setMapCenter(handleBounds(center));
          setZoom(zoom);
        }}
        minZoom={14}
        maxZoom={18}
        height={600}
      >
        {filteredUsers.map((user, i) => (
          <Marker
            key={user.id}
            width={30}
            anchor={[user.lat, user.lng]}
            color={user.status === 'Active' ? 'green' : 'red'}
            onClick={() => setSelectedUser(user)}
          />
        ))}

        {selectedUser && (
          <Overlay anchor={[selectedUser.lat, selectedUser.lng]} offset={[80, 30]}>
            <div className="bg-white shadow-lg p-3 rounded text-xs border max-w-xs">
              {selectedUser.photoURL && (
                <img 
                  src={selectedUser.photoURL} 
                  alt={selectedUser.name}
                  className="w-12 h-12 rounded-full mx-auto mb-2 object-cover"
                />
              )}
              <strong>{selectedUser.name}</strong><br />
              {selectedUser.email}<br />
              Zone: {selectedUser.zone}<br />
              Status: <span className={`font-semibold ${selectedUser.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                {selectedUser.status}
              </span><br />
              {selectedUser.location && (
                <>Location: {selectedUser.location}</>
              )}
              <button 
                onClick={() => setSelectedUser(null)}
                className="mt-2 px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </Overlay>
        )}
      </Map>
    </div>
  );
}