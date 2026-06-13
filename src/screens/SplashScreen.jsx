import React, { useState } from 'react';

const SplashScreen = ({ onReady }) => {
  const [tapped, setTapped] = useState(false);

  const handleTap = () => {
    if (tapped) return; // Prevent double-tap
    setTapped(true);

    // 1. Force Fullscreen
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen().catch(() => {});
      }
    } catch(e) {}

    // 2. Lock orientation to landscape if supported
    try {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => {});
      }
    } catch(e) {}

    // Small delay so fullscreen kicks in before transitioning
    setTimeout(() => onReady(), 300);
  };

  return (
    <div onClick={handleTap} style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw',
      height: '100vh',
      background: 'radial-gradient(ellipse at center, #1a3a2a 0%, #0a1a10 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      zIndex: 100000,
      fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
      overflow: 'hidden',
      userSelect: 'none'
    }}>
      <style>
        {`
          @keyframes floatUp {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
            100% { transform: translateY(0px); }
          }
          @keyframes pulseTap {
            0% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
            100% { opacity: 0.6; transform: scale(1); }
          }
          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
            50% { opacity: 1; transform: scale(1) rotate(180deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      {/* Sparkles */}
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: '8px', height: '8px',
          backgroundColor: '#FFD700',
          borderRadius: '50%',
          top: `${15 + Math.random() * 70}%`,
          left: `${10 + Math.random() * 80}%`,
          animation: `sparkle ${2 + Math.random() * 2}s infinite ${Math.random() * 2}s ease-in-out`,
          boxShadow: '0 0 10px #FFD700'
        }} />
      ))}

      {/* App Icon */}
      <img 
        src="/app_icon.png" 
        alt="Bayani Adventures"
        style={{
          width: 'min(30vw, 30vh)',
          height: 'auto',
          borderRadius: 'min(4vw, 4vh)',
          boxShadow: '0 0 40px rgba(255,215,0,0.3), 0 8px 32px rgba(0,0,0,0.5)',
          animation: 'floatUp 3s infinite ease-in-out, fadeIn 1s ease-out',
          marginBottom: 'min(4vh, 4vw)'
        }}
      />

      {/* Title */}
      <h1 style={{
        color: '#FFD700',
        fontSize: 'min(8vw, 8vh)',
        textShadow: '0 0 20px rgba(255,215,0,0.5), 0 3px 6px rgba(0,0,0,0.5)',
        margin: 0,
        animation: 'fadeIn 1s 0.3s ease-out both',
        letterSpacing: '2px'
      }}>
        Bayani Adventures
      </h1>

      {/* Subtitle */}
      <p style={{
        color: '#8BC34A',
        fontSize: 'min(3vw, 3vh)',
        margin: 'min(1vh, 1vw) 0 0 0',
        animation: 'fadeIn 1s 0.5s ease-out both',
        letterSpacing: '3px',
        textTransform: 'uppercase'
      }}>
        A Magical Learning Journey
      </p>

      {/* Tap to Play */}
      {!tapped ? (
        <div style={{
          marginTop: 'min(6vh, 6vw)',
          color: 'white',
          fontSize: 'min(5vw, 5vh)',
          fontWeight: 'bold',
          animation: 'pulseTap 2s infinite ease-in-out, fadeIn 1s 0.8s ease-out both',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          padding: 'min(2vh, 2vw) min(6vw, 6vh)',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: 'min(3vw, 3vh)',
          background: 'rgba(255,255,255,0.08)'
        }}>
          ▶ Tap to Play
        </div>
      ) : (
        <div style={{
          marginTop: 'min(6vh, 6vw)',
          color: '#8BC34A',
          fontSize: 'min(4vw, 4vh)',
          animation: 'pulseTap 1s infinite ease-in-out'
        }}>
          Loading...
        </div>
      )}
    </div>
  );
};

export default SplashScreen;
