import React, { useState, useEffect } from 'react';
import { GAME_STATE } from './game_state_enum';
import { signInWithGoogle, signOutUser, onAuthStateChange } from './firebaseAuth';
import { 
  getAllChallenges, 
  getChallenge, 
  submitScore, 
  getChallengeLeaderboard,
  getChallengeHighScore 
} from './firestoreService';
import './App.css';

function App() {
  const [game, setGame] = useState({});
  const [grid, setGrid] = useState([]);
  const [gameState, setGameState] = useState(GAME_STATE.BEFORE);
  const [size, setSize] = useState(4);
  const [foundSolutions, setFoundSolutions] = useState([]);
  const [allSolutions, setAllSolutions] = useState([]);
  const [score, setScore] = useState(0);
  
  // Firebase state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Challenge state
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showChallengeList, setShowChallengeList] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [highScore, setHighScore] = useState(0);
  const [isChallengeMode, setIsChallengeMode] = useState(false);
  const [previousRank, setPreviousRank] = useState(null);
  const [currentRank, setCurrentRank] = useState(null);

  const Convert = (s) => {  // convert a string into an array of tokens that are strings
    if (!s) return [];
    s = s.replace(/'/g, '');
    s = s.replace('[', '');
    s = s.replace(']', '');
    const tokens = s.split(",") // Split the string into an array of tokens
      .map(token => token.trim()) // Trim each token
      .filter(token => token !== ''); // Remove empty tokens
    return tokens;
  }

  // Calculate score based on word length
  const calculateScore = (words) => {
    return words.reduce((total, word) => {
      const len = word.length;
      if (len === 3 || len === 4) return total + 1;
      if (len === 5) return total + 2;
      if (len === 6) return total + 3;
      if (len === 7) return total + 5;
      if (len >= 8) return total + 11;
      return total;
    }, 0);
  };

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load challenges on mount
  useEffect(() => {
    loadChallenges();
  }, []);

  // Load challenges from Firestore
  const loadChallenges = async () => {
    try {
      const challengesList = await getAllChallenges();
      const challengesWithScores = await Promise.all(
        challengesList.map(async (challenge) => {
          const highScore = await getChallengeHighScore(challenge.id);
          return { ...challenge, highScore };
        })
      );
      setChallenges(challengesWithScores);
    } catch (error) {
      console.error('Error loading challenges:', error);
    }
  };

  // Load leaderboard for selected challenge
  useEffect(() => {
    if (selectedChallenge) {
      loadLeaderboard(selectedChallenge.id);
    }
  }, [selectedChallenge]);

  const loadLeaderboard = async (challengeId) => {
    try {
      const leaderboardData = await getChallengeLeaderboard(challengeId, 10);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  // useEffect will trigger when gameState or size changes
  // This will call the game_create endpoint when the game starts (for random games)
  useEffect(() => {
    if (gameState === GAME_STATE.IN_PROGRESS && !isChallengeMode) {
      // TODO: Replace XXXXXXXXXXXXXXXXXXXXXXXX with your Codio box name (e.g., 'jumbo-pelican')
      // Get your box name from: Project -> Box Info in Codio
      const url = "https://XXXXXXXXXXXXXXXX-8000.codio.io/api/game/create/" + size;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setGame(data);
          const s = data.grid.replace(/'/g, '"');  //replace single ' with double "
          setGrid(JSON.parse(s));
          setFoundSolutions([]);
          setScore(0);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else if (gameState === GAME_STATE.IN_PROGRESS && isChallengeMode && selectedChallenge) {
      // Load challenge grid
      setGrid(selectedChallenge.grid);
      setSize(selectedChallenge.size);
      setFoundSolutions([]);
      setScore(0);
      setGame({ name: selectedChallenge.name });
    }
  }, [gameState, size, isChallengeMode, selectedChallenge]);

  // useEffect will trigger when the array items in the second argument are
  // updated so whenever grid is updated, we will recompute the solutions
  useEffect(() => {
    if (typeof game.foundwords !== "undefined" && !isChallengeMode) {
      let tmpAllSolutions = Convert(game.foundwords);
      setAllSolutions(tmpAllSolutions);
    }
  }, [grid, game.foundwords, isChallengeMode]);

  // Update score when found solutions change (for challenge mode)
  useEffect(() => {
    if (isChallengeMode && foundSolutions.length > 0) {
      const newScore = calculateScore(foundSolutions);
      setScore(newScore);
    }
  }, [foundSolutions, isChallengeMode]);

  // Auto-submit score during challenge play
  useEffect(() => {
    if (isChallengeMode && user && gameState === GAME_STATE.IN_PROGRESS && foundSolutions.length > 0) {
      const submitScoreAsync = async () => {
        try {
          const result = await submitScore(
            selectedChallenge.id,
            user.uid,
            user.displayName || user.email,
            score,
            foundSolutions
          );
          
          // Check for rank changes
          if (result.updated) {
            const leaderboardData = await getChallengeLeaderboard(selectedChallenge.id, 100);
            const userIndex = leaderboardData.findIndex(entry => entry.userId === user.uid);
            if (userIndex !== -1) {
              const newRank = userIndex + 1;
              if (previousRank && previousRank !== newRank) {
                setCurrentRank(newRank);
                // Show rank change notification
                if (previousRank > newRank) {
                  alert(`🎉 Congratulations! You moved up to rank #${newRank}!`);
                }
              }
              setPreviousRank(newRank);
            }
            await loadLeaderboard(selectedChallenge.id);
            await loadChallenges(); // Refresh high scores
          }
        } catch (error) {
          console.error('Error submitting score:', error);
        }
      };
      
      // Debounce score submission
      const timeoutId = setTimeout(submitScoreAsync, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [score, foundSolutions, user, isChallengeMode, selectedChallenge, gameState]);

  const handleStartGame = () => {
    setGameState(GAME_STATE.IN_PROGRESS);
    setIsChallengeMode(false);
    setSelectedChallenge(null);
  };

  const handleEndGame = () => {
    setGameState(GAME_STATE.ENDED);
    
    // Submit final score if in challenge mode
    if (isChallengeMode && user && selectedChallenge) {
      submitScore(
        selectedChallenge.id,
        user.uid,
        user.displayName || user.email,
        score,
        foundSolutions
      ).then(() => {
        loadLeaderboard(selectedChallenge.id);
        loadChallenges();
      });
    }
  };

  const handleSizeChange = (newSize) => {
    setSize(newSize);
  };

  const handleLoadChallenge = async (challengeId) => {
    try {
      const challenge = await getChallenge(challengeId);
      if (challenge) {
        setSelectedChallenge(challenge);
        setIsChallengeMode(true);
        setGameState(GAME_STATE.IN_PROGRESS);
        setShowChallengeList(false);
        setPreviousRank(null);
        setCurrentRank(null);
      }
    } catch (error) {
      console.error('Error loading challenge:', error);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleWordFound = (word) => {
    if (!foundSolutions.includes(word)) {
      setFoundSolutions([...foundSolutions, word]);
    }
  };

  if (loading) {
    return <div className="App">Loading...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Boggle Game</h1>
        
        {/* Authentication Section */}
        <div style={{ marginBottom: '20px' }}>
          {user ? (
            <div>
              <p>Welcome, {user.displayName || user.email}!</p>
              <button onClick={handleSignOut} style={{ padding: '5px 10px', margin: '5px' }}>
                Sign Out
              </button>
            </div>
          ) : (
            <button onClick={handleSignIn} style={{ padding: '5px 10px', margin: '5px' }}>
              Sign in with Google
            </button>
          )}
        </div>

        {gameState === GAME_STATE.BEFORE && (
          <div>
            <h2>Select Game Mode:</h2>
            <button 
              onClick={() => setShowChallengeList(true)} 
              style={{ margin: '10px', padding: '10px 20px' }}
            >
              Load Challenge
            </button>
            <button 
              onClick={handleStartGame} 
              style={{ margin: '10px', padding: '10px 20px' }}
            >
              Random Game
            </button>

            {!showChallengeList && (
              <div>
                <h3>Select Board Size:</h3>
                <button onClick={() => handleSizeChange(3)}>3x3</button>
                <button onClick={() => handleSizeChange(4)}>4x4</button>
                <button onClick={() => handleSizeChange(5)}>5x5</button>
                <button onClick={() => handleSizeChange(6)}>6x6</button>
              </div>
            )}

            {showChallengeList && (
              <div style={{ marginTop: '20px' }}>
                <h3>Available Challenges</h3>
                <button 
                  onClick={() => setShowChallengeList(false)}
                  style={{ marginBottom: '10px', padding: '5px 10px' }}
                >
                  Back
                </button>
                <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                  {challenges.length === 0 ? (
                    <p>No challenges available. Please populate challenges first.</p>
                  ) : (
                    challenges.map((challenge) => (
                      <div 
                        key={challenge.id} 
                        style={{ 
                          border: '1px solid #ddd', 
                          padding: '10px', 
                          margin: '10px 0',
                          cursor: 'pointer',
                          backgroundColor: selectedChallenge?.id === challenge.id ? '#e0e0e0' : 'white'
                        }}
                        onClick={() => handleLoadChallenge(challenge.id)}
                      >
                        <h4>{challenge.name}</h4>
                        <p>{challenge.description || `Size: ${challenge.size}x${challenge.size}`}</p>
                        <p><strong>High Score: {challenge.highScore || 0}</strong></p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {gameState === GAME_STATE.IN_PROGRESS && (
          <div>
            <h2>
              {isChallengeMode ? `Challenge: ${selectedChallenge?.name}` : `Game in Progress - Size: ${size}x${size}`}
            </h2>
            {isChallengeMode && (
              <div>
                <h3>Score: {score}</h3>
                <p>Words Found: {foundSolutions.length}</p>
              </div>
            )}
            {grid.length > 0 && (
              <div style={{ margin: '20px 0' }}>
                <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
                  <tbody>
                    {grid.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, colIndex) => (
                          <td
                            key={colIndex}
                            style={{
                              border: '1px solid #ccc',
                              padding: '15px',
                              textAlign: 'center',
                              fontSize: '20px',
                              fontWeight: 'bold',
                              minWidth: '40px',
                              minHeight: '40px'
                            }}
                          >
                            {cell.toUpperCase()}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button onClick={handleEndGame} style={{ marginTop: '20px', padding: '10px 20px' }}>
              End Game
            </button>
            {game.name && <p>Game Name: {game.name}</p>}
          </div>
        )}

        {gameState === GAME_STATE.ENDED && (
          <div>
            <h2>Game Ended</h2>
            {isChallengeMode && (
              <div>
                <h3>Final Score: {score}</h3>
                <p>Words Found: {foundSolutions.length}</p>
              </div>
            )}
            {grid.length > 0 && (
              <div style={{ margin: '20px 0' }}>
                <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
                  <tbody>
                    {grid.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, colIndex) => (
                          <td
                            key={colIndex}
                            style={{
                              border: '1px solid #ccc',
                              padding: '15px',
                              textAlign: 'center',
                              fontSize: '20px',
                              fontWeight: 'bold',
                              minWidth: '40px',
                              minHeight: '40px'
                            }}
                          >
                            {cell.toUpperCase()}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {allSolutions.length > 0 && !isChallengeMode && (
              <div style={{ marginTop: '20px' }}>
                <h3>All Solutions ({allSolutions.length}):</h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                  {allSolutions.map((word, index) => (
                    <span key={index} style={{ margin: '5px', display: 'inline-block' }}>
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {foundSolutions.length > 0 && isChallengeMode && (
              <div style={{ marginTop: '20px' }}>
                <h3>Your Words ({foundSolutions.length}):</h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                  {foundSolutions.map((word, index) => (
                    <span key={index} style={{ margin: '5px', display: 'inline-block' }}>
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Leaderboard for Challenge Mode */}
            {isChallengeMode && selectedChallenge && leaderboard.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h3>Leaderboard for {selectedChallenge.name}</h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ border: '1px solid #ccc', padding: '5px' }}>Rank</th>
                        <th style={{ border: '1px solid #ccc', padding: '5px' }}>Player</th>
                        <th style={{ border: '1px solid #ccc', padding: '5px' }}>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((entry, index) => (
                        <tr 
                          key={entry.id}
                          style={{ 
                            backgroundColor: user && entry.userId === user.uid ? '#ffffcc' : 'white'
                          }}
                        >
                          <td style={{ border: '1px solid #ccc', padding: '5px' }}>{index + 1}</td>
                          <td style={{ border: '1px solid #ccc', padding: '5px' }}>{entry.userName}</td>
                          <td style={{ border: '1px solid #ccc', padding: '5px' }}>{entry.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {game.name && <p>Game Name: {game.name}</p>}
            <button onClick={() => {
              setGameState(GAME_STATE.BEFORE);
              setIsChallengeMode(false);
              setSelectedChallenge(null);
              setFoundSolutions([]);
              setScore(0);
            }} style={{ marginTop: '20px', padding: '10px 20px' }}>
              New Game
            </button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
