import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';

// Initialize Firebase - you'll need to replace with your actual config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "agentify-my-business.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "agentify-my-business",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "agentify-my-business.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID || "YOUR_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// User wallet management
export async function getUserWallet(userId) {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userDocRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      // Create new user with default wallet balance
      await setDoc(userDocRef, {
        createdAt: serverTimestamp(),
        walletBalance: 0.00,
        totalSpent: 0.00,
        lastActive: serverTimestamp()
      });
      
      return { walletBalance: 0.00, totalSpent: 0.00 };
    }
  } catch (error) {
    console.error('Error getting user wallet:', error);
    throw error;
  }
}

export async function updateWalletBalance(userId, amount, transactionType = 'credit') {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userDocRef);
    
    if (!userSnap.exists()) {
      throw new Error('User not found');
    }
    
    const currentData = userSnap.data();
    let newBalance;
    
    if (transactionType === 'credit') {
      newBalance = parseFloat(currentData.walletBalance) + amount;
    } else if (transactionType === 'debit') {
      newBalance = parseFloat(currentData.walletBalance) - amount;
      if (newBalance < 0) {
        throw new Error('Insufficient wallet balance');
      }
    } else {
      throw new Error('Invalid transaction type');
    }
    
    // Record the transaction
    await addDoc(collection(db, 'transactions'), {
      userId,
      amount: parseFloat(amount),
      type: transactionType,
      timestamp: serverTimestamp(),
      description: `${transactionType === 'credit' ? 'Top-up' : 'Usage'} - ${amount} credits`
    });
    
    // Update user wallet
    await updateDoc(userDocRef, {
      walletBalance: newBalance,
      totalSpent: transactionType === 'debit' 
        ? parseFloat(currentData.totalSpent) + amount 
        : currentData.totalSpent,
      lastActive: serverTimestamp()
    });
    
    return { success: true, newBalance };
  } catch (error) {
    console.error('Error updating wallet:', error);
    throw error;
  }
}

// MD files and agent memory storage
export async function saveAgentMemory(userId, fileName, content) {
  try {
    const fileRef = doc(db, 'agent_memory', `${userId}/${fileName}`);
    await setDoc(fileRef, {
      content,
      updatedAt: serverTimestamp(),
      createdBy: userId
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error saving agent memory:', error);
    throw error;
  }
}

export async function loadAgentMemory(userId, fileName) {
  try {
    const fileRef = doc(db, 'agent_memory', `${userId}/${fileName}`);
    const fileSnap = await getDoc(fileRef);
    
    if (fileSnap.exists()) {
      return fileSnap.data().content;
    } else {
      return null; // File doesn't exist yet
    }
  } catch (error) {
    console.error('Error loading agent memory:', error);
    throw error;
  }
}

export async function listAgentMemory(userId) {
  try {
    const q = query(
      collection(db, 'agent_memory'),
      where('__name__', '==', userId), // This won't work directly, need different approach
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const files = [];
    
    querySnapshot.forEach((doc) => {
      files.push({ id: doc.id, ...doc.data() });
    });
    
    return files;
  } catch (error) {
    console.error('Error listing agent memory:', error);
    throw error;
  }
}

// Chat history and conversation management
export async function saveChatMessage(userId, messageId, role, content, metadata = {}) {
  try {
    const chatRef = doc(collection(db, 'chats'), `${userId}/${messageId}`);
    await setDoc(chatRef, {
      userId,
      messageId,
      role, // 'user' or 'assistant'
      content,
      timestamp: serverTimestamp(),
      ...metadata
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error saving chat message:', error);
    throw error;
  }
}

export async function getChatHistory(userId, limit = 50) {
  try {
    const q = query(
      collection(db, 'chats'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    const messages = [];
    
    querySnapshot.forEach((doc) => {
      messages.unshift({ id: doc.id, ...doc.data() });
    });
    
    return messages;
  } catch (error) {
    console.error('Error getting chat history:', error);
    throw error;
  }
}

// OpenRouter API integration
export async function callOpenRouter(messages, modelId, apiKey) {
  try {
    const response = await fetch(`${openRouterConfig.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelId,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'OpenRouter API error');
    }
    
    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      usage: data.usage
    };
  } catch (error) {
    console.error('Error calling OpenRouter:', error);
    throw error;
  }
}

// Authentication helpers
export async function signInWithAnonymous() {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error('Anonymous sign-in error:', error);
    throw error;
  }
}

export async function signOutUser() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign-out error:', error);
    throw error;
  }
}

// Export for use in other files
export default app;
