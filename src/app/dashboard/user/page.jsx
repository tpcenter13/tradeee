"use client";
import { useState, useEffect, useRef } from 'react';
import { removeFdProcessedId } from '@/utils/removeFdProcessedId';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { useAppActions, useAppState } from '@/app/context/AppContext';

export default function UserPage() {
  
  const { user, isAuthenticated, userRole } = useAppState();
  const { addPost, logout } = useAppActions();
  
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

  const router = useRouter();
  const dropdownRef = useRef(null);
  const messagesEndRef = useRef(null);
  const forumPostFormRef = useRef(null);

  
  useEffect(() => {
    const cleanup = removeFdProcessedId();
    return () => cleanup && cleanup();
  }, []);

  useEffect(() => {
   
    const samplePosts = [
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
      {
        id: '2',
        item: {
          title: 'Vintage Watch',
          description: 'Classic vintage watch from the 1970s, good condition',
          category: 'Fashion & Apparel',
          quantity: 1,
          isSelling: false,
          price: 0,
          tradeFor: 'Electronics or other watches',
          userId: 'cat',
          isAvailable: true,
          createdAt: new Date(),
          images: ['https://picsum.photos/seed/watch/300/200'],
          nickname: 'WatchCollector',
          zone: '5'
        },
        userData: {
          username: 'WatchCollector',
          photoURL: '',
          location: 'Zone 5, Barangay Bulihan',
          zone: '5',
          role: 'mat',
          emailVerified: true,
          nickname: 'WatchCollector'
        },
        likeCount: 2,
        userLiked: true,
        comments: []
      }
    ];

    setPosts(samplePosts);

    // Load forum posts
    const sampleForumPosts = [
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
    ];

    setForumPosts(sampleForumPosts);

    
    const articles = [
      { id: '1', title: 'How to create an account', category: 'Getting Started', content: 'Creating an account is easy. Just click on the "Sign Up" button and follow the instructions.' },
      { id: '2', title: 'Listing an item for sale', category: 'Marketplace', content: 'To list an item for sale, click the "+" button on the marketplace page.' },
      { id: '3', title: 'Avoiding scams', category: 'Safety', content: 'Here are some tips to avoid scams: Always meet in public places.' }
    ];
    setHelpArticles(articles);

    
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

    
    if (typeof window !== 'undefined' && !localStorage.getItem('welcomeShown')) {
      setShowWelcomeModal(true);
      localStorage.setItem('welcomeShown', 'true');
    }
  }, []);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  
  const generateAvatar = (username) => {
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
  };

  const svgToDataUrl = (svg) => {
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  };

  const filterItems = (category) => {
    setCurrentCategory(category);
  };

  const loadMorePosts = () => {
    setVisiblePosts(prev => prev + 6);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + postImages.length > 6) {
      showToast("Maximum 6 images allowed", 'error');
      return;
    }
    
    const newImages = [];
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = (event) => {
        newImages.push(event.target.result);
        if (newImages.length === files.length) {
          setPostImages(prev => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index) => {
    setPostImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const showToast = (message, type) => {
    if (type === 'error') {
      console.error(message);
    }
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const startTour = () => {
    showToast("Welcome tour started!", 'info');
    setShowWelcomeModal(false);
  };

  const showHelpArticles = (category) => {
    setSearchQuery(category);
  };

  const showHelpArticleDetail = (article) => {
    setSelectedArticle(article);
  };

  const backToHelpList = () => {
    setSelectedArticle(null);
  };

  const submitFeedback = (feedback) => {
    showToast(`Feedback submitted: ${feedback === 'yes' ? 'Helpful' : 'Not helpful'}`, 'success');
  };

  const filteredHelpArticles = helpArticles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  
  const offerTrade = async (postId) => {
    if (operationInProgress) return;
    setOperationInProgress(true);
    
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) {
        showToast("Item not found", 'error');
        setOperationInProgress(false);
        return;
      }
      
      setSelectedPost(post);
      setShowTradeOfferModal(true);
    } catch (error) {
      console.error("Error preparing trade offer:", error);
      showToast("Failed to prepare trade offer", 'error');
    } finally {
      setOperationInProgress(false);
    }
  };

  const submitTradeOffer = async (e) => {
    e.preventDefault();
    if (operationInProgress) return;
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const offeredItemId = formData.get('offeredItem');
    const message = formData.get('message')?.trim() || 'I would like to trade with you';
    
    t
    if (!offeredItemId) {
      showToast("Please select an item to trade", 'error');
      return;
    }
    
    if (!selectedPost) {
      showToast("The item you're trying to trade for is no longer available. Please refresh the page and try again.", 'error');
      return;
    }
    
    setOperationInProgress(true);
    
    try {
      
      const tradeRequest = {
        id: `trade_${Date.now()}`,
        offeredItemId,
        requestedItemId: selectedPost.id,
        buyerId: user.uid,
        sellerId: selectedPost.userId,
        status: 'pending',
        message,
        createdAt: new Date(),
        participants: [user.uid, selectedPost.userId],
        item: {
          ...selectedPost.item,
          isAvailable: false 
        }
      };
      
      
      setTradeRequests(prev => [tradeRequest, ...prev]);
      
      
      showToast("Trade offer sent successfully!", 'success');
      
      
      form.reset();
      setShowTradeOfferModal(false);
      setSelectedPost(null);
      
    } catch (error) {
      console.error("Error submitting trade offer:", error);
      showToast("Failed to submit trade offer. Please try again.", 'error');
    } finally {
      setOperationInProgress(false);
    }
  };

  const respondToTrade = async (tradeId, response) => {
    if (operationInProgress) return;
    setOperationInProgress(true);
    
    try {
      showToast(`Trade ${response} successfully`, 'success');
    } catch (error) {
      console.error("Error responding to trade:", error);
      showToast(`Failed to ${response} trade`, 'error');
    } finally {
      setOperationInProgress(false);
    }
  };

  
  const buyItem = async (postId) => {
    if (operationInProgress) return;
    setOperationInProgress(true);
    
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) {
        showToast("Item not found", 'error');
        setOperationInProgress(false);
        return;
      }
      
      
      showToast("Chat started with seller", 'success');
    } catch (error) {
      console.error("Error initiating purchase:", error);
      showToast("Failed to initiate purchase", 'error');
    } finally {
      setOperationInProgress(false);
    }
  };

  
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (operationInProgress) return;
    setOperationInProgress(true);
    
    try {
      const title = e.target.postTitle?.value.trim();
      const description = e.target.postDescription?.value.trim();
      const quantity = parseInt(e.target.postQuantity?.value);
      const price = isSelling ? parseFloat(e.target.itemPrice?.value) : 0;
      const tradeFor = isSelling ? '' : e.target.tradeFor?.value.trim();
      
      if (!title || !description || !selectedCategory || !quantity || quantity < 1 || 
          (isSelling && (!price || price <= 0))) {
        showToast("Please fill in all required fields correctly", 'error');
        setOperationInProgress(false);
        return;
      }
      
      if (postImages.length < 3) {
        showToast("Please upload at least 3 images", 'error');
        setOperationInProgress(false);
        return;
      }

      
      const newPost = {
        id: Date.now().toString(),
        item: {
          title,
          description,
          category: selectedCategory,
          quantity,
          isSelling,
          price,
          tradeFor,
          userId: user.uid,
          isAvailable: true,
          createdAt: new Date(),
          images: postImages,
          nickname: user.nickname,
          zone: user.zone
        },
        userData: {
          username: user.nickname,
          photoURL: user.photoURL,
          location: user.location,
          zone: user.zone,
          role: user.role,
          emailVerified: true,
          nickname: user.nickname
        },
        likeCount: 0,
        userLiked: false,
        comments: []
      };

      setPosts(prev => [newPost, ...prev]);
      showToast("Item posted successfully!", 'success');
      setShowAddPostModal(false);
      setPostImages([]);
    } catch (error) {
      console.error("Error submitting post:", error);
      showToast(`Error: ${error.message}`, 'error');
    } finally {
      setOperationInProgress(false);
    }
  };

  const handleForumPostSubmit = async (e) => {
    e.preventDefault();
    if (operationInProgress) return;
    setOperationInProgress(true);
    
    try {
      if (!newForumPost.title.trim() || !newForumPost.content.trim()) {
        showToast("Please fill in all required fields", 'error');
        setOperationInProgress(false);
        return;
      }


      const newPost = {
        id: Date.now().toString(),
        post: {
          title: newForumPost.title,
          content: newForumPost.content,
          category: newForumPost.category,
          userId: user.uid,
          createdAt: new Date(),
          nickname: user.nickname,
          zone: user.zone
        },
        userData: {
          username: user.nickname,
          photoURL: user.photoURL,
          location: user.location,
          zone: user.zone,
          role: user.role,
          emailVerified: true,
          nickname: user.nickname
        },
        likeCount: 0,
        userLiked: false,
        comments: [],
        createdAt: new Date()
      };

      setForumPosts(prev => [newPost, ...prev]);
      showToast("Forum post created successfully!", 'success');
      setShowAddForumPostModal(false);
      setNewForumPost({
        title: '',
        content: '',
        category: 'general'
      });
    } catch (error) {
      console.error("Error submitting forum post:", error);
      showToast(`Error: ${error.message}`, 'error');
    } finally {
      setOperationInProgress(false);
    }
  };

  const toggleLike = async (postId, type) => {
    if (operationInProgress) return;
    setOperationInProgress(true);
    
    try {
      
      if (type === 'item') {
        setPosts(posts.map(post => 
          post.id === postId ? { 
            ...post, 
            likeCount: post.userLiked ? post.likeCount - 1 : post.likeCount + 1,
            userLiked: !post.userLiked 
          } : post
        ));
      } else {
        setForumPosts(forumPosts.map(post => 
          post.id === postId ? { 
            ...post, 
            likeCount: post.userLiked ? post.likeCount - 1 : post.likeCount + 1,
            userLiked: !post.userLiked 
          } : post
        ));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      showToast("Failed to update like", 'error');
    } finally {
      setOperationInProgress(false);
    }
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const addComment = async (postId, type) => {
    if (operationInProgress) return;
    setOperationInProgress(true);
    
    try {
      if (!newComment.trim()) {
        showToast("Comment cannot be empty", 'error');
        setOperationInProgress(false);
        return;
      }

      
      const newCommentObj = {
        id: Date.now().toString(),
        content: newComment,
        userId: user.uid,
        userData: {
          username: user.nickname,
          photoURL: user.photoURL,
          nickname: user.nickname
        },
        createdAt: new Date()
      };

      if (type === 'item') {
        setPosts(posts.map(post => 
          post.id === postId ? { 
            ...post, 
            comments: [newCommentObj, ...(post.comments || [])] 
          } : post
        ));
      } else {
        setForumPosts(forumPosts.map(post => 
          post.id === postId ? { 
            ...post, 
            comments: [newCommentObj, ...(post.comments || [])] 
          } : post
        ));
      }
      
      setNewComment('');
    } catch (error) {
      console.error("Error adding comment:", error);
      showToast("Failed to add comment", 'error');
    } finally {
      setOperationInProgress(false);
    }
  };

  const deletePost = async (postId) => {
    if (operationInProgress) return;
    setOperationInProgress(true);
    
    try {
      if (window.confirm("Are you sure you want to delete this post?")) {
        setPosts(posts.filter(post => post.id !== postId));
        showToast("Post deleted successfully", 'success');
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      showToast("Failed to delete post", 'error');
    } finally {
      setOperationInProgress(false);
    }
  };

  const deleteForumPost = async (postId) => {
    if (operationInProgress) return;
    setOperationInProgress(true);
    
    try {
      if (window.confirm("Are you sure you want to delete this post?")) {
        setForumPosts(forumPosts.filter(post => post.id !== postId));
        showToast("Forum post deleted successfully", 'success');
      }
    } catch (error) {
      console.error("Error deleting forum post:", error);
      showToast("Failed to delete forum post", 'error');
    } finally {
      setOperationInProgress(false);
    }
  };

  const sendMessage = async () => {
    if (operationInProgress || !newMessage.trim() || !selectedChatUser) return;
    setOperationInProgress(true);
    
    try {
      
      const newMsg = {
        id: Date.now().toString(),
        content: newMessage,
        senderId: user.uid,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
      showToast("Failed to send message", 'error');
    } finally {
      setOperationInProgress(false);
    }
  };

  const clearChat = async () => {
    if (operationInProgress || !selectedChatUser) return;
    setOperationInProgress(true);
    
    try {
      if (window.confirm("Are you sure you want to clear this chat?")) {
        setMessages([]);
        showToast("Chat cleared", 'success');
      }
    } catch (error) {
      console.error("Error clearing chat:", error);
      showToast("Failed to clear chat", 'error');
    } finally {
      setOperationInProgress(false);
    }
  };

  const deleteChat = async () => {
    if (operationInProgress || !selectedChatUser) return;
    setOperationInProgress(true);
    
    try {
      if (window.confirm("Are you sure you want to delete this chat?")) {
        setChatUsers(chatUsers.filter(chat => chat.id !== selectedChatUser.id));
        setSelectedChatUser(null);
        showToast("Chat deleted", 'success');
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      showToast("Failed to delete chat", 'error');
    } finally {
      setOperationInProgress(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      
      setNotifications(notifications.filter(n => n.id !== notificationId));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const saveProfileSettings = async () => {
    if (operationInProgress) return;
    setOperationInProgress(true);
    
    try {
      const nickname = document.getElementById('nickname')?.value.trim();
      const zone = document.getElementById('zone')?.value;
      const contact = document.getElementById('contact')?.value.trim();
      const gcash = document.getElementById('gcash')?.value.trim();
      const bio = document.getElementById('bio')?.value.trim();
      
      if (!nickname) {
        showToast("Nickname is required", 'error');
        setOperationInProgress(false);
        return;
      }
      
      
      setUser(prev => ({
        ...prev,
        nickname,
        zone,
        contact,
        gcash,
        bio
      }));
      
      showToast("Profile updated successfully", 'success');
      setShowSettingsModal(false);
    } catch (error) {
      console.error("Error saving profile settings:", error);
      showToast("Failed to update profile", 'error');
    } finally {
      setOperationInProgress(false);
    }
  };

  
  return (
    <div className={styles.container}>
      {}
      <div className={styles.mobileHeader}>
        <button className={styles.menuButton} onClick={toggleMenu} aria-label="Toggle menu">
          <i className="fas fa-bars"></i>
        </button>
        <div className={styles.mobileLogo}>
          <div className={styles.logo}>
            <img src="/logo.png" alt="Logo" onError={(e) => e.target.src = '/default-avatar.png'} />
          </div>
          <span>TradeConnect</span>
        </div>
        <div className={styles.mobileUser} onClick={toggleDropdown}>
          <img 
            src={user?.photoURL || svgToDataUrl(generateAvatar(user?.username))} 
            alt="Profile" 
            className={styles.userAvatar} 
          />
        </div>
      </div>

      {}
      <div className={`${styles.sidebar} ${isMenuOpen ? styles.open : ''}`}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <img src="/logo.png" alt="Logo" onError={(e) => e.target.src = '/default-avatar.png'} />
          </div>
          <span className={styles.logoText}>TradeConnect</span>
        </div>
        
        <ul className={styles.navMenu}>
          <li className={styles.navItem}>
            <button 
              className={`${styles.navLink} ${activeSection === 'home' ? styles.active : ''}`}
              onClick={() => { setActiveSection('home'); setIsMenuOpen(false); }}
            >
              <i className="fas fa-home"></i>
              <span>Home</span>
            </button>
          </li>
          <li className={styles.navItem}>
            <button 
              className={`${styles.navLink} ${activeSection === 'profile' ? styles.active : ''}`}
              onClick={() => { setActiveSection('profile'); setIsMenuOpen(false); }}
            >
              <i className="fas fa-user"></i>
              <span>Profile</span>
            </button>
          </li>
          <li className={styles.navItem}>
            <button 
              className={`${styles.navLink} ${activeSection === 'messages' ? styles.active : ''}`}
              onClick={() => { setActiveSection('messages'); setIsMenuOpen(false); }}
            >
              <i className="fas fa-comments"></i>
              <span>Messages</span>
              {unreadCount > 0 && (
                <span className={styles.sidebarNotificationBadge}>{unreadCount}</span>
              )}
            </button>
          </li>
          <li className={styles.navItem}>
            <button 
              className={`${styles.navLink} ${activeSection === 'marketplace' ? styles.active : ''}`}
              onClick={() => { setActiveSection('marketplace'); setIsMenuOpen(false); }}
            >
              <i className="fas fa-store"></i>
              <span>Marketplace</span>
            </button>
          </li>
          <li className={styles.navItem}>
            <button 
              className={`${styles.navLink} ${activeSection === 'community' ? styles.active : ''}`}
              onClick={() => { setActiveSection('community'); setIsMenuOpen(false); }}
            >
              <i className="fas fa-users"></i>
              <span>Community Forum</span>
            </button>
          </li>
          <li className={styles.navItem}>
            <button 
              className={`${styles.navLink} ${activeSection === 'help' ? styles.active : ''}`}
              onClick={() => { setActiveSection('help'); setIsMenuOpen(false); }}
            >
              <i className="fas fa-question-circle"></i>
              <span>Help Center</span>
            </button>
          </li>
        </ul>
      </div>

      {}
      <div className={styles.mainContent}>
        {}
        <div className={styles.topNav}>
          <div className={styles.searchBar}>
            <input 
              type="text" 
              placeholder="Search for items or users..." 
              onChange={(e) => setSearchQuery(e.target.value)}
              suppressHydrationWarning
            />
            <i className="fas fa-search"></i>
          </div>
          
          <div className={styles.userActions}>
            <div className={styles.notification} onClick={() => setShowNotificationsModal(true)}>
              <i className="fas fa-bell"></i>
              {unreadCount > 0 && (
                <span className={styles.notificationBadge}>{unreadCount}</span>
              )}
            </div>
            
            <div className={styles.userProfile} ref={dropdownRef}>
              <div className={styles.userInfo} onClick={toggleDropdown}>
                <img 
                  src={user?.photoURL || svgToDataUrl(generateAvatar(user?.username))} 
                  alt="Profile" 
                  className={styles.userAvatar} 
                />
                <div className={styles.userText}>
                  <span className={styles.userName}>{user?.nickname || user?.displayName || 'User'}</span>
                  <span className={styles.userEmail}>{user?.email}</span>
                </div>
              </div>
              
              {showDropdown && (
                <div className={styles.userDropdown}>
                  <button 
                    className={styles.dropdownItem} 
                    onClick={() => { setShowSettingsModal(true); setShowDropdown(false); }}
                  >
                    <i className="fas fa-cog"></i> Settings
                  </button>
                  <button 
                    className={styles.dropdownItem} 
                    onClick={async () => {
                      try {
                        const { signOut } = await import('firebase/auth');
                        const { auth } = await import('@/lib/firebase');
                        await signOut(auth);
                        logout();
                        
                        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                        
                        window.location.href = '/login';
                      } catch (error) {
                        console.error('Error signing out:', error);
                        showToast('Failed to sign out', 'error');
                      }
                    }}
                  >
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {}
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading...</p>
          </div>
        )}

        {}
        {operationInProgress && (
          <div className={styles.operationInProgress}>
            <div className={styles.loadingSpinner}></div>
            <p>Processing...</p>
          </div>
        )}

        {}
        {activeSection === 'home' && (
          <div className={styles.contentSection}>
            <div className={styles.homeHeader}>
              <h2>Home Feed</h2>
              <p>See what's new in your community</p>
            </div>
            
            <div className={styles.categoriesScroll}>
              <button 
                className={`${styles.category} ${currentCategory === 'all' ? styles.active : ''}`}
                onClick={() => filterItems('all')}
                suppressHydrationWarning
              >
                All Items
              </button>
              <button 
                className={`${styles.category} ${currentCategory === 'Fashion & Apparel' ? styles.active : ''}`}
                onClick={() => filterItems('Fashion & Apparel')}
                suppressHydrationWarning
              >
                Fashion & Apparel
              </button>
              <button 
                className={`${styles.category} ${currentCategory === 'Electronics' ? styles.active : ''}`}
                onClick={() => filterItems('Electronics')}
                suppressHydrationWarning
              >
                Electronics
              </button>
              <button 
                className={`${styles.category} ${currentCategory === 'Food & Beverages' ? styles.active : ''}`}
                onClick={() => filterItems('Food & Beverages')}
                suppressHydrationWarning
              >
                Food & Beverages
              </button>
              <button 
                className={`${styles.category} ${currentCategory === 'DIY & Hardware' ? styles.active : ''}`}
                onClick={() => filterItems('DIY & Hardware')}
                suppressHydrationWarning
              >
                DIY & Hardware
              </button>
              <button 
                className={`${styles.category} ${currentCategory === 'Health & Beauty' ? styles.active : ''}`}
                onClick={() => filterItems('Health & Beauty')}
                suppressHydrationWarning
              >
                Health & Beauty
              </button>
            </div>

            <div className={styles.listingsFeed}>
              {posts
                .filter(post => currentCategory === 'all' || post.item.category === currentCategory)
                .slice(0, visiblePosts)
                .map(post => (
                  <div key={post.id} className={styles.productCard}>
                    <span className={`${styles.productBadge} ${post.item.isSelling ? '' : styles.trade}`}>
                      {post.item.isSelling ? 'For Sale' : 'For Trade'}
                    </span>
                    <img 
                      src={post.item.images?.[0] || '/default-item.png'} 
                      alt={post.item.title} 
                      className={styles.productImage} 
                    />
                    <div className={styles.productInfo}>
                      <h3>{post.item.title}</h3>
                      <div className={styles.price}>
                        {post.item.isSelling ? `₱${post.item.price.toFixed(2)}` : 'Trade Only'}
                      </div>
                      {!post.item.isSelling && (
                        <p className={styles.tradeDescription}>
                          Willing to trade for: {post.item.tradeFor || 'Various items'}
                        </p>
                      )}
                      <div className={styles.productMeta}>
                        <div className={styles.userInfo}>
                          <img 
                            src={post.userData.photoURL || svgToDataUrl(generateAvatar(post.userData.username))} 
                            alt={post.userData.username} 
                            className={styles.userPhoto} 
                          />
                          <span>{post.item.nickname || post.userData.username}</span>
                        </div>
                        {post.userData.location && (
                          <div className={styles.location}>
                            <i className="fas fa-map-marker-alt"></i>
                            <span>{post.userData.location}</span>
                          </div>
                        )}
                        <span className={styles.datePosted}>
                          {post.item.createdAt
                            ? (typeof post.item.createdAt.toDate === 'function'
                                ? post.item.createdAt.toDate().toLocaleDateString()
                                : new Date(post.item.createdAt).toLocaleDateString())
                            : 'Recently'}
                        </span>
                      </div>
                    </div>
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
                      {!post.item.isSelling ? (
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

        {}
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
              <button 
                className={`${styles.profileTab} ${activeProfileTab === 'posts' ? styles.active : ''}`}
                onClick={() => setActiveProfileTab('posts')}
                disabled={operationInProgress}
                suppressHydrationWarning
              >
                My Posts
              </button>
              <button 
                className={`${styles.profileTab} ${activeProfileTab === 'trades' ? styles.active : ''}`}
                onClick={() => setActiveProfileTab('trades')}
                disabled={operationInProgress}
                suppressHydrationWarning
              >
                Trade Requests
              </button>
              <button 
                className={`${styles.profileTab} ${activeProfileTab === 'reviews' ? styles.active : ''}`}
                onClick={() => setActiveProfileTab('reviews')}
                disabled={operationInProgress}
                suppressHydrationWarning
              >
                Reviews
              </button>
            </div>
            
            <div className={`${styles.profileContent} ${activeProfileTab === 'posts' ? styles.active : ''}`}>
              <h3>My Posts</h3>
              <div className={styles.profilePosts}>
                {posts.length > 0 ? (
                  posts.map(post => (
                    <div key={post.id} className={styles.productCard}>
                      <span className={`${styles.productBadge} ${post.item.isSelling ? '' : styles.trade}`}>
                        {post.item.isSelling ? 'For Sale' : 'For Trade'}
                      </span>
                      <img 
                        src={post.item.images?.[0] || '/default-item.png'} 
                        alt={post.item.title} 
                        className={styles.productImage} 
                      />
                      <div className={styles.productInfo}>
                        <h3>{post.item.title}</h3>
                        <div className={styles.price}>
                          {post.item.isSelling ? `₱${post.item.price.toFixed(2)}` : 'Trade Only'}
                        </div>
                        <div className={styles.productMeta}>
                          <span className={styles.datePosted}>
                            {post.item.createdAt
                              ? (typeof post.item.createdAt.toDate === 'function'
                                  ? post.item.createdAt.toDate().toLocaleDateString()
                                  : new Date(post.item.createdAt).toLocaleDateString())
                              : 'Recently'}
                          </span>
                          <div className={styles.postActions}>
                            <button 
                              className={styles.deletePostBtn}
                              onClick={() => deletePost(post.id)}
                              disabled={operationInProgress}
                            >
                              <i className="fas fa-trash"></i> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
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
                    <div key={trade.id} className={styles.tradeRequestCard}>
                      <div className={styles.tradeStatus}>
                        <span className={`${styles.statusBadge} ${
                          trade.status === 'accepted' ? styles.accepted : 
                          trade.status === 'declined' ? styles.declined : 
                          styles.pending
                        }`}>
                          {trade.status}
                        </span>
                      </div>
                      <div className={styles.tradeItems}>
                        <div className={styles.tradeItem}>
                          <h4>Your Item</h4>
                          <img src="https://placehold.co/300x200?text=Your+Item" alt="Offered Item" />
                          <h4>Bluetooth Speaker</h4>
                        </div>
                        
                        <div className={styles.tradeArrow}>
                          <i className="fas fa-exchange-alt"></i>
                        </div>
                        
                        <div className={styles.tradeItem}>
                          <h4>Their Item</h4>
                          <img src="https://placehold.co/300x200?text=Their+Item" alt="Requested Item" />
                          <h4>Nike Shoes</h4>
                        </div>
                      </div>
                      <div className={styles.tradeActions}>
                        {trade.status === 'pending' && trade.participants[0] === user.uid && (
                          <>
                            <button 
                              className={`${styles.tradeBtn} ${styles.accept}`}
                              onClick={() => respondToTrade(trade.id, 'accepted')}
                              disabled={operationInProgress}
                            >
                              <i className="fas fa-check"></i> Accept
                            </button>
                            <button 
                              className={`${styles.tradeBtn} ${styles.decline}`}
                              onClick={() => respondToTrade(trade.id, 'declined')}
                              disabled={operationInProgress}
                            >
                              <i className="fas fa-times"></i> Decline
                            </button>
                          </>
                        )}
                        <button 
                          className={`${styles.tradeBtn} ${styles.message}`}
                          onClick={() => {
                            setActiveSection('messages');
                            setSelectedChatUser(chatUsers[0]);
                          }}
                          disabled={operationInProgress}
                        >
                          <i className="fas fa-comment"></i> Message
                        </button>
                      </div>
                    </div>
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

        {}
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
                          onChange={handleImageUpload}
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

        {}
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
                  <div key={post.id} className={styles.productCard}>
                    <span className={`${styles.productBadge} ${post.item.isSelling ? '' : styles.trade}`}>
                      {post.item.isSelling ? 'For Sale' : 'For Trade'}
                    </span>
                    <img 
                      src={post.item.images?.[0] || '/default-item.png'} 
                      alt={post.item.title} 
                      className={styles.productImage} 
                    />
                    <div className={styles.productInfo}>
                      <h3>{post.item.title}</h3>
                      <div className={styles.price}>
                        {post.item.isSelling ? `₱${post.item.price.toFixed(2)}` : 'Trade Only'}
                      </div>
                      {!post.item.isSelling && (
                        <p className={styles.tradeDescription}>
                          Willing to trade for: {post.item.tradeFor || 'Various items'}
                        </p>
                      )}
                      <div className={styles.productMeta}>
                        <div className={styles.userInfo}>
                          <img 
                            src={post.userData.photoURL || svgToDataUrl(generateAvatar(post.userData.username))} 
                            alt={post.userData.username} 
                            className={styles.userPhoto} 
                          />
                          <span>{post.item.nickname || post.userData.username}</span>
                        </div>
                        {post.userData.location && (
                          <div className={styles.location}>
                            <i className="fas fa-map-marker-alt"></i>
                            <span>{post.userData.location}</span>
                          </div>
                        )}
                        <span className={styles.datePosted}>
                          {post.item.createdAt
                            ? (typeof post.item.createdAt.toDate === 'function'
                                ? post.item.createdAt.toDate().toLocaleDateString()
                                : new Date(post.item.createdAt).toLocaleDateString())
                            : 'Recently'}
                        </span>
                      </div>
                    </div>
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
                      {!post.item.isSelling ? (
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
                            onKeyPress={(e) => e.key === 'Enter' && addComment(post.id, 'item')}
                            disabled={operationInProgress}
                          />
                          <button 
                            onClick={() => addComment(post.id, 'item')}
                            disabled={operationInProgress}
                          >
                            <i className="fas fa-paper-plane"></i>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
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

        {}
        {activeSection === 'community' && (
          <div className={styles.contentSection}>
            <h2>Community Forum</h2>
            <p>Connect with other community members</p>
            
            <button 
              className={styles.btnSubmit}
              onClick={() => setShowAddForumPostModal(true)}
              disabled={operationInProgress}
            >
              <i className="fas fa-plus"></i> Add Post
            </button>
            
            <div className={styles.forumPosts}>
              {forumPosts.length > 0 ? (
                forumPosts.map(post => (
                  <div key={post.id} className={styles.forumPostCard}>
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

        {}
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
                    <button 
                      className={styles.categoryCard} 
                      onClick={() => showHelpArticles('Getting Started')}
                    >
                      <i className="fas fa-user"></i>
                      <h3>Getting Started</h3>
                      <p>Learn how to create an account and set up your profile</p>
                    </button>
                    
                    <button 
                      className={styles.categoryCard} 
                      onClick={() => showHelpArticles('Marketplace')}
                    >
                      <i className="fas fa-store"></i>
                      <h3>Marketplace</h3>
                      <p>How to buy, sell and trade items in the marketplace</p>
                    </button>
                    
                    <button 
                      className={styles.categoryCard} 
                      onClick={() => showHelpArticles('Messaging')}
                    >
                      <i className="fas fa-comments"></i>
                      <h3>Messaging</h3>
                      <p>How to communicate with other users safely</p>
                    </button>
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

      {}
      {showAddPostModal && (
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
                  <button 
                    type="button" 
                    className={`${styles.categoryBtn} ${selectedCategory === 'Fashion & Apparel' ? styles.active : ''}`}
                    onClick={() => !operationInProgress && setSelectedCategory('Fashion & Apparel')}
                    disabled={operationInProgress}
                  >
                    Fashion & Apparel
                  </button>
                  <button 
                    type="button" 
                    className={`${styles.categoryBtn} ${selectedCategory === 'Electronics' ? styles.active : ''}`}
                    onClick={() => !operationInProgress && setSelectedCategory('Electronics')}
                    disabled={operationInProgress}
                  >
                    Electronics
                  </button>
                  <button 
                    type="button" 
                    className={`${styles.categoryBtn} ${selectedCategory === 'Food & Beverages' ? styles.active : ''}`}
                    onClick={() => !operationInProgress && setSelectedCategory('Food & Beverages')}
                    disabled={operationInProgress}
                  >
                    Food & Beverages
                  </button>
                  <button 
                    type="button" 
                    className={`${styles.categoryBtn} ${selectedCategory === 'DIY & Hardware' ? styles.active : ''}`}
                    onClick={() => !operationInProgress && setSelectedCategory('DIY & Hardware')}
                    disabled={operationInProgress}
                  >
                    DIY & Hardware
                  </button>
                  <button 
                    type="button" 
                    className={`${styles.categoryBtn} ${selectedCategory === 'Health & Beauty' ? styles.active : ''}`}
                    onClick={() => !operationInProgress && setSelectedCategory('Health & Beauty')}
                    disabled={operationInProgress}
                  >
                    Health & Beauty
                  </button>
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
      )}

      {showAddForumPostModal && (
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
      )}

      {showTradeOfferModal && selectedPost && (
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
      )}

      {showSettingsModal && (
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

              <div className={styles.formGroup}>
                <label htmlFor="nickname">Nickname*</label>
                <input 
                  type="text" 
                  id="nickname" 
                  placeholder="Enter your nickname" 
                  defaultValue={user?.nickname || user?.displayName || ''} 
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
                  <option value="1">Zone 1</option>
                  <option value="2">Zone 2</option>
                  <option value="3">Zone 3</option>
                  <option value="4">Zone 4</option>
                  <option value="5">Zone 5</option>
                  <option value="6">Zone 6</option>
                  <option value="7">Zone 7</option>
                  <option value="8">Zone 8</option>
                  <option value="9">Zone 9</option>
                  <option value="10">Zone 10</option>
                  <option value="11">Zone 11</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="contact">Contact Number</label>
                <input 
                  type="tel" 
                  id="contact" 
                  placeholder="09XXXXXXXXX" 
                  defaultValue={user?.contact || ''} 
                  disabled={operationInProgress}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="gcash">GCash Number</label>
                <input 
                  type="tel" 
                  id="gcash" 
                  placeholder="09XXXXXXXXX" 
                  defaultValue={user?.gcash || ''} 
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

              <button 
                className={styles.saveBtn} 
                onClick={saveProfileSettings}
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
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
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
            <h3>Report User or Trade</h3>
            <form>
              <div className={styles.formGroup}>
                <label>Reason for Report*</label>
                <select 
                  id="reportReason" 
                  required
                  disabled={operationInProgress}
                >
                  <option value="">Select a reason</option>
                  <option value="scam">Scam/Fraud</option>
                  <option value="no_response">No Response</option>
                  <option value="item_mismatch">Item Not as Described</option>
                  <option value="rude_behavior">Rude Behavior</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="reportDetails">Details*</label>
                <textarea 
                  id="reportDetails" 
                  placeholder="Please provide details about the issue..." 
                  required
                  disabled={operationInProgress}
                ></textarea>
              </div>
              <div className={styles.formGroup}>
                <label>Upload Evidence (Optional)</label>
                <input 
                  type="file" 
                  id="reportEvidence" 
                  accept="image/*" 
                  disabled={operationInProgress}
                />
              </div>
              <button 
                type="button" 
                className={styles.btnSubmit} 
                onClick={() => {
                  showToast("Report submitted successfully!", 'success');
                  setShowReportModal(false);
                }}
                disabled={operationInProgress}
              >
                {operationInProgress ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Submitting...
                  </>
                ) : (
                  <>
                    Submit Report
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {showWelcomeModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent} style={{ maxWidth: '500px', textAlign: 'center' }}>
            <button 
              className={styles.close} 
              onClick={() => setShowWelcomeModal(false)} 
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2>Welcome to TradeConnect!</h2>
            <p>We're excited to have you join our community marketplace. Let's get you started!</p>
            <div className={styles.welcomeActions}>
              <button 
                className={styles.btnPrimary} 
                onClick={startTour}
                disabled={operationInProgress}
              >
                Take a Quick Tour
              </button>
              <button 
                className={styles.btnSecondary} 
                onClick={() => setShowWelcomeModal(false)}
                disabled={operationInProgress}
              >
                Skip for Now
              </button>
            </div>
          </div>
        </div>
      )}

      {showNotificationsModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent} style={{ maxWidth: '500px' }}>
            <button 
              className={styles.close} 
              onClick={() => setShowNotificationsModal(false)} 
              aria-label="Close modal"
            >
              &times;
            </button>
            <div className={styles.notificationsHeader}>
              <h3>Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  className={styles.markAllReadBtn}
                  onClick={markAllAsRead}
                  disabled={operationInProgress}
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className={styles.notificationsList}>
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
                    onClick={() => {
                      markAsRead(notification.id);
                      if (notification.type === 'trade') {
                        setActiveSection('profile');
                        setActiveProfileTab('trades');
                      } else if (notification.type === 'message') {
                        setActiveSection('messages');
                      }
                      setShowNotificationsModal(false);
                    }}
                  >
                    <div className={styles.notificationIcon}>
                      {notification.type === 'message' && <i className="fas fa-comment"></i>}
                      {notification.type === 'like' && <i className="fas fa-heart"></i>}
                      {notification.type === 'trade' && <i className="fas fa-exchange-alt"></i>}
                      {notification.type === 'purchase' && <i className="fas fa-shopping-cart"></i>}
                      {!notification.type && <i className="fas fa-bell"></i>}
                    </div>
                    <div className={styles.notificationContent}>
                      <p>{notification.message}</p>
                      <small>
                        {notification.createdAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {' • '}
                        {notification.createdAt?.toLocaleDateString()}
                      </small>
                    </div>
                    <div className={styles.notificationActions}>
                      <button 
                        className={styles.notificationAction}
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        title="Mark as read"
                        disabled={operationInProgress}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button 
                        className={styles.notificationAction}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        title="Delete"
                        disabled={operationInProgress}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    {!notification.read && (
                      <div className={styles.unreadIndicator}></div>
                    )}
                  </div>
                ))
              ) : (
                <div className={styles.emptyNotifications}>
                  <i className="fas fa-bell-slash"></i>
                  <p>No notifications yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
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
  );}
  