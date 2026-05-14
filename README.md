# Agentify My Business - Complete AI Agent Platform

A web-based autonomous agent platform that lets users interact with AI models through a clean chat interface, complete with wallet system, tool integrations, and persistent memory.

## 🚀 Features

### Core Functionality
- **Multi-model Support**: Choose from budget to premium AI models (Gemma, Llama, Claude, GPT-4o)
- **Wallet System**: £10 top-up model with 15% margin for platform costs
- **OpenRouter Integration**: Resell OpenRouter API with transparent pricing
- **Tool Integrations**: Connect GitHub, Netlify, Notion, Maps via BYOK (Bring Your Own Keys)
- **Persistent Memory**: Store MD files in Firebase for agent context across sessions
- **Live Usage HUD**: Real-time token consumption and cost tracking

### Security & Privacy
- **BYOK Architecture**: API keys stored ONLY in browser localStorage (never on servers)
- **Anonymous Auth**: Users can start without registration (Firebase anonymous auth)
- **Transparent Pricing**: Clear cost breakdown per model call

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/maderealdesign/agentify-my-business.git
cd agentify-my-business
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase (see [Firebase Setup](#firebase-setup) below):
- Copy `.env.example` to `.env.local` and fill in your Firebase credentials
- Get OpenRouter API key from https://openrouter.ai/keys

4. Start development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

6. Deploy to Netlify (or any static host):
```bash
npx netlify deploy --prod
```

## 🔧 Firebase Setup

### 1. Create Firebase Project
- Go to [Firebase Console](https://console.firebase.google.com/)
- Click "Add project" and follow the setup wizard
- Name it: `agentify-my-business`

### 2. Enable Firebase Services

#### Authentication
- Go to **Authentication** → **Sign-in method**
- Enable **Anonymous** sign-in provider

#### Firestore Database
- Go to **Firestore Database** → **Create database**
- Start in **test mode** (you'll want to secure this later)
- Choose a location close to your users

#### Storage (optional - for file uploads)
- Go to **Storage** → **Get started**
- Start in **test mode**

### 3. Get Firebase Config
- Go to **Project Settings** (gear icon)
- Scroll to "Your apps" section
- Click the web icon `</>`
- Copy the configuration object
- Update your `.env.local` file with:
```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=agentify-my-business.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=agentify-my-business
VITE_FIREBASE_STORAGE_BUCKET=agentify-my-business.appspot.com
VITE_FIREBASE_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 4. Configure Firestore Security Rules

Replace the default rules in your Firebase Console with these stricter rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - read/write only by owner
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Transactions collection - read/write only by owner
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.resource.data.userId)).data.ownerId == request.auth.uid;
    }
    
    // Agent memory files - read/write only by owner
    match /agent_memory/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Chat history - read/write only by owner
    match /chats/{userId}/{messageId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🌐 OpenRouter Setup

1. Sign up at https://openrouter.ai/
2. Go to **Keys** section in your dashboard
3. Create a new API key
4. Copy the key and add it to `.env.local`:
```env
VITE_OPENROUTER_API_KEY=your-openrouter-key-here
```

## 💰 Wallet & Pricing Model

### Your Margin Structure
- User pays: £10
- You keep (15%): £1.50
- OpenRouter credit: $8.50

### Model Pricing Examples
| Model | Price per 1M tokens | Speed | Recommended for |
|-------|-------------------|--------|----------------|
| Gemma 3 27B | $0.15 | Fast | Budget tasks |
| Llama 3.1 8B | $0.25 | Fast | Everyday use (recommended) |
| Claude 3.5 Haiku | $1.50 | Fast | Complex reasoning |
| GPT-4o | $7.50 | Fast | Premium tasks |

### Cost Calculation Example
```javascript
// For a message using Llama 3.1 (0.25 per 1M tokens)
const costPerToken = 0.25 / 1000000; // $0.00000025 per token
const responseTokens = 500;
const cost = responseTokens * costPerToken; // $0.000125
```

## 🔌 Tool Integrations (BYOK)

Users can connect the following tools:

### GitHub
- **Purpose**: Code operations, repo management, deployment
- **Required scopes**: `repo`, `workflow`
- **Create token**: https://github.com/settings/tokens

### Netlify
- **Purpose**: Deploy projects from agent
- **Required scopes**: Full account access
- **Get API key**: https://app.netlify.com/user/applications

### Notion
- **Purpose**: Create/update pages, databases
- **Setup**: Create integration at https://developers.notion.com/docs/create-a-notion-integration
- **Share database**: Make sure your integration is added to the target workspace/database

### Google Maps
- **Purpose**: Location search, directions, routes
- **Get API key**: https://console.cloud.google.com/apis/credentials

## 📁 Project Structure

```
agentify-my-business/
├── src/
│   ├── components/
│   │   ├── ChatInterface.jsx       # Main chat UI with message history
│   │   ├── ModelSelector.jsx       # Model selection component (cheap vs expensive)
│   │   ├── WalletPanel.jsx         # Wallet balance and top-up UI
│   │   ├── UsageHUD.jsx            # Real-time usage tracking
│   │   └── ToolIntegrations.jsx    # API key management (BYOK)
│   ├── services/
│   │   └── openrouter.js           # OpenRouter API integration & cost calculation
│   ├── firebase-config.js          # Firebase configuration & helper functions
│   ├── firebase.js                 # Firebase initialization & auth
│   ├── env.js                      # Environment variables
│   ├── App.jsx                     # Main app component with routing
│   └── main.jsx                    # React entry point
├── .env.example                    # Environment variable template
├── netlify.toml                    # Netlify deployment config
├── index.html                      # HTML entry point
└── package.json
```

## 🎨 UI/UX Design Philosophy

- **No Terminal Required**: Clean chat interface instead of command line
- **Transparent Economics**: Clear pricing and wallet balance display
- **BYOK Security**: Users control their API keys (stored locally only)
- **Progressive Disclosure**: Advanced features hidden until needed
- **Mobile Responsive**: Works on phones, tablets, and desktops

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Use environment variables** for all API keys
3. **Secure Firestore rules** - Don't use test mode in production
4. **Rate limiting**: Implement rate limits on your backend (if you add one)
5. **Monitor usage**: Track unusual patterns that might indicate abuse

## 🚀 Deployment to Netlify

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Login: `netlify login`
3. Deploy: `netlify deploy --prod`

Or use the web interface:
1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables in Netlify settings

## 📊 Analytics & Monitoring

To track usage and revenue, implement:

```javascript
// Track wallet transactions
async function logTransaction(userId, amount, type) {
  await addDoc(collection(db, 'transactions'), {
    userId,
    amount,
    type, // 'credit' or 'debit'
    timestamp: serverTimestamp(),
    description: `${type} - ${amount}`
  });
}

// Track model usage for billing
async function logModelUsage(userId, modelId, tokens, cost) {
  await addDoc(collection(db, 'model_usage'), {
    userId,
    modelId,
    tokens,
    cost,
    timestamp: serverTimestamp()
  });
}
```

## 🛠️ Future Enhancements

- [ ] Stripe integration for real payments (currently mocked)
- [ ] Email notifications for low balance
- [ ] Usage analytics dashboard
- [ ] Team accounts with shared wallets
- [ ] Custom model fine-tuning
- [ ] Agent templates and presets
- [ ] API for third-party integrations

## 📝 License

MIT License - See LICENSE file for details

## 👨‍💻 Support

For issues or questions:
- Open an issue on GitHub
- Email: support@agentify-business.co.uk

---

**Built with ❤️ by HermesOS Team**
