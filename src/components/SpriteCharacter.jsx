import React, { useEffect, useRef, useState } from 'react';

const FRAME_SPEED = 80; // ~12fps for a natural walking pace

const SpriteCharacter = ({ controlStateRef, playerProfile }) => {
  const canvasRef = useRef(null);
  
  // Position is the only thing that needs to trigger re-renders (for CSS transform)
  const [position, setPosition] = useState({ 
    x: window.innerWidth / 2, 
    y: window.innerHeight / 2 
  });

  // Everything else is refs so the game loop never tears down
  const directionRef = useRef('down');
  const isMovingRef = useRef(false);
  const keysPressed = useRef({});
  const currentFrame = useRef(0);
  const lastDrawTime = useRef(0);
  const walkImageRef = useRef(null);
  const imageLoadedRef = useRef(false);

  const rowMap = {
    'up': 0,        
    'down': 1,      
    'left': 2,      
    'right': 3,     
    'up-right': 4,  
    'up-left': 5,   
    'down-left': 6, 
    'down-right': 7 
  };

  // ONE-TIME image load — only re-runs if gender changes
  useEffect(() => {
    const walkImage = new Image();
    const imgSrc = playerProfile?.gender === 'girl' ? '/master_girl.png' : '/master_boy.png';
    
    walkImage.onload = () => {
      console.log("Sprite loaded!", imgSrc, walkImage.width, "x", walkImage.height);
      walkImageRef.current = walkImage;
      imageLoadedRef.current = true;
    };
    walkImage.onerror = (err) => {
      console.error("FAILED TO LOAD SPRITE:", imgSrc, err);
    };
    walkImage.src = imgSrc;
  }, [playerProfile?.gender]);

  // ONE-TIME game loop — never tears down
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;
      keysPressed.current[e.key] = true;
      if (e.key === 'Enter') {
        if (controlStateRef) controlStateRef.current.action = true;
      }
    };
    
    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
      keysPressed.current[e.key] = false;
      if (e.key === 'Enter') {
        if (controlStateRef) controlStateRef.current.action = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animationFrameId;

    const render = (timestamp) => {
      let dx = 0;
      let dy = 0;
      const baseSpeed = Math.min(window.innerWidth, window.innerHeight) * 0.005;
      const diagSpeed = baseSpeed * 0.707; 

      // Keyboard input
      const up = keysPressed.current['arrowup'] || keysPressed.current['w'];
      const down = keysPressed.current['arrowdown'] || keysPressed.current['s'];
      const left = keysPressed.current['arrowleft'] || keysPressed.current['a'];
      const right = keysPressed.current['arrowright'] || keysPressed.current['d'];

      if (up && !down) dy -= 1;
      if (down && !up) dy += 1;
      if (left && !right) dx -= 1;
      if (right && !left) dx += 1;

      // Merge Joystick Input
      if (controlStateRef && (controlStateRef.current.joyX !== 0 || controlStateRef.current.joyY !== 0)) {
        dx = controlStateRef.current.joyX;
        dy = controlStateRef.current.joyY;
      }

      const moving = Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1;
      
      let speed = baseSpeed;
      if (dx !== 0 && dy !== 0) speed = diagSpeed;

      // Calculate 8-way direction
      let dirDx = 0;
      let dirDy = 0;
      if (dx < -0.3) dirDx = -1;
      else if (dx > 0.3) dirDx = 1;
      if (dy < -0.3) dirDy = -1;
      else if (dy > 0.3) dirDy = 1;

      let newDir = directionRef.current;
      if (dirDy < 0 && dirDx === 0) newDir = 'up';
      if (dirDy > 0 && dirDx === 0) newDir = 'down';
      if (dirDx < 0 && dirDy === 0) newDir = 'left';
      if (dirDx > 0 && dirDy === 0) newDir = 'right';
      if (dirDy < 0 && dirDx > 0) newDir = 'up-right';
      if (dirDy < 0 && dirDx < 0) newDir = 'up-left';
      if (dirDy > 0 && dirDx > 0) newDir = 'down-right';
      if (dirDy > 0 && dirDx < 0) newDir = 'down-left';

      directionRef.current = newDir;
      isMovingRef.current = moving;

      if (moving) {
        setPosition(prev => {
          let newX = prev.x + (dx * speed);
          let newY = prev.y + (dy * speed);
          newX = Math.max(0, Math.min(window.innerWidth, newX));
          newY = Math.max(0, Math.min(window.innerHeight, newY));
          return { x: newX, y: newY };
        });
      }

      // Draw
      const canvas = canvasRef.current;
      const walkImage = walkImageRef.current;
      if (canvas && walkImage && imageLoadedRef.current) {
        const ctx = canvas.getContext('2d');
        const maxFrames = 25;
        const frameWidth = 256;
        const frameHeight = 256;

        if (canvas.width !== frameWidth) canvas.width = frameWidth;
        if (canvas.height !== frameHeight) canvas.height = frameHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Advance animation frame ONLY if moving
        if (moving && (timestamp - lastDrawTime.current > FRAME_SPEED)) {
          currentFrame.current = (currentFrame.current + 1) % maxFrames;
          lastDrawTime.current = timestamp;
        }
        
        // Reset to frame 0 when stopped
        if (!moving) {
          currentFrame.current = 0;
        }

        const sourceX = currentFrame.current * frameWidth;
        const sourceY = (rowMap[newDir] || 0) * frameHeight;

        ctx.drawImage(
          walkImage,
          sourceX, sourceY, frameWidth, frameHeight,
          0, 0, frameWidth, frameHeight
        );
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    animationFrameId = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []); // Empty deps — runs ONCE, never tears down

  return (
    <div 
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: Math.round(position.y),
        width: '25vmin',
        height: '25vmin'
      }}
    >
      <canvas 
        ref={canvasRef} 
        style={{
          width: '100%',
          height: '100%',
          filter: 'drop-shadow(0px 1.5vmin 1.5vmin rgba(0,0,0,0.5))'
        }}
      />
    </div>
  );
};

export default SpriteCharacter;
