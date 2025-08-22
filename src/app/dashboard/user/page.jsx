"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { removeFdProcessedId } from '@/utils/removeFdProcessedId';
import { useRouter } from 'next/navigation';
import { useAppActions, useAppState } from '@/app/context/AppContext';
import styles from './page.module.css';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';
import ContentSection from '../../../components/ContentSection';
import AddPostModal from '../../../components/AddPostModal';
import AddForumPostModal from '../../../components/AddForumPostModal';
import TradeOfferModal from '../../../components/TradeOfferModal';
import SettingsModal from '../../../components/SettingsModal';
import ReportModal from '../../../components/ReportModal';
import WelcomeModal from '../../../components/WelcomeModal';
import NotificationsModal from '../../../components/NotificationsModal';

export default function UserPage() {
  const { user, isAuthenticated, userRole } = useAppState();
  const { addPost, logout } = useAppActions();
  const router = useRouter();
  const dropdownRef = useRef(null);
  const messagesEndRef = useRef(null);
  const forumPostFormRef = useRef(null);

  // State initialization - moved complex objects to useMemo
  const [activeSection, setActiveSection] = useState('home');
  const [activeProfileTab, setActiveProfileTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [forumPosts, setForumPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState(6);
  const [currentCategory, setCurrentCategory] = useState('all');
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [showTradeOfferModal, setShowTradeOfferModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showAddForumPostModal, setShowAddForumPostModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [isSelling, setIsSelling] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [postImages, setPostImages] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [helpArticles, setHelpArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newForumPost, setNewForumPost] = useState({
    title: '',
    content: '',
    category: 'general'
  });
  const [selectedPost, setSelectedPost] = useState(null);
  const [likes, setLikes] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState({});
  const [tradeRequests, setTradeRequests] = useState([]);
  const [selectedTradeRequest, setSelectedTradeRequest] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [userItemsForTrade, setUserItemsForTrade] = useState([]);
  const [operationInProgress, setOperationInProgress] = useState(false);

  // Memoized sample data to prevent recreation on every render
  const samplePosts = useRef([
    {
      id: '1',
      item: {
        title: 'Wireless Headphones',
        description: 'Brand new wireless headphones with noise cancellation',
        category: 'Electronics',
        quantity: 1,
        isSelling: true,
        price: 2500,
        tradeFor: '',
        userId: 'user1',
        isAvailable: true,
        createdAt: new Date(),
        images: ['https://picsum.photos/seed/headphones/300/200'],
        nickname: 'TechGuy',
        zone: '5'
      },
      userData: {
        username: 'TechGuy',
        photoURL: '',
        location: 'Zone 5, Barangay Bulihan',
        zone: '5',
        role: 'user',
        emailVerified: true,
        nickname: 'TechGuy'
      },
      likeCount: 2,
      userLiked: false,
      comments: []
    },
    // ... other sample posts
  ]).current;

  const sampleForumPosts = useRef([
    {
      id: '1',
      post: {
        title: 'Best places to meet for trades',
        content: 'Mag ingat sa mga asong gala',
        category: 'Tips',
        userId: 'Leo',
        createdAt: new Date(),
        nickname: 'SafetyFirst',
        zone: '5'
      },
      userData: {
        username: 'SafetyFirst',
        photoURL: '',
        location: 'Zone 5, Barangay Bulihan',
        zone: '5',
        role: 'mat',
        emailVerified: true,
        nickname: 'SafetyFirst'
      },
      likeCount: 1,
      userLiked: false,
      comments: [],
      createdAt: new Date()
    }
  ]).current;

  useEffect(() => {
    const cleanup = removeFdProcessedId();
    return () => cleanup && cleanup();
  }, []);

  // Optimized data initialization
  useEffect(() => {
    // Only initialize if data is empty
    if (posts.length === 0) {
      setPosts(samplePosts);
    }
    
    if (forumPosts.length === 0) {
      setForumPosts(sampleForumPosts);
    }

    if (helpArticles.length === 0) {
      setHelpArticles([
        { id: '1', title: 'How to create an account', category: 'Getting Started', content: '...' },
        // ... other articles
      ]);
    }

    if (notifications.length === 0) {
      setNotifications([
        {
          id: '1',
          type: "trade",
          message: "Leo wants to trade for your headphones",
          read: false,
          createdAt: new Date()
        }
      ]);
      setUnreadCount(1);
    }

    if (tradeRequests.length === 0) {
      setTradeRequests([
        {
          id: '1',
          offeredItemId: '2',
          requestedItemId: '1',
          buyerId: 'mat',
          sellerId: 'kat',
          status: "pending",
          message: "I'd like to trade my watch for your headphones",
          createdAt: new Date(),
          participants: ['mat', 'kat']
        }
      ]);
    }

    if (reviews.length === 0) {
      setReviews([
        {
          id: '1',
          tradeId: '0',
          userId: '',
          reviewerId: 'kat',
          rating: 0,
          comment: 'Great trade experience!',
          createdAt: new Date()
        }
      ]);
    }

    if (chatUsers.length === 0) {
      setChatUsers([
        {
          id: '1',
          participants: ['Leo', 'Kat'],
          lastUpdated: new Date(),
          lastMessage: "Hello interesado po ako",
          otherUser: {
            username: 'TradePartner',
            photoURL: '',
            nickname: 'TradePartner'
          }
        }
      ]);
    }

    if (userItemsForTrade.length === 0) {
      setUserItemsForTrade([
        {
          id: '2',
          item: {
            title: 'Vintage Watch',
            description: 'Classic vintage watch from the 1970s',
            images: ['https://picsum.photos/seed/watch/300/200'],
            isAvailable: true,
            isSelling: false
          }
        }
      ]);
    }

    if (typeof window !== 'undefined' && !localStorage.getItem('welcomeShown')) {
      setShowWelcomeModal(true);
      localStorage.setItem('welcomeShown', 'true');
    }
  }, [posts.length, forumPosts.length, helpArticles.length, notifications.length, 
      tradeRequests.length, reviews.length, chatUsers.length, userItemsForTrade.length]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Memoized functions to prevent unnecessary re-renders
  const generateAvatar = useCallback((username) => {
    const initials = username ? username.charAt(0).toUpperCase() : 'U';
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3'];
    const color = colors[initials.charCodeAt(0) % colors.length];
    return `
      <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="50" fill="${color}"/>
        <text x="50%" y="50%" fill="#ffffff" font-family="Arial, sans-serif" font-size="50" text-anchor="middle" dominant-baseline="middle">
          ${initials}
        </text>
      </svg>
    `;
  }, []);

  const svgToDataUrl = useCallback((svg) => `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`, []);

  const showToast = useCallback((message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  }, []);

  // Memoized handler functions
  const filterItems = useCallback((category) => {
    setCurrentCategory(category);
    setVisiblePosts(6); // Reset visible posts when filtering
  }, []);

  const loadMorePosts = useCallback(() => {
    setVisiblePosts(prev => prev + 6);
  }, []);

  const handleImageUpload = useCallback((event) => {
    const files = Array.from(event.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      setPostImages(prev => [...prev, ...images].slice(0, 5)); // Max 5 images
    });
  }, []);

  const removeImage = useCallback((index) => {
    setPostImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const toggleLike = useCallback((postId, postType = 'item') => {
    if (postType === 'item') {
      setLikes(prev => ({
        ...prev,
        [postId]: !prev[postId]
      }));
      setLikeCounts(prev => ({
        ...prev,
        [postId]: (prev[postId] || 0) + (likes[postId] ? -1 : 1)
      }));
    } else {
      // Handle forum post likes
      setForumPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            userLiked: !post.userLiked,
            likeCount: post.likeCount + (post.userLiked ? -1 : 1)
          };
        }
        return post;
      }));
    }
  }, [likes]);

  const toggleComments = useCallback((postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  }, []);

  const addComment = useCallback((postId, postType = 'item') => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now().toString(),
      text: newComment,
      userId: user?.uid || 'current-user',
      username: user?.displayName || user?.nickname || 'Anonymous',
      createdAt: new Date()
    };

    if (postType === 'item') {
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), comment]
      }));
    } else {
      setForumPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, comment]
          };
        }
        return post;
      }));
    }
    
    setNewComment('');
  }, [newComment, user]);

  const offerTrade = useCallback((post) => {
    setSelectedPost(post);
    setShowTradeOfferModal(true);
  }, []);

  const buyItem = useCallback(async (post) => {
    setOperationInProgress(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('Purchase request sent!', 'success');
    } catch (error) {
      showToast('Failed to send purchase request', 'error');
    } finally {
      setOperationInProgress(false);
    }
  }, [showToast]);

  const deletePost = useCallback(async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    setOperationInProgress(true);
    try {
      setPosts(prev => prev.filter(post => post.id !== postId));
      showToast('Post deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete post', 'error');
    } finally {
      setOperationInProgress(false);
    }
  }, [showToast]);

  const deleteForumPost = useCallback(async (postId) => {
    if (!confirm('Are you sure you want to delete this forum post?')) return;
    
    setOperationInProgress(true);
    try {
      setForumPosts(prev => prev.filter(post => post.id !== postId));
      showToast('Forum post deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete forum post', 'error');
    } finally {
      setOperationInProgress(false);
    }
  }, [showToast]);

  const handlePostSubmit = useCallback(async (formData) => {
    setOperationInProgress(true);
    try {
      const newPost = {
        id: Date.now().toString(),
        item: {
          title: formData.title,
          description: formData.description,
          category: selectedCategory,
          quantity: formData.quantity || 1,
          isSelling: isSelling,
          price: formData.price || 0,
          tradeFor: formData.tradeFor || '',
          userId: user?.uid || 'current-user',
          isAvailable: true,
          createdAt: new Date(),
          images: postImages,
          nickname: user?.displayName || user?.nickname || 'Anonymous',
          zone: user?.zone || '1'
        },
        userData: {
          username: user?.displayName || 'Anonymous',
          photoURL: user?.photoURL || '',
          location: user?.location || 'Unknown',
          zone: user?.zone || '1',
          role: user?.role || 'user',
          emailVerified: user?.emailVerified || false,
          nickname: user?.nickname || 'Anonymous'
        },
        likeCount: 0,
        userLiked: false,
        comments: []
      };

      setPosts(prev => [newPost, ...prev]);
      setShowAddPostModal(false);
      setPostImages([]);
      setSelectedCategory('');
      showToast('Post created successfully!', 'success');
    } catch (error) {
      showToast('Failed to create post', 'error');
    } finally {
      setOperationInProgress(false);
    }
  }, [isSelling, postImages, selectedCategory, user, showToast]);

  const handleForumPostSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!newForumPost.title.trim() || !newForumPost.content.trim()) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setOperationInProgress(true);
    try {
      const forumPost = {
        id: Date.now().toString(),
        post: {
          title: newForumPost.title,
          content: newForumPost.content,
          category: newForumPost.category,
          userId: user?.uid || 'current-user',
          createdAt: new Date(),
          nickname: user?.displayName || user?.nickname || 'Anonymous',
          zone: user?.zone || '1'
        },
        userData: {
          username: user?.displayName || 'Anonymous',
          photoURL: user?.photoURL || '',
          location: user?.location || 'Unknown',
          zone: user?.zone || '1',
          role: user?.role || 'user',
          emailVerified: user?.emailVerified || false,
          nickname: user?.nickname || 'Anonymous'
        },
        likeCount: 0,
        userLiked: false,
        comments: [],
        createdAt: new Date()
      };

      setForumPosts(prev => [forumPost, ...prev]);
      setNewForumPost({ title: '', content: '', category: 'general' });
      setShowAddForumPostModal(false);
      showToast('Forum post created successfully!', 'success');
    } catch (error) {
      showToast('Failed to create forum post', 'error');
    } finally {
      setOperationInProgress(false);
    }
  }, [newForumPost, user, showToast]);

  const respondToTrade = useCallback(async (requestId, response, message = '') => {
    setOperationInProgress(true);
    try {
      setTradeRequests(prev => prev.map(request => 
        request.id === requestId 
          ? { ...request, status: response, responseMessage: message }
          : request
      ));
      showToast(`Trade ${response}`, 'success');
    } catch (error) {
      showToast('Failed to respond to trade', 'error');
    } finally {
      setOperationInProgress(false);
    }
  }, [showToast]);

  const submitTradeOffer = useCallback(async (offerData) => {
    setOperationInProgress(true);
    try {
      const newTradeRequest = {
        id: Date.now().toString(),
        offeredItemId: offerData.offeredItemId,
        requestedItemId: selectedPost.id,
        buyerId: user?.uid || 'current-user',
        sellerId: selectedPost.item.userId,
        status: 'pending',
        message: offerData.message,
        createdAt: new Date(),
        participants: [user?.uid || 'current-user', selectedPost.item.userId]
      };

      setTradeRequests(prev => [newTradeRequest, ...prev]);
      setShowTradeOfferModal(false);
      setSelectedPost(null);
      showToast('Trade offer sent!', 'success');
    } catch (error) {
      showToast('Failed to send trade offer', 'error');
    } finally {
      setOperationInProgress(false);
    }
  }, [selectedPost, user, showToast]);

  const sendMessage = useCallback((message) => {
    if (!message.trim() || !selectedChatUser) return;

    const newMsg = {
      id: Date.now().toString(),
      text: message,
      senderId: user?.uid || 'current-user',
      receiverId: selectedChatUser.id,
      timestamp: new Date(),
      read: false
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
  }, [selectedChatUser, user]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const deleteChat = useCallback((chatId) => {
    setChatUsers(prev => prev.filter(chat => chat.id !== chatId));
    if (selectedChatUser?.id === chatId) {
      setSelectedChatUser(null);
      setMessages([]);
    }
  }, [selectedChatUser]);

  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  }, []);

  const deleteNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  }, [notifications]);

  const saveProfileSettings = useCallback(async (settings) => {
    setOperationInProgress(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('Profile updated successfully!', 'success');
      setShowSettingsModal(false);
    } catch (error) {
      showToast('Failed to update profile', 'error');
    } finally {
      setOperationInProgress(false);
    }
  }, [showToast]);

  const startTour = useCallback(() => {
    setShowWelcomeModal(false);
    showToast('Welcome to the platform!', 'info');
  }, [showToast]);

  const showHelpArticles = useCallback(() => {
    setSelectedArticle(null);
  }, []);

  const showHelpArticleDetail = useCallback((article) => {
    setSelectedArticle(article);
  }, []);

  const backToHelpList = useCallback(() => {
    setSelectedArticle(null);
  }, []);

  const submitFeedback = useCallback(async (feedback) => {
    setOperationInProgress(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('Feedback submitted successfully!', 'success');
    } catch (error) {
      showToast('Failed to submit feedback', 'error');
    } finally {
      setOperationInProgress(false);
    }
  }, [showToast]);

  return (
    <div className={styles.container} style={{flex: 1, flexDirection: 'column'}}>
      <div style={{height: 40, width: '100%', backgroundColor: 'black'}}>
        <Header
          user={user}
          unreadCount={unreadCount}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          setShowNotificationsModal={setShowNotificationsModal}
          setShowSettingsModal={setShowSettingsModal}
          toggleMenu={() => setIsMenuOpen(!isMenuOpen)}
          generateAvatar={generateAvatar}
          svgToDataUrl={svgToDataUrl}
          logout={logout}
          showToast={showToast}
          dropdownRef={dropdownRef}
        />
      </div>
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        unreadCount={unreadCount}
      />
      <ContentSection
        activeSection={activeSection}
        posts={posts}
        forumPosts={forumPosts}
        currentCategory={currentCategory}
        filterItems={filterItems}
        visiblePosts={visiblePosts}
        loadMorePosts={loadMorePosts}
        user={user}
        generateAvatar={generateAvatar}
        svgToDataUrl={svgToDataUrl}
        showToast={showToast}
        toggleLike={toggleLike}
        toggleComments={toggleComments}
        showComments={showComments}
        newComment={newComment}
        setNewComment={setNewComment}
        addComment={addComment}
        offerTrade={offerTrade}
        buyItem={buyItem}
        deletePost={deletePost}
        deleteForumPost={deleteForumPost}
        setShowAddPostModal={setShowAddPostModal}
        activeProfileTab={activeProfileTab}
        setActiveProfileTab={setActiveProfileTab}
        tradeRequests={tradeRequests}
        respondToTrade={respondToTrade}
        reviews={reviews}
        chatUsers={chatUsers}
        selectedChatUser={selectedChatUser}
        setSelectedChatUser={setSelectedChatUser}
        messages={messages}
        setMessages={setMessages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
        clearChat={clearChat}
        deleteChat={deleteChat}
        setShowReportModal={setShowReportModal}
        helpArticles={helpArticles}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedArticle={selectedArticle}
        showHelpArticles={showHelpArticles}
        showHelpArticleDetail={showHelpArticleDetail}
        backToHelpList={backToHelpList}
        submitFeedback={submitFeedback}
        operationInProgress={operationInProgress}
        messagesEndRef={messagesEndRef}
      />
      {showAddPostModal && (
        <AddPostModal
          isSelling={isSelling}
          setIsSelling={setIsSelling}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          postImages={postImages}
          handleImageUpload={handleImageUpload}
          removeImage={removeImage}
          handlePostSubmit={handlePostSubmit}
          operationInProgress={operationInProgress}
          setShowAddPostModal={setShowAddPostModal}
          showToast={showToast}
        />
      )}
      {showAddForumPostModal && (
        <AddForumPostModal
          newForumPost={newForumPost}
          setNewForumPost={setNewForumPost}
          handleForumPostSubmit={handleForumPostSubmit}
          operationInProgress={operationInProgress}
          setShowAddForumPostModal={setShowAddForumPostModal}
          forumPostFormRef={forumPostFormRef}
        />
      )}
      {showTradeOfferModal && selectedPost && (
        <TradeOfferModal
          selectedPost={selectedPost}
          userItemsForTrade={userItemsForTrade}
          submitTradeOffer={submitTradeOffer}
          operationInProgress={operationInProgress}
          setShowTradeOfferModal={setShowTradeOfferModal}
        />
      )}
      {showSettingsModal && (
        <SettingsModal
          user={user}
          generateAvatar={generateAvatar}
          svgToDataUrl={svgToDataUrl}
          saveProfileSettings={saveProfileSettings}
          operationInProgress={operationInProgress}
          setShowSettingsModal={setShowSettingsModal}
        />
      )}
      {showReportModal && (
        <ReportModal
          operationInProgress={operationInProgress}
          setShowReportModal={setShowReportModal}
          showToast={showToast}
        />
      )}
      {showWelcomeModal && (
        <WelcomeModal
          startTour={startTour}
          operationInProgress={operationInProgress}
          setShowWelcomeModal={setShowWelcomeModal}
        />
      )}
      {showNotificationsModal && (
        <NotificationsModal
          notifications={notifications}
          markAsRead={markAsRead}
          markAllAsRead={markAllAsRead}
          deleteNotification={deleteNotification}
          operationInProgress={operationInProgress}
          setShowNotificationsModal={setShowNotificationsModal}
          setActiveSection={setActiveSection}
          setActiveProfileTab={setActiveProfileTab}
          unreadCount={unreadCount}
        />
      )}
      {toast && (
        <div className={`${styles.toast} ${styles['toast-' + toast.type]}`}>
          <i className={`fas ${
            toast.type === 'success' ? 'fa-check-circle' : 
            toast.type === 'error' ? 'fa-exclamation-circle' : 
            'fa-info-circle'
          }`}></i>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}