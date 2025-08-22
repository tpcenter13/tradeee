'use client';

import { useState, useRef } from 'react';
import styles from '../../app/dashboard/user/page.module.css';
import { useAppActions, useAppState } from '@/app/context/AppContext';


export default function Header() {
  const { user } = useAppState();
  const { logout } = useAppActions();

  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // Replace with real unread count if available
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    // Add mobile sidebar/menu logic here
  };

  const generateAvatar = (username) => {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="32">${username?.charAt(0).toUpperCase() || 'U'}</text></svg>`;
  };

  const svgToDataUrl = (svg) => {
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const showToast = (msg, type = 'info') => {
    alert(`${type.toUpperCase()}: ${msg}`);
  };

  return (
    <header style={{width: '100%'}}>
      <div>
        {/* Mobile Header */}
        <div className={styles.mobileHeader}>
          <button className={styles.menuButton} onClick={toggleMenu} aria-label="Toggle menu">
            <i className="fas fa-bars"></i>
          </button>
          <div className={styles.mobileLogo}>
            <div className={styles.logo}>
              <img src="/logo.png" alt="Logo" onError={(e) => e.target.src = '/default-avatar.png'} />
            </div>
            <span>TradeConnect</span>
          </div>
          <div className={styles.mobileUser} onClick={() => setShowDropdown(!showDropdown)}>
            <img
              src={user?.photoURL || svgToDataUrl(generateAvatar(user?.username))}
              alt="Profile"
              className={styles.userAvatar}
            />
          </div>
        </div>

        {/* Top Navigation */}
        <div className={styles.topNav}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search for items or users..."
              suppressHydrationWarning
            />
            <i className="fas fa-search"></i>
          </div>

          <div className={styles.userActions}>
            <div className={styles.notification} onClick={() => setShowNotificationsModal(true)}>
              <i className="fas fa-bell"></i>
              {unreadCount > 0 && (
                <span className={styles.notificationBadge}>{unreadCount}</span>
              )}
            </div>

            <div className={styles.userProfile} ref={dropdownRef}>
              <div className={styles.userInfo} onClick={() => setShowDropdown(!showDropdown)}>
                <img
                  src={user?.photoURL || svgToDataUrl(generateAvatar(user?.username))}
                  alt="Profile"
                  className={styles.userAvatar}
                />
                <div className={styles.userText}>
                  <span className={styles.userName}>{user?.nickname || user?.displayName || 'User'}</span>
                  <span className={styles.userEmail}>{user?.email}</span>
                </div>
              </div>

              {showDropdown && (
                <div className={styles.userDropdown}>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => {
                      setShowSettingsModal(true);
                      setShowDropdown(false);
                    }}
                  >
                    <i className="fas fa-cog"></i> Settings
                  </button>
                  <button
                    className={styles.dropdownItem}
                    onClick={async () => {
                      try {
                        const { signOut } = await import('firebase/auth');
                        const { auth } = await import('@/lib/firebase');
                        await signOut(auth);
                        logout();
                        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                        window.location.href = '/login';
                      } catch (error) {
                        console.error('Error signing out:', error);
                        showToast('Failed to sign out', 'error');
                      }
                    }}
                  >
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modals (optional placeholder — implement as needed) */}
        {showNotificationsModal && <div>Notification Modal (placeholder)</div>}
        {showSettingsModal && <div>Settings Modal (placeholder)</div>}
      </div>
    </header>
  );
}
