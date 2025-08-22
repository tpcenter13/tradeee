'use client';

'use client';

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaBell, FaBars, FaTimes, FaHome, FaUsers, FaMapMarkerAlt, FaFileAlt, FaFlag } from 'react-icons/fa';
import styles from './page.module.css';
import ProfileDropdown from './components/ProfileDropdown';
import Dashboard from './components/Dashboard';
import dynamic from 'next/dynamic';

// Dynamically import components with SSR disabled
const UserManagement = dynamic(() => import('./components/UserManagement'), { ssr: false });
const UserLocations = dynamic(
  () => import('@/components/UserLocations'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

const Reports = dynamic(
  () => import('./components/Reports'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

// Sample user data
const sampleUsers = [
  {
    id: 1,
    name: 'Katkai',
    email: 'maricarcaratao11@gmail.com',
    zone: 'Zone 5',
    status: 'Active',
    lat: 14.2850,
    lng: 120.9982,
  },
  {
    id: 2,
    name: 'Car',
    email: '211327caratao@gmail.com',
    zone: 'Zone 3',
    status: 'Offline',
    lat: 14.2812,
    lng: 120.9955,
  },
  {
    id: 3,
    name: 'John Doe',
    email: 'john.doe@example.com',
    zone: 'Zone 5',
    status: 'Active',
    lat: 14.2830,
    lng: 120.9960,
  },
  {
    id: 4,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    zone: 'Zone 2',
    status: 'Active',
    lat: 14.2800,
    lng: 120.9930,
  },
  {
    id: 5,
    name: 'Mike Johnson',
    email: 'mike.j@example.com',
    zone: 'Zone 3',
    status: 'Offline',
    lat: 14.2860,
    lng: 120.9940,
  },
];

// Dynamically import the UserLocationMap component with SSR disabled
const UserLocationMap = dynamic(
  () => import('./components/UserLocationMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

export default function AdminDashboard() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('reports');
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaHome /> },
    { id: 'users', label: 'User Management', icon: <FaUsers /> },
    { id: 'locations', label: 'User Locations', icon: <FaMapMarkerAlt /> },
    { id: 'reports', label: 'Reports', icon: <FaFileAlt /> }
  ];
  
  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'locations':
        return <UserLocations />;
      case 'reports':
        return <Reports />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? 'open' : ''}`}>
        <div className={styles.logo}>
          TradeConnect
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <a
              key={item.id}
              href="#"
              className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.id);
              }}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={styles.mainWrapper}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button 
              className={styles.menuButton}
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder="Search..."
                className={styles.searchInput}
              />
              <FaSearch className={styles.searchIcon} />
            </div>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.notificationButton}>
              <FaBell />
              <span className={styles.notificationBadge}>3</span>
            </button>
            <ProfileDropdown />
          </div>
        </header>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}