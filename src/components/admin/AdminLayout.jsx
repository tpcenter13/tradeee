'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import styles from '@/app/dashboard/admin/page.module.css';

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists() || userDoc.data().role !== 'admin') {
          router.push('/dashboard');
          return;
        }
        setUser(user);
      } catch (err) {
        console.error('Error verifying admin status:', err);
        setError('Failed to verify admin status');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessageBox}>
          <h2 className={styles.errorTitle}>Error</h2>
          <p className={styles.errorText}>{error}</p>
          <button 
            className={styles.errorButton}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.sidebarTitle}>Admin Panel</h1>
          <p className={styles.sidebarSubtitle}>TradeConnect</p>
        </div>
        <nav>
          <button 
            className={`${styles.navButton} ${styles.navButtonActive}`}
            onClick={() => router.push('/dashboard/admin')}
          >
            Dashboard
          </button>
          <button 
            className={styles.navButton}
            onClick={() => router.push('/dashboard/admin/users')}
          >
            User Management
          </button>
          <button 
            className={styles.navButton}
            onClick={() => router.push('/dashboard/admin/reports')}
          >
            Reports
          </button>
          <button 
            className={styles.navButton}
            onClick={() => router.push('/dashboard/admin/logs')}
          >
            Activity Logs
          </button>
        </nav>
        <button 
          className={styles.logoutButton}
          onClick={async () => {
            await auth.signOut();
            router.push('/login');
          }}
        >
          Logout
        </button>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
