import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { GAME_STATE } from './game_state_enum';

// Mock Firebase
jest.mock('./firebase', () => ({
  auth: {},
  googleProvider: {},
  db: {}
}));

jest.mock('./firebaseAuth', () => ({
  signInWithGoogle: jest.fn(),
  signOutUser: jest.fn(),
  onAuthStateChange: jest.fn((callback) => {
    callback(null);
    return () => {};
  })
}));

jest.mock('./firestoreService', () => ({
  getAllChallenges: jest.fn(() => Promise.resolve([])),
  getChallenge: jest.fn(),
  submitScore: jest.fn(),
  getChallengeLeaderboard: jest.fn(() => Promise.resolve([])),
  getChallengeHighScore: jest.fn(() => Promise.resolve(0))
}));

describe('Boggle App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Boggle Game title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Boggle Game/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('shows sign in button when user is not authenticated', async () => {
    render(<App />);
    await waitFor(() => {
      const signInButton = screen.getByText(/Sign in with Google/i);
      expect(signInButton).toBeInTheDocument();
    });
  });

  test('shows game mode selection buttons', async () => {
    render(<App />);
    await waitFor(() => {
      const loadChallengeButton = screen.getByText(/Load Challenge/i);
      const randomGameButton = screen.getByText(/Random Game/i);
      expect(loadChallengeButton).toBeInTheDocument();
      expect(randomGameButton).toBeInTheDocument();
    });
  });

  test('shows board size selection', async () => {
    render(<App />);
    await waitFor(() => {
      const size3Button = screen.getByText(/3x3/i);
      const size4Button = screen.getByText(/4x4/i);
      expect(size3Button).toBeInTheDocument();
      expect(size4Button).toBeInTheDocument();
    });
  });

  test('can click Load Challenge button', async () => {
    render(<App />);
    await waitFor(() => {
      const loadChallengeButton = screen.getByText(/Load Challenge/i);
      fireEvent.click(loadChallengeButton);
      expect(screen.getByText(/Available Challenges/i)).toBeInTheDocument();
    });
  });
});
