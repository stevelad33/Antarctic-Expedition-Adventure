import { useMemo } from 'react';
import { LEVEL_CONFIGS } from './constants';

interface EnvironmentProps {
  level: number;
  path: Array<{ x: number; z: number }>;
}

export default function Environment({ level, path }: EnvironmentProps) {
  const config = LEVEL_CONFIGS[level];

  const trees = useMemo(() => {
    const items = [];
    const spread = 60;
    for (let i = 0; i < 50; i++) {
      const angle = (i / 50) * Math.PI * 2;
      const dist = 20 + Math.random() * spread;
      const cx = path[Math.floor(Math.random() * path.length)];
      items.push({
        x: (cx?.x ?? 0) + Math.cos(angle) * dist,
        z: (cx?.z ?? 0) + Math.sin(angle) * dist,
        scale: 0.6 + Math.random() * 1.4,
      });
    }
    return items;
  }, [path]);

  const icebergs = useMemo(() => {
    return Array.from({ length: 12 }, () => {
      const pt = path[Math.floor(Math.random() * path.length)];
      const angle = Math.random() * Math.PI * 2;
      const dist = 15 + Math.random() * 30;
      return {
        x: (pt?.x ?? 0) + Math.cos(angle) * dist,
        z: (pt?.z ?? 0) + Math.sin(angle) * dist,
        scale: 1.2 + Math.random() * 2.5,
        rotation: Math.random() * Math.PI,
      };
    });
  }, [path]);

  return (
    <group>
      {/* Snow-dusted trees */}
      {trees.map((tree, i) => (
        <group key={i} position={[tree.x, 0, tree.z]} scale={tree.scale}>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.12, 0.18, 0.5, 6]} />
            <meshToonMaterial color="#8D6E63" />
          </mesh>
          <mesh position={[0, 0.9, 0]}>
            <coneGeometry args={[0.55, 1.6, 6]} />
            <meshToonMaterial color="#66BB6A" />
          </mesh>
          <mesh position={[0, 1.9, 0]}>
            <coneGeometry args={[0.42, 1.2, 6]} />
            <meshToonMaterial color="#4CAF50" />
          </mesh>
          <mesh position={[0, 2.7, 0]}>
            <coneGeometry args={[0.3, 0.8, 6]} />
            <meshToonMaterial color="#388E3C" />
          </mesh>
          {/* Snow on top */}
          <mesh position={[0, 0.7, 0]}>
            <sphereGeometry args={[0.58, 6, 4]} />
            <meshToonMaterial color="#FFFFFF" transparent opacity={0.35} />
          </mesh>
          <mesh position={[0, 2.85, 0]}>
            <sphereGeometry args={[0.35, 6, 4]} />
            <meshToonMaterial color="#FFFFFF" transparent opacity={0.45} />
          </mesh>
        </group>
      ))}

      {/* Icebergs */}
      {icebergs.map((berg, i) => (
        <mesh
          key={i}
          position={[berg.x, berg.scale * 0.3, berg.z]}
          rotation={[0.1, berg.rotation, 0.05]}
        >
          <dodecahedronGeometry args={[berg.scale, 0]} />
          <meshToonMaterial color="#E3F2FD" transparent opacity={0.75} />
        </mesh>
      ))}

      {/* Distant mountains */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const dist = 90 + Math.random() * 20;
        return (
          <mesh key={`mtn-${i}`} position={[Math.cos(angle) * dist, 0, Math.sin(angle) * dist]}>
            <coneGeometry args={[12 + Math.random() * 8, 30 + Math.random() * 20, 5]} />
            <meshToonMaterial color={level >= 2 ? '#B0BEC5' : '#CFD8DC'} />
          </mesh>
        );
      })}

      {/* South Pole marker (level 3 only) */}
      {level === 3 && (
        <group position={[path[path.length - 1].x, 0, path[path.length - 1].z]}>
          <mesh position={[0, 2, 0]}>
            <boxGeometry args={[5, 1.5, 5]} />
            <meshToonMaterial color="#ECEFF1" />
          </mesh>
        </group>
      )}
    </group>
  );
}
