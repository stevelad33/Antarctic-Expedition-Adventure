import { GameProvider } from './game/GameContext';
import GameScene from './game/GameScene';
import Menu from './pages/Menu';

function App() {
  return (
    <GameProvider>
      <div style={{ width: '100%', height: '100vh', overflow: 'hidden', margin: 0, padding: 0 }}>
        <Menu />
        <GameScene />
      </div>
    </GameProvider>
  );
}

export default App;
