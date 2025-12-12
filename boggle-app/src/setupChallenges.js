// Setup script to populate Firestore with challenge grids
// Run this once to initialize your challenges in Firestore
// You can run this from the browser console after the app loads:
// import { populateChallenges } from './populateChallenges';
// populateChallenges();

import { saveChallenge } from './firestoreService';

// Challenge grids data
const challengeData = [
  {
    id: 'challenge_1',
    name: "Easy 4x4 Challenge",
    size: 4,
    grid: [["T", "W", "Y", "R"], ["E", "N", "P", "H"], ["G", "Z", "Qu", "R"], ["O", "N", "T", "A"]],
    description: "A simple 4x4 grid to get started"
  },
  {
    id: 'challenge_2',
    name: "Medium 5x5 Challenge",
    size: 5,
    grid: [["B", "R", "E", "I", "E"], ["O", "S", "R", "S", "A"], ["O", "T", "P", "N", "N"], ["M", "I", "E", "G", "E"], ["F", "F", "E", "S", "N"]],
    description: "A medium difficulty 5x5 grid"
  },
  {
    id: 'challenge_3',
    name: "Hard 6x6 Challenge",
    size: 6,
    grid: [["N", "I", "N", "O", "I", "R"], ["G", "N", "P", "H", "N", "T"], ["S", "S", "U", "P", "N", "E"], ["A", "G", "I", "Y", "Z", "G"], ["D", "H", "A", "L", "P", "S"], ["N", "M", "R", "C", "S", "E"]],
    description: "A challenging 6x6 grid"
  },
  {
    id: 'challenge_4',
    name: "Expert 7x7 Challenge",
    size: 7,
    grid: [["E", "C", "O", "E", "A", "O", "A"], ["H", "E", "N", "A", "N", "G", "S"], ["A", "R", "S", "I", "I", "L", "N"], ["A", "B", "C", "B", "G", "O", "B"], ["R", "R", "T", "A", "T", "P", "D"], ["N", "R", "E", "D", "E", "I", "L"], ["P", "P", "C", "A", "E", "I", "G"]],
    description: "An expert level 7x7 grid"
  },
  {
    id: 'challenge_5',
    name: "Master 8x8 Challenge",
    size: 8,
    grid: [["L", "I", "S", "U", "K", "N", "S", "D"], ["E", "T", "T", "I", "R", "A", "N", "I"], ["O", "U", "E", "L", "H", "G", "A", "C"], ["R", "E", "N", "Z", "T", "R", "A", "C"], ["M", "E", "S", "H", "H", "G", "P", "E"], ["A", "R", "E", "C", "T", "K", "I", "I"], ["B", "O", "E", "I", "I", "I", "B", "G"], ["G", "D", "R", "R", "E", "A", "T", "G"]],
    description: "A master level 8x8 grid"
  }
];

// Function to populate all challenges
export const setupChallenges = async () => {
  try {
    console.log('Starting to populate challenges...');
    for (const challenge of challengeData) {
      await saveChallenge(challenge.id, {
        name: challenge.name,
        size: challenge.size,
        grid: challenge.grid,
        description: challenge.description
      });
      console.log(`✓ Saved challenge: ${challenge.name} (${challenge.id})`);
    }
    console.log('✅ All challenges populated successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error populating challenges:', error);
    throw error;
  }
};

// Make it available globally for browser console
if (typeof window !== 'undefined') {
  window.setupChallenges = setupChallenges;
}

export default setupChallenges;

