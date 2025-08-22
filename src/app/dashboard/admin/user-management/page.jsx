'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaChevronDown, FaChevronUp, FaExclamationTriangle, FaTrash, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import styles from './UserManagement.module.css';

// Mock data - replace with API calls in production
const mockUsers = [
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
    email: '211327caratao@gmail.com',
    status: 'offline',
    zone: 'Zone 1',
    location: 'Manila, Metro Manila',
    locationValid: false,
    lastActive: '5 days ago',
    isOutOfZone: true
  },
  {
    id: 3,
    name: 'Juan Dela Cruz',
    email: 'juan.delacruz@example.com',
    status: 'active',
    zone: 'Zone 8',
    location: 'Bulihan, Silang, Cavite',
    locationValid: true,
    lastActive: '30 minutes ago',
    isOutOfZone: false
  },
  {
    id: 4,
    name: 'Maria Santos',
    email: 'maria.santos@example.com',
    status: 'active',
    zone: 'Zone 3',
    location: 'Bulihan, Silang, Cavite',
    locationValid: true,
    lastActive: '1 hour ago',
    isOutOfZone: false
  },
  {
    id: 5,
    name: 'Pedro Reyes',
    email: 'pedro.reyes@example.com',
    status: 'offline',
    zone: 'Zone 11',
    location: 'Makati City',
    locationValid: false,
    lastActive: '2 days ago',
    isOutOfZone: true
  }
];

