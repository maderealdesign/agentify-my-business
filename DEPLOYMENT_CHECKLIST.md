# 🚀 Agentify My Business - Deployment Checklist

## ✅ Pre-Deployment (Completed)

- [x] Project initialized with Vite + React
- [x] Tailwind CSS configured
- [x] Firebase integration complete
- [x] Wallet system built with 15% margin logic
- [x] OpenRouter API service implemented
- [x] Model selector component (budget/premium tiers)
- [x] Chat interface with message history
- [x] Usage HUD for real-time tracking
- [x] Tool integrations (BYOK architecture)
- [x] Build successful (664KB gzipped)

## 🔧 Required Setup Before Going Live

### 1. Firebase Configuration ⭐ CRITICAL

**You MUST set up Firebase before users can use the app:**

#### Step A: Create Firebase Project
```bash
# Go to https://console.firebase.google.com/
# Click "Add project" → Name: agentify-my-business
# Enable Google Analytics (optional)
```

#### Step B: Enable Services in Firebase Console

1. **Authentication**
   - Navigate to Authentication → Sign-in method
   - ✅ Enable **Anonymous** provider
   
2. **Firestore Database**
   - Navigate to Firestore Database → Create database
   - Start in **production mode** (not test mode for security)
   - Choose location: `us-central` or closest to your users

3. **Storage (Optional)**
   - Navigate to Storage → Get started
   - Start in production mode

#### Step C: Update Environment Variables

1. Go to Firebase Console → Project Settings
2. Scroll to "Your apps" → Click web icon `</>`
3. Copy the configuration object
4. Update `/Users/dom/agentify-my-business/.env.local`:

```bash
# Replace these in .env.local (DO NOT COMMIT THIS FILE):

VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=agentify-my-business.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=agentify-my-business
VITE_FIREBASE_STORAGE_BUCKET=agentify-my-business.appspot.com
VITE_FIREBASE_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

#### Step D: Configure Firestore Security Rules

**IMPORTANT**: Replace default rules with these secure rules in Firebase Console → Firestore Database → Rules tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Transactions - owner verification
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.resource.data.userId)).data.ownerId == request.auth.uid;
    }
    
    // Agent memory files - user ownership only
    match /agent_memory/{userId}/{document=**} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
    
    // Chat history - user ownership only
    match /chats/{userId}/{messageId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
  }
}
```

### 2. OpenRouter API Key 🔑 CRITICAL

**Required for the agent to work:**

1. Go to https://openrouter.ai/
2. Sign up / Log in
3. Navigate to **Keys** section
4. Click "Create new key"
5. Name it: `Agentify Production`
6. Copy the key (starts with `sk-...`)
7. Update `.env.local`:

```bash
VITE_OPENROUTER_API_KEY=sk-or-v1-your-key-here-exactly-this-format
```

### 3. Netlify Deployment ⚡

#### Option A: Deploy via Web Interface (Easiest)

1. Go to https://app.netlify.com/
2. Click "New site from Git"
3. Select `maderealdesign/agentify-my-business` repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Add environment variables (same as in `.env.local`)
6. Click "Deploy site"

