import React from 'react';

const WelcomeScreen = ({ onStart }) => {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundImage: 'url("/backgrounds/welcome_bg.png")',
      backgroundSize: '100% 100%',
      backgroundPosition: 'center',
      position: 'relative',
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

      {/* The Logo with ropes hanging from the top */}
      <img 
        src="/backgrounds/welcome_logo.png" 
        alt="Welcome Adventurer" 
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'max(40vw, 500px)',
          filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.5))'
        }}
        onError={(e) => e.target.style.display = 'none'}
      />

      {/* Proper Premium Game Button anchored to the grass */}
      <button style={{
        position: 'absolute',
        bottom: '25vh', // Raised to align with the kids in the background
        left: '50%',
        padding: '20px 80px',
        fontSize: 'max(4vh, 32px)',
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
        backgroundColor: '#FF9800',
        color: 'white',
        border: '6px solid white',
        borderRadius: '60px',
        cursor: 'pointer',
        boxShadow: '0 10px 0 #E65100, 0 20px 25px rgba(0,0,0,0.5)',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: '3px',
        animation: 'pulseBtn 2s infinite ease-in-out',
        textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
        transformOrigin: 'center'
      }}
      onClick={(e) => {
        e.stopPropagation();
        onStart();
      }}>
        Tap to Start
      </button>
    </div>
  );
};

export default WelcomeScreen;
