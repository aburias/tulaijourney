import React from 'react'
import SpriteCharacter from './components/SpriteCharacter'

function App() {
  return (
    <div className="game-container">
      <div className="game-world">
        {/* We place our Sprite Character in the game world */}
        <SpriteCharacter />
      </div>
      
      <div className="controls-hint">
        <h2>Tulai Journey</h2>
        <p>Use <b>Arrow Keys</b> or <b>W,A,S,D</b> to move the character.</p>
      </div>
    </div>
  )
}

export default App
