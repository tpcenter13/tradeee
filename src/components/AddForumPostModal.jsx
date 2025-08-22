import styles from '../app/dashboard/user/page.module.css';

export default function AddForumPostModal({
  newForumPost,
  setNewForumPost,
  handleForumPostSubmit,
  operationInProgress,
  setShowAddForumPostModal,
  forumPostFormRef
}) {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button 
          className={styles.close} 
          onClick={() => !operationInProgress && setShowAddForumPostModal(false)} 
          aria-label="Close modal"
          disabled={operationInProgress}
        >
          &times;
        </button>
        <h3>Create New Forum Post</h3>
        <p>Share your thoughts with the community</p>
        <form onSubmit={handleForumPostSubmit} ref={forumPostFormRef}>
          <div className={styles.formGroup}>
            <label htmlFor="forumPostTitle">Title*</label>
            <input 
              type="text" 
              id="forumPostTitle" 
              placeholder="Post title..." 
              required
              value={newForumPost.title}
              onChange={(e) => !operationInProgress && setNewForumPost({...newForumPost, title: e.target.value})}
              disabled={operationInProgress}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="forumPostCategory">Category</label>
            <select 
              id="forumPostCategory"
              value={newForumPost.category}
              onChange={(e) => !operationInProgress && setNewForumPost({...newForumPost, category: e.target.value})}
              disabled={operationInProgress}
            >
              <option value="general">General Discussion</option>
              <option value="marketplace">Marketplace</option>
              <option value="tips">Tips & Advice</option>
              <option value="events">Community Events</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="forumPostContent">Content*</label>
            <textarea 
              id="forumPostContent" 
              placeholder="Write your post content here..." 
              required
              value={newForumPost.content}
              onChange={(e) => !operationInProgress && setNewForumPost({...newForumPost, content: e.target.value})}
              disabled={operationInProgress}
            ></textarea>
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
                <i className="fas fa-paper-plane"></i> Post to Forum
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}