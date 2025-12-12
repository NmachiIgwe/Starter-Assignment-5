# Firebase Deployment Guide

## Prerequisites

1. **Firebase Account**: Sign up at https://firebase.google.com/
2. **Firebase CLI**: Install globally
   ```bash
   npm install -g firebase-tools
   ```

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "boggle-game")
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firebase Services

### Enable Authentication
1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Google** as a sign-in provider
4. Add your domain to authorized domains if needed

### Enable Firestore
1. Go to **Firestore Database**
2. Click "Create database"
3. Start in **test mode** (for development)
4. Choose a location for your database
5. Click "Enable"

### Enable Hosting
1. Go to **Hosting**
2. Click "Get started"
3. Follow the setup instructions

## Step 3: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (`</>`)
4. Register app with a nickname
5. Copy the `firebaseConfig` object

## Step 4: Configure Your App

1. Open `boggle-app/src/firebase.js`
2. Replace the placeholder config with your actual Firebase config:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_ACTUAL_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

3. Update `.firebaserc`:
   ```json
   {
     "projects": {
       "default": "YOUR_PROJECT_ID"
     }
   }
   ```

## Step 5: Set Firestore Security Rules

Go to **Firestore Database** → **Rules** and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Challenges are readable by everyone
    match /challenges/{challengeId} {
      allow read: if true;
      allow write: if request.auth != null; // Only authenticated users can create challenges
    }
    
    // Scores are readable by everyone, writable by authenticated users
    match /scores/{scoreId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

## Step 6: Populate Challenge Grids

After deploying, you can populate challenges in two ways:

### Option A: Browser Console
1. Open your deployed app
2. Open browser console (F12)
3. Run:
   ```javascript
   import('./setupChallenges').then(module => module.setupChallenges())
   ```

### Option B: Create a Setup Page
Create a temporary admin page to populate challenges.

## Step 7: Build and Deploy

1. **Install dependencies** (if not already done):
   ```bash
   cd boggle-app
   npm install
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase** (if not already done):
   ```bash
   firebase init hosting
   ```
   - Select "Use an existing project"
   - Choose your project
   - Set public directory to `build`
   - Configure as single-page app: **Yes**
   - Set up automatic builds: **No**

4. **Build the React app**:
   ```bash
   npm run build
   ```

5. **Deploy to Firebase**:
   ```bash
   firebase deploy --only hosting
   ```

6. **Your app will be live at**:
   ```
   https://YOUR_PROJECT_ID.web.app
   ```
   or
   ```
   https://YOUR_PROJECT_ID.firebaseapp.com
   ```

## Step 8: Continuous Deployment (Optional)

To set up automatic deployments:

1. Connect your GitHub repo to Firebase
2. Go to **Hosting** → **Get started** → **Connect to GitHub**
3. Follow the setup wizard
4. Firebase will automatically deploy when you push to your main branch

## Troubleshooting

### Authentication not working
- Check that Google sign-in is enabled in Firebase Console
- Verify your authorized domains include your hosting URL
- Check browser console for errors

### Firestore permission denied
- Review your Firestore security rules
- Make sure rules allow read/write for your use case

### Build errors
- Make sure all dependencies are installed: `npm install`
- Check for TypeScript/ESLint errors
- Verify Firebase config is correct

### Challenges not loading
- Make sure you've populated challenges in Firestore
- Check Firestore console to verify data exists
- Review Firestore security rules

## Testing Your Deployment

1. **Test Authentication**:
   - Click "Sign in with Google"
   - Verify you can sign in/out

2. **Test Challenge Loading**:
   - Click "Load Challenge"
   - Verify challenges appear
   - Select a challenge and verify it loads

3. **Test Score Submission**:
   - Sign in
   - Play a challenge
   - Verify score is submitted
   - Check leaderboard updates

4. **Test Leaderboard**:
   - View leaderboard for a challenge
   - Verify scores are displayed correctly

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Hosting Guide](https://firebase.google.com/docs/hosting)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

