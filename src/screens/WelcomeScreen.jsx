import React from 'react';

const GRADES = [
  { id: 'kinder', icon: '/backgrounds/grade_kinder.png', unlocked: true },
  { id: 'primary', icon: '/backgrounds/grade_primary.png', unlocked: false },
  { id: 'intermediate', icon: '/backgrounds/grade_intermediate.png', unlocked: false },
  { id: 'jhs', icon: '/backgrounds/grade_jhs.png', unlocked: false },
  { id: 'shs', icon: '/backgrounds/grade_shs.png', unlocked: false },
];

const GradeIcon = ({ grade, onSelect }) => (
  <div 
    onClick={() => grade.unlocked && onSelect(grade.id)}
    style={{
      position: 'relative',
      cursor: grade.unlocked ? 'pointer' : 'not-allowed',
      transition: 'transform 0.2s',
    }}
    onMouseEnter={(e) => { if (grade.unlocked) e.currentTarget.style.transform = 'scale(1.12)'; }}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
  >
    <img 
      src={grade.icon} 
      alt=""
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        filter: grade.unlocked 
          ? 'drop-shadow(0 0.8vh 1.5vh rgba(0,0,0,0.5))' 
          : 'grayscale(100%) brightness(0.4) drop-shadow(0 0.8vh 1.5vh rgba(0,0,0,0.5))',
        transition: 'filter 0.3s'
      }}
    />
    {!grade.unlocked && (
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '5vh',
        filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.7))'
      }}>
        🔒
      </div>
    )}
  </div>
);

const WelcomeScreen = ({ onGradeSelect }) => {
  const topRow = GRADES.slice(0, 3);
  const bottomRow = GRADES.slice(3, 5);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundImage: 'url("/backgrounds/welcome_bg.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden'
    }}>
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      {/* Logo at the top */}
      <img 
        src="/backgrounds/welcome_logo.png" 
        alt="Welcome Adventurer" 
        style={{
          width: '35vh',
          height: 'auto',
          filter: 'drop-shadow(0px 1vmin 1.5vmin rgba(0,0,0,0.5))',
          marginBottom: '2vh'
        }}
        onError={(e) => e.target.style.display = 'none'}
      />

      {/* Grade Grid — 3 top, 2 bottom, all centered */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2vh',
        animation: 'fadeInUp 0.8s ease-out both'
      }}>
        {/* Top row: 3 icons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3.5vh' }}>
          {topRow.map((grade, i) => (
            <div key={grade.id} style={{ 
              width: '17vh', height: '17vh',
              animation: `fadeInUp 0.5s ${0.1 * i}s ease-out both` 
            }}>
              <GradeIcon grade={grade} onSelect={onGradeSelect} />
            </div>
          ))}
        </div>
        {/* Bottom row: 2 icons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3.5vh' }}>
          {bottomRow.map((grade, i) => (
            <div key={grade.id} style={{ 
              width: '17vh', height: '17vh',
              animation: `fadeInUp 0.5s ${0.3 + 0.1 * i}s ease-out both` 
            }}>
              <GradeIcon grade={grade} onSelect={onGradeSelect} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
