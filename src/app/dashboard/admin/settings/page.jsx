'use client';

import { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaBell, FaMoon, FaSun, FaGlobe, FaCalendarAlt, FaArrowLeft, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import styles from './settings.module.css';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    newReports: true,
    emailNotifications: true,
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Handle password change logic here
    alert('Password updated successfully!');
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Handle email update logic here
    alert('Email updated successfully!');
  };

  const toggleNotification = (setting) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/dashboard/admin" className={styles.backButton}>
          <FaArrowLeft className={styles.backIcon} />
          Back to Dashboard
        </Link>
        <h1 className={styles.pageTitle}>Admin Settings</h1>
      </div>
      
      <div className={styles.settingsContainer}>
        {/* Sidebar Navigation */}
        <div className={styles.sidebar}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'account' ? styles.active : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <FaUser className={styles.tabIcon} />
            Account Settings
          </button>
          
          <button 
            className={`${styles.tabButton} ${activeTab === 'notifications' ? styles.active : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <FaBell className={styles.tabIcon} />
            Notifications
          </button>
          
          <button 
            className={`${styles.tabButton} ${activeTab === 'appearance' ? styles.active : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            {darkMode ? (
              <FaSun className={styles.tabIcon} />
            ) : (
              <FaMoon className={styles.tabIcon} />
            )}
            Appearance
          </button>
          
          <button 
            className={`${styles.tabButton} ${activeTab === 'preferences' ? styles.active : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <FaGlobe className={styles.tabIcon} />
            Preferences
          </button>
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          {activeTab === 'account' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <FaLock className={styles.sectionIcon} />
                Change Password
              </h2>
              <form onSubmit={handlePasswordSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="currentPassword">Current Password</label>
                  <input 
                    type="password" 
                    id="currentPassword" 
                    required 
                    className={styles.input}
                    placeholder="Enter current password"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="newPassword">New Password</label>
                  <input 
                    type="password" 
                    id="newPassword" 
                    required 
                    minLength="8"
                    className={styles.input}
                    placeholder="Enter new password"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    required 
                    minLength="8"
                    className={styles.input}
                    placeholder="Confirm new password"
                  />
                </div>
                
                <button type="submit" className={styles.primaryButton}>
                  Update Password
                </button>
              </form>

              <h2 className={styles.sectionTitle} style={{ marginTop: '2.5rem' }}>
                <FaEnvelope className={styles.sectionIcon} />
                Update Email Address
              </h2>
              <form onSubmit={handleEmailSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="currentEmail">Current Email</label>
                  <input 
                    type="email" 
                    id="currentEmail" 
                    value="admin@example.com"
                    disabled
                    className={`${styles.input} ${styles.disabledInput}`}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="newEmail">New Email Address</label>
                  <input 
                    type="email" 
                    id="newEmail" 
                    required 
                    className={styles.input}
                    placeholder="Enter new email address"
                  />
                </div>
                
                <button type="submit" className={styles.primaryButton}>
                  Update Email
                </button>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <FaBell className={styles.sectionIcon} />
                Notification Preferences
              </h2>
              
              <div className={styles.toggleGroup}>
                <div className={styles.toggleItem}>
                  <div>
                    <h3 className={styles.toggleTitle}>New Reports</h3>
                    <p className={styles.toggleDescription}>Receive notifications for new reports submitted</p>
                  </div>
                  <label className={styles.switch}>
                    <input 
                      type="checkbox" 
                      checked={notifications.newReports}
                      onChange={() => toggleNotification('newReports')}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
                
                <div className={styles.toggleItem}>
                  <div>
                    <h3 className={styles.toggleTitle}>Email Notifications</h3>
                    <p className={styles.toggleDescription}>Receive email notifications for important updates</p>
                  </div>
                  <label className={styles.switch}>
                    <input 
                      type="checkbox" 
                      checked={notifications.emailNotifications}
                      onChange={() => toggleNotification('emailNotifications')}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                {darkMode ? (
                  <FaSun className={styles.sectionIcon} />
                ) : (
                  <FaMoon className={styles.sectionIcon} />
                )}
                Appearance
              </h2>
              
              <div className={styles.toggleGroup}>
                <div className={styles.toggleItem}>
                  <div>
                    <h3 className={styles.toggleTitle}>Dark Mode</h3>
                    <p className={styles.toggleDescription}>Enable dark theme for better visibility in low-light conditions</p>
                  </div>
                  <label className={styles.switch}>
                    <input 
                      type="checkbox" 
                      checked={darkMode}
                      onChange={() => setDarkMode(!darkMode)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <FaGlobe className={styles.sectionIcon} />
                Language & Region
              </h2>
              
              <div className={styles.formGroup}>
                <label htmlFor="language">Language</label>
                <select id="language" className={styles.select}>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="ja">日本語</option>
                </select>
              </div>
              
              <h2 className={styles.sectionTitle} style={{ marginTop: '2.5rem' }}>
                <FaCalendarAlt className={styles.sectionIcon} />
                Date & Time
              </h2>
              
              <div className={styles.formGroup}>
                <label htmlFor="timezone">Timezone</label>
                <select id="timezone" className={styles.select}>
                  <option value="UTC">(UTC) Coordinated Universal Time</option>
                  <option value="PST">(UTC-8) Pacific Time</option>
                  <option value="EST">(UTC-5) Eastern Time</option>
                  <option value="CET">(UTC+1) Central European Time</option>
                  <option value="JST">(UTC+9) Japan Standard Time</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="dateFormat">Date Format</label>
                <select id="dateFormat" className={styles.select}>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
