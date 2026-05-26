import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { LEVEL_CONFIGS, COIN_VALUE } from './constants';
import { useGame } from './GameContext';
import Player from './Player';
import Camp from './Camp';
import Airplane from './Airplane';
import Environment from './Environment';
import Snowflakes from './Snowflakes';
import CameraFollow from './CameraFollow';

interface PlatformData {
  x: number; y: number; z: number;
  width: number; height: number; depth: number;
}

interface CampData {
  x: number; y: number; z: number;
  visited: boolean;
  type: 'rest' | 'atv';
}

interface CoinData {
  x: number; y: number; z: number;
  collected: boolean;
}

interface ObstacleData {
  x: number; y: number; z: number;
  deleted: boolean;
}

function generateWindingPath(stepCount: number, stepSize: number) {
  const points: Array<{ x: number; z: number }> = [{ x: 0, z: 0 }];
  let angle = 0;
  for (let i = 0; i < stepCount; i++) {
    angle += (Math.random() - 0.5) * 1.1;
    const last = points[points.length - 1];
    points.push({
      x: last.x + Math.sin(angle) * stepSize,
      z: last.z + Math.cos(angle) * stepSize,
    });
  }
  return points;
}

function generatePlatforms(path: Array<{ x: number; z: number }>, level: number): PlatformData[] {
  const config = LEVEL_CONFIGS[level];
  const platforms: PlatformData[] = [];

  for (let i = 1; i < path.length; i++) {
    const pt = path[i];
    const prev = path[i - 1];

    // 1-2 platforms between each waypoint
    const numBetween = 1 + Math.floor(Math.random() * 2);
    for (let j = 0; j <= numBetween; j++) {
      const t = j / (numBetween + 1);
      const bx = prev.x + (pt.x - prev.x) * t + (Math.random() - 0.5) * 3;
      const bz = prev.z + (pt.z - prev.z) * t + (Math.random() - 0.5) * 3;
      const by = 0.5 + (i % 4) * 0.8 + Math.random() * 0.5;
      platforms.push({
        x: bx, y: by, z: bz,
        width: 3 + Math.random() * 3,
        height: 0.5,
        depth: 3 + Math.random() * 3,
      });
    }
    void config;
  }
  return platforms;
}

function generateCamps(path: Array<{ x: number; z: number }>, level: number): CampData[] {
  const config = LEVEL_CONFIGS[level];
  const campCount = config.campPositions.length;
  const camps: CampData[] = [];

  for (let i = 0; i < campCount; i++) {
    const idx = Math.floor(((i + 1) / (campCount + 1)) * (path.length - 1));
    const pt = path[idx];
    camps.push({
      x: pt.x,
      y: 0.3,
      z: pt.z,
      visited: false,
      type: i === 0 && level < 5 ? 'atv' : 'rest',
    });
  }
  return camps;
}

function generateCoins(path: Array<{ x: number; z: number }>, level: number): CoinData[] {
  const config = LEVEL_CONFIGS[level];
  const coins: CoinData[] = [];
  const coinCount = config.coinCount || 8;

  for (let i = 0; i < coinCount; i++) {
    const idx = Math.floor((i / coinCount) * (path.length - 1));
    const pt = path[idx];
    coins.push({
      x: pt.x + (Math.random() - 0.5) * 4,
      y: 1.0 + Math.random() * 1.5,
      z: pt.z + (Math.random() - 0.5) * 4,
      collected: false,
    });
  }
  return coins;
}

function generateObstacles(path: Array<{ x: number; z: number }>, level: number): ObstacleData[] {
  const config = LEVEL_CONFIGS[level];
  const obstacles: ObstacleData[] = [];
  const obstacleCount = config.obstacleCount || 3;

  for (let i = 0; i < obstacleCount; i++) {
    const idx = Math.floor(((i + 0.5) / obstacleCount) * (path.length - 2)) + 1;
    const pt = path[idx];
    obstacles.push({
      x: pt.x + (Math.random() - 0.5) * 3,
      y: 0.8,
      z: pt.z + (Math.random() - 0.5) * 3,
      deleted: false,
    });
  }
  return obstacles;
}

