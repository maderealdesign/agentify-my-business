// Environment configuration
export const env = {
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY || 'your-firebase-api-key',
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'agentify-my-business.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'agentify-my-business',
  VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'agentify-my-business.appspot.com',
  VITE_FIREBASE_SENDER_ID: import.meta.env.VITE_FIREBASE_SENDER_ID || 'your-sender-id',
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID || 'your-app-id',
  
  // OpenRouter API key (you can store this in .env file)
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || import.meta.env.VITE_OPENROUTER_API_KEY || 'your-openrouter-api-key'
};

// Export for use in other files
export default env;
