// components/Header.js
import styles from '../app/dashboard/user/page.module.css';

export default function Header({
  user,
  unreadCount,
  showDropdown,
  setShowDropdown,
  setShowNotificationsModal,
  setShowSettingsModal,
  toggleMenu,
  generateAvatar,
  svgToDataUrl,
  logout,
  showToast,
  dropdownRef
}) {
  return (
    <header>
      <div >
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
       
        <div className={styles.topNav}>
          <div className={styles.searchBar} style={{marginLeft: 300}}>
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
                    onClick={() => { setShowSettingsModal(true); setShowDropdown(false); }}
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
      </div>
    </header>
  );
}