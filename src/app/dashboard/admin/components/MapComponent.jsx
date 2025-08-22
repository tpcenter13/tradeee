"use client";

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';

// Dynamically import the LeafletMap component with SSR disabled
const DynamicLeafletMap = dynamic(
  () => import('./LeafletMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        Loading map...
      </div>
    )
  }
);

export default function MapComponent({ 
  users = [], 
  selectedZone,
  onUserClick,
  selectedUser
}) {
  // Clean up any duplicate map containers on mount
  useEffect(() => {
    const cleanupMapContainers = () => {
      const containers = document.querySelectorAll('.leaflet-container');
      containers.forEach((container, index) => {
        if (index > 0) { // Keep the first container, remove duplicates
          container.remove();
        }
      });
    };

    // Run cleanup on mount
    cleanupMapContainers();

    // Also run cleanup on window load in case of dynamic loading
    window.addEventListener('load', cleanupMapContainers);
    
    return () => {
      window.removeEventListener('load', cleanupMapContainers);
    };
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DynamicLeafletMap 
        users={users}
        selectedZone={selectedZone}
        onUserClick={onUserClick}
        selectedUser={selectedUser}
      />
    </div>
  );
}
