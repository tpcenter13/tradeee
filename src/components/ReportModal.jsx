import styles from '../app/dashboard/user/page.module.css';

export default function ReportModal({
  operationInProgress,
  setShowReportModal,
  showToast
}) {
  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (operationInProgress) return;
    const reason = e.target.reportReason.value;
    if (!reason.trim()) {
      showToast('Please provide a reason for the report', 'error');
      return;
    }
    // Placeholder for report submission logic
    showToast('Report submitted successfully', 'success');
    setShowReportModal(false);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button 
          className={styles.close} 
          onClick={() => !operationInProgress && setShowReportModal(false)} 
          aria-label="Close modal"
          disabled={operationInProgress}
        >
          &times;
        </button>
        <h3>Report Issue</h3>
        <p>Please provide details about the issue you are reporting.</p>
        <form onSubmit={handleReportSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="reportReason">Reason for Report*</label>
            <textarea 
              id="reportReason" 
              placeholder="Describe the issue..." 
              required
              disabled={operationInProgress}
            ></textarea>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="reportType">Report Type</label>
            <select 
              id="reportType" 
              disabled={operationInProgress}
            >
              <option value="user">Inappropriate User Behavior</option>
              <option value="post">Inappropriate Post</option>
              <option value="trade">Trade Issue</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button 
            type="submit" 
            className={styles.btnSubmit}
            disabled={operationInProgress}
          >
            {operationInProgress ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Submitting...
              </>
            ) : (
              <>
                <i className="fas fa-flag"></i> Submit Report
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}