const zones = [
  'All Zones',
  'Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5',
  'Zone 6', 'Zone 7', 'Zone 8', 'Zone 9', 'Zone 10', 'Zone 11'
];

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showZoneDropdown, setShowZoneDropdown] = useState(false);
  const [selectedZone, setSelectedZone] = useState('All Zones');
  const [warningModal, setWarningModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [users, setUsers] = useState([]);

  // Load users on component mount
  useEffect(() => {
    // In a real app, this would be an API call
    setUsers(mockUsers);
  }, []);

  // Filter users based on search query and selected zone
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = selectedZone === 'All Zones' || user.zone === selectedZone;
    return matchesSearch && matchesZone;
  });

  // Handle warning action
  const handleWarnUser = (user) => {
    setWarningModal({
      id: user.id,
      name: user.name,
      email: user.email,
      isOutOfZone: user.isOutOfZone
    });
  };
  
  // Handle delete action
  const handleDeleteUser = (user) => {
    setDeleteModal({
      id: user.id,
      name: user.name,
      email: user.email
    });
  };
  
  // State for edit location modal
  const [editModal, setEditModal] = useState(null);
  const [newZone, setNewZone] = useState('');
  const [newLocation, setNewLocation] = useState('');

  // Handle edit location action
  const handleEditLocation = (user) => {
    setEditModal({
      id: user.id,
      name: user.name,
      email: user.email,
      currentZone: user.zone,
      currentLocation: user.location,
      isOutOfZone: user.isOutOfZone
    });
    setNewZone(user.zone);
    setNewLocation(user.location);
  };

  // Save edited location
  const saveLocation = () => {
    if (!newZone || !newLocation) {
      alert('Please fill in all fields');
      return;
    }
    
    // Show success message
    const isInBulihan = newLocation.toLowerCase().includes('bulihan');
    const statusMessage = isInBulihan 
      ? 'User location updated and marked as within service area.' 
      : 'User location updated but marked as OUTSIDE service area.';
    
    alert(`Location updated for ${editModal.name}\n${statusMessage}`);

    const updatedUsers = users.map(user => {
      if (user.id === editModal.id) {
        const isInBulihan = newLocation.toLowerCase().includes('bulihan');
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

    setUsers(updatedUsers);
    setEditModal(null);
    setNewZone('');
    setNewLocation('');
  };
  
  // Handle confirm warning
  const sendWarning = () => {
    // In a real app, this would send a warning to the user
    console.log('Warning sent to:', warningModal.email);
    // Show success message
    alert(`Warning sent to ${warningModal.email}`);
    setWarningModal(null);
  };
  
  // Handle confirm delete
  const confirmDelete = () => {
    // In a real app, this would delete the user
    console.log('User deleted:', deleteModal.id);
    setUsers(users.filter(user => user.id !== deleteModal.id));
    setDeleteModal(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showZoneDropdown && !event.target.closest(`.${styles.zoneFilter}`)) {
        setShowZoneDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showZoneDropdown]);

  // Auto-close modals when pressing Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setWarningModal(null);
        setDeleteModal(null);
        setEditModal(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>User Management</h1>
        <p className={styles.subtitle}>Location-Based User Filtering & Monitoring</p>
      </div>

      {/* Search and Filter Controls */}
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
            {showZoneDropdown ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          
          {showZoneDropdown && (
            <div className={styles.zoneDropdown}>
              {zones.map((zone, index) => (
                <div
                  key={index}
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

      {/* Users Table */}
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id} className={styles.userRow}>
                  <td>
                    <div className={styles.userInfo}>
                      <div className={styles.userInitial}>{user.name.charAt(0)}</div>
                      <div>
                        <div className={styles.userName}>{user.name}</div>
                        {user.isOutOfZone && (
                          <span className={styles.outOfZoneBadge}>
                            🚫 Out of Service Area
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${user.status === 'active' ? styles.statusActive : styles.statusOffline}`}>
                      {user.status === 'active' ? '🟢 Active' : '🔴 Offline'}
                    </span>
                  </td>
                  <td>{user.zone}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button 
                        className={`${styles.actionButton} ${styles.warnButton} ${styles.tooltip}`}
                        onClick={() => handleWarnUser(user)}
                        data-tooltip="Send Warning"
                      >
                        <FaExclamationTriangle />
                        <span className={styles.tooltipText}>Send Warning</span>
                      </button>
                      <button 
                        className={`${styles.actionButton} ${styles.deleteButton} ${styles.tooltip}`}
                        onClick={() => handleDeleteUser(user)}
                        data-tooltip="Delete User"
                      >
                        <FaTrash />
                        <span className={styles.tooltipText}>Delete User</span>
                      </button>
                      <button 
                        className={`${styles.actionButton} ${styles.editButton} ${styles.tooltip}`}
                        onClick={() => handleEditLocation(user)}
                        data-tooltip="Edit Location"
                      >
                        <FaMapMarkerAlt />
                        <span className={styles.tooltipText}>Edit Location</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className={styles.noResults}>
                  No users found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Warning Modal */}
      {warningModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>⚠️ Warning</h3>
            {warningModal.isOutOfZone ? (
              <>
                <p>This user is not from Bulihan, Silang, Cavite.</p>
                <p>You may warn them to update or clarify their location.</p>
              </>
            ) : (
              <p>Send a warning to <strong>{warningModal.name}</strong>?</p>
            )}
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
            <p>Are you sure you want to remove <strong>{deleteModal.name}</strong>?</p>
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
            <h3>✏️ Edit Location: {editModal.name}</h3>
            
            <div className={styles.formGroup}>
              <label>Zone</label>
              <select 
                className={styles.selectInput}
                value={newZone}
                onChange={(e) => setNewZone(e.target.value)}
              >
                {zones.filter(zone => zone !== 'All Zones').map((zone, index) => (
                  <option key={index} value={zone}>{zone}</option>
                ))}
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label>Full Address</label>
              <input
                type="text"
                className={styles.textInput}
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Enter full address"
              />
            </div>
            
            {!newLocation.toLowerCase().includes('bulihan') && (
              <div className={styles.warningBox}>
                <FaExclamationTriangle className={styles.warningIcon} />
                <span>This address is outside Bulihan, Silang, Cavite. The user will be marked as out of service area.</span>
              </div>
            )}
            
            <div className={styles.modalActions}>
              <button 
                className={styles.primaryButton}
                onClick={saveLocation}
              >
                Save Changes
              </button>
              <button 
                className={styles.secondaryButton}
                onClick={() => setEditModal(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
