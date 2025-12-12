import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc,
  query,
  orderBy,
  limit,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

// Challenge Grids Collection
const CHALLENGES_COLLECTION = 'challenges';
const SCORES_COLLECTION = 'scores';

// Get all challenges
export const getAllChallenges = async () => {
  try {
    const challengesRef = collection(db, CHALLENGES_COLLECTION);
    const snapshot = await getDocs(challengesRef);
    const challenges = [];
    snapshot.forEach((doc) => {
      challenges.push({ id: doc.id, ...doc.data() });
    });
    return challenges;
  } catch (error) {
    console.error('Error getting challenges:', error);
    throw error;
  }
};

// Get a specific challenge by ID
export const getChallenge = async (challengeId) => {
  try {
    const challengeRef = doc(db, CHALLENGES_COLLECTION, challengeId);
    const challengeSnap = await getDoc(challengeRef);
    if (challengeSnap.exists()) {
      return { id: challengeSnap.id, ...challengeSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting challenge:', error);
    throw error;
  }
};

// Create or update a challenge (for manual population)
export const saveChallenge = async (challengeId, challengeData) => {
  try {
    const challengeRef = doc(db, CHALLENGES_COLLECTION, challengeId);
    await setDoc(challengeRef, {
      ...challengeData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return challengeId;
  } catch (error) {
    console.error('Error saving challenge:', error);
    throw error;
  }
};

// Submit a score for a challenge
export const submitScore = async (challengeId, userId, userName, score, foundWords) => {
  try {
    const scoreRef = doc(db, SCORES_COLLECTION, `${challengeId}_${userId}`);
    const scoreData = {
      challengeId,
      userId,
      userName,
      score,
      foundWords,
      timestamp: serverTimestamp()
    };
    
    // Check if user already has a score for this challenge
    const existingScore = await getDoc(scoreRef);
    if (existingScore.exists()) {
      const existingData = existingScore.data();
      // Only update if new score is higher
      if (score > existingData.score) {
        await updateDoc(scoreRef, scoreData);
        return { updated: true, previousScore: existingData.score };
      }
      return { updated: false, currentScore: existingData.score };
    } else {
      await setDoc(scoreRef, scoreData);
      return { updated: true, previousScore: 0 };
    }
  } catch (error) {
    console.error('Error submitting score:', error);
    throw error;
  }
};

// Get leaderboard for a specific challenge
export const getChallengeLeaderboard = async (challengeId, limitCount = 10) => {
  try {
    const scoresRef = collection(db, SCORES_COLLECTION);
    const q = query(
      scoresRef,
      where('challengeId', '==', challengeId),
      orderBy('score', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    const leaderboard = [];
    snapshot.forEach((doc) => {
      leaderboard.push({ id: doc.id, ...doc.data() });
    });
    return leaderboard;
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw error;
  }
};

// Get user's rank for a challenge
export const getUserRank = async (challengeId, userId) => {
  try {
    const scoresRef = collection(db, SCORES_COLLECTION);
    const q = query(
      scoresRef,
      where('challengeId', '==', challengeId),
      orderBy('score', 'desc')
    );
    const snapshot = await getDocs(q);
    let rank = 0;
    let found = false;
    snapshot.forEach((doc) => {
      rank++;
      if (doc.data().userId === userId && !found) {
        found = true;
      }
    });
    return found ? { rank, total: snapshot.size } : { rank: null, total: snapshot.size };
  } catch (error) {
    console.error('Error getting user rank:', error);
    throw error;
  }
};

// Get high score for a challenge
export const getChallengeHighScore = async (challengeId) => {
  try {
    const leaderboard = await getChallengeLeaderboard(challengeId, 1);
    return leaderboard.length > 0 ? leaderboard[0].score : 0;
  } catch (error) {
    console.error('Error getting high score:', error);
    return 0;
  }
};

