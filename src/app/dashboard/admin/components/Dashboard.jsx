'use client';

import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  return (
    <>
      <div className={styles.headerSection}>
        <div>
          <h1>Dashboard</h1>
          <p className={styles.welcomeText}>Welcome to Admin Dashboard</p>
        </div>
      </div>
      
      {}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Total Users</span>
            <span className={styles.statValue}>4</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#10B981' }}>🟢</div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Active Users</span>
            <span className={styles.statValue}>1</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#3B82F6' }}>📈</div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Total Trades</span>
            <span className={styles.statValue}>0</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#F59E0B' }}>🏆</div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Reports</span>
            <span className={styles.statValue}>2</span>
          </div>
        </div>
      </div>
      
      {}
      <div className={styles.card}>
        <div 
          className={styles.cardHeader} 
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
        >
          <h2 className={styles.cardTitle}>
            {isCategoryOpen ? <FaChevronUp className={styles.dropdownIcon} /> : <FaChevronDown className={styles.dropdownIcon} />}
            Best Sell by Category (Weekly)
            <span className={styles.clickHint}>(click to {isCategoryOpen ? 'collapse' : 'expand'})</span>
          </h2>
        </div>
        
        {isCategoryOpen && (
          <div className={styles.cardBody}>
            <div className={styles.categoryList}>
              {['👗 Fashion & Apparel', '📱 Electronics', '🍔 Food & Beverages', '🔨 DIY & Hardware', '💄 Health & Beauty'].map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <div className={styles.categoryDivider}>›</div>}
                  <div className={styles.categoryItem}>
                    {item}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Recent Users</h2>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.tableContainer}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th className={styles.tableHeader}>Name</th>
                  <th className={styles.tableHeader}>Email</th>
                  <th className={styles.tableHeader}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <div className={styles.userInfo}>
                      <span className={styles.userInitial}>K</span>
                      <span>Katkai</span>
                    </div>
                  </td>
                  <td className={styles.tableCell}>maricarcaratao11@gmail.com</td>
                  <td className={styles.tableCell}>
                    <span className={styles.statusBadgeActive}>Active</span>
                  </td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <div className={styles.userInfo}>
                      <span className={styles.userInitial}>C</span>
                      <span>car</span>
                    </div>
                  </td>
                  <td className={styles.tableCell}>11327caratao@gmail.com</td>
                  <td className={styles.tableCell}>
                    <span className={styles.statusBadgeOffline}>Offline</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
