import React, { useState, useEffect, useRef } from 'react';

const AnimatedAvatar = ({ src, frames = 25, cols = 5, onClick }) => {
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
    
    // For a 5x5 grid: each frame is image.width/cols x image.height/rows
    const rows = Math.ceil(frames / cols);
    const frameWidth = image.width / cols;
    const frameHeight = image.height / rows;
    
    // Use a high internal resolution for sharp rendering
    const targetSize = 256;
    canvas.width = targetSize;
    canvas.height = (frameHeight / frameWidth) * targetSize;

    let currentFrame = 0;
    let animationFrameId;
    let lastDrawTime = 0;

    const render = (timestamp) => {
      if (timestamp - lastDrawTime > 100) { // ~10fps for idle
        currentFrame = (currentFrame + 1) % frames;
        lastDrawTime = timestamp;
      }
      
      const srcCol = currentFrame % cols;
      const srcRow = Math.floor(currentFrame / cols);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        image,
        srcCol * frameWidth, srcRow * frameHeight, frameWidth, frameHeight,
        0, 0, canvas.width, canvas.height
      );
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [image, frames, cols]);

  return (
    <canvas 
      ref={canvasRef} 
      onClick={onClick}
      style={{
        width: '40vh',
        height: 'auto',
        cursor: 'pointer',
        filter: 'drop-shadow(0px 1.5vmin 1.5vmin rgba(0,0,0,0.5))',
        transition: 'transform 0.2s',
        margin: '0 5vw' 
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
      backgroundSize: 'cover', 
      backgroundPosition: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      <audio ref={audioRef} src="/sounds/title_theme.mp3" loop />

      {/* 16:9 SAFE AREA CONTAINER */}
      <div style={{
        position: 'relative',
        width: '100vw',
        height: '56.25vw', // 9/16 = 0.5625
        maxHeight: '100vh',
        maxWidth: '177.78vh', // 16/9 = 1.7778
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: '4%' // Dropped significantly to give the banner breathing room
      }}>
        {/* Character Selection */}
        {!selectedGender ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <AnimatedAvatar src="/characters/Bayani Male Kinder-idle.png" frames={25} cols={5} onClick={() => handleSelect('boy')} />
              <AnimatedAvatar src="/characters/Bayani Female Kinder-idle.png" frames={25} cols={5} onClick={() => handleSelect('girl')} />
            </div>
          </div>
        ) : (
          /* Name Entry Popup */
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '4%',
            borderRadius: '2vmin',
            boxShadow: '0 1vmin 3vmin rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            animation: 'popIn 0.3s ease-out',
            marginBottom: '10%' // Push up slightly from bottom
          }}>
            <h2 style={{ color: '#333', marginBottom: '3vmin', fontSize: '4vmin' }}>What is your name?</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Name..."
                autoFocus
                style={{
                  fontSize: '3vmin',
                  padding: '2vmin 3vmin',
                  borderRadius: '1.5vmin',
                  border: '0.3vmin solid #4CAF50',
                  marginBottom: '3vmin',
                  textAlign: 'center',
                  outline: 'none'
                }}
              />
              <div style={{ display: 'flex', gap: '2vmin' }}>
                <button type="button" onClick={() => setSelectedGender(null)} style={{
                  padding: '1.5vmin 3vmin', fontSize: '2.5vmin', borderRadius: '1.5vmin', border: 'none', cursor: 'pointer', backgroundColor: '#ccc'
                }}>Back</button>
                <button type="submit" disabled={!name.trim()} style={{
                  padding: '1.5vmin 4vmin', fontSize: '2.5vmin', borderRadius: '1.5vmin', border: 'none', cursor: 'pointer', backgroundColor: name.trim() ? '#4CAF50' : '#aaa', color: 'white', fontWeight: 'bold'
                }}>Go!</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TitleScreen;
