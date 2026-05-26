import { useMemo } from 'react';
import { LEVEL_CONFIGS } from './constants';

interface EnvironmentProps {
  level: number;
  path: Array<{ x: number; z: number }>;
}

function Penguin({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Body */}
      <mesh position={[0, 0.4, 0]}>
        <capsuleGeometry args={[0.25, 0.5, 4, 8]} />
        <meshToonMaterial color="#1A1A1A" />
      </mesh>
      {/* Belly */}
      <mesh position={[0, 0.4, 0.18]}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshToonMaterial color="#FFFFFF" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshToonMaterial color="#1A1A1A" />
      </mesh>
      {/* Beak */}
      <mesh position={[0, 0.8, 0.22]}>
        <coneGeometry args={[0.06, 0.15, 4]} />
        <meshToonMaterial color="#FB8C00" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.08, 0.9, 0.18]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshToonMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.08, 0.9, 0.18]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshToonMaterial color="#FFFFFF" />
      </mesh>
      {/* Feet */}
      <mesh position={[-0.1, 0, 0.1]}>
        <boxGeometry args={[0.12, 0.03, 0.2]} />
        <meshToonMaterial color="#FB8C00" />
      </mesh>
      <mesh position={[0.1, 0, 0.1]}>
        <boxGeometry args={[0.12, 0.03, 0.2]} />
        <meshToonMaterial color="#FB8C00" />
      </mesh>
      {/* Flippers */}
      <mesh position={[-0.3, 0.45, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.08, 0.35, 0.15]} />
        <meshToonMaterial color="#1A1A1A" />
      </mesh>
      <mesh position={[0.3, 0.45, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.08, 0.35, 0.15]} />
        <meshToonMaterial color="#1A1A1A" />
      </mesh>
    </group>
  );
}

function Flag({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 3, 6]} />
        <meshToonMaterial color="#8D6E63" />
      </mesh>
      <mesh position={[0.3, 2.5, 0]}>
        <boxGeometry args={[0.6, 0.8, 0.02]} />
        <meshToonMaterial color={color} />
      </mesh>
      <mesh position={[0, 3.1, 0]}>
        <sphereGeometry args={[0.08, 6, 6]} />
        <meshToonMaterial color="#FFD54F" />
      </mesh>
    </group>
  );
}

function Crevass({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[8, 0.8, 1.5]} />
        <meshToonMaterial color="#1565C0" />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[8.2, 0.2, 1.7]} />
        <meshToonMaterial color="#1976D2" />
      </mesh>
      <mesh position={[-3.5, -0.5, 0]}>
        <sphereGeometry args={[0.3, 6, 6]} />
        <meshToonMaterial color="#0D47A1" />
      </mesh>
      <mesh position={[3.5, -0.5, 0]}>
        <sphereGeometry args={[0.3, 6, 6]} />
        <meshToonMaterial color="#0D47A1" />
      </mesh>
    </group>
  );
}

function ResearchStation({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Main building */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[6, 3, 5]} />
        <meshToonMaterial color="#ECEFF1" />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 3.3, 0]}>
        <boxGeometry args={[6.5, 0.4, 5.5]} />
        <meshToonMaterial color="#FF5722" />
      </mesh>
      {/* Antenna */}
      <mesh position={[2, 5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 3, 6]} />
        <meshToonMaterial color="#757575" />
      </mesh>
      <mesh position={[2, 6.7, 0]}>
        <sphereGeometry args={[0.2, 6, 6]} />
        <meshToonMaterial color="#F44336" />
      </mesh>
      {/* Windows */}
      <mesh position={[-2, 1.8, 2.51]}>
        <boxGeometry args={[0.8, 0.8, 0.05]} />
        <meshToonMaterial color="#81D4FA" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, 1.8, 2.51]}>
        <boxGeometry args={[0.8, 0.8, 0.05]} />
        <meshToonMaterial color="#81D4FA" transparent opacity={0.7} />
      </mesh>
      <mesh position={[2, 1.8, 2.51]}>
        <boxGeometry args={[0.8, 0.8, 0.05]} />
        <meshToonMaterial color="#81D4FA" transparent opacity={0.7} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.75, 2.51]}>
        <boxGeometry args={[1, 1.5, 0.05]} />
        <meshToonMaterial color="#5D4037" />
      </mesh>
    </group>
  );
}

function IceCrystal({ position, scale }: { position: [number, number, number]; scale: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh rotation={[0.2, 0.5, 0.1]}>
        <octahedronGeometry args={[0.8, 0]} />
        <meshToonMaterial color="#B3E5FC" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0.3, 0.5, 0.2]} rotation={[0.3, 0.8, 0.2]}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshToonMaterial color="#E1F5FE" transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

