import { useRef, useEffect, MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { UNIFORM_COLORS, GRAVITY, JUMP_FORCE, MOVE_SPEED, ATV_SPEED, BOOST_SPEED } from './constants';
import { useGame } from './GameContext';

interface Platform {
  x: number; y: number; z: number;
  width: number; height: number; depth: number;
}

interface CampMarker {
  x: number; y: number; z: number; visited: boolean;
}

interface CoinMarker {
  x: number; y: number; z: number; collected: boolean;
}

interface ObstacleMarker {
  x: number; y: number; z: number;
}

interface PlayerProps {
  platforms: Platform[];
  camps: CampMarker[];
  atvCamps: CampMarker[];
  coins: CoinMarker[];
  obstacles: ObstacleMarker[];
  goalPosition: THREE.Vector3;
  onReachEnd: () => void;
  onVisitCamp: (index: number) => void;
  onCollectATV: (index: number) => void;
  onCollectCoin: (index: number) => void;
  onDeleteObstacle: (index: number) => void;
  onObstacleCollision: () => void;
  onFallOff: () => void;
  groupRef: MutableRefObject<THREE.Group | null>;
  facingAngleRef: MutableRefObject<number>;
}

export default function Player({
  platforms,
  camps,
  atvCamps,
  coins,
  obstacles,
  goalPosition,
  onReachEnd,
  onVisitCamp,
  onCollectATV,
  onCollectCoin,
  onDeleteObstacle,
  onObstacleCollision,
  onFallOff,
  groupRef,
  facingAngleRef,
}: PlayerProps) {
  const velRef = useRef(new THREE.Vector3());
  const isGrounded = useRef(true);
  const keys = useRef<Set<string>>(new Set());
  const lastPos = useRef(new THREE.Vector3());
  const reachedEnd = useRef(false);
  const obstacleHitCooldown = useRef(false);

  const { uniformColor, hasATV, speedBoostActive, shieldActive, heatPackActive, level, updateStats, gameStateRef } = useGame();
  const color = UNIFORM_COLORS[uniformColor] || UNIFORM_COLORS.red;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keys.current.add(e.key.toLowerCase());
    const handleKeyUp = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Reset player when level changes
  useEffect(() => {
    if (groupRef?.current) {
      groupRef.current.position.set(0, 1.5, 0);
      velRef.current.set(0, 0, 0);
      lastPos.current.set(0, 0, 0);
      if (facingAngleRef) facingAngleRef.current = 0;
      reachedEnd.current = false;
    }
  }, [level]); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((_, delta) => {
    if (!groupRef.current || gameStateRef.current.screen !== 'playing') return;

    const pos = groupRef.current.position;
    const vel = velRef.current;
    const currentHasATV = gameStateRef.current.hasATV;
    const currentSpeedBoost = gameStateRef.current.speedBoostActive;
    const currentShield = gameStateRef.current.shieldActive;
    const currentHeatPack = gameStateRef.current.heatPackActive;
    const rotSpeed = 2.0;

    // Calculate base speed with ATV and speed boost
    let baseSpeed = currentHasATV ? ATV_SPEED : MOVE_SPEED;
    if (currentSpeedBoost) {
      baseSpeed *= 1.5; // 50% speed boost
    }
    const speed = baseSpeed;
    const dt = Math.min(delta, 0.05);

    // Heat pack reduces energy drain (handled in updateStats via gameStateRef)
    void currentHeatPack;
    void currentShield;

    // Rotate facing angle with left/right
    if (keys.current.has('arrowleft') || keys.current.has('a')) {
      facingAngleRef.current -= rotSpeed * dt;
    }
    if (keys.current.has('arrowright') || keys.current.has('d')) {
      facingAngleRef.current += rotSpeed * dt;
    }

    const angle = facingAngleRef.current;
    const fwdX = Math.sin(angle);
    const fwdZ = Math.cos(angle);

    let moving = false;
    if (keys.current.has('arrowup') || keys.current.has('w')) {
      vel.x = fwdX * speed;
      vel.z = fwdZ * speed;
      moving = true;
    } else if (keys.current.has('arrowdown') || keys.current.has('s')) {
      vel.x = -fwdX * speed;
      vel.z = -fwdZ * speed;
      moving = true;
    }

    if (!moving) {
      vel.x *= 0.8;
      vel.z *= 0.8;
    }

    // Jump
    if (keys.current.has(' ') && isGrounded.current) {
      vel.y = JUMP_FORCE;
      isGrounded.current = false;
    }

    // Gravity
    vel.y += GRAVITY;

    // Integrate position
    pos.x += vel.x;
    pos.y += vel.y;
    pos.z += vel.z;

    // Ground check (y=0 plane)
    isGrounded.current = false;
    if (pos.y <= 1.0) {
      pos.y = 1.0;
      vel.y = 0;
      isGrounded.current = true;
    }

    // Platform collision
    for (const plat of platforms) {
      const halfW = plat.width / 2 + 0.3;
      const halfD = plat.depth / 2 + 0.3;
      const platTop = plat.y + plat.height / 2;

      if (
        pos.x >= plat.x - halfW &&
        pos.x <= plat.x + halfW &&
        pos.z >= plat.z - halfD &&
        pos.z <= plat.z + halfD
      ) {
        if (pos.y >= platTop - 0.2 && pos.y <= platTop + 1.5 && vel.y <= 0) {
          pos.y = platTop + 1.0;
          vel.y = 0;
          isGrounded.current = true;
        }
      }
    }

    // Fall off
    if (pos.y < -12) {
      onFallOff();
      pos.set(0, 1.5, 0);
      vel.set(0, 0, 0);
      reachedEnd.current = false;
    }

    // Rotate player mesh to face direction
    groupRef.current.rotation.y = -angle + Math.PI;

    // Track distance for energy drain
    const delta3d = pos.distanceTo(lastPos.current);
    if (delta3d > 0.1) {
      updateStats(delta3d * 0.05);
      lastPos.current.copy(pos);
    }

    // Camp interactions
    camps.forEach((camp, i) => {
      const dx = pos.x - camp.x;
      const dz = pos.z - camp.z;
      if (!camp.visited && Math.sqrt(dx * dx + dz * dz) < 2.5) {
        onVisitCamp(i);
      }
    });

    atvCamps.forEach((atv, i) => {
      const dx = pos.x - atv.x;
      const dz = pos.z - atv.z;
      if (!atv.collected && Math.sqrt(dx * dx + dz * dz) < 2.5) {
        onCollectATV(i);
      }
    });

    // Coin collection
    coins.forEach((coin, i) => {
      if (coin.collected) return;
      const dx = pos.x - coin.x;
      const dy = pos.y - coin.y;
      const dz = pos.z - coin.z;
      if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 1.2) {
        onCollectCoin(i);
      }
    });

    // Obstacle interaction (bags/crates)
    obstacles.forEach((obs, i) => {
      const dx = pos.x - obs.x;
      const dy = pos.y - obs.y;
      const dz = pos.z - obs.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      // Press E or click to delete obstacle when near
      if (dist < 2.0 && keys.current.has('e')) {
        onDeleteObstacle(i);
      }
      // Collision with obstacle causes damage
      else if (dist < 1.0 && !obstacleHitCooldown.current && !currentShield) {
        obstacleHitCooldown.current = true;
        onObstacleCollision();
        // Brief invulnerability after hitting obstacle
        setTimeout(() => {
          obstacleHitCooldown.current = false;
        }, 1000);
      }
    });

    // Shield protects from damage
    if (currentShield) {
      obstacleHitCooldown.current = false;
    }

    // Reach goal
    if (!reachedEnd.current) {
      const dx = pos.x - goalPosition.x;
      const dz = pos.z - goalPosition.z;
      if (Math.sqrt(dx * dx + dz * dz) < 5) {
        reachedEnd.current = true;
        onReachEnd();
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.5, 0]}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.7, 0.9, 0.6]} />
        <meshToonMaterial color={color} />
      </mesh>
      {/* Jacket */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.9, 0.5, 0.65]} />
        <meshToonMaterial color={color} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.65, 0.6, 0.6]} />
        <meshToonMaterial color="#FFCC99" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.15, 0.8, 0.31]}>
        <boxGeometry args={[0.12, 0.12, 0.05]} />
        <meshToonMaterial color="#333333" />
      </mesh>
      <mesh position={[0.15, 0.8, 0.31]}>
        <boxGeometry args={[0.12, 0.12, 0.05]} />
        <meshToonMaterial color="#333333" />
      </mesh>
      {/* Hat */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.7, 0.15, 0.65]} />
        <meshToonMaterial color={color} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.5, 0.1, 0]}>
        <boxGeometry args={[0.3, 0.7, 0.35]} />
        <meshToonMaterial color={color} />
      </mesh>
      <mesh position={[0.5, 0.1, 0]}>
        <boxGeometry args={[0.3, 0.7, 0.35]} />
        <meshToonMaterial color={color} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.2, -0.65, 0]}>
        <boxGeometry args={[0.3, 0.5, 0.35]} />
        <meshToonMaterial color={color} />
      </mesh>
      <mesh position={[0.2, -0.65, 0]}>
        <boxGeometry args={[0.3, 0.5, 0.35]} />
        <meshToonMaterial color={color} />
      </mesh>
      {/* Boots */}
      <mesh position={[-0.2, -1.0, 0.05]}>
        <boxGeometry args={[0.35, 0.25, 0.45]} />
        <meshToonMaterial color="#5D4037" />
      </mesh>
      <mesh position={[0.2, -1.0, 0.05]}>
        <boxGeometry args={[0.35, 0.25, 0.45]} />
        <meshToonMaterial color="#5D4037" />
      </mesh>

      {/* ATV */}
      {hasATV && (
        <group position={[0, -0.8, 0]}>
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[1.4, 0.4, 0.9]} />
            <meshToonMaterial color="#FF6F00" />
          </mesh>
          <mesh position={[-0.5, -0.5, 0.4]}>
            <cylinderGeometry args={[0.2, 0.2, 0.15, 8]} />
            <meshToonMaterial color="#333" />
          </mesh>
          <mesh position={[0.5, -0.5, 0.4]}>
            <cylinderGeometry args={[0.2, 0.2, 0.15, 8]} />
            <meshToonMaterial color="#333" />
          </mesh>
          <mesh position={[-0.5, -0.5, -0.4]}>
            <cylinderGeometry args={[0.2, 0.2, 0.15, 8]} />
            <meshToonMaterial color="#333" />
          </mesh>
          <mesh position={[0.5, -0.5, -0.4]}>
            <cylinderGeometry args={[0.2, 0.2, 0.15, 8]} />
            <meshToonMaterial color="#333" />
          </mesh>
        </group>
      )}
    </group>
  );
}
