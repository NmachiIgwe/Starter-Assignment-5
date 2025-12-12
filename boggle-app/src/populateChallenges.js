// Script to manually populate Firestore with challenge grids
// Run this in the browser console or as a one-time setup script
// Make sure Firebase is initialized before running

import { saveChallenge } from './firestoreService';

// Sample challenge grids - you can add more
export const sampleChallenges = [
  {
    name: "Easy 4x4 Challenge",
    size: 4,
    grid: [["T", "W", "Y", "R"], ["E", "N", "P", "H"], ["G", "Z", "Qu", "R"], ["O", "N", "T", "A"]],
    description: "A simple 4x4 grid to get started"
  },
  {
    name: "Medium 5x5 Challenge",
    size: 5,
    grid: [["B", "R", "E", "I", "E"], ["O", "S", "R", "S", "A"], ["O", "T", "P", "N", "N"], ["M", "I", "E", "G", "E"], ["F", "F", "E", "S", "N"]],
    description: "A medium difficulty 5x5 grid"
  },
  {
    name: "Hard 6x6 Challenge",
    size: 6,
    grid: [["N", "I", "N", "O", "I", "R"], ["G", "N", "P", "H", "N", "T"], ["S", "S", "U", "P", "N", "E"], ["A", "G", "I", "Y", "Z", "G"], ["D", "H", "A", "L", "P", "S"], ["N", "M", "R", "C", "S", "E"]],
    description: "A challenging 6x6 grid"
  }
];

// Function to populate challenges
export const populateChallenges = async () => {
  try {
    for (let i = 0; i < sampleChallenges.length; i++) {
      const challenge = sampleChallenges[i];
      const challengeId = `challenge_${i + 1}`;
      await saveChallenge(challengeId, challenge);
      console.log(`Saved challenge: ${challenge.name} (${challengeId})`);
    }
    console.log('All challenges populated successfully!');
  } catch (error) {
    console.error('Error populating challenges:', error);
  }
};

// Export function to be called from browser console
if (typeof window !== 'undefined') {
  window.populateChallenges = populateChallenges;
}

