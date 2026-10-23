import { useMemo } from 'react';
import '../styles/animations.css';

// ─── Floating ambient background layer ─────────────────────
export default function FloatingHearts({ count = 28 }) {
  // Two pools: slow drifters (large, subtle) + rising particles (small, frequent)
  const drifters = useMemo(() => {
    return Array.from({ length: Math.ceil(count * 0.55) }, (_, i) => ({
      id: `d-${i}`,
      symbol: ['💗', '🌸', '💕', '🌷', '✨', '💖', '⭐', '🫧'][i % 8],
      size: 18 + Math.random() * 24,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 7 + Math.random() * 9,
      opacity: 0.18 + Math.random() * 0.3,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const risers = useMemo(() => {
    return Array.from({ length: Math.floor(count * 0.45) }, (_, i) => ({
      id: `r-${i}`,
      symbol: ['❤️', '💗', '✨', '🌸', '💕', '💖'][i % 6],
      size: 12 + Math.random() * 14,
      left: Math.random() * 100,
      delay: Math.random() * 14,
      duration: 9 + Math.random() * 10,
      opacity: 0.25 + Math.random() * 0.35,
      drift: (Math.random() - 0.5) * 60, // horizontal drift while rising
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* Slow-drifting ambient pieces */}
      {drifters.map((item) => (
        <span
          key={item.id}
          style={{
            position: 'absolute',
            left: `${item.left}%`,
            top: `${item.top}%`,
            fontSize: `${item.size}px`,
            opacity: item.opacity,
            animation: `driftAround ${item.duration}s ease-in-out ${item.delay}s infinite`,
            userSelect: 'none',
            willChange: 'transform',
          }}
        >
          {item.symbol}
        </span>
      ))}

      {/* Rising particle stream — float up from the bottom */}
      {risers.map((item) => (
        <span
          key={item.id}
          style={{
            position: 'absolute',
            left: `${item.left}%`,
            bottom: '-40px',
            fontSize: `${item.size}px`,
            opacity: item.opacity,
            '--drift': `${item.drift}px`,
            animation: `riseUp ${item.duration}s ease-in-out ${item.delay}s infinite`,
            userSelect: 'none',
            willChange: 'transform, opacity',
          }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  );
}
