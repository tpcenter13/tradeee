import styles from '../app/dashboard/user/page.module.css';

export default function SettingsModal({
  user,
  generateAvatar,
  svgToDataUrl,
  saveProfileSettings,
  operationInProgress,
  setShowSettingsModal
}) {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent} style={{ maxWidth: '500px', padding: '30px' }}>
        <button 
          className={styles.close} 
          onClick={() => !operationInProgress && setShowSettingsModal(false)} 
          aria-label="Close modal"
          disabled={operationInProgress}
        >
          &times;
        </button>
        <div className={styles.profileSettings}>
          <h2><i className="fas fa-user-cog"></i> Profile Settings</h2>
          <div className={styles.profilePic}>
            <img 
              src={user?.photoURL || svgToDataUrl(generateAvatar(user?.username))} 
              alt="Profile Picture" 
              className={styles.profileAvatar} 
            />
            <div className={styles.profileEmail}>
              <i className="fas fa-envelope"></i> {user?.email}
            </div>
          </div>
          <form onSubmit={saveProfileSettings}>
            <div className={styles.formGroup}>
              <label htmlFor="nickname">Nickname*</label>
              <input 
                type="text" 
                id="nickname" 
                placeholder="Enter your nickname" 
                defaultValue={user?.nickname || user?.displayName || ''} 
                required
                disabled={operationInProgress}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="zone">Zone</label>
              <select 
                id="zone" 
                defaultValue={user?.zone || '5'}
                disabled={operationInProgress}
              >
                <option value="">Select your zone</option>
                {[...Array(11)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>Zone {i + 1}</option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="location">Location</label>
              <input 
                type="text" 
                id="location" 
                placeholder="Enter your location (e.g., Barangay Bulihan)" 
                defaultValue={user?.location || ''} 
                disabled={operationInProgress}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="bio">Bio</label>
              <textarea 
                id="bio" 
                placeholder="Tell us about yourself..." 
                defaultValue={user?.bio || ''} 
                disabled={operationInProgress}
              ></textarea>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="profilePicture">Profile Picture</label>
              <input 
                type="file" 
                id="profilePicture" 
                accept="image/*" 
                disabled={operationInProgress}
              />
            </div>
            <button 
              type="submit" 
              className={styles.btnSubmit}
              disabled={operationInProgress}
            >
              {operationInProgress ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i> Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}