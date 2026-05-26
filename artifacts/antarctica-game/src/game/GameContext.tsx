import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import { MAX_HEALTH, MAX_HUNGER, MAX_ENERGY, ENERGY_DRAIN_PER_KM, HUNGER_DRAIN_RATE, HEALTH_DRAIN_WHEN_HUNGRY, SHOP_ITEMS } from './constants';

export type GameScreen = 'menu' | 'playing' | 'gameover' | 'victory' | 'levelComplete' | 'shop';

interface GameState {
  screen: GameScreen;
  health: number;
  hunger: number;
  energy: number;
  level: number;
  distance: number;
  uniformColor: string;
  hasATV: boolean;
  hasSpeedBoost: boolean;
  hasShield: boolean;
  hasHeatPack: boolean;
  speedBoostActive: boolean;
  shieldActive: boolean;
  heatPackActive: boolean;
  coins: number;
  score: number;
  purchasedItems: Set<string>;
  unlockedUniforms: Set<string>;
}

interface ShopItem {
  id: string;
  name: string;
  price: number;
  effect: string;
  value: number;
  icon: string;
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
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  purchaseItem: (item: ShopItem) => boolean;
  useItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
  isUniformUnlocked: (color: string) => boolean;
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
  hasSpeedBoost: false,
  hasShield: false,
  hasHeatPack: false,
  speedBoostActive: false,
  shieldActive: false,
  heatPackActive: false,
  coins: 0,
  score: 0,
  purchasedItems: new Set<string>(),
  unlockedUniforms: new Set<string>(['red', 'blue', 'pink']),
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
    const maxLevel = 5; // 6 levels total (0-5)
    if (cur.level >= maxLevel) {
      updateRef({ ...cur, screen: 'victory' });
    } else {
      updateRef({
        ...cur,
        level: cur.level + 1,
        distance: 0,
        hasATV: false,
        hasSpeedBoost: false,
        speedBoostActive: false,
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

  const addCoins = useCallback((amount: number) => {
    const cur = gameStateRef.current;
    updateRef({ ...cur, coins: cur.coins + amount });
  }, [updateRef]);

  const spendCoins = useCallback((amount: number): boolean => {
    const cur = gameStateRef.current;
    if (cur.coins < amount) return false;
    updateRef({ ...cur, coins: cur.coins - amount });
    return true;
  }, [updateRef]);

  const purchaseItem = useCallback((item: ShopItem): boolean => {
    const cur = gameStateRef.current;
    if (cur.coins < item.price) return false;
    if (cur.purchasedItems.has(item.id)) return false;

    const newPurchased = new Set(cur.purchasedItems);
    newPurchased.add(item.id);

    // Handle cosmetic unlocks (uniforms)
    if (item.effect === 'cosmetic' && item.id.startsWith('uniform_')) {
      const color = item.id.replace('uniform_', '');
      const newUniforms = new Set(cur.unlockedUniforms);
      newUniforms.add(color);
      updateRef({
        ...cur,
        coins: cur.coins - item.price,
        purchasedItems: newPurchased,
        unlockedUniforms: newUniforms,
      });
      return true;
    }

    updateRef({
      ...cur,
      coins: cur.coins - item.price,
      purchasedItems: newPurchased,
    });
    return true;
  }, [updateRef]);

  const useItem = useCallback((itemId: string) => {
    const cur = gameStateRef.current;
    if (!cur.purchasedItems.has(itemId)) return;

    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    const newPurchased = new Set(cur.purchasedItems);
    newPurchased.delete(itemId);

    let updates: Partial<GameState> = { purchasedItems: newPurchased };

    switch (item.effect) {
      case 'health_boost':
        updates.health = Math.min(MAX_HEALTH, cur.health + item.value);
        break;
      case 'energy_boost':
        updates.energy = Math.min(MAX_ENERGY, cur.energy + item.value);
        break;
      case 'hunger_boost':
        updates.hunger = Math.min(MAX_HUNGER, cur.hunger + item.value);
        break;
      case 'speed_boost':
        updates.hasSpeedBoost = true;
        updates.speedBoostActive = true;
        break;
      case 'shield':
        updates.hasShield = true;
        updates.shieldActive = true;
        break;
      case 'heat_pack':
        updates.hasHeatPack = true;
        updates.heatPackActive = true;
        break;
    }

    updateRef({ ...cur, ...updates });
  }, [updateRef]);

  const hasItem = useCallback((itemId: string): boolean => {
    return gameStateRef.current.purchasedItems.has(itemId);
  }, []);

  const isUniformUnlocked = useCallback((color: string): boolean => {
    return gameStateRef.current.unlockedUniforms.has(color);
  }, []);

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
        addCoins,
        spendCoins,
        purchaseItem,
        useItem,
        hasItem,
        isUniformUnlocked,
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
