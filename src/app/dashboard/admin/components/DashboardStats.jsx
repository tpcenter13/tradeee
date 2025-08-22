'use client';

import { FaUsers, FaUserCheck, FaExchangeAlt, FaExclamationCircle } from 'react-icons/fa';
import styles from './DashboardStats.module.css';

const stats = [
  {
    title: 'Total Users',
    value: '1,234',
    icon: <FaUsers className={styles.icon} />,
    color: '#4f46e5',
    trend: '+12% from last month',
  },
  {
    title: 'Active Users',
    value: '856',
    icon: <FaUserCheck className={styles.icon} />,
    color: '#10b981',
    trend: '+5% from last week',
  },
  {
    title: 'Total Trades',
    value: '3,456',
    icon: <FaExchangeAlt className={styles.icon} />,
    color: '#f59e0b',
    trend: '+8% from last month',
  },
  {
    title: 'Reports',
    value: '42',
    icon: <FaExclamationCircle className={styles.icon} />,
    color: '#ef4444',
    trend: '3 new today',
  },
];

const DashboardStats = () => {
  return (
    <div className={styles.statsContainer}>
      {stats.map((stat, index) => (
        <div key={index} className={styles.statCard}>
          <div className={styles.iconContainer} style={{ backgroundColor: `${stat.color}15` }}>
            {stat.icon}
          </div>
          <div className={styles.statContent}>
            <span className={styles.statTitle}>{stat.title}</span>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statTrend} style={{ color: stat.color }}>
              {stat.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
