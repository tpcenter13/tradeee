"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapBoundsControl({ selectedZone, selectedUser }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Set initial bounds for Bulihan, Silang
    const bounds = [
      [14.2626, 120.9776], // Southwest corner
      [14.3026, 121.0176]  // Northeast corner
    ];

    // Set map bounds and zoom constraints
    map.setMaxBounds(bounds);
    map.setMinZoom(14);
    map.setMaxZoom(18);

    // If we have a selected zone, fly to its bounds
    if (selectedZone && ZONE_BOUNDARIES[selectedZone]?.bounds) {
      const bounds = L.latLngBounds(ZONE_BOUNDARIES[selectedZone].bounds);
      map.flyToBounds(bounds, { padding: [50, 50] });
    }

    // If we have a selected user, center on them
    if (selectedUser?.coordinates) {
      map.flyTo(selectedUser.coordinates, 16, {
        duration: 1,
        animate: true,
      });
    }
  }, [map, selectedZone, selectedUser]);

  return null;
}

// Zone boundaries
export const ZONE_BOUNDARIES = {
  'Zone 1': {
    bounds: [
      [14.286, 120.990],
      [14.286, 121.000],
      [14.280, 121.000],
      [14.280, 120.990]
    ],
    color: '#3b82f6'
  },
  'Zone 2': {
    bounds: [
      [14.280, 120.990],
      [14.280, 121.000],
      [14.274, 121.000],
      [14.274, 120.990]
    ],
    color: '#10b981'
  },
  'Zone 3': {
    bounds: [
      [14.274, 120.990],
      [14.274, 121.000],
      [14.268, 121.000],
      [14.268, 120.990]
    ],
    color: '#f59e0b'
  },
  'Zone 4': {
    bounds: [
      [14.286, 120.980],
      [14.286, 120.990],
      [14.280, 120.990],
      [14.280, 120.980]
    ],
    color: '#8b5cf6'
  },
  'Zone 5': {
    bounds: [
      [14.280, 120.980],
      [14.280, 120.990],
      [14.274, 120.990],
      [14.274, 120.980]
    ],
    color: '#ec4899'
  },
  'Zone 6': {
    bounds: [
      [14.274, 120.980],
      [14.274, 120.990],
      [14.268, 120.990],
      [14.268, 120.980]
    ],
    color: '#14b8a6'
  },
  'Zone 7': {
    bounds: [
      [14.286, 120.970],
      [14.286, 120.980],
      [14.280, 120.980],
      [14.280, 120.970]
    ],
    color: '#f97316'
  },
  'Zone 8': {
    bounds: [
      [14.280, 120.970],
      [14.280, 120.980],
      [14.274, 120.980],
      [14.274, 120.970]
    ],
    color: '#0ea5e9'
  },
  'Zone 9': {
    bounds: [
      [14.274, 120.970],
      [14.274, 120.980],
      [14.268, 120.980],
      [14.268, 120.970]
    ],
    color: '#84cc16'
  },
  'Zone 10': {
    bounds: [
      [14.286, 120.960],
      [14.286, 120.970],
      [14.280, 120.970],
      [14.280, 120.960]
    ],
    color: '#ef4444'
  },
  'Zone 11': {
    bounds: [
      [14.280, 120.960],
      [14.280, 120.970],
      [14.274, 120.970],
      [14.274, 120.960]
    ],
    color: '#a855f7'
  }
};
