import React, { useRef } from 'react';
import SpriteCharacter from '../components/SpriteCharacter';
import VirtualControls from '../components/VirtualControls';

const Overworld = ({ playerProfile }) => {
  // Shared ref to pass joystick data to the SpriteCharacter without triggering React re-renders
  const controlStateRef = useRef({ joyX: 0, joyY: 0, action: false });

  return (
    <div 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#87CEEB', // Fallback sky blue
        backgroundImage: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 50%, #90EE90 50%, #3CB371 100%)' // Placeholder landscape
      }}
    >
      {/* 
        The world map container could go here. 
        For now, the character just walks around the screen.
      */}
      
      <SpriteCharacter controlStateRef={controlStateRef} playerProfile={playerProfile} />
      
      <VirtualControls controlStateRef={controlStateRef} />
      
      {/* Action listener example: We could poll this ref or pass a callback to VirtualControls for specific actions */}
    </div>
  );
};

export default Overworld;
