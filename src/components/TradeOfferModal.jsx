import styles from '../app/dashboard/user/page.module.css';

export default function TradeOfferModal({
  selectedPost,
  userItemsForTrade,
  submitTradeOffer,
  operationInProgress,
  setShowTradeOfferModal
}) {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button 
          className={styles.close} 
          onClick={() => !operationInProgress && setShowTradeOfferModal(false)} 
          aria-label="Close modal"
          disabled={operationInProgress}
        >
          &times;
        </button>
        <div className={styles.tradeOfferContainer}>
          <div className={styles.tradeOfferHeader}>
            <h3>Trade Offer</h3>
            <p>Propose a trade for {selectedPost.item.title}</p>
          </div>
          <div className={styles.tradeItems}>
            <div className={styles.tradeItem}>
              <h4>Your Item</h4>
              {userItemsForTrade.length > 0 ? (
                <select 
                  id="offeredItem" 
                  className={styles.tradeSelect}
                  disabled={operationInProgress}
                >
                  <option value="">Select an item to trade</option>
                  {userItemsForTrade.map(item => (
                    <option key={item.id} value={item.id}>{item.item.title}</option>
                  ))}
                </select>
              ) : (
                <p>You don't have any items listed for trade</p>
              )}
            </div>
            <div className={styles.tradeArrow}>
              <i className="fas fa-exchange-alt"></i>
            </div>
            <div className={styles.tradeItem}>
              <h4>Their Item</h4>
              <img 
                src={selectedPost.item.images?.[0] || '/default-item.png'} 
                alt={selectedPost.item.title} 
                className={styles.tradeItemImage} 
              />
              <h4>{selectedPost.item.title}</h4>
            </div>
          </div>
          <form onSubmit={submitTradeOffer}>
            <div className={styles.formGroup}>
              <label htmlFor="message">Message (Optional)</label>
              <textarea 
                id="message" 
                placeholder="Add a message to the trader..." 
                disabled={operationInProgress}
              ></textarea>
            </div>
            <div className={styles.tradeActions}>
              <button 
                type="submit" 
                className={`${styles.tradeBtn} ${styles.submit}`}
                disabled={userItemsForTrade.length === 0 || operationInProgress}
              >
                {operationInProgress ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Sending...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i> Send Offer
                  </>
                )}
              </button>
              <button 
                type="button" 
                className={`${styles.tradeBtn} ${styles.cancel}`}
                onClick={() => !operationInProgress && setShowTradeOfferModal(false)}
                disabled={operationInProgress}
              >
                <i className="fas fa-times"></i> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}