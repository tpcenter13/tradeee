import styles from '../app/dashboard/user/page.module.css';

export default function TradeRequestCard({
  trade,
  user,
  respondToTrade,
  setActiveSection,
  setSelectedChatUser,
  chatUsers,
  operationInProgress
}) {
  return (
    <div className={styles.tradeRequestCard}>
      <div className={styles.tradeStatus}>
        <span className={`${styles.statusBadge} ${
          trade.status === 'accepted' ? styles.accepted : 
          trade.status === 'declined' ? styles.declined : 
          styles.pending
        }`}>
          {trade.status}
        </span>
      </div>
      <div className={styles.tradeItems}>
        <div className={styles.tradeItem}>
          <h4>Your Item</h4>
          <img src="https://placehold.co/300x200?text=Your+Item" alt="Offered Item" />
          <h4>Bluetooth Speaker</h4>
        </div>
        <div className={styles.tradeArrow}>
          <i className="fas fa-exchange-alt"></i>
        </div>
        <div className={styles.tradeItem}>
          <h4>Their Item</h4>
          <img src="https://placehold.co/300x200?text=Their+Item" alt="Requested Item" />
          <h4>Nike Shoes</h4>
        </div>
      </div>
      <div className={styles.tradeActions}>
        {trade.status === 'pending' && trade.participants[0] === user.uid && (
          <>
            <button 
              className={`${styles.tradeBtn} ${styles.accept}`}
              onClick={() => respondToTrade(trade.id, 'accepted')}
              disabled={operationInProgress}
            >
              <i className="fas fa-check"></i> Accept
            </button>
            <button 
              className={`${styles.tradeBtn} ${styles.decline}`}
              onClick={() => respondToTrade(trade.id, 'declined')}
              disabled={operationInProgress}
            >
              <i className="fas fa-times"></i> Decline
            </button>
          </>
        )}
        <button 
          className={`${styles.tradeBtn} ${styles.message}`}
          onClick={() => {
            setActiveSection('messages');
            setSelectedChatUser(chatUsers[0]);
          }}
          disabled={operationInProgress}
        >
          <i className="fas fa-comment"></i> Message
        </button>
      </div>
    </div>
  );
}