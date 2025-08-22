"use client";
import { Map, Marker, Overlay } from "pigeon-maps";
import { useState } from "react";
import users from "@/data/users";

const BULIHAN_CENTER = [14.2826, 120.9976];

const bounds = {
  minLat: 14.2626,
  maxLat: 14.3026,
  minLng: 120.9776,
  maxLng: 121.0176,
};

export default function UserLocationMap() {
  const [selectedZone, setSelectedZone] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [mapCenter, setMapCenter] = useState(BULIHAN_CENTER);
  const [zoom, setZoom] = useState(15);

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

  return (
    <div className="h-full w-full">
      {/* Zone Filter */}
      <div className="p-2">
        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          className="border p-1 rounded text-sm"
        >
          <option>All</option>
          {[...Array(11)].map((_, i) => (
            <option key={i}>Zone {i + 1}</option>
          ))}
        </select>
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
            key={i}
            width={30}
            anchor={[user.lat, user.lng]}
            color="red"
            onClick={() => setSelectedUser(user)}
          />
        ))}

        {selectedUser && (
          <Overlay anchor={[selectedUser.lat, selectedUser.lng]} offset={[80, 30]}>
            <div className="bg-white shadow-lg p-2 rounded text-xs border">
              <strong>{selectedUser.name}</strong><br />
              {selectedUser.email}<br />
              Zone: {selectedUser.zone}<br />
              Status: {selectedUser.status}
            </div>
          </Overlay>
        )}
      </Map>
    </div>
  );
}
