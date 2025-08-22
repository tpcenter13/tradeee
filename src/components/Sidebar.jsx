import styles from '../app/dashboard/user/page.module.css';

export default function Sidebar({
  activeSection,
  setActiveSection,
  isMenuOpen,
  setIsMenuOpen,
  unreadCount
}) {
  return (
    <div className={`${styles.sidebar} ${isMenuOpen ? styles.open : ''}`}>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="Logo" onError={(e) => e.target.src = '/default-avatar.png'} />
        </div>
        <span className={styles.logoText}>TradeConnect</span>
      </div>
      <ul className={styles.navMenu}>
        <li className={styles.navItem}>
          <button 
            className={`${styles.navLink} ${activeSection === 'home' ? styles.active : ''}`}
            onClick={() => { setActiveSection('home'); setIsMenuOpen(false); }}
          >
            <i className="fas fa-home"></i>
            <span>Home</span>
          </button>
        </li>
        <li className={styles.navItem}>
          <button 
            className={`${styles.navLink} ${activeSection === 'profile' ? styles.active : ''}`}
            onClick={() => { setActiveSection('profile'); setIsMenuOpen(false); }}
          >
            <i className="fas fa-user"></i>
            <span>Profile</span>
          </button>
        </li>
        <li className={styles.navItem}>
          <button 
            className={`${styles.navLink} ${activeSection === 'messages' ? styles.active : ''}`}
            onClick={() => { setActiveSection('messages'); setIsMenuOpen(false); }}
          >
            <i className="fas fa-comments"></i>
            <span>Messages</span>
            {unreadCount > 0 && (
              <span className={styles.sidebarNotificationBadge}>{unreadCount}</span>
            )}
          </button>
        </li>
        <li className={styles.navItem}>
          <button 
            className={`${styles.navLink} ${activeSection === 'marketplace' ? styles.active : ''}`}
            onClick={() => { setActiveSection('marketplace'); setIsMenuOpen(false); }}
          >
            <i className="fas fa-store"></i>
            <span>Marketplace</span>
          </button>
        </li>
        <li className={styles.navItem}>
          <button 
            className={`${styles.navLink} ${activeSection === 'community' ? styles.active : ''}`}
            onClick={() => { setActiveSection('community'); setIsMenuOpen(false); }}
          >
            <i className="fas fa-users"></i>
            <span>Community Forum</span>
          </button>
        </li>
        <li className={styles.navItem}>
          <button 
            className={`${styles.navLink} ${activeSection === 'help' ? styles.active : ''}`}
            onClick={() => { setActiveSection('help'); setIsMenuOpen(false); }}
          >
            <i className="fas fa-question-circle"></i>
            <span>Help Center</span>
          </button>
        </li>
      </ul>
    </div>
  );
}