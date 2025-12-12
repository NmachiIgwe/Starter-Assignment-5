import React, { useState, useEffect } from 'react';
import { GAME_STATE } from './game_state_enum';
import './App.css';

function App() {
  const [game, setGame] = useState({});
  const [grid, setGrid] = useState([]);
  const [gameState, setGameState] = useState(GAME_STATE.BEFORE);
  const [size, setSize] = useState(4);
  const [foundSolutions, setFoundSolutions] = useState([]);
  const [allSolutions, setAllSolutions] = useState([]);

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

  // useEffect will trigger when gameState or size changes
  // This will call the game_create endpoint when the game starts
  useEffect(() => {
    if (gameState === GAME_STATE.IN_PROGRESS) {
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
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [gameState, size]);

  // useEffect will trigger when the array items in the second argument are
  // updated so whenever grid is updated, we will recompute the solutions
  useEffect(() => {
    if (typeof game.foundwords !== "undefined") {
      let tmpAllSolutions = Convert(game.foundwords);
      setAllSolutions(tmpAllSolutions);
    }
  }, [grid, game.foundwords]);

  const handleStartGame = () => {
    setGameState(GAME_STATE.IN_PROGRESS);
  };

  const handleEndGame = () => {
    setGameState(GAME_STATE.ENDED);
  };

  const handleSizeChange = (newSize) => {
    setSize(newSize);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Boggle Game</h1>
        {gameState === GAME_STATE.BEFORE && (
          <div>
            <h2>Select Board Size:</h2>
            <button onClick={() => handleSizeChange(3)}>3x3</button>
            <button onClick={() => handleSizeChange(4)}>4x4</button>
            <button onClick={() => handleSizeChange(5)}>5x5</button>
            <button onClick={() => handleSizeChange(6)}>6x6</button>
            <br />
            <button onClick={handleStartGame} style={{ marginTop: '20px', padding: '10px 20px' }}>
              Start Game
            </button>
          </div>
        )}

        {gameState === GAME_STATE.IN_PROGRESS && (
          <div>
            <h2>Game in Progress - Size: {size}x{size}</h2>
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
            {allSolutions.length > 0 && (
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
            {game.name && <p>Game Name: {game.name}</p>}
            <button onClick={() => setGameState(GAME_STATE.BEFORE)} style={{ marginTop: '20px', padding: '10px 20px' }}>
              New Game
            </button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
