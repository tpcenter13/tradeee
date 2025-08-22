'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaChevronDown, FaChevronUp, FaExclamationTriangle, FaTrash, FaMapMarkerAlt, FaEdit, FaTimes } from 'react-icons/fa';
import styles from './UserManagement.module.css';

// Mock data - replace with actual API calls
const mockUsers = [
  {
    id: 1,
    name: 'Katkai',
    email: 'maricarcaratao11@gmail.com',
    status: 'active',
    zone: 'Zone 5',
    locationValid: true,
    lastActive: '2 hours ago'
  },
  {
    id: 2,
    name: 'Car',
    email: '11327caratao@gmail.com',
    status: 'offline',
    zone: 'Zone 1',
    locationValid: true,
    lastActive: '5 days ago'
  },
  // Add more mock users as needed
];

const zones = [
  'All Zones',
  'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5',
  'Zone 6', 'Zone 7', 'Zone 8', 'Zone 9', 'Zone 10', 'Zone 11'
];

export default function UserManagement() {
  // State for search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [showZoneDropdown, setShowZoneDropdown] = useState(false);
  const [selectedZone, setSelectedZone] = useState('All Zones');
  const [warningModal, setWarningModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [mockUsers, setMockUsers] = useState([
    {
      id: 1,
      name: 'Katkai',
      email: 'maricarcaratao11@gmail.com',
      status: 'active',
      zone: 'Zone 5',
      location: 'Bulihan, Silang, Cavite',
      locationValid: true,
      lastActive: '2 hours ago',
      isOutOfZone: false
    },
    {
      id: 2,
      name: 'Car',
      email: '11327caratao@gmail.com',
      status: 'offline',
      zone: 'Zone 1',
      location: 'Manila, Metro Manila',
      locationValid: false,
      lastActive: '5 days ago',
      isOutOfZone: true
    },
    // Add more mock users as needed
  ]);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowZoneDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Filter users based on search query and selected zone
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = selectedZone === 'All Zones' || user.zone === selectedZone;
    return matchesSearch && matchesZone;
  });
  
  // Handle warning action
  const handleWarnUser = (userId) => {
    const user = mockUsers.find(u => u.id === userId);
    setWarningModal({
      id: userId,
      name: user.name,
      email: user.email
    });
  };
  
  // Handle delete action
  const handleDeleteUser = (userId) => {
    const user = mockUsers.find(u => u.id === userId);
    setDeleteModal({
      id: userId,
      name: user.name,
      email: user.email
    });
  };
  
  // State for edit location modal
  const [editModal, setEditModal] = useState(null);
  const [newLocation, setNewLocation] = useState('');
  const [newZone, setNewZone] = useState('');
  
  // Handle edit location action
  const handleEditLocation = (user) => {
    setEditModal({
      id: user.id,
      name: user.name,
      email: user.email,
      currentZone: user.zone,
      currentLocation: user.location || '',
      isOutOfZone: !user.locationValid
    });
    setNewZone(user.zone);
    setNewLocation(user.location || '');
  };
  
  // Save edited location
  const saveLocation = () => {
    if (!newZone || !newLocation) {
      alert('Please fill in all fields');
      return;
    }
    
    // Check if location is in Bulihan
    const isInBulihan = newLocation.toLowerCase().includes('bulihan');
    
    // In a real app, this would be an API call to update the user's location
    const updatedUsers = mockUsers.map(user => {
      if (user.id === editModal.id) {
        return {
          ...user,
          zone: newZone,
          location: newLocation,
          locationValid: isInBulihan,
          isOutOfZone: !isInBulihan
        };
      }
      return user;
    });
    
    // Update the users list
    setMockUsers(updatedUsers);
    
    // Show success message
    const statusMessage = isInBulihan 
      ? 'User location updated and marked as within service area.' 
      : 'User location updated but marked as OUTSIDE service area.';
    
    alert(`Location updated for ${editModal.name}\n${statusMessage}`);
    
    // Close the modal
    setEditModal(null);
    setNewZone('');
    setNewLocation('');
  };
  
  // Handle confirm warning
  const sendWarning = () => {
    // In a real app, this would send a warning to the user
    console.log('Warning sent to:', warningModal.email);
    setWarningModal(null);
  };
  
  // Handle confirm delete
  const confirmDelete = () => {
    // In a real app, this would delete the user
    console.log('User deleted:', deleteModal.id);
    setDeleteModal(null);
  };

  return (
    <div className={styles.userManagement}>
      <div className={styles.header}>
        <h1>User Management</h1>
        <div className={styles.controls}>
          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.zoneFilter}>
            <button 
              className={styles.zoneDropdownButton}
              onClick={() => setShowZoneDropdown(!showZoneDropdown)}
            >
              Filter by Zone: {selectedZone}
              <span className={styles.dropdownArrow}>▼</span>
            </button>
            {showZoneDropdown && (
              <div className={styles.zoneDropdown}>
                {zones.map(zone => (
                  <div
                    key={zone}
                    className={`${styles.zoneItem} ${zone === selectedZone ? styles.selectedZone : ''}`}
                    onClick={() => {
                      setSelectedZone(zone);
                      setShowZoneDropdown(false);
                    }}
                  >
                    {zone}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Zone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className={styles.userRow}>
                <td>
                  <div className={styles.userInfo}>
                    <div className={styles.userInitial}>{user.name.charAt(0)}</div>
                    <div>
                      <div className={styles.userName}>{user.name}</div>
                      {!user.locationValid && (
                        <span className={styles.outOfZoneBadge}>🚫 Out of Service Area</span>
                      )}
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`${styles.statusBadge} ${user.status === 'active' ? styles.active : styles.offline}`}>
                    {user.status === 'active' ? '🟢 Active' : '🔴 Offline'}
                  </span>
                </td>
                <td>{user.zone}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button 
                      className={styles.warnButton}
                      onClick={() => handleWarnUser(user.id)}
                      title="Send Warning"
                    >
                      <FaExclamationTriangle />
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDeleteUser(user.id)}
                      title="Delete User"
                    >
                      <FaTrash />
                    </button>
                    <button 
                      className={styles.editButton}
                      title="Edit Location"
                      onClick={() => handleEditLocation(user)}
                    >
                      <FaEdit />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Warning Modal */}
      {warningModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>⚠️ Warning</h3>
            <p>This will send a warning to <strong>{warningModal.name}</strong> ({warningModal.email}).</p>
            <p>Please confirm you want to send this warning.</p>
            <div className={styles.modalActions}>
              <button 
                className={styles.primaryButton}
                onClick={sendWarning}
              >
                Send Warning
              </button>
              <button 
                className={styles.secondaryButton}
                onClick={() => setWarningModal(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>⚠️ Delete User</h3>
            <p>Are you sure you want to remove <strong>{deleteModal.name}</strong> ({deleteModal.email})?</p>
            <p><strong>This action cannot be undone.</strong></p>
            <div className={styles.modalActions}>
              <button 
                className={styles.dangerButton}
                onClick={confirmDelete}
              >
                Confirm Delete
              </button>
              <button 
                className={styles.secondaryButton}
                onClick={() => setDeleteModal(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Location Modal */}
      {editModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>
              <FaMapMarkerAlt /> Edit Location: {editModal.name}
              {newLocation.toLowerCase().includes('bulihan') ? (
                <span className={styles.locationStatus}>
                  <span>Within Service Area</span>
                </span>
              ) : (
                <span className={`${styles.locationStatus} ${styles.outside}`}>
                  <span>Outside Service Area</span>
                </span>
              )}
            </h3>
            
            <div className={styles.formGroup}>
              <label>
                <FaMapMarkerAlt /> Zone
              </label>
              <select 
                className={styles.selectInput}
                value={newZone}
                onChange={(e) => setNewZone(e.target.value)}
              >
                {zones.filter(zone => zone !== 'All Zones').map(zone => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label>
                <FaMapMarkerAlt /> Full Address
              </label>
              <input
                type="text"
                className={styles.textInput}
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Enter full address (e.g., Bulihan, Silang, Cavite)"
              />
              <div className={styles.helpText}>
                {newLocation.toLowerCase().includes('bulihan') ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>This address is within Bulihan service area.</span>
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>This address appears to be outside Bulihan service area.</span>
                  </>
                )}
              </div>
              
              {!newLocation.toLowerCase().includes('bulihan') && (
                <div className={`${styles.helpText} ${styles.warning}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  <span>Users outside Bulihan will be marked as "Out of Service Area".</span>
                </div>
              )}
            </div>
            
            <div className={styles.modalActions}>
              <button 
                className={styles.secondaryButton}
                onClick={() => setEditModal(null)}
              >
                <FaTimes /> Cancel
              </button>
              <button 
                className={styles.primaryButton}
                onClick={saveLocation}
                disabled={!newZone || !newLocation}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
