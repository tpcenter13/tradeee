'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaUser, FaCog, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import styles from './ProfileDropdown.module.css';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      // Call your logout API endpoint if you have one
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        // Clear any client-side auth state
        localStorage.removeItem('adminToken');
        
        // Redirect to home page
        window.location.href = '/login';
      } else {
        console.error('Logout failed');
        // Still redirect to home even if API call fails
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Still redirect to home even if there's an error
      window.location.href = '/login';
    }
  };

  return (
    <div className={styles.profileDropdown} ref={dropdownRef}>
      <button className={styles.profileButton} onClick={toggleDropdown}>
        <div className={styles.profileInfo}>
          <span className={styles.profileName}>Admin User</span>
          <FaChevronDown className={`${styles.chevron} ${isOpen ? styles.rotated : ''}`} />
        </div>
        <div className={styles.profileInitial}>A</div>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <Link href="/dashboard/admin/settings" className={styles.dropdownItem}>
            <FaUser className={styles.dropdownIcon} />
            <span>Admin Profile</span>
          </Link>
          <Link href="/dashboard/admin/settings" className={styles.dropdownItem}>
            <FaCog className={styles.dropdownIcon} />
            <span>Settings</span>
          </Link>
          <div className={styles.divider}></div>
          <button className={styles.dropdownItem} onClick={handleLogout}>
            <FaSignOutAlt className={styles.dropdownIcon} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
