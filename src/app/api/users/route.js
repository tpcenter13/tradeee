// src/app/api/users/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

// Zone center coordinates for Bulihan, Silang, Cavite
const ZONE_CENTERS = {
  'Zone 1': { lat: 14.2850, lng: 120.9950 },
  'Zone 2': { lat: 14.2840, lng: 120.9960 },
  'Zone 3': { lat: 14.2830, lng: 120.9970 },
  'Zone 4': { lat: 14.2820, lng: 120.9980 },
  'Zone 5': { lat: 14.2810, lng: 120.9990 },
  'Zone 6': { lat: 14.2800, lng: 121.0000 },
  'Zone 7': { lat: 14.2860, lng: 120.9940 },
  'Zone 8': { lat: 14.2870, lng: 120.9930 },
  'Zone 9': { lat: 14.2880, lng: 120.9920 },
  'Zone 10': { lat: 14.2890, lng: 120.9910 },
  'Zone 11': { lat: 14.2900, lng: 120.9900 },
};

// Function to generate random coordinates within a small radius of zone center
function generateZoneCoordinates(zone, userIndex = 0) {
  const center = ZONE_CENTERS[zone];
  if (!center) {
    // Default to Zone 1 if zone not found
    return ZONE_CENTERS['Zone 1'];
  }
  
  // Create a small random offset (within ~100-200 meters)
  const offsetLat = (Math.random() - 0.5) * 0.002; // ~0.001 degree = ~111 meters
  const offsetLng = (Math.random() - 0.5) * 0.002;
  
  // Add some systematic spacing to avoid exact overlap
  const systematicOffsetLat = (userIndex % 3) * 0.0003;
  const systematicOffsetLng = Math.floor(userIndex / 3) * 0.0003;
  
  return {
    lat: center.lat + offsetLat + systematicOffsetLat,
    lng: center.lng + offsetLng + systematicOffsetLng
  };
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const zone = searchParams.get('zone');
    
    // Create query - if zone is specified, filter by zone
    let usersQuery;
    if (zone && zone !== 'All') {
      usersQuery = query(collection(db, "users"), where("zone", "==", zone));
    } else {
      usersQuery = query(collection(db, "users"));
    }
    
    const querySnapshot = await getDocs(usersQuery);
    
    // Group users by zone to generate better coordinates
    const usersByZone = {};
    const allUsers = [];
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      const user = {
        id: doc.id,
        name: userData.username || userData.name,
        email: userData.email,
        zone: userData.zone || 'Zone 1',
        status: userData.status || 'Active',
        role: userData.role || 'user',
        photoURL: userData.photoURL,
        location: userData.location,
        createdAt: userData.createdAt?.toDate?.()?.toISOString() || null,
      };
      
      allUsers.push(user);
      
      // Group by zone for coordinate generation
      if (!usersByZone[user.zone]) {
        usersByZone[user.zone] = [];
      }
      usersByZone[user.zone].push(user);
    });
    
    // Generate coordinates for each user based on their zone
    const usersWithCoordinates = allUsers.map((user) => {
      const zoneUsers = usersByZone[user.zone];
      const userIndex = zoneUsers.findIndex(u => u.id === user.id);
      const coordinates = generateZoneCoordinates(user.zone, userIndex);
      
      return {
        ...user,
        lat: coordinates.lat,
        lng: coordinates.lng
      };
    });
    
    return NextResponse.json(usersWithCoordinates);
    
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// Optional: Add a POST route to update user location manually
export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, lat, lng, location } = body;
    
    if (!userId || !lat || !lng) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
    
    // Update user location in Firestore
    await setDoc(doc(db, "users", userId), {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      location: location || null,
      locationUpdatedAt: serverTimestamp(),
    }, { merge: true });
    
    return NextResponse.json({ message: "Location updated successfully" });
    
  } catch (error) {
    console.error("Error updating location:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}