'use client';

import { useEffect, useRef } from 'react';
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

// Zone boundaries for Bulihan, Silang, Cavite (approximate)
const zoneBoundaries = {
  '1': { lat: 14.245, lng: 120.975, radius: 0.02 },
  '2': { lat: 14.243, lng: 120.978, radius: 0.02 },
  '3': { lat: 14.241, lng: 120.981, radius: 0.02 },
  '4': { lat: 14.239, lng: 120.984, radius: 0.02 },
  '5': { lat: 14.237, lng: 120.987, radius: 0.02 },
  '6': { lat: 14.235, lng: 120.990, radius: 0.02 },
  '7': { lat: 14.233, lng: 120.993, radius: 0.02 },
  '8': { lat: 14.231, lng: 120.996, radius: 0.02 },
  '9': { lat: 14.229, lng: 120.999, radius: 0.02 },
  '10': { lat: 14.227, lng: 121.002, radius: 0.02 },
  '11': { lat: 14.225, lng: 121.005, radius: 0.02 }
};

const zoneColors = [
  '#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3',
  '#33FFF3', '#FF8C33', '#8C33FF', '#33FF8C', '#FF338C',
  '#33A2FF'
];

export default function LocationMap({ users }) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const zoneLayersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize the map centered on Bulihan, Silang, Cavite
      mapRef.current = L.map('map').setView([14.2376, 120.9872], 15);
      
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
        fillOpacity: 0.2,
        radius: radius * 111320 // Convert to meters
      }).addTo(mapRef.current);
      
      zoneLayer.bindPopup(`<b>Zone ${zone}</b><br>Users: ${zoneUsers.length}`);
      zoneLayersRef.current.push(zoneLayer);
    });

    // Add user markers
    users.forEach(user => {
      if (!user.zone || !zoneBoundaries[user.zone]) return;
      
      const zone = zoneBoundaries[user.zone];
      // Add some randomness to marker positions within the zone
      const lat = zone.lat + (Math.random() * 0.01 - 0.005);
      const lng = zone.lng + (Math.random() * 0.01 - 0.005);
      
      const marker = L.marker([lat, lng], { icon: customIcon })
        .addTo(mapRef.current)
        .bindPopup(`
          <div style="text-align: center;">
            <img src="${user.photoURL || '/default-avatar.png'}" 
                 style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; margin-bottom: 5px;">
            <b>${user.username || 'Anonymous'}</b><br>
            Zone: ${user.zone}<br>
            ${user.location || 'Unknown location'}
          </div>
        `);
      
      markersRef.current.push(marker);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [users]);

  return <div id="map" style={{ height: '100%', width: '100%', borderRadius: '8px' }} />;
}