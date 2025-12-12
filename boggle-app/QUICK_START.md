# Quick Start Guide - Run Your Boggle Website

## 🚀 Running Locally (Development)

### Step 1: Install Dependencies
```bash
cd boggle-app
npm install
```

### Step 2: Configure Firebase (Required)
1. Create a Firebase project at https://console.firebase.google.com/
2. Enable:
   - **Authentication** → Google Sign-in
   - **Firestore Database** → Create database (test mode)
3. Copy your Firebase config to `src/firebase.js`
4. Update `.firebaserc` with your project ID

### Step 3: Set Firestore Rules
In Firebase Console → Firestore → Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /challenges/{challengeId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /scores/{scoreId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Step 4: Start the App
```bash
npm start
```

The app will open at **http://localhost:3000**

### Step 5: Populate Challenges
1. Open browser console (F12)
2. Run:
```javascript
import('./setupChallenges').then(m => m.setupChallenges())
```

## 🌐 Deploy to Firebase (Production)

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Login
```bash
firebase login
```

### Step 3: Build
```bash
npm run build
```

### Step 4: Deploy
```bash
firebase deploy --only hosting
```

Your app will be live at:
- `https://YOUR_PROJECT_ID.web.app`
- `https://YOUR_PROJECT_ID.firebaseapp.com`

## 📋 Features Available

✅ **Random Games** - Play with randomly generated grids
✅ **Challenge Mode** - Play fixed challenge grids
✅ **Leaderboard** - Compete with other players
✅ **Google Sign-in** - Track your scores
✅ **Real-time Scoring** - Automatic score submission
✅ **Beautiful UI** - Modern gradient design

## 🎮 How to Play

1. **Sign in** with Google (optional but recommended)
2. Choose **"Load Challenge"** or **"Random Game"**
3. If challenge mode:
   - Select a challenge from the list
   - Play and find words
   - Your score updates automatically
   - View leaderboard after game ends
4. If random game:
   - Select board size (3x3 to 6x6)
   - Play and find words
   - View all solutions when game ends

## 🐛 Troubleshooting

**"Firebase not initialized"**
- Check `src/firebase.js` has correct config
- Verify all Firebase services are enabled

**"Permission denied"**
- Check Firestore security rules
- Ensure user is authenticated

**"Challenges not loading"**
- Run the setup script to populate challenges
- Check Firestore console for data

**Port already in use**
- Change port: `PORT=3001 npm start`

## 📚 More Help

- See `DEPLOYMENT.md` for detailed deployment
- See `SETUP_INSTRUCTIONS.md` for setup details
- See `README_FEATURES.md` for feature documentation

