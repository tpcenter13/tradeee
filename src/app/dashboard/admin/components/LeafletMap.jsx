"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from 'react';
import MapBoundsControl from "./MapBoundsControl";

// Fix for default marker icons in Next.js
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
    iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
    iconSize: [32, 32],
  });
}

const BULIHAN_CENTER = [14.2826, 120.9976];

export default function LeafletMap({ 
  users = [], 
  selectedZone,
  onUserClick,
  selectedUser
}) {
  useEffect(() => {
    return () => {
      // Cleanup any remaining map instances when component unmounts
      const containers = document.querySelectorAll('.leaflet-container');
      containers.forEach(container => {
        if (container._leaflet_id) {
          container._leaflet_id = null;
          container.remove();
        }
      });
    };
  }, []);

  return (
    <MapContainer
      center={BULIHAN_CENTER}
      zoom={15}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
    >
      <MapBoundsControl selectedZone={selectedZone} selectedUser={selectedUser} />
      
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* User markers */}
      {users.map((user) => {
        if (!user.coordinates?.length === 2) return null;
        
        const isSelected = selectedUser?.id === user.id;
        
        return (
          <Marker
            key={user.id}
            position={user.coordinates}
            eventHandlers={{
              click: () => onUserClick && onUserClick(user)
            }}
            icon={new L.Icon({
              iconUrl: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
              iconSize: isSelected ? [40, 40] : [32, 32],
            })}
          >
            <Popup>
              <div className="user-tooltip">
                <div className="user-tooltip-header">
                  <strong>{user.name}</strong>
                  <span className={`status-badge ${user.status}`}>
                    {user.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="user-tooltip-details">
                  <div>{user.email || user.contact}</div>
                  <div>Zone: {user.zone}</div>
                  {user.isOutOfZone && (
                    <div className="out-of-zone">Out of Zone</div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
