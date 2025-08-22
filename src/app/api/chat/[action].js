import { chatService, userService } from '@/lib/firebaseService';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default async function handler(req, res) {
  const { action } = req.query;

  try {
    switch (action) {
      case 'create':
        return await handleCreateChat(req, res);
      case 'send':
        return await handleSendMessage(req, res);
      case 'get':
        return await handleGetChats(req, res);
      case 'messages':
        return await handleGetMessages(req, res);
      default:
        return res.status(404).json({ error: 'Endpoint not found' });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleCreateChat(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { senderId, receiverId, senderName, receiverName, product } = req.body;

  if (!senderId || !receiverId || !product) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if chat already exists between these users for this product
    const existingChat = await findExistingChat(senderId, receiverId, product.id);
    
    if (existingChat) {
      // Return existing chat instead of creating new one
      return res.status(200).json(existingChat);
    }

    // Create new chat only if none exists
    const chat = await chatService.getOrCreateChat(
      senderId, 
      receiverId, 
      senderName, 
      receiverName, 
      product
    );
    
    return res.status(201).json(chat); // 201 for created
  } catch (error) {
    console.error('Error in handleCreateChat:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Helper function to find existing chat
async function findExistingChat(senderId, receiverId, productId) {
  try {
    const chatsRef = collection(db, 'chats');
    
    // Query for chats where both users are participants and product matches
    const q1 = query(
      chatsRef,
      where('participants', 'array-contains', senderId),
      where('product.id', '==', productId)
    );
    
    const querySnapshot = await getDocs(q1);
    
    // Check if any of the results also contain the receiverId
    for (const doc of querySnapshot.docs) {
      const chatData = doc.data();
      if (chatData.participants.includes(receiverId)) {
        return { id: doc.id, ...chatData };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error finding existing chat:', error);
    return null;
  }
}

async function handleSendMessage(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { chatId, senderId, receiverId, message, product } = req.body;

  if (!chatId || !senderId || !receiverId || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newMessage = await chatService.sendMessage(
      chatId, 
      senderId, 
      receiverId, 
      message, 
      product
    );
    return res.status(200).json(newMessage);
  } catch (error) {
    console.error('Error in handleSendMessage:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function handleGetChats(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const chats = await chatService.getUserChats(userId);
    return res.status(200).json(chats);
  } catch (error) {
    console.error('Error in handleGetChats:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function handleGetMessages(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { chatId, limit = 50 } = req.query;

  if (!chatId) {
    return res.status(400).json({ error: 'Chat ID is required' });
  }

  try {
    // For server-side rendering, we get messages once
    // Real-time updates should be handled on the client
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(
      messagesRef, 
      orderBy('timestamp', 'asc'),
      limit(parseInt(limit))
    );
    const querySnapshot = await getDocs(q);
    
    const messages = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Convert Firestore timestamp to serializable format
      messages.push({ 
        id: doc.id, 
        ...data,
        timestamp: data.timestamp?.toDate?.() || new Date()
      });
    });
    
    return res.status(200).json(messages);
  } catch (error) {
    console.error('Error in handleGetMessages:', error);
    return res.status(500).json({ error: error.message });
  }
}