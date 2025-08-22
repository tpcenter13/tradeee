import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDocs,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db } from './firebase';

// Chat-related functions
export const chatService = {
  // Create or get a chat between two users about a product
  async getOrCreateChat(senderId, receiverId, senderName, receiverName, product) {
  try {
    const chatsRef = collection(db, 'chats');

    // ✅ Step 1: Query by participants
    const q = query(chatsRef, where('participants', 'array-contains', senderId));
    const querySnapshot = await getDocs(q);

    // ✅ Step 2: Check in memory for matching product.id and other user
    let existingChat = null;
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (
        data.participants.includes(receiverId) &&
        data.product?.id === product.id
      ) {
        existingChat = { id: docSnap.id, ...data };
      }
    });

    if (existingChat) return existingChat;

    // ✅ Step 3: Create new chat
    const chatData = {
      participants: [senderId, receiverId],
      participantNames: {
        [senderId]: senderName,
        [receiverId]: receiverName
      },
      product: {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        isSelling: product.isSelling
      },
      lastMessage: '',
      lastMessageTime: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(chatsRef, chatData);

    // ✅ Optional: Fetch actual data after creation to include real timestamps
    const newDoc = await getDoc(docRef);
    return { id: docRef.id, ...newDoc.data() };

  } catch (error) {
    console.error('Error getting/creating chat:', error);
    throw error;
  }
},


  // Send a message
  async sendMessage(chatId, senderId, receiverId, messageText, product = null) {
    try {
      const messageData = {
        senderId,
        senderName: await this.getUserName(senderId),
        receiverId,
        receiverName: await this.getUserName(receiverId),
        message: messageText,
        product: product || null,
        timestamp: serverTimestamp(),
        read: false
      };
      
      // Add message to subcollection
      const messageRef = await addDoc(
        collection(db, 'chats', chatId, 'messages'),
        messageData
      );
      
      // Update chat's last message and timestamp
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: messageText,
        lastMessageTime: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return { id: messageRef.id, ...messageData };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Get user's name by ID
  async getUserName(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data().displayName || userDoc.data().email;
      }
      return 'Unknown User';
    } catch (error) {
      console.error('Error getting user name:', error);
      return 'Unknown User';
    }
  },

  // Listen for messages in a chat
  listenToMessages(chatId, callback) {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    return onSnapshot(q, (snapshot) => {
      const messages = [];
      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      callback(messages);
    });
  },

  // Get user's chats
  async getUserChats(userId) {
    try {
      const chatsRef = collection(db, 'chats');
      const q = query(
        chatsRef,
        where('participants', 'array-contains', userId),
        orderBy('lastMessageTime', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const chats = [];
      querySnapshot.forEach((doc) => {
        chats.push({ id: doc.id, ...doc.data() });
      });
      
      return chats;
    } catch (error) {
      console.error('Error getting user chats:', error);
      return [];
    }
  },

  // Mark messages as read
  async markMessagesAsRead(chatId, userId) {
    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const q = query(
        messagesRef,
        where('receiverId', '==', userId),
        where('read', '==', false)
      );
      
      const querySnapshot = await getDocs(q);
      const updatePromises = [];
      
      querySnapshot.forEach((doc) => {
        updatePromises.push(updateDoc(doc.ref, { read: true }));
      });
      
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }
};

// User-related functions
export const userService = {
  // Create or update user profile
  async createUserProfile(userId, userData) {
    try {
      await setDoc(doc(db, 'users', userId), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  },

  // Get user profile
  async getUserProfile(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }
};