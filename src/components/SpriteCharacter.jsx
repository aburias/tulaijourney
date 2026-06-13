import React, { useEffect, useRef, useState } from 'react';

const SCALE = 2; // How much to scale up the pixel art
const FRAME_SPEED = 100; // Milliseconds per frame

const SpriteCharacter = ({ controlStateRef }) => {
  const canvasRef = useRef(null);
  
  // Game State
  const [position, setPosition] = useState({ x: 500, y: 300 });
  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState('down');
  
  // Track keys pressed
  const keysPressed = useRef({});
  // Animation state
  const currentFrame = useRef(0);
  const lastDrawTime = useRef(0);

  // Mapping exactly to the order of the NEW sprite sheet:
  // UP, DOWN, LEFT, RIGHT, UP+RIGHT, UP+LEFT, DOWN+LEFT, DOWN+RIGHT
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

  useEffect(() => {
    // 1. Load the images
    const walkImage = new Image();
    walkImage.src = '/WALKING_8DIR_6FRAME_192x192_REAL_TRANSPARENT.png';

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

    // Game Loop
    const render = (timestamp) => {
      // 1. Process Input & Movement
      let dx = 0;
      let dy = 0;
      const baseSpeed = 4;
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
        // Override keyboard with joystick if actively using joystick
        dx = controlStateRef.current.joyX;
        dy = controlStateRef.current.joyY;
      }

      // Check if there is actual movement intended
      const moving = Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1;
      
      let speed = baseSpeed;
      if (dx !== 0 && dy !== 0) speed = diagSpeed;

      let newDir = direction;

      // Calculate exact 8-way direction using thresholding for analog joystick
      let dirDx = 0;
      let dirDy = 0;
      if (dx < -0.3) dirDx = -1;
      else if (dx > 0.3) dirDx = 1;
      
      if (dy < -0.3) dirDy = -1;
      else if (dy > 0.3) dirDy = 1;

      if (dirDy < 0 && dirDx === 0) newDir = 'up';
      if (dirDy > 0 && dirDx === 0) newDir = 'down';
      if (dirDx < 0 && dirDy === 0) newDir = 'left';
      if (dirDx > 0 && dirDy === 0) newDir = 'right';
      
      if (dirDy < 0 && dirDx > 0) newDir = 'up-right';
      if (dirDy < 0 && dirDx < 0) newDir = 'up-left';
      if (dirDy > 0 && dirDx > 0) newDir = 'down-right';
      if (dirDy > 0 && dirDx < 0) newDir = 'down-left';

      // React state updates (batched)
      if (moving !== isMoving) setIsMoving(moving);
      if (newDir !== direction) setDirection(newDir);

      if (moving) {
        setPosition(prev => ({ x: prev.x + (dx * speed), y: prev.y + (dy * speed) }));
      }

      // 2. Draw on Canvas
      const canvas = canvasRef.current;
      if (canvas && walkImage.complete) {
        const ctx = canvas.getContext('2d');

        // Always use walk image
        const activeImage = walkImage;
        const maxFrames = 6;
        
        // Exact 192x192 based on new sprite
        const frameWidth = 192;
        const frameHeight = 192;

        // Dynamically resize canvas to fit the exact sprite frame
        const targetWidth = Math.ceil(frameWidth * SCALE);
        const targetHeight = Math.ceil(frameHeight * SCALE);
        if (canvas.width !== targetWidth) canvas.width = targetWidth;
        if (canvas.height !== targetHeight) canvas.height = targetHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Advance animation frame ONLY if moving
        if (moving && (timestamp - lastDrawTime.current > FRAME_SPEED)) {
          currentFrame.current = (currentFrame.current + 1) % maxFrames;
          lastDrawTime.current = timestamp;
        }

        const sourceX = currentFrame.current * frameWidth;
        // Keep the same row (direction) even when stopped
        const sourceY = (rowMap[newDir] || 0) * frameHeight;

        ctx.drawImage(
          activeImage,
          sourceX, sourceY, frameWidth, frameHeight,
          0, 0, targetWidth, targetHeight
        );
      }

      animationFrameId = window.requestAnimationFrame(render);
    };

    // Start loop
    animationFrameId = window.requestAnimationFrame(render);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [isMoving, direction]); // Re-bind effect when states change

  return (
    <div 
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: position.y
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default SpriteCharacter;
