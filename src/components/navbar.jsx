'use client';

import Link from 'next/link';
import '../styles/navbar.css';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const db = getFirestore();

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserRole(data.role); // either 'admin' or 'user'
          }
        } catch (error) {
          console.error("Failed to fetch user role:", error);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          TradeConnect
        </Link>

        <div className="navbar-links">
          {!user ? (
            <>
              <Link href="/login" className={`navbar-link ${pathname === '/login' ? 'active' : ''}`}>Login</Link>
              <Link href="/signup" className={`navbar-link ${pathname === '/signup' ? 'active' : ''}`}>Sign Up</Link>
              <Link href="/forgot" className={`navbar-link ${pathname === '/forgot' ? 'active' : ''}`}>Forgot Password</Link>
            </>
          ) : (
            <>
              {userRole === 'admin' && (
                <Link
                  href="/dashboard/admin"
                  className={`navbar-link ${pathname === '/dashboard/admin' ? 'active' : ''}`}
                >
                  Admin Dashboard
                </Link>
              )}
              {userRole === 'user' && (
                <Link
                  href="/dashboard/user"
                  className={`navbar-link ${pathname === '/dashboard/user' ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="navbar-link">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
