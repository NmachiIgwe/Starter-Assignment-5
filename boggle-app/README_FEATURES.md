# Boggle Game - Part 5 Features

This document describes the new features added for Part 5 of the Boggle assignment.

## Features Implemented

### 1. Firebase Integration ✅
- **Firestore Database**: Stores challenge grids and scores
- **Firebase Authentication**: Google Sign-in support
- **Real-time Updates**: Leaderboard updates automatically

### 2. Challenge Grids ✅
- **Manual Population**: Script to populate Firestore with fixed challenge grids
- **5 Pre-configured Challenges**: 
  - Easy 4x4 Challenge
  - Medium 5x5 Challenge
  - Hard 6x6 Challenge
  - Expert 7x7 Challenge
  - Master 8x8 Challenge

### 3. Load Challenge Functionality ✅
- **Challenge List**: Displays all available challenges
- **High Score Display**: Shows current high score for each challenge
- **Challenge Selection**: Click to load and play a specific challenge
- **Challenge Mode**: Distinguishes between random games and challenges

### 4. Leaderboard Functionality ✅
- **Real-time Leaderboard**: Shows top 10 scores for each challenge
- **User Highlighting**: Your score is highlighted in the leaderboard
- **Rank Display**: Shows player rank, name, and score
- **Automatic Updates**: Leaderboard updates when scores are submitted

### 5. Google Sign-in ✅
- **Authentication UI**: Sign in/out buttons
- **User Profile**: Displays user name or email
- **Protected Features**: Score submission requires authentication

### 6. Score Tracking ✅
- **Automatic Submission**: Scores are automatically sent to Firebase during gameplay
- **Score Calculation**: Based on word length (3-4 letters: 1pt, 5: 2pts, 6: 3pts, 7: 5pts, 8+: 11pts)
- **Best Score Tracking**: Only updates if new score is higher
- **Real-time Updates**: Scores update as you find words

### 7. Rank Change Notifications ✅ (Stretch Feature)
- **Rank Tracking**: Tracks your rank changes
- **Notifications**: Alerts when you move up in rank
- **Previous Rank**: Compares current rank with previous rank

### 8. Firebase Deployment ✅
- **Hosting Configuration**: Firebase hosting setup
- **Build Scripts**: Automated build and deploy
- **Deployment Guide**: Complete instructions in DEPLOYMENT.md

### 9. Testing ✅
- **Unit Tests**: Basic component tests
- **Firebase Mocks**: Mocked Firebase services for testing
- **Test Coverage**: Tests for main UI components

## File Structure

```
boggle-app/
├── src/
│   ├── firebase.js              # Firebase configuration
│   ├── firebaseAuth.js          # Authentication functions
│   ├── firestoreService.js      # Firestore database operations
│   ├── setupChallenges.js       # Challenge population script
│   ├── App.js                   # Main app component (updated)
│   └── App.test.js              # Unit tests
├── .firebaserc                  # Firebase project configuration
├── firebase.json                # Firebase hosting configuration
├── DEPLOYMENT.md               # Deployment instructions
└── README_FEATURES.md          # This file
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd boggle-app
npm install
```

### 2. Configure Firebase
1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Authentication (Google provider)
3. Enable Firestore Database
4. Copy your Firebase config to `src/firebase.js`

### 3. Populate Challenges
After deploying, run the setup script:
```javascript
// In browser console
import('./setupChallenges').then(m => m.setupChallenges())
```

### 4. Deploy
```bash
npm run build
firebase deploy --only hosting
```

## Usage

### Playing a Challenge
1. Sign in with Google
2. Click "Load Challenge"
3. Select a challenge from the list
4. Play the game - scores are automatically tracked
5. View leaderboard after game ends

### Playing a Random Game
1. Click "Random Game"
2. Select board size
3. Click "Start Game"
4. Play normally (no leaderboard for random games)

## Scoring System

- 3-4 letter words: 1 point
- 5 letter words: 2 points
- 6 letter words: 3 points
- 7 letter words: 5 points
- 8+ letter words: 11 points

## Firestore Collections

### `challenges` Collection
```javascript
{
  id: "challenge_1",
  name: "Easy 4x4 Challenge",
  size: 4,
  grid: [["T", "W", "Y", "R"], ...],
  description: "A simple 4x4 grid",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### `scores` Collection
```javascript
{
  id: "challenge_1_user123",
  challengeId: "challenge_1",
  userId: "user123",
  userName: "John Doe",
  score: 45,
  foundWords: ["word1", "word2", ...],
  timestamp: Timestamp
}
```

## Security Rules

See DEPLOYMENT.md for Firestore security rules configuration.

## Future Enhancements (Stretch Goals)

- [ ] Multi-player mode
- [ ] Real-time game sessions
- [ ] Challenge creation UI
- [ ] More detailed statistics
- [ ] Achievement system
- [ ] Social features (friends, sharing)

## Troubleshooting

### Challenges not loading
- Verify Firestore is enabled
- Check security rules allow reads
- Ensure challenges are populated

### Authentication not working
- Verify Google sign-in is enabled in Firebase Console
- Check authorized domains
- Review browser console for errors

### Scores not submitting
- Ensure user is signed in
- Check Firestore security rules
- Verify network connection

## Credits

Built with:
- React
- Firebase (Firestore, Authentication, Hosting)
- Material-UI (optional styling)

