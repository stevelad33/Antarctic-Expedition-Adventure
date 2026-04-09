# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains an Antarctica Expedition 3D browser game.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Game**: React + Vite + Three.js (React Three Fiber + Drei)
- **3D Engine**: Three.js with React Three Fiber
- **Styling**: Inline styles with Fredoka One font

## Game: Expedition Antarctica

A 3D Roblox-style platformer where the player travels through 4 levels to reach the South Pole.

### Features
- **4 Levels**: Base Camp (McMurdo Station), Ross Ice Shelf, Transantarctic Mountains, South Pole Station
- **Stats System**: Health, Hunger, Energy bars - energy drains 5% per km
- **Camps**: Rest camps (restore stats) and ATV camps (faster movement)
- **Uniform Colors**: Red, Blue, Pink - selectable from main menu
- **3D Environment**: Roblox-style block characters, ice platforms, snow trees, icebergs, snowfall
- **Smartwings Airplane**: At the South Pole for the victory flight home
- **Mobile Controls**: Touch-friendly buttons for mobile play

### File Structure
- `artifacts/antarctica-game/src/game/` - Core game logic
  - `GameContext.tsx` - State management (health, hunger, energy, level, score)
  - `Player.tsx` - 3D player character with physics and controls
  - `Level.tsx` - Level generation (platforms, camps, environment)
  - `Camp.tsx` - Camp 3D models
  - `Airplane.tsx` - Smartwings airplane 3D model
  - `Environment.tsx` - Trees, icebergs, ground, South Pole marker
  - `Snowflakes.tsx` - Particle snow effect
  - `CameraFollow.tsx` - Camera tracking
  - `HUD.tsx` - Health/hunger/energy bars overlay
  - `MobileControls.tsx` - Touch controls for mobile
  - `constants.ts` - Game configuration
- `artifacts/antarctica-game/src/pages/Menu.tsx` - Main menu, level complete, game over, victory screens

## Key Commands

- `pnpm run typecheck` - full typecheck across all packages
- `pnpm run build` - typecheck + build all packages
- `pnpm --filter @workspace/antarctica-game run dev` - run game locally
