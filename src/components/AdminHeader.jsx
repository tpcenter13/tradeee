'use client';

import { useState, useRef, useEffect } from 'react';
import styles from '../app/dashboard/admin/page.module.css';

const AdminHeader = ({ title, notifications = [], unreadCount = 0 }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notificationsRef = useRef(null);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.topNav}>
      <h1 className={styles.pageTitle}>{title}</h1>
      
      <div className={styles.searchContainer}>
        <div className={styles.searchInput}>
          <svg 
            className={styles.searchIcon} 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInputField}
          />
        </div>
      </div>
      
      <div className={styles.headerActions}>
        <div className={styles.notificationWrapper} ref={notificationsRef}>
          <button 
            className={styles.notificationButton}
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <i className="fas fa-bell"></i>
            {unreadCount > 0 && (
              <span className={styles.notificationBadge}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className={styles.notificationDropdown}>
              <div className={styles.notificationHeader}>
                <h3>Notifications</h3>
                <button 
                  className={styles.markAllRead}
                  onClick={() => {}}
                >
                  Mark all as read
                </button>
              </div>
              <div className={styles.notificationList}>
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div key={notification.id} className={styles.notificationItem}>
                      <p>{notification.message}</p>
                      <span className={styles.notificationTime}>{notification.time}</span>
                    </div>
                  ))
                ) : (
                  <p className={styles.noNotifications}>No new notifications</p>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.profileMenu}>
          <button 
            className={styles.profileButton}
            onClick={() => setShowDropdown(!showDropdown)}
            aria-label="User menu"
          >
            <div className={styles.avatar}>
              <i className="fas fa-user"></i>
            </div>
            <span>Admin</span>
            <i className={`fas fa-chevron-down ${styles.dropdownIcon}`}></i>
          </button>
          
          {showDropdown && (
            <div className={styles.dropdownMenu}>
              <button className={styles.dropdownItem}>
                <i className="fas fa-user"></i> Profile
              </button>
              <button className={styles.dropdownItem}>
                <i className="fas fa-cog"></i> Settings
              </button>
              <button className={styles.dropdownItem}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
