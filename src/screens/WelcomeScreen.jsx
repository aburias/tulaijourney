import React from 'react';

const WelcomeScreen = ({ onStart }) => {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundImage: 'url("/backgrounds/welcome_bg.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      cursor: 'pointer'
    }} onClick={onStart}>
      
      <style>
        {`
          @keyframes pulseBtn {
            0% { transform: translateX(-50%) scale(1); }
            50% { transform: translateX(-50%) scale(1.05); }
            100% { transform: translateX(-50%) scale(1); }
          }
        `}
      </style>

      {/* 16:9 SAFE AREA CONTAINER */}
      <div style={{
        position: 'relative',
        width: '100vw',
        height: '56.25vw',
        maxHeight: '100vh',
        maxWidth: '177.78vh',
        pointerEvents: 'none'
      }}>
        {/* The Logo positioned via percentages */}
        <img 
          src="/backgrounds/welcome_logo.png" 
          alt="Welcome Adventurer" 
          style={{
            position: 'absolute',
            top: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '45%',
            filter: 'drop-shadow(0px 1vmin 1.5vmin rgba(0,0,0,0.5))'
          }}
          onError={(e) => e.target.style.display = 'none'}
        />

        {/* Tap to Start button — visual only, the whole screen is clickable */}
        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: '50%',
          padding: '2% 6%', 
          fontSize: '3vmin', 
          fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
          backgroundColor: '#FF9800',
          color: 'white',
          border: '0.6vmin solid white', 
          borderRadius: '10vmin', 
          boxShadow: '0 1vmin 0 #E65100, 0 1.5vmin 2.5vmin rgba(0,0,0,0.5)',
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: '0.2vmin',
          animation: 'pulseBtn 2s infinite ease-in-out',
          textShadow: '0.2vmin 0.2vmin 0.4vmin rgba(0,0,0,0.4)',
          transformOrigin: 'center'
        }}>
          Tap to Start
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
