import styles from '../app/dashboard/user/page.module.css';

export default function PostCard({
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
  offerTrade,
  buyItem,
  deletePost,
  operationInProgress,
  isProfile
}) {
  // Add safety check for post and post.id
  if (!post || !post.id) {
    console.warn('PostCard: Invalid post object or missing post.id', post);
    return null; // or return a loading/error state
  }

  return (
    <div className={styles.productCard}>
      <span className={`${styles.productBadge} ${post.item?.isSelling ? '' : styles.trade}`}>
        {post.item?.isSelling ? 'For Sale' : 'For Trade'}
      </span>
      <img 
        src={post.item?.images?.[0] || '/default-item.png'} 
        alt={post.item?.title || 'Item'} 
        className={styles.productImage} 
      />
      <div className={styles.productInfo}>
        <h3>{post.item?.title || 'Untitled'}</h3>
        <div className={styles.price}>
          {post.item?.isSelling ? `₱${post.item?.price?.toFixed(2) || '0.00'}` : 'Trade Only'}
        </div>
        {!post.item?.isSelling && (
          <p className={styles.tradeDescription}>
            Willing to trade for: {post.item?.tradeFor || 'Various items'}
          </p>
        )}
        <div className={styles.productMeta}>
          <div className={styles.userInfo}>
            <img 
              src={post.userData?.photoURL || svgToDataUrl(generateAvatar(post.userData?.username || 'Anonymous'))} 
              alt={post.userData?.username || 'User'} 
              className={styles.userPhoto} 
            />
            <span>{post.item?.nickname || post.userData?.username || 'Anonymous'}</span>
          </div>
          {post.userData?.location && (
            <div className={styles.location}>
              <i className="fas fa-map-marker-alt"></i>
              <span>{post.userData.location}</span>
            </div>
          )}
          <span className={styles.datePosted}>
            {post.item?.createdAt
              ? (typeof post.item.createdAt.toDate === 'function'
                  ? post.item.createdAt.toDate().toLocaleDateString()
                  : new Date(post.item.createdAt).toLocaleDateString())
              : 'Recently'}
          </span>
          {isProfile && (
            <div className={styles.postActions}>
              <button 
                className={styles.deletePostBtn}
                onClick={() => deletePost(post.id)}
                disabled={operationInProgress}
              >
                <i className="fas fa-trash"></i> Delete
              </button>
            </div>
          )}
        </div>
      </div>
      {!isProfile && (
        <div className={styles.postInteraction}>
          <button 
            className={styles.interactionBtn} 
            onClick={() => toggleLike(post.id, 'item')}
            disabled={operationInProgress}
          >
            <i className={`far fa-heart ${post.userLiked ? styles.liked : ''}`}></i>
            <span>{post.likeCount || 0}</span>
          </button>
          <button 
            className={styles.interactionBtn} 
            onClick={() => toggleComments(post.id)}
            disabled={operationInProgress}
          >
            <i className="far fa-comment"></i>
            <span>{post.comments?.length || 0}</span>
          </button>
          {!post.item?.isSelling ? (
            <button 
              className={styles.interactionBtn} 
              onClick={() => offerTrade(post.id)}
              disabled={operationInProgress}
            >
              <i className="fas fa-exchange-alt"></i>
              <span>Offer Trade</span>
            </button>
          ) : (
            <button 
              className={styles.interactionBtn} 
              onClick={() => buyItem(post.id)}
              disabled={operationInProgress}
            >
              <i className="fas fa-shopping-cart"></i>
              <span>Buy</span>
            </button>
          )}
        </div>
      )}
      {showComments && showComments[post.id] && (
        <div className={styles.commentsSection}>
          <div className={styles.commentsList}>
            {post.comments?.length > 0 ? (
              post.comments.map(comment => (
                <div key={comment.id} className={styles.comment}>
                  <div className={styles.commentUser}>
                    <img 
                      src={comment.userData?.photoURL || svgToDataUrl(generateAvatar(comment.userData?.username || 'Anonymous'))} 
                      alt={comment.userData?.username || 'User'} 
                      className={styles.commentUserAvatar} 
                    />
                    <div>
                      <span className={styles.commentUsername}>{comment.userData?.nickname || comment.userData?.username || 'Anonymous'}</span>
                      <p className={styles.commentContent}>{comment.content}</p>
                      <span className={styles.commentTime}>
                        {comment.createdAt?.toLocaleTimeString?.([], { hour: '2-digit', minute: '2-digit' })}
                        {comment.createdAt && ' • '}
                        {comment.createdAt?.toLocaleDateString?.()}
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
              value={newComment || ''}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addComment(post.id, 'item')}
              disabled={operationInProgress}
            />
            <button 
              onClick={() => addComment(post.id, 'item')}
              disabled={operationInProgress}
              suppressHydrationWarning
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}