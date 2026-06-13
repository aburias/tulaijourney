import React, { useState, useEffect } from 'react';

const OrientationLock = ({ children }) => {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    // Check on mount
    checkOrientation();

    // Listen for resize/orientation changes
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (isPortrait) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#111',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        zIndex: 99999, // Always on top
        padding: '20px',
        boxSizing: 'border-box',
        textAlign: 'center'
      }}>
        {/* Animated rotating phone icon using CSS */}
        <div style={{
          width: '60px',
          height: '100px',
          border: '4px solid white',
          borderRadius: '10px',
          position: 'relative',
          marginBottom: '30px',
          animation: 'rotatePhone 2s infinite ease-in-out'
        }}>
          {/* Phone home button */}
          <div style={{
            position: 'absolute',
            bottom: '5px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            border: '2px solid white'
          }} />
        </div>

        <style>
          {`
            @keyframes rotatePhone {
              0% { transform: rotate(0deg); }
              50% { transform: rotate(-90deg); }
              100% { transform: rotate(-90deg); }
            }
          `}
        </style>

        <h1 style={{ 
          fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
          fontSize: 'max(4vw, 24px)',
          margin: 0
        }}>
          Please rotate your device!
        </h1>
        <p style={{
          fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
          fontSize: 'max(3vw, 16px)',
          color: '#aaa',
          marginTop: '10px'
        }}>
          Bayani Adventures is played in Landscape mode.
        </p>
      </div>
    );
  }

  // If landscape, show the game
  return <>{children}</>;
};

export default OrientationLock;
