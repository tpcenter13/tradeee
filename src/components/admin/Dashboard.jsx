'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import styles from '@/app/dashboard/admin/page.module.css';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTrades: 0,
    totalReports: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch total users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const activeUsers = usersSnapshot.docs.filter(
          doc => doc.data().lastActiveAt?.toDate() > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length;

        // Fetch total trades (adjust collection name as needed)
        const tradesSnapshot = await getDocs(collection(db, 'trades'));
        
        // Fetch active reports
        const reportsQuery = query(
          collection(db, 'reports'),
          where('status', '==', 'pending')
        );
        const reportsSnapshot = await getDocs(reportsQuery);

        setStats({
          totalUsers: usersSnapshot.size,
          activeUsers,
          totalTrades: tradesSnapshot.size,
          totalReports: reportsSnapshot.size,
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.pageTitle}>Dashboard Overview</h1>
      
      <div className={styles.statsGrid}>
        <div className={`${styles.card} ${styles.cardBlue}`}>
          <h3>Total Users</h3>
          <p className={styles.statValue}>{stats.totalUsers}</p>
          <p className={styles.statLabel}>Registered users</p>
        </div>
        
        <div className={`${styles.card} ${styles.cardGreen}`}>
          <h3>Active Users</h3>
          <p className={styles.statValue}>{stats.activeUsers}</p>
          <p className={styles.statLabel}>Active in last 30 days</p>
        </div>
        
        <div className={`${styles.card} ${styles.cardYellow}`}>
          <h3>Total Trades</h3>
          <p className={styles.statValue}>{stats.totalTrades}</p>
          <p className={styles.statLabel}>All-time trades</p>
        </div>
        
        <div className={`${styles.card} ${styles.cardRed}`}>
          <h3>Pending Reports</h3>
          <p className={styles.statValue}>{stats.totalReports}</p>
          <p className={styles.statLabel}>Requires attention</p>
        </div>
      </div>
      
      {/* Add more dashboard widgets as needed */}
      <div className={styles.recentActivity}>
        <h2>Recent Activity</h2>
        <div className={styles.activityList}>
          {/* Activity items will be added here */}
          <p className={styles.noActivity}>No recent activity</p>
        </div>
      </div>
    </div>
  );
}
