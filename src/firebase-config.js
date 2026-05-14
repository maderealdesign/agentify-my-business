// Firebase configuration for Agentify My Business
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "agentify-my-business.firebaseapp.com",
  projectId: "agentify-my-business",
  storageBucket: "agentify-my-business.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// OpenRouter API configuration
export const openRouterConfig = {
  baseUrl: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || 'your-openrouter-api-key'
};

// Model pricing (per 1M tokens) - you can customize these
export const modelPricing = {
  // Cheap models for cost-conscious users
  'google/gemma-3-27b-it': { price: 0.15, speed: 'fast', recommended: true },
  'mistralai/mistral-nemo:free': { price: 0.15, speed: 'fast' },
  'microsoft/phi-4-mini-instruct:free': { price: 0.15, speed: 'medium' },
  
  // Medium tier
  'meta-llama/llama-3.1-8b-instruct:free': { price: 0.25, speed: 'fast', recommended: true },
  'cohere/command-r-plus-08-2024': { price: 0.60, speed: 'medium' },
  
  // Expensive but powerful models
  'anthropic/claude-3.5-haiku:free': { price: 1.50, speed: 'fast', recommended: true },
  'google/gemma-2-9b-it:free': { price: 1.00, speed: 'medium' },
  'mistralai/mistral-large-latest': { price: 3.00, speed: 'slow' },
  
  // Premium tier (GPT-5.5 via OpenRouter)
  'openai/gpt-4o': { price: 7.50, speed: 'fast', recommended: true },
  'anthropic/claude-3-opus:free': { price: 15.00, speed: 'slow' },
};

// Your margin percentage (you keep this % of every transaction)
export const MARGIN_PERCENTAGE = 15; // You keep 15% of wallet top-ups
