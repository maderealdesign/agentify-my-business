import { env } from '../env';

// Model pricing per 1M tokens (you can adjust these)
export const MODEL_PRICING = {
  // Budget tier
  'google/gemma-3-27b-it': { price: 0.15, speed: 'fast', name: 'Gemma 3 27B' },
  'mistralai/mistral-nemo:free': { price: 0.15, speed: 'fast', name: 'Mistral Nemo' },
  
  // Mid tier
  'meta-llama/llama-3.1-8b-instruct:free': { price: 0.25, speed: 'fast', name: 'Llama 3.1 8B' },
  'cohere/command-r-plus-08-2024': { price: 0.60, speed: 'medium', name: 'Command R+' },
  
  // Premium tier
  'anthropic/claude-3.5-haiku:free': { price: 1.50, speed: 'fast', name: 'Claude 3.5 Haiku' },
  'openai/gpt-4o': { price: 7.50, speed: 'fast', name: 'GPT-4o' },
};

// Calculate cost for a message based on model and token usage
export function calculateCost(modelId, tokens) {
  const pricing = MODEL_PRICING[modelId] || MODEL_PRICING['meta-llama/llama-3.1-8b-instruct:free'];
  const costPerToken = pricing.price / 1000000; // price per token
  return tokens * costPerToken;
}

// Build system message with context from agent memory
export function buildSystemMessage(agentMemory) {
  let systemMessage = `You are Hermes, an autonomous AI assistant designed to help users complete tasks. You have access to various tools and can think in loops.\n\n`;
  
  if (agentMemory && Object.keys(agentMemory).length > 0) {
    systemMessage += 'IMPORTANT CONTEXT FROM USER MEMORY:\n';
    for (const [key, value] of Object.entries(agentMemory)) {
      systemMessage += `- ${key}: ${value}\n`;
    }
    systemMessage += '\n';
  }
  
  systemMessage += `RULES:
1. Think step-by-step before taking actions
2. Use tools when needed (GitHub, Notion, Maps, etc.)
3. Keep responses concise and actionable
4. If you need more context, ask the user
5. Track your token usage carefully

Current session model: {{MODEL_ID}}
User wallet balance: ${{WALLET_BALANCE}}`;
  
  return systemMessage;
}

// Call OpenRouter API with proper error handling
export async function callOpenRouter(messages, modelId, options = {}) {
  const apiKey = env.VITE_OPENROUTER_API_KEY;
  
  if (!apiKey || apiKey === 'your-openrouter-api-key-here') {
    throw new Error('OpenRouter API key not configured. Please set VITE_OPENROUTER_API_KEY in your .env file.');
  }

  try {
    const response = await fetch(`${'https://openrouter.ai/api/v1'}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Agentify My Business',
      },
      body: JSON.stringify({
        model: modelId,
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2048,
        top_p: options.topP || 1,
        frequency_penalty: options.frequencyPenalty || 0,
        presence_penalty: options.presencePenalty || 0,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || 
        `OpenRouter API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    
    return {
      success: true,
      content: data.choices[0].message.content,
      usage: data.usage || {},
      model: data.model,
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error('OpenRouter API call failed:', error);
    
    // Handle specific error types
    if (error.message.includes('API key')) {
      throw new Error('Invalid OpenRouter API key. Please check your configuration.');
    } else if (error.message.includes('Insufficient funds') || response?.status === 402) {
      throw new Error('Insufficient wallet balance to complete this request.');
    } else {
      throw error;
    }
  }
}

// Stream responses for better UX (optional enhancement)
export async function* streamOpenRouter(messages, modelId, options = {}) {
  const apiKey = env.VITE_OPENROUTER_API_KEY;
  
  try {
    const response = await fetch(`${'https://openrouter.ai/api/v1'}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Agentify My Business',
      },
      body: JSON.stringify({
        model: modelId,
        messages: messages,
        stream: true,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2048,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || 
        `OpenRouter API error: ${response.status}`
      );
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.choices && parsed.choices[0]?.delta?.content) {
              yield {
                content: parsed.choices[0].delta.content,
                done: false,
              };
            } else if (parsed.usage) {
              yield {
                usage: parsed.usage,
                done: true,
              };
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }

  } catch (error) {
    console.error('Stream API call failed:', error);
    throw error;
  }
}

// Build conversation history for context
export function buildConversationHistory(messages, lastN = 10) {
  const conversation = [];
  
  // Add system prompt first
  conversation.push({
    role: 'system',
    content: "You are Hermes, an autonomous AI assistant. Be concise and actionable."
  });

  // Add recent messages as context
  if (messages.length > 0) {
    const recentMessages = messages.slice(-lastN);
    
    for (const msg of recentMessages) {
      conversation.push({
        role: msg.role,
        content: msg.content,
      });
    }
  }

  return conversation;
}

// Track usage and calculate costs
export function trackUsage(messages, response, cost) {
  const totalTokens = response.usage?.total_tokens || 0;
  const promptTokens = response.usage?.prompt_tokens || 0;
  const completionTokens = response.usage?.completion_tokens || 0;

  return {
    timestamp: new Date().toISOString(),
    modelId: response.model,
    tokens: {
      total: totalTokens,
      prompt: promptTokens,
      completion: completionTokens,
    },
    cost: cost,
    messagesProcessed: messages.length,
  };
}

export default {
  callOpenRouter,
  streamOpenRouter,
  buildConversationHistory,
  trackUsage,
  calculateCost,
  MODEL_PRICING,
};
