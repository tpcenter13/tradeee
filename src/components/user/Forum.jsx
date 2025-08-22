"use client"

import { 
  MessageCircle, 
  Heart, 
  User, 
  Clock, 
  Plus,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
// Import Firebase auth
import { auth } from "@/lib/firebase"; // Adjust path to your firebase config
import { onAuthStateChanged } from "firebase/auth";

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredAction, setHoveredAction] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [newCommentContent, setNewCommentContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Add auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Get additional user data from Firestore if needed
        try {
          const response = await fetch(`/api/getUser?uid=${currentUser.uid}`);
          if (response.ok) {
            const userData = await response.json();
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              ...userData
            });
          } else {
            // Fallback to auth data only
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName || currentUser.email
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Fallback to auth data only
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName || currentUser.email
          });
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch posts from API on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/getForum');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        // Format timestamp to display "X hours ago"
        const formattedPosts = data.map(post => ({
          ...post,
          timestamp: formatTimestamp(post.createdAt)
        }));
        setPosts(formattedPosts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Helper function to format Firestore timestamp
  const formatTimestamp = (isoString) => {
    const now = new Date();
    const postDate = new Date(isoString);
    const diffMs = now - postDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    return `${Math.floor(diffHours / 24)} day${diffHours / 24 < 2 ? '' : 's'} ago`;
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      position: 'relative'
    },
    wrapper: {
      maxWidth: '896px',
      margin: '0 auto',
      padding: '24px'
    },
    header: {
      marginBottom: '32px'
    },
    title: {
      fontSize: '30px',
      fontWeight: 'bold',
      color: '#1e40af',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#6b7280'
    },
    actionsBar: {
      display: 'flex',
      gap: '16px',
      marginBottom: '24px',
      flexWrap: 'wrap'
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      backgroundColor: '#1e40af',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    buttonDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed'
    },
    buttonHover: {
      backgroundColor: '#1d4ed8'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      width: '90%',
      maxWidth: '600px',
      maxHeight: '90vh',
      overflow: 'auto'
    },
    modalHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px'
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#1e40af'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#6b7280',
      padding: '4px'
    },
    textarea: {
      width: '100%',
      minHeight: '120px',
      padding: '12px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '14px',
      fontFamily: 'inherit',
      resize: 'vertical',
      marginBottom: '20px'
    },
    commentTextarea: {
      width: '100%',
      minHeight: '80px',
      padding: '12px',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '14px',
      fontFamily: 'inherit',
      resize: 'vertical',
      marginBottom: '20px'
    },
    modalActions: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end'
    },
    cancelButton: {
      padding: '8px 16px',
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer'
    },
    postButton: {
      padding: '8px 16px',
      backgroundColor: '#1e40af',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer'
    },
    postButtonDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed'
    },
    postsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    post: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '24px',
      border: '2px solid #e5e7eb',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
    },
    postHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      marginBottom: '16px'
    },
    avatar: {
      width: '40px',
      height: '40px',
      backgroundColor: '#1e40af',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    userInfo: {
      flex: 1
    },
    userNameRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '4px'
    },
    userName: {
      fontWeight: '600',
      color: '#374151'
    },
    separator: {
      color: '#9ca3af',
      fontSize: '14px'
    },
    timestamp: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      color: '#6b7280',
      fontSize: '14px'
    },
    postContent: {
      marginBottom: '16px'
    },
    contentText: {
      color: '#374151',
      lineHeight: '1.625'
    },
    postActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px'
    },
    actionButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#6b7280',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: 'color 0.2s'
    },
    actionButtonHover: {
      color: '#2563eb'
    },
    actionText: {
      fontSize: '14px'
    },
    loadMoreContainer: {
      textAlign: 'center',
      marginTop: '32px'
    },
    loadMoreButton: {
      padding: '12px 24px',
      backgroundColor: '#1e40af',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    errorMessage: {
      color: '#dc2626',
      textAlign: 'center',
      margin: '16px 0'
    },
    loadingMessage: {
      color: '#6b7280',
      textAlign: 'center',
      margin: '16px 0'
    },
    authMessage: {
      color: '#6b7280',
      textAlign: 'center',
      margin: '32px 0',
      padding: '16px',
      backgroundColor: '#f9fafb',
      borderRadius: '8px'
    },
    commentsSection: {
      maxHeight: '300px',
      overflowY: 'auto',
      marginBottom: '20px'
    },
    comment: {
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px'
    },
    commentHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      marginBottom: '8px'
    },
    commentAvatar: {
      width: '32px',
      height: '32px',
      backgroundColor: '#1e40af',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    commentUserInfo: {
      flex: 1
    },
    commentUserNameRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    commentUserName: {
      fontWeight: '500',
      color: '#374151',
      fontSize: '14px'
    },
    commentSeparator: {
      color: '#9ca3af',
      fontSize: '12px'
    },
    commentTimestamp: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      color: '#6b7280',
      fontSize: '12px'
    },
    commentContent: {
      color: '#374151',
      fontSize: '14px',
      lineHeight: '1.5'
    },
    noComments: {
      color: '#9ca3af',
      fontSize: '14px',
      textAlign: 'center',
      fontStyle: 'italic',
      padding: '20px'
    }
  };

  // Helper functions
  const getButtonStyle = (buttonId, disabled = false) => ({
    ...styles.button,
    ...(disabled ? styles.buttonDisabled : {}),
    ...(hoveredButton === buttonId && !disabled ? styles.buttonHover : {})
  });

  const getActionStyle = (actionId) => ({
    ...styles.actionButton,
    ...(hoveredAction === actionId ? styles.actionButtonHover : {})
  });

  // Handle new post submission
  const handleCreatePost = async () => {
    if (newPostContent.trim() && user) {
      try {
        const response = await fetch('/api/postForum', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: newPostContent.trim(),
            author: user.displayName || user.username || user.email,
            authorUid: user.uid
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create post');
        }

        const newPost = await response.json();
        const formattedNewPost = {
          ...newPost,
          timestamp: formatTimestamp(newPost.createdAt)
        };

        const updatedPosts = [formattedNewPost, ...posts];
        setPosts(updatedPosts);
        setNewPostContent("");
        setShowPostModal(false);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Handle comment submission
  const handleCreateComment = async () => {
    if (newCommentContent.trim() && user && selectedPost) {
      try {
        const response = await fetch('/api/postComment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            postId: selectedPost.id,
            content: newCommentContent.trim(),
            author: user.displayName || user.username || user.email,
            authorUid: user.uid
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create comment');
        }

        const newComment = await response.json();
        const formattedNewComment = {
          ...newComment,
          timestamp: formatTimestamp(newComment.createdAt)
        };

        // Update posts with new comment
        const updatedPosts = posts.map(post => {
          if (post.id === selectedPost.id) {
            return {
              ...post,
              replies: [...(post.replies || []), formattedNewComment],
              comments: post.comments + 1
            };
          }
          return post;
        });

        setPosts(updatedPosts);
        
        // Update selected post with new comment
        const updatedSelectedPost = {
          ...selectedPost,
          replies: [...(selectedPost.replies || []), formattedNewComment],
          comments: selectedPost.comments + 1
        };
        setSelectedPost(updatedSelectedPost);
        
        setNewCommentContent("");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Handle opening comment modal
  const handleOpenCommentModal = (post) => {
    setSelectedPost(post);
    setShowCommentModal(true);
  };

  // Handle closing comment modal
  const handleCloseCommentModal = () => {
    setShowCommentModal(false);
    setSelectedPost(null);
    setNewCommentContent("");
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.wrapper}>
          <div style={styles.loadingMessage}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Community Forum</h1>
          <p style={styles.subtitle}>Connect, share, and discuss with the community</p>
          {user && (
            <p style={{color: '#6b7280', fontSize: '14px', marginTop: '8px'}}>
              Welcome, {user.displayName || user.username || user.email}!
            </p>
          )}
        </div>

        {/* Show message if not authenticated */}
        {!user && (
          <div style={styles.authMessage}>
            Please log in to create posts and interact with the community.
          </div>
        )}

        {/* Actions Bar */}
        <div style={styles.actionsBar}>
          <button 
            style={getButtonStyle('newPost', !user)}
            onMouseEnter={() => setHoveredButton('newPost')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => user && setShowPostModal(true)}
            disabled={!user}
            title={!user ? "Please log in to create a post" : "Create a new post"}
          >
            <Plus size={20} />
            New Post
          </button>
        </div>

        {/* Loading and Error States */}
        {loading && <div style={styles.loadingMessage}>Loading posts...</div>}
        {error && <div style={styles.errorMessage}>Error: {error}</div>}

        {/* Posts */}
        {!loading && !error && (
          <div style={styles.postsContainer}>
            {posts.map((post) => (
              <div key={post.id} style={styles.post}>
                {/* Post Header */}
                <div style={styles.postHeader}>
                  <div style={styles.avatar}>
                    <User color="white" size={20} />
                  </div>
                  <div style={styles.userInfo}>
                    <div style={styles.userNameRow}>
                      <h3 style={styles.userName}>{post.author}</h3>
                      <span style={styles.separator}>•</span>
                      <div style={styles.timestamp}>
                        <Clock size={14} />
                        {post.timestamp}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div style={styles.postContent}>
                  <p style={styles.contentText}>{post.content}</p>
                </div>

                {/* Post Actions */}
                <div style={styles.postActions}>
                  <button 
                    style={getActionStyle(`heart-${post.id}`)}
                    onMouseEnter={() => setHoveredAction(`heart-${post.id}`)}
                    onMouseLeave={() => setHoveredAction(null)}
                    disabled={!user}
                  >
                    <Heart size={18} />
                    <span style={styles.actionText}>{post.likes}</span>
                  </button>
                  <button 
                    style={getActionStyle(`message-${post.id}`)}
                    onMouseEnter={() => setHoveredAction(`message-${post.id}`)}
                    onMouseLeave={() => setHoveredAction(null)}
                    onClick={() => handleOpenCommentModal(post)}
                  >
                    <MessageCircle size={18} />
                    <span style={styles.actionText}>{post.comments}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {!loading && !error && (
          <div style={styles.loadMoreContainer}>
            <button 
              style={getButtonStyle('loadMore')}
              onMouseEnter={() => setHoveredButton('loadMore')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Load More Posts
            </button>
          </div>
        )}

        {/* New Post Modal */}
        {showPostModal && user && (
          <div style={styles.modalOverlay} onClick={() => setShowPostModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Create New Post</h2>
                <button 
                  style={styles.closeButton}
                  onClick={() => setShowPostModal(false)}
                >
                  <X size={24} />
                </button>
              </div>
              
              <textarea
                style={styles.textarea}
                placeholder="What's on your mind? Share your thoughts with the community..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
              
              <div style={styles.modalActions}>
                <button 
                  style={styles.cancelButton}
                  onClick={() => setShowPostModal(false)}
                >
                  Cancel
                </button>
                <button 
                  style={{
                    ...styles.postButton,
                    ...(!newPostContent.trim() ? styles.postButtonDisabled : {})
                  }}
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim()}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Comment Modal */}
        {showCommentModal && selectedPost && (
          <div style={styles.modalOverlay} onClick={handleCloseCommentModal}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Comments</h2>
                <button 
                  style={styles.closeButton}
                  onClick={handleCloseCommentModal}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Original Post */}
              <div style={{...styles.post, marginBottom: '20px', backgroundColor: '#f8fafc'}}>
                <div style={styles.postHeader}>
                  <div style={styles.avatar}>
                    <User color="white" size={20} />
                  </div>
                  <div style={styles.userInfo}>
                    <div style={styles.userNameRow}>
                      <h3 style={styles.userName}>{selectedPost.author}</h3>
                      <span style={styles.separator}>•</span>
                      <div style={styles.timestamp}>
                        <Clock size={14} />
                        {selectedPost.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={styles.postContent}>
                  <p style={styles.contentText}>{selectedPost.content}</p>
                </div>
              </div>

              {/* Comments Section */}
              <div style={styles.commentsSection}>
                {selectedPost.replies && selectedPost.replies.length > 0 ? (
                  selectedPost.replies.map((comment, index) => (
                    <div key={index} style={styles.comment}>
                      <div style={styles.commentHeader}>
                        <div style={styles.commentAvatar}>
                          <User color="white" size={16} />
                        </div>
                        <div style={styles.commentUserInfo}>
                          <div style={styles.commentUserNameRow}>
                            <h4 style={styles.commentUserName}>{comment.author}</h4>
                            <span style={styles.commentSeparator}>•</span>
                            <div style={styles.commentTimestamp}>
                              <Clock size={12} />
                              {comment.timestamp}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p style={styles.commentContent}>{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <div style={styles.noComments}>
                    No comments yet. Be the first to comment!
                  </div>
                )}
              </div>

              {/* Add Comment */}
              {user && (
                <>
                  <textarea
                    style={styles.commentTextarea}
                    placeholder="Write a comment..."
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                  />
                  
                  <div style={styles.modalActions}>
                    <button 
                      style={styles.cancelButton}
                      onClick={handleCloseCommentModal}
                    >
                      Close
                    </button>
                    <button 
                      style={{
                        ...styles.postButton,
                        ...(!newCommentContent.trim() ? styles.postButtonDisabled : {})
                      }}
                      onClick={handleCreateComment}
                      disabled={!newCommentContent.trim()}
                    >
                      Comment
                    </button>
                  </div>
                </>
              )}

              {!user && (
                <div style={styles.authMessage}>
                  Please log in to add comments.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}