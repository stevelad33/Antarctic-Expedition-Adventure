import { Canvas } from '@react-three/fiber';
import Level from './Level';
import HUD from './HUD';
import MobileControls from './MobileControls';
import { useGame } from './GameContext';

export default function GameScene() {
  const { screen } = useGame();

  if (screen !== 'playing') return null;

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Canvas
        camera={{ position: [5, 5, 15], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Level />
      </Canvas>
      <HUD />
      <MobileControls />
    </div>
  );
}
