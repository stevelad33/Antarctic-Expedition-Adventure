import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface CameraFollowProps {
  playerRef?: React.RefObject<THREE.Group | null>;
}

export default function CameraFollow(_props: CameraFollowProps) {
  const { scene } = useThree();
  const targetPos = useRef(new THREE.Vector3(5, 5, 15));

  useFrame(({ camera }) => {
    const player = scene.children.find(child => {
      if (child.type === 'Group') {
        const hasBoxChild = child.children.some(c => c.type === 'Mesh');
        const pos = child.position;
        return hasBoxChild && pos.y > -5 && pos.y < 50;
      }
      return false;
    });

    if (player) {
      targetPos.current.set(
        player.position.x + 3,
        player.position.y + 6,
        15
      );

      camera.position.lerp(targetPos.current, 0.05);
      camera.lookAt(player.position.x + 2, player.position.y + 1, 0);
    }
  });

  return null;
}
