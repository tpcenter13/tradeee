import styles from '../app/dashboard/user/page.module.css';

export default function NotificationsModal({
  notifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  operationInProgress,
  setShowNotificationsModal,
  setActiveSection,
  setActiveProfileTab,
  unreadCount
}) {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button 
          className={styles.close} 
          onClick={() => !operationInProgress && setShowNotificationsModal(false)} 
          aria-label="Close modal"
          disabled={operationInProgress}
        >
          &times;
        </button>
        <h3>Notifications {unreadCount > 0 && `(${unreadCount} unread)`}</h3>
        <div className={styles.notificationActions}>
          <button 
            className={styles.btnSubmit}
            onClick={() => !operationInProgress && markAllAsRead()}
            disabled={operationInProgress || notifications.length === 0}
          >
            <i className="fas fa-check-double"></i> Mark All as Read
          </button>
        </div>
        <div className={styles.notificationsList}>
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`${styles.notificationItem} ${notification.read ? '' : styles.unread}`}
                onClick={() => {
                  if (!operationInProgress && !notification.read) {
                    markAsRead(notification.id);
                  }
                  if (notification.type === 'trade') {
                    setActiveSection('profile');
                    setActiveProfileTab('trades');
                    setShowNotificationsModal(false);
                  }
                }}
              >
                <div className={styles.notificationContent}>
                  <i className={`fas fa-${notification.type === 'trade' ? 'exchange-alt' : 'bell'}`}></i>
                  <div>
                    <p>{notification.message}</p>
                    <span className={styles.notificationTime}>
                      {notification.createdAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {' • '}
                      {notification.createdAt?.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button 
                  className={styles.deleteNotification}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!operationInProgress) {
                      deleteNotification(notification.id);
                    }
                  }}
                  disabled={operationInProgress}
                  aria-label="Delete notification"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <i className="fas fa-bell-slash"></i>
              <p>No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}