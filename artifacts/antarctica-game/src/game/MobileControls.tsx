import { useEffect, useCallback, useState } from 'react';

export default function MobileControls() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const simulateKey = useCallback((key: string, type: 'keydown' | 'keyup') => {
    window.dispatchEvent(new KeyboardEvent(type, { key }));
  }, []);

  if (!isMobile) return null;

  const btnStyle = (size: number = 56): React.CSSProperties => ({
    width: size,
    height: size,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.3)',
    border: '2px solid rgba(255,255,255,0.5)',
    color: '#FFFFFF',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    touchAction: 'none',
    userSelect: 'none',
    backdropFilter: 'blur(4px)',
  });

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0 20px',
      pointerEvents: 'auto',
      zIndex: 20,
    }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div
          style={btnStyle()}
          onTouchStart={() => simulateKey('ArrowLeft', 'keydown')}
          onTouchEnd={() => simulateKey('ArrowLeft', 'keyup')}
        >
          {'<'}
        </div>
        <div
          style={btnStyle()}
          onTouchStart={() => simulateKey('ArrowRight', 'keydown')}
          onTouchEnd={() => simulateKey('ArrowRight', 'keyup')}
        >
          {'>'}
        </div>
      </div>

      <div
        style={btnStyle(70)}
        onTouchStart={() => simulateKey(' ', 'keydown')}
        onTouchEnd={() => simulateKey(' ', 'keyup')}
      >
        Jump
      </div>
    </div>
  );
}