export default function Level() {
  const { level, visitCamp, collectATV, setScreen, addScore, takeDamage, addCoins } = useGame();
  const config = LEVEL_CONFIGS[level];

  const playerGroupRef = useRef<THREE.Group>(null);
  const facingAngleRef = useRef(0);

  const path = useMemo(() => generateWindingPath(8, 10), [level]);
  const goalPosition = useMemo(() => {
    const last = path[path.length - 1];
    return new THREE.Vector3(last.x, 0, last.z);
  }, [path]);

  const [platforms] = useState<PlatformData[]>(() => generatePlatforms(path, level));
  const [camps, setCamps] = useState<CampData[]>(() => generateCamps(path, level));
  const [coins, setCoins] = useState<CoinData[]>(() => generateCoins(path, level));
  const [obstacles, setObstacles] = useState<ObstacleData[]>(() => generateObstacles(path, level));
  const [reachedEnd, setReachedEnd] = useState(false);

  useEffect(() => {
    setReachedEnd(false);
    setCamps(generateCamps(path, level));
    setCoins(generateCoins(path, level));
    setObstacles(generateObstacles(path, level));
  }, [level, path]);

  const restCamps = useMemo(() => camps.filter(c => c.type === 'rest'), [camps]);
  const atvCamps = useMemo(() => camps.filter(c => c.type === 'atv'), [camps]);
  const activeObstacles = useMemo(() => obstacles.filter(o => !o.deleted), [obstacles]);

  const handleVisitCamp = useCallback((index: number) => {
    const restIndices = camps.map((c, i) => c.type === 'rest' ? i : -1).filter(i => i >= 0);
    const actual = restIndices[index];
    if (actual === undefined || camps[actual].visited) return;
    setCamps(prev => {
      const next = [...prev];
      next[actual] = { ...next[actual], visited: true };
      return next;
    });
    visitCamp();
  }, [camps, visitCamp]);

  const handleCollectATV = useCallback((index: number) => {
    const atvIndices = camps.map((c, i) => c.type === 'atv' ? i : -1).filter(i => i >= 0);
    const actual = atvIndices[index];
    if (actual === undefined || camps[actual].visited) return;
    setCamps(prev => {
      const next = [...prev];
      next[actual] = { ...next[actual], visited: true };
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

  const handleCollectCoin = useCallback((index: number) => {
    setCoins(prev => {
      if (prev[index].collected) return prev;
      const next = [...prev];
      next[index] = { ...next[index], collected: true };
      return next;
    });
    addCoins(COIN_VALUE);
  }, [addCoins]);

  const handleDeleteObstacle = useCallback((index: number) => {
    setObstacles(prev => {
      const next = [...prev];
      next[index] = { ...next[index], deleted: true };
      return next;
    });
    addScore(25);
  }, [addScore]);

  const handleObstacleCollision = useCallback(() => {
    takeDamage(10);
  }, [takeDamage]);

  // Path trail markers
  const pathMarkers = useMemo(() => path.slice(1, -1).map((pt, i) => (
    <mesh key={i} position={[pt.x, 0.1, pt.z]}>
      <cylinderGeometry args={[0.3, 0.3, 0.15, 8]} />
      <meshToonMaterial color={config.accentColor} transparent opacity={0.5} />
    </mesh>
  )), [path, config.accentColor]);

  return (
    <>
      <color attach="background" args={[config.backgroundColor]} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[20, 30, 20]} intensity={0.7} color="#FFFDE7" castShadow />
      <hemisphereLight args={['#87CEEB', '#E8F4FD', 0.4]} />
      <fog attach="fog" args={[config.backgroundColor, 40, 100]} />

      <CameraFollow playerRef={playerGroupRef} facingAngleRef={facingAngleRef} />

      <Environment level={level} path={path} />

      <Snowflakes count={200} />

      {/* Ground plane */}
      <mesh position={[0, -0.1, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[400, 400]} />
        <meshToonMaterial color={config.groundColor} />
      </mesh>

      {/* Path trail */}
      {pathMarkers}

      {/* Platforms */}
      {platforms.map((plat, i) => (
        <mesh key={i} position={[plat.x, plat.y, plat.z]} receiveShadow castShadow>
          <boxGeometry args={[plat.width, plat.height, plat.depth]} />
          <meshToonMaterial color={i % 2 === 0 ? config.platformColor : config.accentColor} />
        </mesh>
      ))}

      {/* Camps */}
      {camps.map((camp, i) => (
        <Camp
          key={i}
          position={[camp.x, camp.y, camp.z]}
          visited={camp.visited}
          type={camp.type}
        />
      ))}

      {/* Base camp at start */}
      <group position={[-3, 0, -3]}>
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

      {/* Goal marker */}
      <group position={[goalPosition.x, 0, goalPosition.z]}>
        {/* Glowing beacon */}
        <mesh position={[0, 4, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 8, 8]} />
          <meshToonMaterial color="#F44336" />
        </mesh>
        <mesh position={[0, 8.2, 0]}>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshToonMaterial color="#FFEB3B" emissive="#FFEB3B" emissiveIntensity={0.8} />
        </mesh>
        {/* Smartwings plane at south pole (level 5) or flag otherwise */}
        {level === 5 ? (
          <Airplane position={[4, 2, 0]} flying={reachedEnd} />
        ) : (
          <mesh position={[0.5, 5.5, 0]}>
            <boxGeometry args={[0.05, 0.8, 1.2]} />
            <meshToonMaterial color="#E53935" />
          </mesh>
        )}
        {/* Ground ring */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3, 5, 32]} />
          <meshToonMaterial color="#FFEB3B" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Coins */}
      {coins.map((coin, i) => (
        !coin.collected && (
          <mesh key={`coin-${i}`} position={[coin.x, coin.y, coin.z]}>
            <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
            <meshToonMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
          </mesh>
        )
      ))}

      {/* Obstacles (ice bags/crates) */}
      {obstacles.map((obs, i) => (
        !obs.deleted && (
          <group key={`obs-${i}`} position={[obs.x, obs.y, obs.z]}>
            <mesh>
              <boxGeometry args={[1.2, 1.2, 1.2]} />
              <meshToonMaterial color="#78909C" />
            </mesh>
            <mesh position={[0, 0.7, 0]}>
              <boxGeometry args={[0.8, 0.3, 0.05]} />
              <meshToonMaterial color="#455A64" />
            </mesh>
          </group>
        )
      ))}

      <Player
        platforms={platforms}
        camps={restCamps.map(c => ({ x: c.x, y: c.y, z: c.z, visited: c.visited }))}
        atvCamps={atvCamps.map(c => ({ x: c.x, y: c.y, z: c.z, visited: c.visited }))}
        coins={coins.map(c => ({ x: c.x, y: c.y, z: c.z, collected: c.collected }))}
        obstacles={activeObstacles.map(o => ({ x: o.x, y: o.y, z: o.z }))}
        goalPosition={goalPosition}
        onReachEnd={handleReachEnd}
        onVisitCamp={handleVisitCamp}
        onCollectATV={handleCollectATV}
        onCollectCoin={handleCollectCoin}
        onDeleteObstacle={handleDeleteObstacle}
        onObstacleCollision={handleObstacleCollision}
        onFallOff={handleFallOff}
        groupRef={playerGroupRef}
        facingAngleRef={facingAngleRef}
      />
    </>
  );
}
