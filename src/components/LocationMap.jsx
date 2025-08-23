'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define the custom icon
const customIcon = new L.Icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Zone boundaries for Bulihan, Silang, Cavite - Updated to be closer together
const zoneBoundaries = {
  'Zone 1': { lat: 14.2850, lng: 120.9950, radius: 0.015 },
  'Zone 2': { lat: 14.2840, lng: 120.9960, radius: 0.015 },
  'Zone 3': { lat: 14.2830, lng: 120.9970, radius: 0.015 },
  'Zone 4': { lat: 14.2820, lng: 120.9980, radius: 0.015 },
  'Zone 5': { lat: 14.2810, lng: 120.9990, radius: 0.015 },
  'Zone 6': { lat: 14.2800, lng: 121.0000, radius: 0.015 },
  'Zone 7': { lat: 14.2860, lng: 120.9940, radius: 0.015 },
  'Zone 8': { lat: 14.2870, lng: 120.9930, radius: 0.015 },
  'Zone 9': { lat: 14.2880, lng: 120.9920, radius: 0.015 },
  'Zone 10': { lat: 14.2890, lng: 120.9910, radius: 0.015 },
  'Zone 11': { lat: 14.2900, lng: 120.9900, radius: 0.015 }
};

const zoneColors = [
  '#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3',
  '#33FFF3', '#FF8C33', '#8C33FF', '#33FF8C', '#FF338C',
  '#33A2FF'
];

export default function LocationMap({ initialUsers = [] }) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const zoneLayersRef = useRef([]);
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users from Firebase API
  useEffect(() => {
    if (initialUsers.length === 0) {
      fetchUsers();
    } else {
      setUsers(initialUsers);
    }
  }, [initialUsers]);

  const fetchUsers = async () => {
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

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize the map centered on Bulihan, Silang, Cavite
      mapRef.current = L.map('map').setView([14.2850, 120.9950], 15);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }

    // Clear existing markers and zone layers
    markersRef.current.forEach(marker => mapRef.current.removeLayer(marker));
    markersRef.current = [];
    
    zoneLayersRef.current.forEach(layer => mapRef.current.removeLayer(layer));
    zoneLayersRef.current = [];

    // Add zone boundaries
    Object.entries(zoneBoundaries).forEach(([zone, { lat, lng, radius }], index) => {
      const zoneUsers = users.filter(user => user.zone === zone);
      
      const zoneLayer = L.circle([lat, lng], {
        color: zoneColors[index],
        fillColor: zoneColors[index],
        fillOpacity: 0.15,
        radius: radius * 111320, // Convert to meters
        weight: 2
      }).addTo(mapRef.current);
      
      zoneLayer.bindPopup(`
        <div style="text-align: center;">
          <b>${zone}</b><br>
          Users: ${zoneUsers.length}<br>
          <small>Center: ${lat.toFixed(4)}, ${lng.toFixed(4)}</small>
        </div>
      `);
      zoneLayersRef.current.push(zoneLayer);
    });

    // Add user markers with real coordinates from API
    users.forEach(user => {
      if (!user.lat || !user.lng) return;
      
      const marker = L.marker([user.lat, user.lng], { icon: customIcon })
        .addTo(mapRef.current)
        .bindPopup(`
          <div style="text-align: center; min-width: 200px;">
            ${user.photoURL ? `<img src="${user.photoURL}" 
                 style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; margin-bottom: 8px;">` : ''}
            <b>${user.name || user.username || 'Anonymous'}</b><br>
            <small>${user.email}</small><br>
            <span style="background: ${user.status === 'Active' ? '#10b981' : '#ef4444'}; 
                         color: white; padding: 2px 6px; border-radius: 12px; font-size: 10px;">
              ${user.status || 'Unknown'}
            </span><br>
            <strong>Zone:</strong> ${user.zone}<br>
            ${user.location ? `<strong>Location:</strong> ${user.location}<br>` : ''}
            ${user.role ? `<strong>Role:</strong> ${user.role}<br>` : ''}
            <small style="color: #666;">
              ${user.lat.toFixed(6)}, ${user.lng.toFixed(6)}
            </small>
          </div>
        `);
      
      // Color marker based on status
      if (user.status === 'Active') {
        marker.getElement()?.style.setProperty('filter', 'hue-rotate(120deg)'); // Green
      } else {
        marker.getElement()?.style.setProperty('filter', 'hue-rotate(0deg)'); // Red (default)
      }
      
      markersRef.current.push(marker);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [users]);

  if (loading) {
    return (
      <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#ef4444' }}>
          Error: {error}
          <br />
          <button onClick={fetchUsers} style={{ marginTop: '8px', padding: '4px 8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding: '8px', backgroundColor: '#f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '14px' }}>
          Total Users: {users.length} | Zones: {Object.keys(zoneBoundaries).length}
        </span>
        <button 
          onClick={fetchUsers}
          disabled={loading}
          style={{ 
            padding: '4px 12px', 
            backgroundColor: loading ? '#9ca3af' : '#10b981', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '12px'
          }}
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
      <div id="map" style={{ height: '100%', width: '100%', borderRadius: '8px' }} />
    </div>
  );
}