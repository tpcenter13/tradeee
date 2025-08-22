import L from 'leaflet';

// Create a custom cluster icon
const createClusterCustomIcon = (cluster) => {
  const count = cluster.getChildCount();
  let size = 'small';
  
  if (count > 50) size = 'large';
  else if (count > 10) size = 'medium';

  return L.divIcon({
    html: `<div><span>${count}</span></div>`,
    className: `marker-cluster marker-cluster-${size}`,
    iconSize: L.point(40, 40, true)
  });
};

// Validate if coordinates are within Bulihan bounds
const isInBulihan = (lat, lng) => {
  const BULIHAN_BOUNDS = {
    north: 14.29,
    south: 14.27,
    east: 121.01,
    west: 120.98
  };
  
  return (
    lat >= BULIHAN_BOUNDS.south &&
    lat <= BULIHAN_BOUNDS.north &&
    lng >= BULIHAN_BOUNDS.west &&
    lng <= BULIHAN_BOUNDS.east
  );
};

// Generate random coordinates within Bulihan
const generateRandomCoordinates = () => {
  const lat = 14.27 + (Math.random() * 0.02);
  const lng = 120.98 + (Math.random() * 0.03);
  return [lat, lng];
};

export {
  createClusterCustomIcon,
  isInBulihan,
  generateRandomCoordinates
};
