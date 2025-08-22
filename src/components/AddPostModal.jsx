import styles from '../app/dashboard/user/page.module.css';

export default function AddPostModal({
  isSelling,
  setIsSelling,
  selectedCategory,
  setSelectedCategory,
  postImages,
  handleImageUpload,
  removeImage,
  handlePostSubmit,
  operationInProgress,
  setShowAddPostModal,
  showToast
}) {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button 
          className={styles.close} 
          onClick={() => !operationInProgress && setShowAddPostModal(false)} 
          aria-label="Close modal"
          disabled={operationInProgress}
        >
          &times;
        </button>
        <h3>Create New Listing</h3>
        <p>Fill in the details of the item you want to list</p>
        <form onSubmit={handlePostSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="postTitle">Title*</label>
            <input 
              type="text" 
              id="postTitle" 
              placeholder="Item title..." 
              required 
              disabled={operationInProgress}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="postDescription">Description*</label>
            <textarea 
              id="postDescription" 
              placeholder="Describe your item..." 
              required
              disabled={operationInProgress}
            ></textarea>
          </div>
          <div className={styles.formGroup}>
            <label>Categories*</label>
            <div className={styles.categoryButtons}>
              {['Fashion & Apparel', 'Electronics', 'Food & Beverages', 'DIY & Hardware', 'Health & Beauty'].map(category => (
                <button 
                  key={category}
                  type="button" 
                  className={`${styles.categoryBtn} ${selectedCategory === category ? styles.active : ''}`}
                  onClick={() => !operationInProgress && setSelectedCategory(category)}
                  disabled={operationInProgress}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="postQuantity">Quantity*</label>
            <input 
              type="number" 
              id="postQuantity" 
              min="1" 
              defaultValue="1" 
              required
              disabled={operationInProgress}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Upload Images (Minimum 3)*</label>
            <div className={styles.imageUploadContainer}>
              {postImages.map((image, index) => (
                <div key={index} className={styles.imageUploadBox}>
                  <img 
                    src={image} 
                    alt={`Preview ${index}`} 
                    className={styles.imagePreview} 
                  />
                  <button 
                    className={styles.removeImage}
                    onClick={() => !operationInProgress && removeImage(index)}
                    aria-label="Remove image"
                    disabled={operationInProgress}
                  >
                    &times;
                  </button>
                </div>
              ))}
              {postImages.length < 6 && (
                <div className={styles.imageUploadBox}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className={styles.imageUploadInput}
                    onChange={handleImageUpload}
                    multiple
                    disabled={operationInProgress}
                  />
                  <span className={styles.imageUploadText}>+ Add Image</span>
                </div>
              )}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>I want to:*</label>
            <div className={styles.switchContainer}>
              <label className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={isSelling}
                  onChange={() => !operationInProgress && setIsSelling(!isSelling)}
                  disabled={operationInProgress}
                />
                <span className={`${styles.slider} ${styles.round}`}>
                  <span className={styles.tradeText}>Trade</span>
                  <span className={styles.sellText}>Sell</span>
                </span>
              </label>
            </div>
            {isSelling && (
              <div className={styles.priceInput}>
                <label htmlFor="itemPrice">Price (₱)*</label>
                <input 
                  type="number" 
                  id="itemPrice" 
                  min="1" 
                  placeholder="Enter amount" 
                  required
                  disabled={operationInProgress}
                />
              </div>
            )}
            {!isSelling && (
              <div>
                <label htmlFor="tradeFor">Willing to trade for:</label>
                <textarea 
                  id="tradeFor" 
                  placeholder="What items would you accept in trade?"
                  disabled={operationInProgress}
                ></textarea>
              </div>
            )}
          </div>
          <button 
            type="submit" 
            className={styles.btnSubmit}
            disabled={operationInProgress}
          >
            {operationInProgress ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Posting...
              </>
            ) : (
              <>
                <i className="fas fa-upload"></i> Post Item
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}