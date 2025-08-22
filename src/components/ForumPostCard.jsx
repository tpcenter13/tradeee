import styles from '../app/dashboard/user/page.module.css';

export default function ForumPostCard({
  post,
  user,
  generateAvatar,
  svgToDataUrl,
  toggleLike,
  toggleComments,
  showComments,
  newComment,
  setNewComment,
  addComment,
  deleteForumPost,
  operationInProgress
}) {
  return (
    <div className={styles.forumPostCard}>
      <div className={styles.postHeader}>
        <div className={styles.postUser}>
          <img 
            src={post.userData.photoURL || svgToDataUrl(generateAvatar(post.userData.username))} 
            alt={post.userData.username} 
            className={styles.userAvatarSmall} 
          />
          <div>
            <h3>{post.post.nickname || post.userData.username}</h3>
            <span className={styles.postDate}>
              {post.createdAt?.toLocaleDateString() || 'Recently'}
            </span>
          </div>
        </div>
        <div className={styles.postCategory}>
          {post.post.category}
        </div>
      </div>
      <div className={styles.postContent}>
        <h3>{post.post.title}</h3>
        <p>{post.post.content}</p>
      </div>
      <div className={styles.postFooter}>
        <button 
          className={styles.postAction} 
          onClick={() => toggleLike(post.id, 'post')}
          disabled={operationInProgress}
        >
          <i className={`far fa-heart ${post.userLiked ? styles.liked : ''}`}></i> 
          Like ({post.likeCount || 0})
        </button>
        <button 
          className={styles.postAction}
          onClick={() => toggleComments(post.id)}
          disabled={operationInProgress}
        >
          <i className="far fa-comment"></i> 
          Comment ({post.comments?.length || 0})
        </button>
        {post.post.userId === user?.uid && (
          <button 
            className={styles.postAction}
            onClick={() => deleteForumPost(post.id)}
            disabled={operationInProgress}
          >
            <i className="fas fa-trash"></i> Delete
          </button>
        )}
      </div>
      {showComments[post.id] && (
        <div className={styles.commentsSection}>
          <div className={styles.commentsList}>
            {post.comments?.length > 0 ? (
              post.comments.map(comment => (
                <div key={comment.id} className={styles.comment}>
                  <div className={styles.commentUser}>
                    <img 
                      src={comment.userData.photoURL || svgToDataUrl(generateAvatar(comment.userData.username))} 
                      alt={comment.userData.username} 
                      className={styles.commentUserAvatar} 
                    />
                    <div>
                      <span className={styles.commentUsername}>{comment.userData.nickname || comment.userData.username}</span>
                      <p className={styles.commentContent}>{comment.content}</p>
                      <span className={styles.commentTime}>
                        {comment.createdAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {' • '}
                        {comment.createdAt?.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noComments}>No comments yet</p>
            )}
          </div>
          <div className={styles.addComment}>
            <input 
              type="text" 
              placeholder="Add a comment..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addComment(post.id, 'post')}
              disabled={operationInProgress}
            />
            <button 
              onClick={() => addComment(post.id, 'post')}
              disabled={operationInProgress}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}