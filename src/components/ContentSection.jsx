import styles from '../app/dashboard/user/page.module.css';
import PostCard from './PostCard';
import ForumPostCard from './ForumPostCard';
import TradeRequestCard from './TradeRequestCard';

export default function ContentSection({
  activeSection,
  posts,
  forumPosts,
  currentCategory,
  filterItems,
  visiblePosts,
  loadMorePosts,
  user,
  generateAvatar,
  svgToDataUrl,
  showToast,
  toggleLike,
  toggleComments,
  showComments,
  newComment,
  setNewComment,
  addComment,
  offerTrade,
  buyItem,
  deletePost,
  deleteForumPost,
  setShowAddPostModal,
  activeProfileTab,
  setActiveProfileTab,
  tradeRequests,
  respondToTrade,
  reviews,
  chatUsers,
  selectedChatUser,
  setSelectedChatUser,
  messages,
  setMessages,
  newMessage,
  setNewMessage,
  sendMessage,
  clearChat,
  deleteChat,
  setShowReportModal,
  helpArticles,
  searchQuery,
  setSearchQuery,
  selectedArticle,
  showHelpArticles,
  showHelpArticleDetail,
  backToHelpList,
  submitFeedback,
  operationInProgress,
  messagesEndRef,
  setActiveSection // Added missing prop
}) {
  const filteredHelpArticles = helpArticles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.mainContent}>
      {activeSection === 'home' && (
        <div className={styles.contentSection}>
          <div className={styles.homeHeader}>
            <h2>Home Feed</h2>
            <p>See what's new in your community</p>
          </div>
          <div className={styles.categoriesScroll}>
            {['all', 'Fashion & Apparel', 'Electronics', 'Food & Beverages', 'DIY & Hardware', 'Health & Beauty'].map(category => (
              <button 
                key={category}
                className={`${styles.category} ${currentCategory === category ? styles.active : ''}`}
                onClick={() => filterItems(category)}
                suppressHydrationWarning
              >
                {category === 'all' ? 'All Items' : category}
              </button>
            ))}
          </div>
          <div className={styles.listingsFeed}>
            {posts
              .filter(post => currentCategory === 'all' || post.item.category === currentCategory)
              .slice(0, visiblePosts)
              .map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  user={user}
                  generateAvatar={generateAvatar}
                  svgToDataUrl={svgToDataUrl}
                  toggleLike={toggleLike}
                  toggleComments={toggleComments}
                  showComments={showComments}
                  newComment={newComment}
                  setNewComment={setNewComment}
                  addComment={addComment}
                  offerTrade={offerTrade}
                  buyItem={buyItem}
                  operationInProgress={operationInProgress}
                />
              ))}
          </div>
          {posts.filter(post => currentCategory === 'all' || post.item.category === currentCategory).length > visiblePosts && (
            <button 
              className={styles.loadMoreBtn} 
              onClick={loadMorePosts}
              disabled={operationInProgress}
              suppressHydrationWarning
            >
              Load More
            </button>
          )}
          <button 
            className={styles.floatingPostBtn} 
            onClick={() => setShowAddPostModal(true)}
            title="Create new listing"
            aria-label="Create new listing"
            disabled={operationInProgress}
            suppressHydrationWarning
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      )}

      {activeSection === 'profile' && (
        <div className={styles.profileContainer}>
          <div className={styles.profileHeader}>
            <img 
              src={user?.photoURL || svgToDataUrl(generateAvatar(user?.username))} 
              alt="Profile Picture" 
              className={styles.profileAvatar} 
            />
            <h1 className={styles.profileName}>{user?.nickname || user?.displayName || 'User'}</h1>
            <div className={styles.profileLocation}>
              <i className="fas fa-map-marker-alt"></i>
              <span>{user?.location || 'Zone 5, Barangay Bulihan'}</span>
            </div>
            <div className={styles.profileStats}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{posts.length}</div>
                <div className={styles.statLabel}>Posts</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{tradeRequests.length}</div>
                <div className={styles.statLabel}>Trades</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>
                  {reviews.length > 0 ? 
                    (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1) : 
                    '0'}
                </div>
                <div className={styles.statLabel}>Rating</div>
              </div>
            </div>
            <div className={styles.profileBio}>
              {user?.bio || 'Member since 2023. Active trader in the community.'}
            </div>
          </div>
          <div className={styles.profileTabs}>
            {['posts', 'trades', 'reviews'].map(tab => (
              <button 
                key={tab}
                className={`${styles.profileTab} ${activeProfileTab === tab ? styles.active : ''}`}
                onClick={() => setActiveProfileTab(tab)}
                disabled={operationInProgress}
                suppressHydrationWarning
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className={`${styles.profileContent} ${activeProfileTab === 'posts' ? styles.active : ''}`}>
            <h3>My Posts</h3>
            <div className={styles.profilePosts}>
              {posts.length > 0 ? (
                posts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    user={user}
                    generateAvatar={generateAvatar}
                    svgToDataUrl={svgToDataUrl}
                    deletePost={deletePost}
                    operationInProgress={operationInProgress}
                    isProfile
                  />
                ))
              ) : (
                <div className={styles.emptyState}>
                  <i className="fas fa-box-open"></i>
                  <p>You haven't posted any items yet</p>
                  <button 
                    className={styles.btnSubmit}
                    onClick={() => setShowAddPostModal(true)}
                    disabled={operationInProgress}
                  >
                    <i className="fas fa-plus"></i> Create Your First Post
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className={`${styles.profileContent} ${activeProfileTab === 'trades' ? styles.active : ''}`}>
            <h3>Trade Requests</h3>
            {tradeRequests.length > 0 ? (
              <div className={styles.tradeRequestsList}>
                {tradeRequests.map(trade => (
                  <TradeRequestCard
                    key={trade.id}
                    trade={trade}
                    user={user}
                    respondToTrade={respondToTrade}
                    setActiveSection={setActiveSection}
                    setSelectedChatUser={setSelectedChatUser}
                    chatUsers={chatUsers}
                    operationInProgress={operationInProgress}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <i className="fas fa-exchange-alt"></i>
                <p>No trade requests yet</p>
              </div>
            )}
          </div>
          <div className={`${styles.profileContent} ${activeProfileTab === 'reviews' ? styles.active : ''}`}>
            <h3>Reviews</h3>
            {reviews.length > 0 ? (
              <div className={styles.reviewsList}>
                {reviews.map(review => (
                  <div key={review.id} className={styles.reviewCard}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewerInfo}>
                        <img 
                          src={review.reviewerPhoto || svgToDataUrl(generateAvatar(review.reviewerName))} 
                          alt={review.reviewerName} 
                          className={styles.reviewerAvatar} 
                        />
                        <div>
                          <h4>{review.reviewerName}</h4>
                          <div className={styles.starRating}>
                            {[...Array(5)].map((_, i) => (
                              <i 
                                key={i} 
                                className={`fas fa-star ${i < review.rating ? styles.filled : ''}`}
                              ></i>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className={styles.reviewDate}>
                        {review.createdAt?.toLocaleDateString() || 'Recently'}
                      </span>
                    </div>
                    <p className={styles.reviewContent}>{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <i className="fas fa-comment-alt"></i>
                <p>No reviews yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'messages' && (
        <div className={styles.contentSection}>
          <div className={styles.messagesContainer}>
            <div className={styles.chatList}>
              <h2>Messages</h2>
              <div className={styles.chatUsers}>
                {chatUsers.length > 0 ? (
                  chatUsers.map(chat => (
                    <div 
                      key={chat.id} 
                      className={`${styles.chatUser} ${selectedChatUser?.id === chat.id ? styles.active : ''}`}
                      onClick={() => {
                        setSelectedChatUser(chat);
                        setMessages([
                          {
                            id: '1',
                            content: "Hi, interesado ako sa item mo",
                            senderId: chat.otherUser.username === 'TradePartner' ? 'user2' : 'user1',
                            timestamp: new Date()
                          },
                          {
                            id: '2',
                            content: "Sige, ano ba kaya mo ma trade sakin",
                            senderId: user.uid,
                            timestamp: new Date()
                          }
                        ]);
                      }}
                    >
                      <img 
                        src={chat.otherUser?.photoURL || svgToDataUrl(generateAvatar(chat.otherUser?.username))} 
                        alt={chat.otherUser?.username} 
                        className={styles.chatUserAvatar} 
                      />
                      <div className={styles.chatUserInfo}>
                        <h3>{chat.otherUser?.nickname || chat.otherUser?.username || 'Unknown User'}</h3>
                        <p className={styles.lastMessage}>
                          {chat.lastMessage?.content || 'No messages yet'}
                        </p>
                      </div>
                      <span className={styles.chatTime}>
                        {chat.lastUpdated?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <i className="fas fa-comment-slash"></i>
                    <p>No conversations yet</p>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.chatContainer}>
              {selectedChatUser ? (
                <>
                  <div className={styles.chatHeader}>
                    <div className={styles.chatPartnerInfo}>
                      <img 
                        src={selectedChatUser.otherUser?.photoURL || svgToDataUrl(generateAvatar(selectedChatUser.otherUser?.username))} 
                        alt={selectedChatUser.otherUser?.username} 
                        className={styles.partnerAvatar} 
                      />
                      <div>
                        <h3>{selectedChatUser.otherUser?.nickname || selectedChatUser.otherUser?.username}</h3>
                        <span className={styles.status}>Online</span>
                      </div>
                    </div>
                    <div className={styles.chatActions}>
                      <button 
                        className={styles.actionBtn} 
                        onClick={clearChat}
                        disabled={operationInProgress}
                      >
                        <i className="fas fa-trash-alt"></i> Clear
                      </button>
                      <button 
                        className={styles.actionBtn} 
                        onClick={deleteChat}
                        disabled={operationInProgress}
                      >
                        <i className="fas fa-times"></i> Delete
                      </button>
                      <button 
                        className={styles.btnReport}
                        onClick={() => setShowReportModal(true)}
                        disabled={operationInProgress}
                      >
                        <i className="fas fa-flag"></i> Report User
                      </button>
                    </div>
                  </div>
                  <div className={styles.chatMessages}>
                    {messages.length > 0 ? (
                      messages.map(message => (
                        <div 
                          key={message.id} 
                          className={`${styles.message} ${message.senderId === user.uid ? styles.sent : styles.received}`}
                        >
                          <p>{message.content}</p>
                          <span className={styles.messageTime}>
                            {message.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className={styles.noMessages}>
                        <i className="fas fa-comment-slash"></i>
                        <p>No messages yet. Start a conversation!</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className={styles.messageInput}>
                    <div className={styles.imageUploadChat}>
                      <input 
                        type="file" 
                        id="chatImageUpload" 
                        accept="image/*" 
                        multiple 
                        style={{ display: 'none' }} 
                        disabled={operationInProgress}
                      />
                      <label htmlFor="chatImageUpload" title="Attach images">
                        <i className="fas fa-image"></i>
                      </label>
                    </div>
                    <input 
                      type="text" 
                      id="messageInput" 
                      placeholder="Type a message..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      disabled={!selectedChatUser || operationInProgress}
                      suppressHydrationWarning
                    />
                    <button 
                      onClick={sendMessage}
                      disabled={!selectedChatUser || !newMessage.trim() || operationInProgress}
                      suppressHydrationWarning
                    >
                      <i className="fas fa-paper-plane"></i>
                    </button>
                  </div>
                </>
              ) : (
                <div className={styles.selectChatPrompt}>
                  <i className="fas fa-comments"></i>
                  <p>Select a conversation to start chatting</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeSection === 'marketplace' && (
        <div className={styles.contentSection}>
          <div className={styles.marketplaceHeader}>
            <h2>Marketplace</h2>
            <p>Buy, sell, or trade items in your community</p>
          </div>
          <button 
            className={styles.btnSubmit}
            onClick={() => setShowAddPostModal(true)}
            disabled={operationInProgress}
          >
            <i className="fas fa-plus"></i> Create New Listing
          </button>
          <div className={styles.listingsFeed}>
            {posts
              .filter(post => currentCategory === 'all' || post.item.category === currentCategory)
              .slice(0, visiblePosts)
              .map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  user={user}
                  generateAvatar={generateAvatar}
                  svgToDataUrl={svgToDataUrl}
                  toggleLike={toggleLike}
                  toggleComments={toggleComments}
                  showComments={showComments}
                  newComment={newComment}
                  setNewComment={setNewComment}
                  addComment={addComment}
                  offerTrade={offerTrade}
                  buyItem={buyItem}
                  operationInProgress={operationInProgress}
                />
              ))}
          </div>
          {posts.filter(post => currentCategory === 'all' || post.item.category === currentCategory).length > visiblePosts && (
            <button 
              className={styles.loadMoreBtn} 
              onClick={loadMorePosts}
              disabled={operationInProgress}
            >
              Load More
            </button>
          )}
        </div>
      )}

      {activeSection === 'community' && (
        <div className={styles.contentSection}>
          <h2>Community Forum</h2>
          <p>Connect with other community members</p>
          <button 
            className={styles.btnSubmit}
            onClick={() => setShowAddPostModal(true)}
            disabled={operationInProgress}
          >
            <i className="fas fa-plus"></i> Add Post
          </button>
          <div className={styles.forumPosts}>
            {forumPosts.length > 0 ? (
              forumPosts.map(post => (
                <ForumPostCard
                  key={post.id}
                  post={post}
                  user={user}
                  generateAvatar={generateAvatar}
                  svgToDataUrl={svgToDataUrl}
                  toggleLike={toggleLike}
                  toggleComments={toggleComments}
                  showComments={showComments}
                  newComment={newComment}
                  setNewComment={setNewComment}
                  addComment={addComment}
                  deleteForumPost={deleteForumPost}
                  operationInProgress={operationInProgress}
                />
              ))
            ) : (
              <div className={styles.emptyState}>
                <i className="fas fa-comments"></i>
                <p>No forum posts yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'help' && (
        <div className={styles.contentSection}>
          <div className={styles.helpCenter}>
            <h1><i className="fas fa-tools"></i> TradeConnect Help Center</h1>
            <p>Find answers to common questions and learn how to use TradeConnect</p>
            <div className={styles.helpSearch}>
              <input 
                type="text" 
                placeholder="Search help articles..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button id="searchHelpBtn">
                <i className="fas fa-search"></i>
              </button>
            </div>
            {!selectedArticle ? (
              <>
                <div className={styles.helpCategories}>
                  {['Getting Started', 'Marketplace', 'Messaging'].map(category => (
                    <button 
                      key={category}
                      className={styles.categoryCard} 
                      onClick={() => showHelpArticles(category)}
                    >
                      <i className={`fas fa-${category === 'Getting Started' ? 'user' : category === 'Marketplace' ? 'store' : 'comments'}`}></i>
                      <h3>{category}</h3>
                      <p>{category === 'Getting Started' ? 'Learn how to create an account and set up your profile' : 
                          category === 'Marketplace' ? 'How to buy, sell and trade items in the marketplace' : 
                          'How to communicate with other users safely'}</p>
                    </button>
                  ))}
                </div>
                <div className={styles.helpArticles}>
                  {filteredHelpArticles.length > 0 ? (
                    filteredHelpArticles.map(article => (
                      <button 
                        key={article.id} 
                        className={styles.articleCard}
                        onClick={() => showHelpArticleDetail(article)}
                      >
                        <h3>{article.title}</h3>
                        <div className={styles.articleMeta}>
                          <span>{article.category}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className={styles.emptyState}>
                      <i className="fas fa-search"></i>
                      <p>No articles found matching your search</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className={styles.articleDetail}>
                <button className={styles.backToList} onClick={backToHelpList}>
                  <i className="fas fa-arrow-left"></i> Back to list
                </button>
                <h2>{selectedArticle.title}</h2>
                <div className={styles.articleMeta}>
                  <span>{selectedArticle.category}</span>
                </div>
                <div className={styles.articleContent}>
                  <p>{selectedArticle.content}</p>
                </div>
                <div className={styles.articleFeedback}>
                  <p>Was this article helpful?</p>
                  <button className={styles.feedbackBtn} onClick={() => submitFeedback('yes')}>
                    <i className="fas fa-thumbs-up"></i> Yes
                  </button>
                  <button className={styles.feedbackBtn} onClick={() => submitFeedback('no')}>
                    <i className="fas fa-thumbs-down"></i> No
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}