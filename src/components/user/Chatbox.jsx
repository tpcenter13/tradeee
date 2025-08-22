"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { chatService } from '@/lib/firebaseService';

export default function ChatBox() {
  const [user] = useAuthState(auth);
  const searchParams = useSearchParams();
  const productName = searchParams.get("product");
  const sellerEmail = searchParams.get("sellerEmail");
  const productPrice = searchParams.get("price");
  const productImage = searchParams.get("image");
  const isSelling = searchParams.get("isSelling") === "true";
  const productId = searchParams.get("productId");
  
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [userChats, setUserChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatInitialized, setChatInitialized] = useState(false);
  const [contacts, setContacts] = useState([]);
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load user chats and set up refresh interval
  useEffect(() => {
    if (user) {
      loadUserChats();
      
      const refreshInterval = setInterval(() => {
        loadUserChats();
      }, 30000);
      
      return () => clearInterval(refreshInterval);
    }
  }, [user]);

  // Initialize specific chat when user, productId, and sellerEmail are available
  useEffect(() => {
    if (user && productId && sellerEmail && !chatInitialized) {
      initializeChat();
    }
  }, [user, productId, sellerEmail, chatInitialized]);

  const initializeChat = async () => {
    try {
      setLoading(true);
      
      const receiverId = `seller_${sellerEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const receiverName = sellerEmail;
      
      const productData = {
        id: productId,
        title: productName,
        price: productPrice,
        image: productImage || "/placeholder-product.png",
        images: productImage ? [productImage] : [],
        isSelling: isSelling,
        description: "",
        seller: {
          email: sellerEmail,
          uid: receiverId
        },
        category: "Unknown",
        createdAt: new Date().toISOString(),
        quantity: "1"
      };
      
      const chat = await chatService.getOrCreateChat(
        user.uid, 
        receiverId, 
        user.email, 
        receiverName, 
        productData
      );
      
      setCurrentChat(chat);
      setChatInitialized(true);
      
      // Set up real-time listener for messages
      const unsubscribe = chatService.listenToMessages(chat.id, (messagesFromDb) => {
        setMessages(messagesFromDb);
        
        // Send initial message only if there are no messages in the chat
        const hasMessages = messagesFromDb && messagesFromDb.length > 0;
        const hasUserMessages = messagesFromDb.some(msg => msg.senderId === user.uid);
        
        if (!hasMessages || !hasUserMessages) {
          sendInitialMessage(chat.id, receiverId, productData);
        }
        
        setLoading(false);
      });
      
      return () => {
        if (unsubscribe) unsubscribe();
      };
    } catch (error) {
      console.error('Error initializing chat:', error);
      setLoading(false);
    }
  };

  const sendInitialMessage = async (chatId, receiverId, productData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const initialMessage = `Hi! I'm interested in your product: ${productData.title}`;
      
      await chatService.sendMessage(
        chatId, 
        user.uid, 
        receiverId, 
        initialMessage,
        productData
      );
    } catch (error) {
      console.error('Error sending initial message:', error);
    }
  };

const loadUserChats = async () => {
  try {
    const chats = await chatService.getUserChats(user.uid);

    // ✅ Filter chats where user.email is in participantNames values
    const filteredChats = chats.filter(chat => {
      const participantEmails = Object.values(chat.participantNames || {});
      return participantEmails.includes(user.email);
    });

    setUserChats(filteredChats);

    // ✅ Convert chats to contacts format
    const contactsData = filteredChats
      .sort((a, b) => {
        const aTime = a.updatedAt?.toDate?.() || a.createdAt?.toDate?.() || new Date(0);
        const bTime = b.updatedAt?.toDate?.() || b.createdAt?.toDate?.() || new Date(0);
        return bTime - aTime;
      })
      .map(chat => {
        const otherParticipantId = chat.participants.find(id => id !== user.uid);
        const otherParticipantName = chat.participantNames[otherParticipantId];

        let lastMessageDisplay = "No messages yet";
        if (chat.lastMessage) {
          const maxLength = 50;
          lastMessageDisplay = chat.lastMessage.length > maxLength
            ? chat.lastMessage.substring(0, maxLength) + "..."
            : chat.lastMessage;
        }

        return {
          id: chat.id,
          name: otherParticipantName || "Unknown User",
          avatar: otherParticipantName ? otherParticipantName.charAt(0).toUpperCase() : "U",
          online: Math.random() > 0.5,
          lastMessage: lastMessageDisplay,
          lastMessageTime: chat.updatedAt?.toDate?.() || chat.createdAt?.toDate?.(),
          product: chat.product,
          unreadCount: chat.unreadCount?.[user.uid] || 0
        };
      });

    setContacts(contactsData);
  } catch (error) {
    console.error('Error loading user chats:', error);
  }
};


  const handleSendMessage = async () => {
    if (messageInput.trim() === "" || !currentChat) return;
    
    try {
      const receiverId = currentChat.participants.find(id => id !== user.uid);
      
      await chatService.sendMessage(
        currentChat.id, 
        user.uid, 
        receiverId, 
        messageInput
      );
      
      setMessageInput("");
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleContactClick = async (contact) => {
    try {
      const chat = userChats.find(chat => chat.id === contact.id);
      if (chat) {
        setCurrentChat(chat);
        setLoading(true);
        
        // Set up real-time listener for the selected chat
        const unsubscribe = chatService.listenToMessages(chat.id, (messages) => {
          setMessages(messages);
          setLoading(false);
        });
        
        // Mark messages as read
        await chatService.markMessagesAsRead(chat.id, user.uid);
        
        // Store unsubscribe function to clean up later if needed
        return () => {
          if (unsubscribe) unsubscribe();
        };
      }
    } catch (error) {
      console.error('Error selecting contact:', error);
      setLoading(false);
    }
  };

  // Format time for display
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // ProductCard component
  const ProductCard = ({ product }) => {
    const productImage = product.images && product.images.length > 0 
      ? product.images[0] 
      : product.image || "/placeholder-product.png";
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden w-64">
        <img 
          src={productImage} 
          alt={product.title || "Product image"} 
          className="w-full h-40 object-cover"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=160&fit=crop";
          }}
        />
        <div className="p-3">
          <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
            {product.title || "Untitled Product"}
          </h4>
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1">
              <span className="text-lg font-bold text-gray-900">
                {product.isSelling 
                  ? `₱${parseFloat(product.price || 0).toFixed(2)}` 
                  : "For Trade"
                }
              </span>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded ${
              product.isSelling ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }`}>
              {product.isSelling ? "For Sale" : "For Trade"}
            </span>
          </div>

          {product.seller && (
            <div className="text-xs text-gray-500 mb-2">
              Sold by: {product.seller.email || "Unknown Seller"}
            </div>
          )}

          <button
            className="w-full py-2 px-3 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[600px] flex">
      {/* Sidebar */}
      <div className="w-80 bg-gray-100 border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Chats</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {contacts.length} conversation{contacts.length !== 1 ? 's' : ''}
              </p>
            </div>
            {contacts.length > 0 && (
              <button 
                onClick={() => loadUserChats()}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                title="Refresh chats"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
          </div>
          {productName && (
            <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-600 font-medium">Current Discussion</p>
              <p className="text-xs text-blue-800 mt-0.5">{productName}</p>
            </div>
          )}
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {contacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-sm">No chat history yet</p>
              <p className="text-xs text-center mt-1">Your conversations will appear here</p>
            </div>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${
                  currentChat && currentChat.id === contact.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => handleContactClick(contact)}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {contact.avatar}
                    </div>
                    {/* Online indicator */}
                    {contact.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                    {/* Unread message indicator */}
                    {contact.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                        {contact.unreadCount}
                      </div>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                      <span className="text-xs text-gray-400">
                        {formatTime(contact.lastMessageTime)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-500 truncate mb-1">{contact.lastMessage}</p>
                    
                    {/* Product info */}
                    {contact.product && (
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={contact.product.image || contact.product.images?.[0] || "/placeholder-product.png"} 
                            alt="" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=32&h=32&fit=crop";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-600 truncate">{contact.product.title}</p>
                          <p className="text-xs text-gray-500">
                            {contact.product.isSelling 
                              ? `₱${parseFloat(contact.product.price || 0).toFixed(2)}`
                              : "For Trade"
                            }
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        {currentChat ? (
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                {currentChat.participantNames[currentChat.participants.find(id => id !== user.uid)]?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {currentChat.participantNames[currentChat.participants.find(id => id !== user.uid)] || "Unknown User"}
                </h3>
                <p className="text-sm text-green-500">Online</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-medium">
                PS
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Product Seller</h3>
                <p className="text-sm text-gray-500">Select a conversation to start chatting</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center text-gray-500">
                <p>Loading messages...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center text-gray-500">
                <p>No messages yet</p>
                <p className="text-sm mt-2">Send a message to start a conversation</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.senderId === user.uid ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-xs lg:max-w-md">
                    {message.product ? (
                      <div className="space-y-1">
                        <div className={`${message.senderId === user.uid ? "text-right" : "text-left"} text-xs text-gray-500 mb-1`}>
                          Product Details
                        </div>
                        <ProductCard product={message.product} />
                        <div
                          className={`px-4 py-2 rounded-lg mt-2 ${
                            message.senderId === user.uid ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                        </div>
                        <p
                          className={`text-xs ${message.senderId === user.uid ? "text-right text-gray-500" : "text-left text-gray-500"}`}
                        >
                          {message.timestamp?.toDate ? message.timestamp.toDate().toLocaleTimeString() : "Now"}
                        </p>
                      </div>
                    ) : (
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          message.senderId === user.uid ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${message.senderId === user.uid ? "text-blue-100" : "text-gray-500"}`}>
                          {message.timestamp?.toDate ? message.timestamp.toDate().toLocaleTimeString() : "Now"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex space-x-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!currentChat}
            />
            <button 
              onClick={handleSendMessage}
              className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={!currentChat || messageInput.trim() === ""}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}