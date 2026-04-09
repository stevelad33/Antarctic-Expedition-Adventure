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

  const btnStyle = (active?: boolean): React.CSSProperties => ({
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: active ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)',
    border: '2px solid rgba(255,255,255,0.5)',
    color: '#FFFFFF',
    fontSize: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    touchAction: 'none',
    userSelect: 'none',
    backdropFilter: 'blur(4px)',
    cursor: 'pointer',
  });

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      padding: '0 20px',
      pointerEvents: 'auto',
      zIndex: 20,
    }}>
      {/* D-pad style: forward/back/turn */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div
          style={btnStyle()}
          onTouchStart={() => simulateKey('ArrowUp', 'keydown')}
          onTouchEnd={() => simulateKey('ArrowUp', 'keyup')}
        >
          ↑
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div
            style={btnStyle()}
            onTouchStart={() => simulateKey('ArrowLeft', 'keydown')}
            onTouchEnd={() => simulateKey('ArrowLeft', 'keyup')}
          >
            ←
          </div>
          <div
            style={btnStyle()}
            onTouchStart={() => simulateKey('ArrowDown', 'keydown')}
            onTouchEnd={() => simulateKey('ArrowDown', 'keyup')}
          >
            ↓
          </div>
          <div
            style={btnStyle()}
            onTouchStart={() => simulateKey('ArrowRight', 'keydown')}
            onTouchEnd={() => simulateKey('ArrowRight', 'keyup')}
          >
            →
          </div>
        </div>
      </div>

      {/* Jump button */}
      <div
        style={{ ...btnStyle(), width: 70, height: 70, fontSize: 14, fontWeight: 700 }}
        onTouchStart={() => simulateKey(' ', 'keydown')}
        onTouchEnd={() => simulateKey(' ', 'keyup')}
      >
        JUMP
      </div>
    </div>
  );
}
