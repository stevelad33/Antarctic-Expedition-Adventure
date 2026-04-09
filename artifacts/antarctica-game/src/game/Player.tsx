import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { UNIFORM_COLORS, GRAVITY, JUMP_FORCE, MOVE_SPEED, ATV_SPEED, LEVEL_CONFIGS } from './constants';
import { useGame } from './GameContext';

interface PlayerProps {
  platforms: Array<{ x: number; y: number; z: number; width: number; height: number; depth: number }>;
  camps: Array<{ x: number; y: number; z: number; visited: boolean }>;
  atvCamps: Array<{ x: number; y: number; z: number; collected: boolean }>;
  onReachEnd: () => void;
  onVisitCamp: (index: number) => void;
  onCollectATV: (index: number) => void;
  onFallOff: () => void;
}

export default function Player({
  platforms,
  camps,
  atvCamps,
  onReachEnd,
  onVisitCamp,
  onCollectATV,
  onFallOff,
}: PlayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const velocity = useRef({ x: 0, y: 0, z: 0 });
  const isGrounded = useRef(true);
  const keys = useRef<Set<string>>(new Set());
  const lastPos = useRef(0);
  const { uniformColor, hasATV, level, updateStats, screen, gameStateRef } = useGame();
  const config = LEVEL_CONFIGS[level];

  const color = UNIFORM_COLORS[uniformColor] || UNIFORM_COLORS.red;

  const bodyMaterial = useMemo(() => new THREE.MeshToonMaterial({ color }), [color]);
  const skinMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: '#FFCC99' }), []);
  const eyeMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: '#333333' }), []);
  const bootMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: '#5D4037' }), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current.add(e.key.toLowerCase());
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current.delete(e.key.toLowerCase());
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (!groupRef.current || gameStateRef.current.screen !== 'playing') return;

    const pos = groupRef.current.position;
    const vel = velocity.current;
    const currentHasATV = gameStateRef.current.hasATV;
    const speed = currentHasATV ? ATV_SPEED : MOVE_SPEED;

    if (keys.current.has('arrowright') || keys.current.has('d')) {
      vel.x = speed;
    } else if (keys.current.has('arrowleft') || keys.current.has('a')) {
      vel.x = -speed;
    } else {
      vel.x *= 0.85;
    }

    if ((keys.current.has(' ') || keys.current.has('arrowup') || keys.current.has('w')) && isGrounded.current) {
      vel.y = JUMP_FORCE;
      isGrounded.current = false;
    }

    vel.y += GRAVITY;
    pos.x += vel.x;
    pos.y += vel.y;

    pos.x = Math.max(-2, pos.x);

    isGrounded.current = false;

    if (pos.y <= 0.8) {
      if (pos.x >= -3 && pos.x <= config.length + 5) {
        pos.y = 0.8;
        vel.y = 0;
        isGrounded.current = true;
      }
    }

    for (const plat of platforms) {
      const halfW = plat.width / 2;
      const halfD = plat.depth / 2;
      if (
        pos.x >= plat.x - halfW &&
        pos.x <= plat.x + halfW &&
        pos.z >= plat.z - halfD &&
        pos.z <= plat.z + halfD &&
        pos.y >= plat.y + plat.height / 2 - 0.1 &&
        pos.y <= plat.y + plat.height / 2 + 1.0 &&
        vel.y <= 0
      ) {
        pos.y = plat.y + plat.height / 2 + 0.8;
        vel.y = 0;
        isGrounded.current = true;
      }
    }

    if (pos.y < -10) {
      onFallOff();
      pos.set(0, 2, 0);
      vel.x = 0;
      vel.y = 0;
    }

    const deltaX = Math.abs(pos.x - lastPos.current);
    if (deltaX > 0.1) {
      updateStats(deltaX * 0.05);
      lastPos.current = pos.x;
    }

    camps.forEach((camp, i) => {
      if (!camp.visited && Math.abs(pos.x - camp.x) < 2 && Math.abs(pos.y - camp.y) < 3) {
        onVisitCamp(i);
      }
    });

    atvCamps.forEach((atv, i) => {
      if (!atv.collected && Math.abs(pos.x - atv.x) < 2 && Math.abs(pos.y - atv.y) < 3) {
        onCollectATV(i);
      }
    });

    if (pos.x >= config.length - 5) {
      onReachEnd();
    }
  });

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(0, 2, 0);
      velocity.current = { x: 0, y: 0, z: 0 };
      lastPos.current = 0;
    }
  }, [level, screen]);

  return (
    <group ref={groupRef} position={[0, 2, 0]}>
      <mesh material={bodyMaterial} position={[0, 0, 0]}>
        <boxGeometry args={[0.7, 0.9, 0.6]} />
      </mesh>

      <mesh material={bodyMaterial} position={[0, 0.05, 0]}>
        <boxGeometry args={[0.9, 0.5, 0.65]} />
      </mesh>

      <mesh material={skinMaterial} position={[0, 0.75, 0]}>
        <boxGeometry args={[0.65, 0.6, 0.6]} />
      </mesh>

      <mesh material={eyeMaterial} position={[-0.15, 0.8, 0.31]}>
        <boxGeometry args={[0.12, 0.12, 0.05]} />
      </mesh>
      <mesh material={eyeMaterial} position={[0.15, 0.8, 0.31]}>
        <boxGeometry args={[0.12, 0.12, 0.05]} />
      </mesh>

      <mesh material={bodyMaterial} position={[0, 1.0, 0]}>
        <boxGeometry args={[0.7, 0.15, 0.65]} />
      </mesh>

      <mesh material={bodyMaterial} position={[-0.5, 0.1, 0]}>
        <boxGeometry args={[0.3, 0.7, 0.35]} />
      </mesh>
      <mesh material={bodyMaterial} position={[0.5, 0.1, 0]}>
        <boxGeometry args={[0.3, 0.7, 0.35]} />
      </mesh>

      <mesh material={bodyMaterial} position={[-0.2, -0.65, 0]}>
        <boxGeometry args={[0.3, 0.5, 0.35]} />
      </mesh>
      <mesh material={bodyMaterial} position={[0.2, -0.65, 0]}>
        <boxGeometry args={[0.3, 0.5, 0.35]} />
      </mesh>

      <mesh material={bootMaterial} position={[-0.2, -1.0, 0.05]}>
        <boxGeometry args={[0.35, 0.25, 0.45]} />
      </mesh>
      <mesh material={bootMaterial} position={[0.2, -1.0, 0.05]}>
        <boxGeometry args={[0.35, 0.25, 0.45]} />
      </mesh>

      {hasATV && (
        <group position={[0, -0.8, 0]}>
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[1.4, 0.4, 0.9]} />
            <meshToonMaterial color="#FF6F00" />
          </mesh>
          <mesh position={[-0.5, -0.5, 0.5]}>
            <cylinderGeometry args={[0.2, 0.2, 0.15, 8]} />
            <meshToonMaterial color="#333" />
          </mesh>
          <mesh position={[0.5, -0.5, 0.5]}>
            <cylinderGeometry args={[0.2, 0.2, 0.15, 8]} />
            <meshToonMaterial color="#333" />
          </mesh>
          <mesh position={[-0.5, -0.5, -0.5]}>
            <cylinderGeometry args={[0.2, 0.2, 0.15, 8]} />
            <meshToonMaterial color="#333" />
          </mesh>
          <mesh position={[0.5, -0.5, -0.5]}>
            <cylinderGeometry args={[0.2, 0.2, 0.15, 8]} />
            <meshToonMaterial color="#333" />
          </mesh>
          <mesh position={[0.0, 0.1, 0]}>
            <boxGeometry args={[0.3, 0.5, 0.1]} />
            <meshToonMaterial color="#FF8F00" />
          </mesh>
        </group>
      )}
    </group>
  );
}