function VolcanicVent({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]}>
        <coneGeometry args={[1.5, 2, 8]} />
        <meshToonMaterial color="#5D4037" />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.3, 0.6, 1, 8]} />
        <meshToonMaterial color="#3E2723" />
      </mesh>
      {/* Steam effect */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshToonMaterial color="#BDBDBD" transparent opacity={0.4} />
      </mesh>
    </group>
  );
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

  const penguins = useMemo(() => {
    const count = level >= 2 ? 4 + level : 3;
    return Array.from({ length: count }, () => {
      const pt = path[Math.floor(Math.random() * path.length)];
      return {
        x: (pt?.x ?? 0) + (Math.random() - 0.5) * 10,
        z: (pt?.z ?? 0) + (Math.random() - 0.5) * 10,
      };
    });
  }, [path, level]);

  const flags = useMemo(() => {
    const flagColors = ['#E53935', '#1E88E5', '#43A047', '#FB8C00', '#8E24AA'];
    return Array.from({ length: 6 + level * 2 }, (_, i) => {
      const pt = path[Math.floor(i * (path.length / (6 + level * 2)))];
      return {
        x: (pt?.x ?? 0) + (Math.random() - 0.5) * 8,
        z: (pt?.z ?? 0) + (Math.random() - 0.5) * 8,
        color: flagColors[i % flagColors.length],
      };
    });
  }, [path, level]);

  const crevasses = useMemo(() => {
    if (level < 2) return [];
    return Array.from({ length: 3 + level }, () => {
      const pt = path[Math.floor(Math.random() * path.length)];
      return {
        x: (pt?.x ?? 0) + (Math.random() - 0.5) * 15,
        z: (pt?.z ?? 0) + (Math.random() - 0.5) * 15,
        rotation: Math.random() * Math.PI,
      };
    });
  }, [path, level]);

  const crystals = useMemo(() => {
    return Array.from({ length: 8 + level * 2 }, () => {
      const pt = path[Math.floor(Math.random() * path.length)];
      return {
        x: (pt?.x ?? 0) + (Math.random() - 0.5) * 12,
        z: (pt?.z ?? 0) + (Math.random() - 0.5) * 12,
        scale: 0.5 + Math.random() * 0.8,
      };
    });
  }, [path, level]);

  const volcanicVents = useMemo(() => {
    if (level < 5) return [];
    return Array.from({ length: 3 + level }, () => {
      const pt = path[Math.floor(Math.random() * path.length)];
      return {
        x: (pt?.x ?? 0) + (Math.random() - 0.5) * 20,
        z: (pt?.z ?? 0) + (Math.random() - 0.5) * 20,
      };
    });
  }, [path, level]);

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
          key={berg.i}
          position={[berg.x, berg.scale * 0.3, berg.z]}
          rotation={[0.1, berg.rotation, 0.05]}
        >
          <dodecahedronGeometry args={[berg.scale, 0]} />
          <meshToonMaterial color="#E3F2FD" transparent opacity={0.75} />
        </mesh>
      ))}

      {/* Penguins (level 2+) */}
      {penguins.map((penguin, i) => (
        <Penguin key={`penguin-${i}`} position={[penguin.x, 0, penguin.z]} />
      ))}

      {/* Flags */}
      {flags.map((flag, i) => (
        <Flag key={`flag-${i}`} position={[flag.x, 0, flag.z]} color={flag.color} />
      ))}

      {/* Crevasses (level 2+) */}
      {crevasses.map((crevass, i) => (
        <Crevass key={`crevass-${i}`} position={[crevass.x, 0, crevass.z]} rotation={crevass.rotation} />
      ))}

      {/* Ice crystals */}
      {crystals.map((crystal, i) => (
        <IceCrystal key={`crystal-${i}`} position={[crystal.x, 0.5, crystal.z]} scale={crystal.scale} />
      ))}

      {/* Volcanic vents (level 5+) */}
      {volcanicVents.map((vent, i) => (
        <VolcanicVent key={`vent-${i}`} position={[vent.x, 0, vent.z]} />
      ))}

      {/* Distant mountains */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const dist = 90 + Math.random() * 20;
        return (
          <mesh key={`mtn-${i}`} position={[Math.cos(angle) * dist, 0, Math.sin(angle) * dist]}>
            <coneGeometry args={[12 + Math.random() * 8, 30 + Math.random() * 20, 5]} />
            <meshToonMaterial color={level >= 4 ? '#FFAB91' : (level >= 2 ? '#B0BEC5' : '#CFD8DC')} />
          </mesh>
        );
      })}

      {/* South Pole marker (level 3) */}
      {level === 3 && path[path.length - 1] && (
        <group position={[path[path.length - 1].x, 0, path[path.length - 1].z]}>
          <mesh position={[0, 2, 0]}>
            <boxGeometry args={[5, 1.5, 5]} />
            <meshToonMaterial color="#ECEFF1" />
          </mesh>
        </group>
      )}

      {/* Research Station (level 4+) */}
      {level >= 4 && path[path.length - 1] && (
        <ResearchStation position={[path[path.length - 1].x - 10, 0, path[path.length - 1].z - 10]} />
      )}

      {/* Volcanic crater (level 5) */}
      {level === 5 && path[path.length - 1] && (
        <group position={[path[path.length - 1].x, 0, path[path.length - 1].z]}>
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[8, 12, 2, 16]} />
            <meshToonMaterial color="#3E2723" />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[6, 6, 0.5, 16]} />
            <meshToonMaterial color="#BF360C" emissive="#BF360C" emissiveIntensity={0.5} />
          </mesh>
        </group>
      )}
    </group>
  );
}
