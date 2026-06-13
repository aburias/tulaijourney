import React, { useState, useEffect } from 'react';

const VirtualControls = ({ controlStateRef }) => {
  const [basePos, setBasePos] = useState(null);
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Responsive scaling state
  const [dimensions, setDimensions] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate joystick sizes dynamically based on viewport (max 25% of the shortest dimension, capped)
  const vMin = Math.min(dimensions.width, dimensions.height);
  const baseSize = Math.min(vMin * 0.35, 160); // 35vmin, max 160px
  const stickSize = baseSize * 0.45;
  const maxRadius = baseSize / 2;

  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setBasePos({ x: e.clientX, y: e.clientY });
    setStickPos({ x: 0, y: 0 });
  };

  const handlePointerMove = (e) => {
    e.preventDefault();
    if (isDragging && basePos) {
      updateJoystick(e.clientX, e.clientY, basePos.x, basePos.y);
    }
  };

  const handlePointerUp = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setBasePos(null);
    setStickPos({ x: 0, y: 0 });
    if (controlStateRef && controlStateRef.current) {
      controlStateRef.current.joyX = 0;
      controlStateRef.current.joyY = 0;
    }
  };

  const updateJoystick = (clientX, clientY, baseX, baseY) => {
    let dx = clientX - baseX;
    let dy = clientY - baseY;
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > maxRadius) {
      dx = (dx / distance) * maxRadius;
      dy = (dy / distance) * maxRadius;
    }
    
    setStickPos({ x: dx, y: dy });
    
    // Normalize to -1 to 1 for the game logic
    if (controlStateRef && controlStateRef.current) {
      controlStateRef.current.joyX = dx / maxRadius;
      controlStateRef.current.joyY = dy / maxRadius;
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setBasePos(null);
        setStickPos({ x: 0, y: 0 });
        if (controlStateRef && controlStateRef.current) {
          controlStateRef.current.joyX = 0;
          controlStateRef.current.joyY = 0;
        }
      }
    };
    
    window.addEventListener('pointerup', handleGlobalMouseUp);
    return () => window.removeEventListener('pointerup', handleGlobalMouseUp);
  }, [isDragging, controlStateRef]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, pointerEvents: 'none' }}>
      
      {/* Left Half: Invisible Joystick Zone */}
      <div 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50vw',
          height: '100vh',
          pointerEvents: 'auto',
          touchAction: 'none'
        }}
      >
        {/* Hint Joystick (shows when NOT dragging) */}
        {!isDragging && (
          <div style={{
            position: 'absolute',
            left: '8vw',
            bottom: '15vh',
            width: baseSize,
            height: baseSize,
            borderRadius: '50%',
            border: `${baseSize * 0.03}px dashed rgba(255, 255, 255, 0.4)`,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.7
          }}>
            <div style={{
              width: stickSize,
              height: stickSize,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.3)'
            }} />
          </div>
        )}

        {/* Render the Active Joystick only when dragging */}
        {isDragging && basePos && (
          <div style={{
            position: 'absolute',
            left: basePos.x - baseSize / 2,
            top: basePos.y - baseSize / 2,
            width: baseSize,
            height: baseSize,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            border: `${baseSize * 0.03}px solid rgba(255, 255, 255, 0.6)`,
            pointerEvents: 'none',
            backdropFilter: 'blur(4px)'
          }}>
            <div style={{
              width: stickSize,
              height: stickSize,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(calc(-50% + ${stickPos.x}px), calc(-50% + ${stickPos.y}px))`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }} />
          </div>
        )}
      </div>

      {/* Right Side: Action Button using viewport units */}
      <div 
        onPointerDown={(e) => { e.preventDefault(); if(controlStateRef) controlStateRef.current.action = true; }}
        onPointerUp={(e) => { e.preventDefault(); if(controlStateRef) controlStateRef.current.action = false; }}
        onPointerLeave={(e) => { e.preventDefault(); if(controlStateRef) controlStateRef.current.action = false; }}
        style={{
          position: 'absolute',
          bottom: '15vh',  // Responsive bottom spacing
          right: '8vw',    // Responsive right spacing
          width: 'max(12vh, 70px)', // Scale based on height, but don't get too small
          height: 'max(12vh, 70px)',
          borderRadius: '50%',
          backgroundColor: '#4CAF50',
          border: 'max(0.5vh, 4px) solid white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: '900',
          fontSize: 'max(4vh, 20px)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
          pointerEvents: 'auto',
          touchAction: 'none',
          userSelect: 'none',
          cursor: 'pointer',
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
        }}
      >
        GO
      </div>
      
    </div>
  );
};

export default VirtualControls;
