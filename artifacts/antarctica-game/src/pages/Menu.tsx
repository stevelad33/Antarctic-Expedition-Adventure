import { useGame } from '../game/GameContext';
import { UNIFORM_COLORS, LEVEL_NAMES, SHOP_ITEMS } from '../game/constants';

export default function Menu() {
  const {
    screen,
    uniformColor,
    setUniformColor,
    startGame,
    nextLevel,
    restartGame,
    score,
    level,
    coins,
    purchaseItem,
    useItem,
    hasItem,
    isUniformUnlocked,
    setScreen,
  } = useGame();

  if (screen === 'playing') return null;

  const handlePurchase = (item: typeof SHOP_ITEMS[0]) => {
    purchaseItem(item);
  };

  const handleUseItem = (itemId: string) => {
    useItem(itemId);
  };

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: screen === 'gameover'
        ? 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)'
        : screen === 'victory'
          ? 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #43a047 100%)'
          : 'linear-gradient(135deg, #0277BD 0%, #0288D1 30%, #039BE5 60%, #03A9F4 100%)',
      fontFamily: "'Fredoka One', 'Comic Sans MS', cursive, sans-serif",
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
              background: 'rgba(255,255,255,0.3)',
              borderRadius: '50%',
              animation: `snowfall ${3 + Math.random() * 5}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes snowfall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

      <div style={{
        textAlign: 'center',
        padding: '40px',
        maxWidth: '500px',
        width: '90%',
      }}>
        {screen === 'menu' && (
          <>
            <div style={{
              fontSize: '48px',
              fontWeight: 900,
              color: '#FFFFFF',
              textShadow: '3px 3px 0 #01579B, -1px -1px 0 #01579B',
              marginBottom: '8px',
              animation: 'bounce 2s ease-in-out infinite',
              letterSpacing: '2px',
            }}>
              EXPEDITION
            </div>
            <div style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#B3E5FC',
              textShadow: '2px 2px 0 #01579B',
              marginBottom: '32px',
            }}>
              Antarctica
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '20px',
              padding: '20px',
              marginBottom: '24px',
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{ color: '#E1F5FE', fontSize: '14px', marginBottom: '12px', fontWeight: 600 }}>
                Choose Your Uniform
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                {Object.entries(UNIFORM_COLORS).map(([name, hex]) => (
                  <button
                    key={name}
                    onClick={() => setUniformColor(name)}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      background: hex,
                      border: uniformColor === name ? '4px solid #FFFFFF' : '4px solid transparent',
                      cursor: 'pointer',
                      transform: uniformColor === name ? 'scale(1.15)' : 'scale(1)',
                      transition: 'all 0.2s ease',
                      boxShadow: uniformColor === name ? `0 0 20px ${hex}80` : 'none',
                      position: 'relative',
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      bottom: '-22px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'capitalize',
                    }}>
                      {name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <button
                onClick={startGame}
                style={{
                  padding: '16px 32px',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  background: 'linear-gradient(180deg, #43A047 0%, #2E7D32 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  boxShadow: '0 6px 0 #1B5E20, 0 8px 20px rgba(0,0,0,0.3)',
                  letterSpacing: '2px',
                  animation: 'pulse 2s ease-in-out infinite',
                  fontFamily: 'inherit',
                }}
              >
                START EXPEDITION
              </button>
              <button
                onClick={() => setScreen('shop')}
                style={{
                  padding: '16px 32px',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  background: 'linear-gradient(180deg, #FFA726 0%, #F57C00 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  boxShadow: '0 6px 0 #E65100, 0 8px 20px rgba(0,0,0,0.3)',
                  letterSpacing: '2px',
                  fontFamily: 'inherit',
                }}
              >
                SHOP
              </button>
            </div>

            <div style={{
              background: 'rgba(255,215,0,0.2)',
              borderRadius: '12px',
              padding: '8px 16px',
              display: 'inline-block',
              marginBottom: '16px',
            }}>
              <span style={{ color: '#FFD700', fontSize: '20px', fontWeight: 700 }}>
                {coins} coins
              </span>
            </div>

            <div style={{
              marginTop: '24px',
              color: '#B3E5FC',
              fontSize: '12px',
              lineHeight: '1.8',
            }}>
              <div>Arrow keys / WASD to move</div>
              <div>SPACE to jump   |   E to delete obstacles</div>
              <div>Collect coins   |   Reach camps to rest</div>
              <div>6 levels to the South Pole!</div>
            </div>
          </>
        )}

        {screen === 'levelComplete' && level < 5 && (
          <>
            <div style={{
              fontSize: '36px',
              fontWeight: 900,
              color: '#FFD54F',
              textShadow: '3px 3px 0 #01579B',
              marginBottom: '16px',
              animation: 'bounce 1s ease-in-out infinite',
            }}>
              LEVEL COMPLETE!
            </div>
            <div style={{ color: '#E1F5FE', fontSize: '16px', marginBottom: '8px' }}>
              You completed: {LEVEL_NAMES[level]}
            </div>
            <div style={{ color: '#FFD54F', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
              Score: {score}   |   Coins: {coins}
            </div>
            <div style={{ color: '#B3E5FC', fontSize: '14px', marginBottom: '20px' }}>
              Next: {LEVEL_NAMES[level + 1]}
            </div>
            <button
              onClick={nextLevel}
              style={{
                padding: '14px 40px',
                fontSize: '20px',
                fontWeight: 800,
                color: '#FFFFFF',
                background: 'linear-gradient(180deg, #43A047 0%, #2E7D32 100%)',
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer',
                boxShadow: '0 6px 0 #1B5E20, 0 8px 20px rgba(0,0,0,0.3)',
                letterSpacing: '2px',
                fontFamily: 'inherit',
              }}
            >
              NEXT LEVEL
            </button>
          </>
        )}

        {screen === 'levelComplete' && level >= 5 && (
          <>
            <div style={{
              fontSize: '36px',
              fontWeight: 900,
              color: '#FFD54F',
              textShadow: '3px 3px 0 #01579B',
              marginBottom: '16px',
              animation: 'bounce 1s ease-in-out infinite',
            }}>
              LEVEL COMPLETE!
            </div>
            <div style={{ color: '#E1F5FE', fontSize: '16px', marginBottom: '8px' }}>
              You completed: {LEVEL_NAMES[level]}
            </div>
            <div style={{ color: '#FFD54F', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
              Score: {score}   |   Coins: {coins}
            </div>
            <button
              onClick={nextLevel}
              style={{
                padding: '14px 40px',
                fontSize: '20px',
                fontWeight: 800,
                color: '#FFFFFF',
                background: 'linear-gradient(180deg, #FFA726 0%, #F57C00 100%)',
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer',
                boxShadow: '0 6px 0 #E65100, 0 8px 20px rgba(0,0,0,0.3)',
                letterSpacing: '2px',
                fontFamily: 'inherit',
              }}
            >
              FLY HOME!
            </button>
          </>
        )}

        {screen === 'shop' && (
          <>
            <div style={{
              fontSize: '36px',
              fontWeight: 900,
              color: '#FFD54F',
              textShadow: '3px 3px 0 #E65100',
              marginBottom: '8px',
            }}>
              EXPEDITION SHOP
            </div>
            <div style={{
              color: '#FFD700',
              fontSize: '24px',
              fontWeight: 700,
              marginBottom: '24px',
            }}>
              {coins} coins
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              maxWidth: '450px',
              marginBottom: '24px',
            }}>
              {SHOP_ITEMS.map((item) => {
                const owned = hasItem(item.id);
                const canAfford = coins >= item.price;
                const isUnlocked = item.effect === 'cosmetic' ? isUniformUnlocked(item.id.replace('uniform_', '')) : false;
                const showOwned = owned || isUnlocked;

                return (
                  <div
                    key={item.id}
                    style={{
                      background: showOwned
                        ? 'rgba(67,160,71,0.3)'
                        : canAfford
                          ? 'rgba(255,255,255,0.15)'
                          : 'rgba(100,100,100,0.3)',
                      borderRadius: '12px',
                      padding: '12px',
                      cursor: showOwned ? 'default' : canAfford ? 'pointer' : 'not-allowed',
                      border: showOwned
                        ? '2px solid #43A047'
                        : canAfford
                          ? '2px solid rgba(255,255,255,0.3)'
                          : '2px solid transparent',
                      opacity: showOwned ? 0.8 : canAfford ? 1 : 0.6,
                    }}
                    onClick={() => !showOwned && canAfford && handlePurchase(item)}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px',
                    }}>
                      <span style={{ fontSize: '24px' }}>{item.icon}</span>
                      <span style={{
                        color: '#FFFFFF',
                        fontSize: '14px',
                        fontWeight: 700,
                        textAlign: 'left',
                      }}>
                        {item.name}
                      </span>
                    </div>
                    <div style={{
                      color: showOwned ? '#43A047' : '#FFD700',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}>
                      {showOwned ? 'OWNED' : `${item.price} coins`}
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setScreen('menu')}
              style={{
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: 800,
                color: '#FFFFFF',
                background: 'linear-gradient(180deg, #78909C 0%, #546E7A 100%)',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 4px 0 #37474F, 0 6px 16px rgba(0,0,0,0.3)',
                fontFamily: 'inherit',
              }}
            >
              BACK TO MENU
            </button>
          </>
        )}

        {screen === 'gameover' && (
          <>
            <div style={{
              fontSize: '42px',
              fontWeight: 900,
              color: '#EF5350',
              textShadow: '3px 3px 0 #1a237e',
              marginBottom: '16px',
            }}>
              EXPEDITION FAILED
            </div>
            <div style={{ color: '#C5CAE9', fontSize: '16px', marginBottom: '8px' }}>
              The cold was too much...
            </div>
            <div style={{ color: '#FFD54F', fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>
              Score: {score}
            </div>
            <button
              onClick={restartGame}
              style={{
                padding: '14px 40px',
                fontSize: '20px',
                fontWeight: 800,
                color: '#FFFFFF',
                background: 'linear-gradient(180deg, #42A5F5 0%, #1E88E5 100%)',
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer',
                boxShadow: '0 6px 0 #1565C0, 0 8px 20px rgba(0,0,0,0.3)',
                letterSpacing: '2px',
                fontFamily: 'inherit',
              }}
            >
              TRY AGAIN
            </button>
          </>
        )}

        {screen === 'victory' && (
          <>
            <div style={{
              fontSize: '42px',
              fontWeight: 900,
              color: '#FFD54F',
              textShadow: '3px 3px 0 #1b5e20',
              marginBottom: '16px',
              animation: 'bounce 1s ease-in-out infinite',
            }}>
              VICTORY!
            </div>
            <div style={{ color: '#C8E6C9', fontSize: '18px', marginBottom: '8px' }}>
              You reached the South Pole and flew back on the Smartwings plane!
            </div>
            <div style={{ color: '#FFD54F', fontSize: '28px', fontWeight: 700, marginBottom: '24px' }}>
              Final Score: {score}
            </div>
            <button
              onClick={restartGame}
              style={{
                padding: '14px 40px',
                fontSize: '20px',
                fontWeight: 800,
                color: '#FFFFFF',
                background: 'linear-gradient(180deg, #43A047 0%, #2E7D32 100%)',
                border: 'none',
                borderRadius: '16px',
                cursor: 'pointer',
                boxShadow: '0 6px 0 #1B5E20, 0 8px 20px rgba(0,0,0,0.3)',
                letterSpacing: '2px',
                fontFamily: 'inherit',
              }}
            >
              PLAY AGAIN
            </button>
          </>
        )}
      </div>
    </div>
  );
}
