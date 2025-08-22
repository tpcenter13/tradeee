import { adminAuth } from './firebase-admin-config';
import { getAuth } from 'firebase/auth';
import { auth } from './firebase';

// Function to set admin claim for a user
export const setAdminClaim = async (uid, isAdmin = true) => {
  try {
    // Set admin claim on the user
    await adminAuth.setCustomUserClaims(uid, { admin: isAdmin });
    
    // Force token refresh to apply the new claims
    const user = auth.currentUser;
    if (user && user.uid === uid) {
      await user.getIdToken(true);
    }
    
    return true;
  } catch (error) {
    console.error('Error setting admin claim:', error);
    return false;
  }
};

// Function to check if a user is an admin
export const isUserAdmin = async (user) => {
  try {
    if (!user) return false;
    
    // First check the ID token claims (faster)
    const idTokenResult = await user.getIdTokenResult();
    if (idTokenResult.claims.admin) {
      return true;
    }
    
    // Fallback to checking Firestore (legacy)
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    return userDoc.exists() && userDoc.data().role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Function to initialize admin user
export const initializeAdminUser = async (email, password) => {
  try {
    // Check if user exists
    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(email);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create new admin user
        userRecord = await adminAuth.createUser({
          email,
          password,
          emailVerified: true,
        });
        console.log('Created new admin user:', userRecord.uid);
      } else {
        throw error;
      }
    }
    
    // Set admin claim
    await setAdminClaim(userRecord.uid, true);
    
    // Create/update user document in Firestore
    const userRef = doc(db, 'users', userRecord.uid);
    await setDoc(userRef, {
      uid: userRecord.uid,
      email: userRecord.email,
      role: 'admin',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      isAdmin: true
    }, { merge: true });
    
    console.log('Admin user initialized successfully');
    return userRecord.uid;
  } catch (error) {
    console.error('Error initializing admin user:', error);
    throw error;
  }
};