#### Option B: Deploy via CLI (Advanced)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to production
cd /Users/dom/agentify-my-business
netlify deploy --prod
```

### 4. Environment Variables in Production ⚠️

**DO NOT commit `.env.local`!** Instead, add these as environment variables in your hosting platform:

#### For Netlify:
1. Go to site settings → Environment variables
2. Add each variable from `.env.local` (except the ones starting with `VITE_`)
3. Netlify will automatically prepend `VITE_` for client-side env vars

#### For Vercel:
```bash
vercel env add VITE_FIREBASE_API_KEY
# Follow prompts to enter value
# Repeat for all variables
```

## 🧪 Testing Checklist

### Before Launch, Test These Scenarios:

1. **Anonymous Authentication**
   - [ ] User visits site without logging in
   - [ ] Agent works with anonymous session
   - [ ] Data persists across page refreshes

2. **Wallet System**
   - [ ] Wallet panel shows $0 initially
   - [ ] Top-up modal opens correctly
   - [ ] Margin calculation is correct (15%)
   - [ ] Balance updates after top-up
   - [ ] Low balance warning appears (<$1)

3. **Model Selection**
   - [ ] All model categories display correctly
   - [ ] Pricing information is accurate
   - [ ] Selecting a model changes the chat interface
   - [ ] Model badge shows in header when selected

4. **Chat Interface**
   - [ ] Messages display with correct styling
   - [ ] Timestamps show correctly
   - [ ] Loading states work during API calls
   - [ ] Error handling for failed messages

5. **Usage HUD**
   - [ ] Token count updates in real-time
   - [ ] Cost calculation is accurate
   - [ ] Wallet progress bar works
   - [ ] Recent activity log shows correctly

6. **Tool Integrations (BYOK)**
   - [ ] Can add GitHub API key
   - [ ] Keys stored only in localStorage
   - [ ] Can remove connections
   - [ ] Security warning displays correctly

7. **Agent Memory**
   - [ ] Can upload MD files
   - [ ] Files saved to Firebase
   - [ ] Context loaded when chatting
   - [ ] File list persists across sessions

8. **Responsive Design**
   - [ ] Mobile menu works (all breakpoints)
   - [ ] Layout adjusts correctly on tablets
   - [ ] Chat interface usable on mobile screens
   - [ ] Touch targets large enough

## 📊 Post-Deployment Monitoring

### Key Metrics to Track:

```javascript
// Add these to Firebase Console → Firestore → Queries

// 1. Active users (last 7 days)
const activeUsersQuery = collectionGroup(db, 'users', {
  where: 'lastActive', '>=', timestamp(7.days.ago)
});

// 2. Revenue (wallet top-ups)
const revenueQuery = query(collection(db, 'transactions'), 
  where('type', '==', 'credit')
);

// 3. Average cost per session
const avgCostQuery = collectionGroup(db, 'model_usage');

// 4. Popular models
const modelUsageQuery = groupBy(model_id) from model_usage;
```

### Error Monitoring:

1. **OpenRouter API Errors**
   - Check for invalid API key errors
   - Monitor rate limit responses (HTTP 429)
   - Track insufficient balance errors

2. **Firebase Security Errors**
   - Watch for permission denied errors
   - Ensure Firestore rules are correct

3. **Wallet Balance Issues**
   - Detect negative balances
   - Catch race conditions in updates

## 🚨 Rollback Plan

If something goes wrong after deployment:

1. **Quick Rollback via Netlify:**
   ```bash
   netlify rollback --prod 2
   # Reverts to 2nd-to-last successful deploy
   ```

2. **Disable Features Gradually:**
   - Disable wallet system first if payment issues
   - Switch to demo mode with fixed balance
   - Temporarily remove OpenRouter integration

3. **Database Rollback:**
   ```bash
   # If Firestore data is corrupted:
   firebase firestore:delete --all-docs
   # Recreate from backup (if you have one)
   ```

## 📝 Launch Day Tasks

### 24 Hours Before Launch:
- [ ] Verify all environment variables set correctly
- [ ] Test complete user flow end-to-end
- [ ] Check Firestore security rules are production-ready
- [ ] Confirm OpenRouter API key is valid
- [ ] Test on multiple browsers (Chrome, Safari, Firefox)

### During Launch:
- [ ] Monitor Netlify build logs for errors
- [ ] Watch Firebase console for unusual activity
- [ ] Be ready to respond to user feedback
- [ ] Keep rollback plan accessible

### After Launch (First 24 Hours):
- [ ] Check error logs every few hours
- [ ] Review user feedback and bug reports
- [ ] Monitor wallet balance trends
- [ ] Track model usage patterns

## 🎉 You're Ready to Launch!

Once all checkboxes are complete, your Agentify My Business platform will be live with:

✅ Full AI agent functionality  
✅ Wallet system with margin structure  
✅ Secure BYOK architecture  
✅ Real-time usage tracking  
✅ Persistent memory storage  

**Good luck with your launch! 🚀**

---

Need help? Check the main README.md or open an issue on GitHub.
