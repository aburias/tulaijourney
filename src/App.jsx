import React, { useState } from 'react';
import WelcomeScreen from './screens/WelcomeScreen';
import TitleScreen from './screens/TitleScreen';
import Overworld from './screens/Overworld';

function App() {
  const [currentScreen, setCurrentScreen] = useState('WELCOME'); // WELCOME, TITLE, OVERWORLD
  const [playerProfile, setPlayerProfile] = useState(null);

  const startGame = () => {
    setCurrentScreen('TITLE');
  };

  const onCharacterSelect = (profile) => {
    setPlayerProfile(profile);
    setCurrentScreen('OVERWORLD');
  };

  return (
    <>
      {currentScreen === 'WELCOME' && <WelcomeScreen onStart={startGame} />}
      {currentScreen === 'TITLE' && <TitleScreen onSelect={onCharacterSelect} />}
      {currentScreen === 'OVERWORLD' && <Overworld playerProfile={playerProfile} />}
    </>
  );
}

export default App;
