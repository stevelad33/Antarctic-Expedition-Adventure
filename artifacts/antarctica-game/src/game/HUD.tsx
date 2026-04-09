import { useGame } from './GameContext';
import { LEVEL_NAMES, MAX_HEALTH, MAX_HUNGER, MAX_ENERGY } from './constants';

export default function HUD() {
  const { health, hunger, energy, level, score, hasATV, distance } = useGame();

  const healthPercent = (health / MAX_HEALTH) * 100;
  const hungerPercent = (hunger / MAX_HUNGER) * 100;
  const energyPercent = (energy / MAX_ENERGY) * 100;

  const getBarColor = (percent: number, type: string) => {
    if (type === 'health') {
      if (percent > 60) return '#66BB6A';
      if (percent > 30) return '#FFA726';
      return '#EF5350';
    }
    if (type === 'hunger') {
      if (percent > 60) return '#FF7043';
      if (percent > 30) return '#FFA726';
      return '#EF5350';
    }
    if (percent > 60) return '#42A5F5';
    if (percent > 30) return '#FFA726';
    return '#EF5350';
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      padding: '12px 16px',
      pointerEvents: 'none',
      zIndex: 10,
      fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '16px',
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '16px',
          padding: '12px 16px',
          minWidth: '200px',
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 700, marginBottom: '8px', letterSpacing: '1px' }}>
            {LEVEL_NAMES[level]}
          </div>

          <StatBar label="Health" percent={healthPercent} color={getBarColor(healthPercent, 'health')} icon="+" />
          <StatBar label="Hunger" percent={hungerPercent} color={getBarColor(hungerPercent, 'hunger')} icon="~" />
          <StatBar label="Energy" percent={energyPercent} color={getBarColor(energyPercent, 'energy')} icon="*" />
        </div>

        <div style={{
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '16px',
          padding: '12px 16px',
          textAlign: 'right',
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{ color: '#FFD54F', fontSize: '20px', fontWeight: 700 }}>
            {score} pts
          </div>
          <div style={{ color: '#B0BEC5', fontSize: '11px', marginTop: '4px' }}>
            Distance: {(distance * 0.5).toFixed(1)} km
          </div>
          {hasATV && (
            <div style={{
              color: '#FF6F00',
              fontSize: '12px',
              marginTop: '4px',
              background: 'rgba(255,111,0,0.2)',
              borderRadius: '8px',
              padding: '2px 8px',
            }}>
              ATV Active
            </div>
          )}
        </div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '-60vh',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.5)',
        fontSize: '11px',
        textAlign: 'center',
      }}>
        Arrow keys or WASD to move | SPACE to jump
      </div>
    </div>
  );
}

function StatBar({ label, percent, color, icon }: { label: string; percent: number; color: string; icon: string }) {
  return (
    <div style={{ marginBottom: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
        <span style={{ color: '#B0BEC5', fontSize: '11px' }}>
          {icon} {label}
        </span>
        <span style={{ color: '#FFFFFF', fontSize: '11px', fontWeight: 600 }}>
          {Math.round(percent)}%
        </span>
      </div>
      <div style={{
        width: '100%',
        height: '8px',
        background: 'rgba(255,255,255,0.15)',
        borderRadius: '4px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${percent}%`,
          height: '100%',
          background: color,
          borderRadius: '4px',
          transition: 'width 0.3s ease',
          boxShadow: `0 0 6px ${color}60`,
        }} />
      </div>
    </div>
  );
}
