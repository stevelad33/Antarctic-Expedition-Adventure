import { useState, useCallback, useMemo, useEffect } from 'react';
import { LEVEL_CONFIGS } from './constants';
import { useGame } from './GameContext';
import Player from './Player';
import Camp from './Camp';
import Airplane from './Airplane';
import Environment from './Environment';
import Snowflakes from './Snowflakes';
import CameraFollow from './CameraFollow';

function generatePlatforms(level: number) {
  const config = LEVEL_CONFIGS[level];
  const platforms = [];

  for (let i = 0; i < config.platformCount; i++) {
    const x = 5 + (i / config.platformCount) * (config.length - 15);
    const y = 1 + Math.random() * 3;
    const width = 2 + Math.random() * 3;
    platforms.push({
      x,
      y,
      z: (Math.random() - 0.5) * 2,
      width,
      height: 0.5,
      depth: 2 + Math.random() * 1.5,
    });
  }
  return platforms;
}

function generateCamps(level: number) {
  const config = LEVEL_CONFIGS[level];
  return config.campPositions.map((x, i) => ({
    x,
    y: 0.3,
    z: 0,
    visited: false,
    type: (i === 0 && level < 3 ? 'atv' : 'rest') as 'atv' | 'rest',
  }));
}

export default function Level() {
  const { level, visitCamp, collectATV, setScreen, addScore, takeDamage } = useGame();
  const [reachedEnd, setReachedEnd] = useState(false);
  const config = LEVEL_CONFIGS[level];

  const [platforms] = useState(() => generatePlatforms(level));
  const [camps, setCamps] = useState(() => generateCamps(level));

  useEffect(() => {
    setReachedEnd(false);
    setCamps(generateCamps(level));
  }, [level]);

  const restCamps = useMemo(() => camps.filter(c => c.type === 'rest'), [camps]);
  const atvCamps = useMemo(() => camps.filter(c => c.type === 'atv'), [camps]);

  const handleVisitCamp = useCallback((index: number) => {
    const restCampIndices = camps.map((c, i) => c.type === 'rest' ? i : -1).filter(i => i >= 0);
    const actualIndex = restCampIndices[index];
    if (actualIndex === undefined || camps[actualIndex].visited) return;
    setCamps(prev => {
      const next = [...prev];
      next[actualIndex] = { ...next[actualIndex], visited: true };
      return next;
    });
    visitCamp();
  }, [camps, visitCamp]);

  const handleCollectATV = useCallback((index: number) => {
    const atvCampIndices = camps.map((c, i) => c.type === 'atv' ? i : -1).filter(i => i >= 0);
    const actualIndex = atvCampIndices[index];
    if (actualIndex === undefined || camps[actualIndex].visited) return;
    setCamps(prev => {
      const next = [...prev];
      next[actualIndex] = { ...next[actualIndex], visited: true };
      return next;
    });
    collectATV();
  }, [camps, collectATV]);

  const handleReachEnd = useCallback(() => {
    if (reachedEnd) return;
    setReachedEnd(true);
    addScore(200);
    setScreen('levelComplete');
  }, [reachedEnd, addScore, setScreen]);

  const handleFallOff = useCallback(() => {
    takeDamage(15);
  }, [takeDamage]);

  return (
    <>
      <color attach="background" args={[config.backgroundColor]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} color="#FFFDE7" />
      <hemisphereLight args={['#87CEEB', '#E8F4FD', 0.5]} />
      <fog attach="fog" args={[config.backgroundColor, 30, 80]} />

      <CameraFollow />

      <Environment level={level} />

      <Snowflakes count={300} />

      {platforms.map((plat, i) => (
        <mesh key={i} position={[plat.x, plat.y, plat.z]}>
          <boxGeometry args={[plat.width, plat.height, plat.depth]} />
          <meshToonMaterial color={i % 2 === 0 ? config.platformColor : config.accentColor} />
        </mesh>
      ))}

      {camps.map((camp, i) => (
        <Camp
          key={i}
          position={[camp.x, camp.y, camp.z]}
          visited={camp.visited}
          type={camp.type}
        />
      ))}

      {level === 3 && (
        <Airplane position={[config.length - 5, 1.5, 0]} flying={reachedEnd} />
      )}

      <group position={[-3, 0, 0]}>
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[4, 3, 4]} />
          <meshToonMaterial color="#FFA726" />
        </mesh>
        <mesh position={[0, 3.2, 0]}>
          <coneGeometry args={[3, 1.5, 4]} />
          <meshToonMaterial color="#EF6C00" />
        </mesh>
        <mesh position={[0, 1.5, 2.01]}>
          <boxGeometry args={[1.2, 1.8, 0.05]} />
          <meshToonMaterial color="#5D4037" />
        </mesh>
      </group>

      <Player
        platforms={platforms}
        camps={restCamps.map(c => ({ x: c.x, y: c.y, z: c.z, visited: c.visited }))}
        atvCamps={atvCamps.map(c => ({ x: c.x, y: c.y, z: c.z, collected: c.visited }))}
        onReachEnd={handleReachEnd}
        onVisitCamp={handleVisitCamp}
        onCollectATV={handleCollectATV}
        onFallOff={handleFallOff}
      />
    </>
  );
}
