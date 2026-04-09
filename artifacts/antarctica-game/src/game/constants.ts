export const GRAVITY = -0.015;
export const JUMP_FORCE = 0.35;
export const MOVE_SPEED = 0.15;
export const ATV_SPEED = 0.3;

export const MAX_HEALTH = 100;
export const MAX_HUNGER = 100;
export const MAX_ENERGY = 100;

export const ENERGY_DRAIN_PER_KM = 5;
export const HUNGER_DRAIN_RATE = 0.02;
export const HEALTH_DRAIN_WHEN_HUNGRY = 0.01;

export const PLAYER_SIZE = { width: 0.8, height: 1.6, depth: 0.8 };

export const UNIFORM_COLORS: Record<string, string> = {
  red: '#E53935',
  blue: '#1E88E5',
  pink: '#EC407A',
};

export const LEVEL_NAMES = [
  'Base Camp - McMurdo Station',
  'Ross Ice Shelf',
  'Transantarctic Mountains',
  'South Pole Station',
];

export const LEVEL_CONFIGS = [
  {
    length: 80,
    platformCount: 12,
    campPositions: [20, 50],
    backgroundColor: '#87CEEB',
    groundColor: '#E8F4FD',
    platformColor: '#B3E5FC',
    accentColor: '#4FC3F7',
  },
  {
    length: 100,
    platformCount: 15,
    campPositions: [30, 65],
    backgroundColor: '#B2EBF2',
    groundColor: '#E0F7FA',
    platformColor: '#80DEEA',
    accentColor: '#26C6DA',
  },
  {
    length: 120,
    platformCount: 18,
    campPositions: [35, 75, 100],
    backgroundColor: '#C5CAE9',
    groundColor: '#E8EAF6',
    platformColor: '#9FA8DA',
    accentColor: '#7986CB',
  },
  {
    length: 140,
    platformCount: 20,
    campPositions: [40, 80, 110],
    backgroundColor: '#D1C4E9',
    groundColor: '#EDE7F6',
    platformColor: '#B39DDB',
    accentColor: '#9575CD',
  },
];
