import React, { useState, useEffect, useRef } from 'react';

const AnimatedAvatar = ({ src, frames = 4, onClick }) => {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setImage(img);
  }, [src]);

  useEffect(() => {
    if (!image || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Auto-detect square frames by assuming 1 row
    const frameWidth = image.width / frames;
    const frameHeight = image.height;
    
    // Make the avatars a bit smaller so they don't overlap the sign
    const targetSize = 160;
    canvas.width = targetSize;
    // Maintain aspect ratio
    canvas.height = (frameHeight / frameWidth) * targetSize;

    let currentFrame = 0;
    let animationFrameId;
    let lastDrawTime = 0;

    const render = (timestamp) => {
      if (timestamp - lastDrawTime > 150) { // ~6fps for idle
        currentFrame = (currentFrame + 1) % frames;
        lastDrawTime = timestamp;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        image,
        currentFrame * frameWidth, 0, frameWidth, frameHeight,
        0, 0, canvas.width, canvas.height
      );
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [image, frames]);

  return (
    <canvas 
      ref={canvasRef} 
      onClick={onClick}
      style={{
        cursor: 'pointer',
        filter: 'drop-shadow(0px 10px 10px rgba(0,0,0,0.5))',
        transition: 'transform 0.2s',
        margin: '0 80px' // Spread them out significantly wider
      }}
      onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
    />
  );
};

const TitleScreen = ({ onSelect }) => {
  const [selectedGender, setSelectedGender] = useState(null);
  const [name, setName] = useState('');
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.log('Audio autoplay blocked', e));
    }
  }, []);

  const handleSelect = (gender) => {
    setSelectedGender(gender);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSelect({ name: name.trim(), gender: selectedGender });
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundImage: 'url("/backgrounds/title_bg.png")',
      backgroundSize: '100% 100%', // Stretch to fit exactly
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingBottom: '12vh', // Push them slightly up from the absolute bottom
      position: 'relative'
    }}>
      <audio ref={audioRef} src="/sounds/title_theme.mp3" loop />

      {/* Character Selection */}
      {!selectedGender ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {/* Assume 4 frames for now, we can tweak this once we verify the sprites */}
            <AnimatedAvatar src="/characters/avatar_sprite_boy.png" frames={4} onClick={() => handleSelect('boy')} />
            <AnimatedAvatar src="/characters/avatar_sprite_girl.png" frames={4} onClick={() => handleSelect('girl')} />
          </div>
        </div>
      ) : (
        /* Name Entry Popup */
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'popIn 0.3s ease-out'
        }}>
          <h2 style={{ color: '#333', marginBottom: '20px', fontSize: '32px' }}>What is your name?</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name..."
              autoFocus
              style={{
                fontSize: '24px',
                padding: '15px 20px',
                borderRadius: '10px',
                border: '3px solid #4CAF50',
                marginBottom: '20px',
                textAlign: 'center',
                outline: 'none'
              }}
            />
            <div style={{ display: 'flex', gap: '15px' }}>
              <button type="button" onClick={() => setSelectedGender(null)} style={{
                padding: '15px 30px', fontSize: '20px', borderRadius: '10px', border: 'none', cursor: 'pointer', backgroundColor: '#ccc'
              }}>Back</button>
              <button type="submit" disabled={!name.trim()} style={{
                padding: '15px 40px', fontSize: '20px', borderRadius: '10px', border: 'none', cursor: 'pointer', backgroundColor: name.trim() ? '#4CAF50' : '#aaa', color: 'white', fontWeight: 'bold'
              }}>Go!</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TitleScreen;
