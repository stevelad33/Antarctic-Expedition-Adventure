import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import { MAX_HEALTH, MAX_HUNGER, MAX_ENERGY, ENERGY_DRAIN_PER_KM, HUNGER_DRAIN_RATE, HEALTH_DRAIN_WHEN_HUNGRY } from './constants';

export type GameScreen = 'menu' | 'playing' | 'gameover' | 'victory' | 'levelComplete';

interface GameState {
  screen: GameScreen;
  health: number;
  hunger: number;
  energy: number;
  level: number;
  distance: number;
  uniformColor: string;
  hasATV: boolean;
  score: number;
}

interface GameContextType extends GameState {
  setScreen: (screen: GameScreen) => void;
  setUniformColor: (color: string) => void;
  startGame: () => void;
  nextLevel: () => void;
  restartGame: () => void;
  updateStats: (deltaDistance: number) => void;
  visitCamp: () => void;
  collectATV: () => void;
  takeDamage: (amount: number) => void;
  addScore: (amount: number) => void;
  gameStateRef: React.MutableRefObject<GameState>;
}

const initialState: GameState = {
  screen: 'menu',
  health: MAX_HEALTH,
  hunger: MAX_HUNGER,
  energy: MAX_ENERGY,
  level: 0,
  distance: 0,
  uniformColor: 'red',
  hasATV: false,
  score: 0,
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>({ ...initialState });
  const gameStateRef = useRef<GameState>(state);

  const updateRef = useCallback((newState: GameState) => {
    gameStateRef.current = newState;
    setState(newState);
  }, []);

  const setScreen = useCallback((screen: GameScreen) => {
    updateRef({ ...gameStateRef.current, screen });
  }, [updateRef]);

  const setUniformColor = useCallback((color: string) => {
    updateRef({ ...gameStateRef.current, uniformColor: color });
  }, [updateRef]);

  const startGame = useCallback(() => {
    const newState = {
      ...initialState,
      uniformColor: gameStateRef.current.uniformColor,
      screen: 'playing' as GameScreen,
    };
    updateRef(newState);
  }, [updateRef]);

  const nextLevel = useCallback(() => {
    const cur = gameStateRef.current;
    if (cur.level >= 3) {
      updateRef({ ...cur, screen: 'victory' });
    } else {
      updateRef({
        ...cur,
        level: cur.level + 1,
        distance: 0,
        hasATV: false,
        screen: 'playing',
      });
    }
  }, [updateRef]);

  const restartGame = useCallback(() => {
    const newState = {
      ...initialState,
      uniformColor: gameStateRef.current.uniformColor,
      screen: 'menu' as GameScreen,
    };
    updateRef(newState);
  }, [updateRef]);

  const updateStats = useCallback((deltaDistance: number) => {
    const cur = gameStateRef.current;
    if (cur.screen !== 'playing') return;

    const kmTraveled = deltaDistance / 10;
    let newEnergy = Math.max(0, cur.energy - kmTraveled * ENERGY_DRAIN_PER_KM);
    let newHunger = Math.max(0, cur.hunger - HUNGER_DRAIN_RATE);
    let newHealth = cur.health;

    if (newHunger <= 0) {
      newHealth = Math.max(0, newHealth - HEALTH_DRAIN_WHEN_HUNGRY);
    }
    if (newEnergy <= 0) {
      newHealth = Math.max(0, newHealth - 0.05);
    }

    const newState = {
      ...cur,
      energy: newEnergy,
      hunger: newHunger,
      health: newHealth,
      distance: cur.distance + deltaDistance,
    };

    if (newHealth <= 0) {
      newState.screen = 'gameover';
    }

    updateRef(newState);
  }, [updateRef]);

  const visitCamp = useCallback(() => {
    const cur = gameStateRef.current;
    updateRef({
      ...cur,
      health: MAX_HEALTH,
      hunger: MAX_HUNGER,
      energy: MAX_ENERGY,
      score: cur.score + 50,
    });
  }, [updateRef]);

  const collectATV = useCallback(() => {
    const cur = gameStateRef.current;
    updateRef({
      ...cur,
      hasATV: true,
      score: cur.score + 100,
    });
  }, [updateRef]);

  const takeDamage = useCallback((amount: number) => {
    const cur = gameStateRef.current;
    const newHealth = Math.max(0, cur.health - amount);
    const newState = { ...cur, health: newHealth };
    if (newHealth <= 0) {
      newState.screen = 'gameover';
    }
    updateRef(newState);
  }, [updateRef]);

  const addScore = useCallback((amount: number) => {
    const cur = gameStateRef.current;
    updateRef({ ...cur, score: cur.score + amount });
  }, [updateRef]);

  return (
    <GameContext.Provider
      value={{
        ...state,
        setScreen,
        setUniformColor,
        startGame,
        nextLevel,
        restartGame,
        updateStats,
        visitCamp,
        collectATV,
        takeDamage,
        addScore,
        gameStateRef,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
