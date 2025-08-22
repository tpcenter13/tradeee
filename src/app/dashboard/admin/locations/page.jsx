'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import UserLocations from '../components/UserLocations';

// Disable SSR for the map component to avoid window is not defined errors
const UserLocationsMap = dynamic(
  () => import('../components/UserLocations'),
  { 
    ssr: false,
    loading: () => (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        minHeight: '60vh',
        color: '#64748b',
        fontSize: '1rem'
      }}>
        Loading map...
      </div>
    )
  }
);

export default function LocationsPage() {
  return (
    <div className="h-full">
      <Suspense fallback={
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          color: '#64748b',
          fontSize: '1rem'
        }}>
          Loading user locations...
        </div>
      }>
        <UserLocationsMap />
      </Suspense>
    </div>
  );
}
