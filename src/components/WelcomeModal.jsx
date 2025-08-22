import styles from '../app/dashboard/user/page.module.css';

export default function WelcomeModal({
  startTour,
  operationInProgress,
  setShowWelcomeModal
}) {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button 
          className={styles.close} 
          onClick={() => !operationInProgress && setShowWelcomeModal(false)} 
          aria-label="Close modal"
          disabled={operationInProgress}
        >
          &times;
        </button>
        <h3>Welcome to TradeConnect!</h3>
        <p>Discover how to buy, sell, and trade items in your community.</p>
        <div className={styles.welcomeContent}>
          <p>TradeConnect is your local marketplace to connect with others, share items, and join community discussions.</p>
          <ul>
            <li>Explore the Marketplace to find items for sale or trade.</li>
            <li>Connect with others through the Community Forum.</li>
            <li>Manage your profile and trade requests in one place.</li>
          </ul>
        </div>
        <div className={styles.welcomeActions}>
          <button 
            className={styles.btnSubmit}
            onClick={() => !operationInProgress && startTour()}
            disabled={operationInProgress}
          >
            <i className="fas fa-rocket"></i> Start Tour
          </button>
          <button 
            className={`${styles.btnSubmit} ${styles.secondary}`}
            onClick={() => !operationInProgress && setShowWelcomeModal(false)}
            disabled={operationInProgress}
          >
            <i className="fas fa-times"></i> Skip
          </button>
        </div>
      </div>
    </div>
  );
}