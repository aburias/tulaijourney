import React, { useState } from 'react';
import WelcomeScreen from './screens/WelcomeScreen';
import TitleScreen from './screens/TitleScreen';
import Overworld from './screens/Overworld';
import OrientationLock from './components/OrientationLock';

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
    <OrientationLock>
      {currentScreen === 'WELCOME' && <WelcomeScreen onStart={startGame} />}
      {currentScreen === 'TITLE' && <TitleScreen onSelect={onCharacterSelect} />}
      {currentScreen === 'OVERWORLD' && <Overworld playerProfile={playerProfile} />}
    </OrientationLock>
  );
}

export default App;
