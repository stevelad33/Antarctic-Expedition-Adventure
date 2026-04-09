import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AirplaneProps {
  position: [number, number, number];
  flying?: boolean;
}

export default function Airplane({ position, flying = false }: AirplaneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const propRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (propRef.current) {
      propRef.current.rotation.z += flying ? 0.5 : 0.05;
    }
    if (groupRef.current && flying) {
      groupRef.current.position.y += 0.02;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[5.0, 1.2, 1.4]} />
        <meshToonMaterial color="#FFFFFF" />
      </mesh>

      <mesh position={[2.2, 0.2, 0]}>
        <coneGeometry args={[0.7, 1.5, 4]} />
        <meshToonMaterial color="#E0E0E0" />
      </mesh>

      <mesh position={[-2.0, 0.7, 0]}>
        <boxGeometry args={[1.2, 1.0, 0.8]} />
        <meshToonMaterial color="#64B5F6" />
      </mesh>

      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.5, 0.1, 6.0]} />
        <meshToonMaterial color="#BDBDBD" />
      </mesh>

      <mesh position={[-2.2, 0.8, 0]}>
        <boxGeometry args={[0.5, 0.1, 2.5]} />
        <meshToonMaterial color="#BDBDBD" />
      </mesh>

      <mesh position={[-2.5, 1.2, 0]}>
        <boxGeometry args={[0.1, 1.2, 0.05]} />
        <meshToonMaterial color="#BDBDBD" />
      </mesh>

      <mesh position={[3.0, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.1, 0.2, 0.1]} />
        <meshToonMaterial color="#333" />
      </mesh>
      <mesh ref={propRef} position={[3.1, 0.2, 0]}>
        <boxGeometry args={[0.05, 1.5, 0.15]} />
        <meshToonMaterial color="#555" />
      </mesh>

      <mesh position={[1.5, -0.7, -0.8]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshToonMaterial color="#555" />
      </mesh>
      <mesh position={[1.5, -0.95, -0.8]}>
        <boxGeometry args={[0.6, 0.15, 0.2]} />
        <meshToonMaterial color="#333" />
      </mesh>
      <mesh position={[1.5, -0.7, 0.8]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshToonMaterial color="#555" />
      </mesh>
      <mesh position={[1.5, -0.95, 0.8]}>
        <boxGeometry args={[0.6, 0.15, 0.2]} />
        <meshToonMaterial color="#333" />
      </mesh>

      <mesh position={[-0.5, 0.35, 0.71]}>
        <boxGeometry args={[2.0, 0.5, 0.02]} />
        <meshToonMaterial color="#81D4FA" transparent opacity={0.5} />
      </mesh>
      <mesh position={[-0.5, 0.35, -0.71]}>
        <boxGeometry args={[2.0, 0.5, 0.02]} />
        <meshToonMaterial color="#81D4FA" transparent opacity={0.5} />
      </mesh>

      <group position={[0.5, 0.0, 0.75]}>
        <mesh>
          <boxGeometry args={[1.5, 0.04, 0.4]} />
          <meshToonMaterial color="#E53935" />
        </mesh>
      </group>
      <group position={[0.5, 0.0, -0.75]}>
        <mesh>
          <boxGeometry args={[1.5, 0.04, 0.4]} />
          <meshToonMaterial color="#E53935" />
        </mesh>
      </group>
    </group>
  );
}
