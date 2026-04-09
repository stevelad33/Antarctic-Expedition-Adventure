import { useFrame, useThree } from '@react-three/fiber';
import { MutableRefObject, useRef } from 'react';
import * as THREE from 'three';

interface CameraFollowProps {
  playerRef: MutableRefObject<THREE.Group | null>;
  facingAngleRef: MutableRefObject<number>;
}

const CAM_DIST = 12;
const CAM_HEIGHT = 7;
const CAM_LAG = 0.06;

export default function CameraFollow({ playerRef, facingAngleRef }: CameraFollowProps) {
  const { camera } = useThree();
  const camTarget = useRef(new THREE.Vector3(0, 6, 12));
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    if (!playerRef.current) return;

    const pos = playerRef.current.position;
    const angle = facingAngleRef.current;

    // Camera stays behind the player based on their facing angle
    const camX = pos.x - Math.sin(angle) * CAM_DIST;
    const camY = pos.y + CAM_HEIGHT;
    const camZ = pos.z - Math.cos(angle) * CAM_DIST;

    camTarget.current.set(camX, camY, camZ);
    camera.position.lerp(camTarget.current, CAM_LAG);

    // Look slightly ahead of player
    lookTarget.current.set(
      pos.x + Math.sin(angle) * 2,
      pos.y + 1.5,
      pos.z + Math.cos(angle) * 2
    );
    camera.lookAt(lookTarget.current);
  });

  return null;
}
