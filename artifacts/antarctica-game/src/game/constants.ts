export const GRAVITY = -0.015;
export const JUMP_FORCE = 0.35;
export const MOVE_SPEED = 0.15;
export const ATV_SPEED = 0.3;
export const BOOST_SPEED = 0.25;

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
  green: '#43A047',
  orange: '#FB8C00',
  purple: '#8E24AA',
};

export const LEVEL_NAMES = [
  'Base Camp - McMurdo Station',
  'Ross Ice Shelf',
  'Transantarctic Mountains',
  'South Pole Station',
  'Pine Island Glacier',
  'Antarctic Volcanoes',
];

export const LEVEL_CONFIGS = [
  {
    length: 80,
    platformCount: 12,
    campPositions: [20, 50],
    obstacleCount: 3,
    coinCount: 8,
    backgroundColor: '#87CEEB',
    groundColor: '#E8F4FD',
    platformColor: '#B3E5FC',
    accentColor: '#4FC3F7',
    difficulty: 1,
  },
  {
    length: 100,
    platformCount: 15,
    campPositions: [30, 65],
    obstacleCount: 5,
    coinCount: 10,
    backgroundColor: '#B2EBF2',
    groundColor: '#E0F7FA',
    platformColor: '#80DEEA',
    accentColor: '#26C6DA',
    difficulty: 1.2,
  },
  {
    length: 120,
    platformCount: 18,
    campPositions: [35, 75],
    obstacleCount: 7,
    coinCount: 12,
    backgroundColor: '#C5CAE9',
    groundColor: '#E8EAF6',
    platformColor: '#9FA8DA',
    accentColor: '#7986CB',
    difficulty: 1.4,
  },
  {
    length: 140,
    platformCount: 20,
    campPositions: [40, 80],
    obstacleCount: 8,
    coinCount: 14,
    backgroundColor: '#D1C4E9',
    groundColor: '#EDE7F6',
    platformColor: '#B39DDB',
    accentColor: '#9575CD',
    difficulty: 1.6,
  },
  {
    length: 160,
    platformCount: 22,
    campPositions: [45, 95],
    obstacleCount: 10,
    coinCount: 16,
    backgroundColor: '#B3E5FC',
    groundColor: '#E1F5FE',
    platformColor: '#81D4FA',
    accentColor: '#4FC3F7',
    difficulty: 1.8,
  },
  {
    length: 180,
    platformCount: 25,
    campPositions: [50, 110],
    obstacleCount: 12,
    coinCount: 18,
    backgroundColor: '#FFCCBC',
    groundColor: '#FBE9E7',
    platformColor: '#FFAB91',
    accentColor: '#FF8A65',
    difficulty: 2.0,
  },
];

export const SHOP_ITEMS = [
  { id: 'health_pack', name: 'Health Pack', price: 50, effect: 'health_boost', value: 30, icon: '+' },
  { id: 'energy_drink', name: 'Energy Drink', price: 40, effect: 'energy_boost', value: 50, icon: '*' },
  { id: 'food_ration', name: 'Food Ration', price: 35, effect: 'hunger_boost', value: 40, icon: '~' },
  { id: 'speed_boost', name: 'Speed Skis', price: 100, effect: 'speed_boost', value: 10, icon: '>' },
  { id: 'shield', name: 'Cold Shield', price: 150, effect: 'shield', value: 1, icon: 'O' },
  { id: 'heat_pack', name: 'Heat Pack', price: 80, effect: 'heat_pack', value: 20, icon: 'H' },
  { id: 'uniform_green', name: 'Green Uniform', price: 200, effect: 'cosmetic', value: 0, icon: 'G' },
  { id: 'uniform_orange', name: 'Orange Uniform', price: 200, effect: 'cosmetic', value: 0, icon: 'O' },
  { id: 'uniform_purple', name: 'Purple Uniform', price: 300, effect: 'cosmetic', value: 0, icon: 'P' },
];

export const COIN_VALUE = 10;
