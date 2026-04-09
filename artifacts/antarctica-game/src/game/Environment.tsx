import { useMemo } from 'react';
import { LEVEL_CONFIGS } from './constants';

interface EnvironmentProps {
  level: number;
}

export default function Environment({ level }: EnvironmentProps) {
  const config = LEVEL_CONFIGS[level];

  const trees = useMemo(() => {
    const items = [];
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * config.length - 5;
      const z = -5 - Math.random() * 10;
      items.push({ x, z, scale: 0.5 + Math.random() * 1.5 });
    }
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * config.length - 5;
      const z = 5 + Math.random() * 10;
      items.push({ x, z, scale: 0.5 + Math.random() * 1.5 });
    }
    return items;
  }, [level, config.length]);

  const icebergs = useMemo(() => {
    return Array.from({ length: 8 }, () => ({
      x: Math.random() * config.length,
      z: (Math.random() > 0.5 ? 1 : -1) * (8 + Math.random() * 10),
      scale: 1 + Math.random() * 3,
      rotation: Math.random() * Math.PI,
    }));
  }, [level, config.length]);

  return (
    <group>
      <mesh position={[config.length / 2, -0.1, 0]} receiveShadow>
        <boxGeometry args={[config.length + 20, 0.2, 30]} />
        <meshToonMaterial color={config.groundColor} />
      </mesh>

      {level >= 1 && (
        <mesh position={[config.length / 2, -0.3, 0]}>
          <boxGeometry args={[config.length + 20, 0.2, 40]} />
          <meshToonMaterial color="#B3E5FC" transparent opacity={0.3} />
        </mesh>
      )}

      {trees.map((tree, i) => (
        <group key={i} position={[tree.x, 0, tree.z]} scale={tree.scale}>
          <mesh position={[0, 0.8, 0]}>
            <coneGeometry args={[0.5, 1.6, 6]} />
            <meshToonMaterial color="#81C784" />
          </mesh>
          <mesh position={[0, 1.8, 0]}>
            <coneGeometry args={[0.4, 1.2, 6]} />
            <meshToonMaterial color="#66BB6A" />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.1, 0.15, 0.5, 6]} />
            <meshToonMaterial color="#8D6E63" />
          </mesh>
          <mesh position={[0, 2.2, 0]}>
            <coneGeometry args={[0.3, 0.8, 6]} />
            <meshToonMaterial color="#4CAF50" />
          </mesh>
          <mesh position={[0, 0.6, 0]}>
            <sphereGeometry args={[0.55, 6, 4]} />
            <meshToonMaterial color="#FFFFFF" transparent opacity={0.4} />
          </mesh>
        </group>
      ))}

      {icebergs.map((berg, i) => (
        <mesh key={i} position={[berg.x, berg.scale * 0.3, berg.z]} rotation={[0, berg.rotation, 0]}>
          <dodecahedronGeometry args={[berg.scale, 0]} />
          <meshToonMaterial color="#E3F2FD" transparent opacity={0.7} />
        </mesh>
      ))}

      {level === 3 && (
        <group position={[config.length - 8, 0, 0]}>
          <mesh position={[0, 3, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 6, 8]} />
            <meshToonMaterial color="#F44336" />
          </mesh>
          <mesh position={[0, 6, 0]}>
            <sphereGeometry args={[0.5, 8, 8]} />
            <meshToonMaterial color="#F44336" />
          </mesh>

          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[3, 1, 3]} />
            <meshToonMaterial color="#ECEFF1" />
          </mesh>
        </group>
      )}
    </group>
  );
}
