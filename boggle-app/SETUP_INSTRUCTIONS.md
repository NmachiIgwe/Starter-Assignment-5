# Quick Setup Guide

## Step 1: Install Dependencies
```bash
cd boggle-app
npm install
```

## Step 2: Firebase Setup

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com/
   - Click "Add project"
   - Follow the wizard

2. **Enable Services**
   - **Authentication**: Enable Google sign-in provider
   - **Firestore**: Create database in test mode
   - **Hosting**: Get started (we'll configure later)

3. **Get Configuration**
   - Project Settings → Your apps → Web app
   - Copy the `firebaseConfig` object

4. **Update `src/firebase.js`**
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_ACTUAL_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     // ... rest of config
   };
   ```

5. **Update `.firebaserc`**
   ```json
   {
     "projects": {
       "default": "YOUR_PROJECT_ID"
     }
   }
   ```

## Step 3: Set Firestore Security Rules

Go to Firestore Database → Rules:

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

## Step 4: Populate Challenges

After the app is running, open browser console and run:

```javascript
// Option 1: Import and run
import('./setupChallenges').then(m => m.setupChallenges())

// Option 2: If available globally
window.setupChallenges()
```

Or manually add challenges through Firebase Console.

## Step 5: Test Locally

```bash
npm start
```

Visit http://localhost:3000 and test:
- Sign in with Google
- Load challenges
- Play a challenge
- Check leaderboard

## Step 6: Deploy

```bash
# Build the app
npm run build

# Login to Firebase (first time only)
firebase login

# Deploy
firebase deploy --only hosting
```

Your app will be live at:
- https://YOUR_PROJECT_ID.web.app
- https://YOUR_PROJECT_ID.firebaseapp.com

## Troubleshooting

**"Firebase not initialized"**
- Check that `firebase.js` has correct config
- Verify all Firebase services are enabled

**"Permission denied"**
- Check Firestore security rules
- Ensure user is authenticated for write operations

**"Challenges not loading"**
- Verify challenges are populated in Firestore
- Check browser console for errors
- Verify security rules allow reads

**"Authentication not working"**
- Verify Google sign-in is enabled in Firebase Console
- Check authorized domains include your URL
- Clear browser cache and cookies

## Next Steps

1. Test all features locally
2. Populate challenge grids
3. Deploy to Firebase
4. Test deployed app
5. Share your app URL!

