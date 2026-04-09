import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Snowflakes({ count = 200 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 100,
      y: Math.random() * 30,
      z: (Math.random() - 0.5) * 20,
      speed: 0.01 + Math.random() * 0.03,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.5 + Math.random() * 1.5,
    }));
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    particles.forEach((p, i) => {
      p.y -= p.speed;
      if (p.y < -2) {
        p.y = 30;
        p.x = (Math.random() - 0.5) * 100 + (state.camera.position.x || 0);
      }

      dummy.position.set(
        p.x + Math.sin(t * p.wobbleSpeed + p.wobble) * 0.5,
        p.y,
        p.z
      );
      dummy.scale.setScalar(0.05 + Math.random() * 0.02);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#FFFFFF" transparent opacity={0.8} />
    </instancedMesh>
  );
}
