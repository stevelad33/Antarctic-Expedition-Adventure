import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CampProps {
  position: [number, number, number];
  visited: boolean;
  type: 'rest' | 'atv';
}

export default function Camp({ position, visited, type }: CampProps) {
  const flagRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (flagRef.current) {
      flagRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const tentColor = type === 'atv' ? '#FF6F00' : '#43A047';
  const glowColor = visited ? '#666666' : (type === 'atv' ? '#FFAB00' : '#66BB6A');

  return (
    <group position={position}>
      <mesh position={[0, 1.2, 0]}>
        <coneGeometry args={[1.8, 2.0, 4]} />
        <meshToonMaterial color={tentColor} />
      </mesh>

      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[3.0, 0.3, 3.0]} />
        <meshToonMaterial color="#795548" />
      </mesh>

      <mesh position={[0, 0.0, 1.0]}>
        <boxGeometry args={[0.8, 1.2, 0.1]} />
        <meshToonMaterial color="#5D4037" />
      </mesh>

      <mesh position={[2.0, 1.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 3, 6]} />
        <meshToonMaterial color="#8D6E63" />
      </mesh>

      <mesh ref={flagRef} position={[2.0, 2.8, 0.3]}>
        <boxGeometry args={[0.02, 0.5, 0.6]} />
        <meshToonMaterial color={type === 'atv' ? '#FF6F00' : '#E53935'} />
      </mesh>

      {!visited && (
        <mesh position={[0, 3.0, 0]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshToonMaterial color={glowColor} emissive={glowColor} emissiveIntensity={0.5} />
        </mesh>
      )}

      {type === 'atv' && !visited && (
        <group position={[-1.5, 0.5, 1.5]}>
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[1.2, 0.35, 0.8]} />
            <meshToonMaterial color="#FF6F00" />
          </mesh>
          <mesh position={[-0.4, 0.0, 0.4]}>
            <cylinderGeometry args={[0.18, 0.18, 0.12, 8]} />
            <meshToonMaterial color="#333" />
          </mesh>
          <mesh position={[0.4, 0.0, 0.4]}>
            <cylinderGeometry args={[0.18, 0.18, 0.12, 8]} />
            <meshToonMaterial color="#333" />
          </mesh>
          <mesh position={[0, 0.45, -0.1]}>
            <boxGeometry args={[0.25, 0.4, 0.08]} />
            <meshToonMaterial color="#FF8F00" />
          </mesh>
        </group>
      )}

      {visited && (
        <mesh position={[0, 0.4, 1.4]}>
          <boxGeometry args={[1.2, 0.3, 0.05]} />
          <meshToonMaterial color="#F44336" />
        </mesh>
      )}
    </group>
  );
}
