import React, { useState } from 'react';
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import TitleScreen from './screens/TitleScreen';
import Overworld from './screens/Overworld';
import OrientationLock from './components/OrientationLock';

function App() {
  const [currentScreen, setCurrentScreen] = useState('SPLASH'); // SPLASH, WELCOME, TITLE, OVERWORLD
  const [playerProfile, setPlayerProfile] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);

  const onSplashDone = () => {
    setCurrentScreen('WELCOME');
  };

  const onGradeSelect = (gradeId) => {
    setSelectedGrade(gradeId);
    setCurrentScreen('TITLE');
  };

  const onCharacterSelect = (profile) => {
    setPlayerProfile({ ...profile, grade: selectedGrade });
    setCurrentScreen('OVERWORLD');
  };

  // Splash screen sits OUTSIDE orientation lock — works in any orientation
  if (currentScreen === 'SPLASH') {
    return <SplashScreen onReady={onSplashDone} />;
  }

  // Everything after splash is inside the orientation lock
  return (
    <OrientationLock>
      {currentScreen === 'WELCOME' && <WelcomeScreen onGradeSelect={onGradeSelect} />}
      {currentScreen === 'TITLE' && <TitleScreen onSelect={onCharacterSelect} />}
      {currentScreen === 'OVERWORLD' && <Overworld playerProfile={playerProfile} />}
    </OrientationLock>
  );
}

export default App;
