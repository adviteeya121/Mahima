import { useState } from 'react';
import { CONFIG } from '../data/config';

const S = {
  screen: {
    position: 'relative',
    zIndex: 10,
    minHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 1.5rem 2rem',
    animation: 'fadeIn 0.8s ease both',
    overflowY: 'auto',
  },
  card: {
    background: 'rgba(255,255,255,0.88)',
    backdropFilter: 'blur(24px)',
    borderRadius: '36px',
    padding: 'clamp(2.2rem, 5vw, 4rem) clamp(2rem, 5vw, 4rem)',
    maxWidth: '660px',
    width: '100%',
    boxShadow:
      '0 24px 90px rgba(233,30,99,0.24), 0 0 0 1.5px rgba(255,255,255,0.7) inset',
    textAlign: 'center',
    border: '2px solid rgba(244,143,177,0.5)',
    animation:
      'fadeInUp 0.9s cubic-bezier(0.22,1,0.36,1) both, borderGlow 4s ease-in-out 1.5s infinite',
    position: 'relative',
    overflow: 'hidden',
  },
  // Gradient shimmer stripe inside card
  cardShine: {
    position: 'absolute',
    top: 0, left: '-100%',
    width: '60%', height: '100%',
    background:
      'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)',
    animation: 'shineSweep 4s ease-in-out 2s infinite',
    pointerEvents: 'none',
  },
  deco: {
    fontSize: '1.8rem',
    letterSpacing: '0.5rem',
    marginBottom: '1rem',
    opacity: 0.85,
  },
  heartContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.6rem',
    position: 'relative',
  },
  heart: {
    fontSize: '8rem',
    display: 'inline-block',
    filter: 'drop-shadow(0 8px 28px rgba(233,30,99,0.5))',
    cursor: 'default',
    userSelect: 'none',
  },
  // Orbiting mini hearts around big heart
  orbit1: {
    position: 'absolute',
    top: '50%', left: '50%',
    fontSize: '1.4rem',
    animation: 'orbit 4s linear infinite',
    transformOrigin: '0 0',
  },
  orbit2: {
    position: 'absolute',
    top: '50%', left: '50%',
    fontSize: '1rem',
    animation: 'orbit 5.5s linear 1.2s infinite reverse',
    transformOrigin: '0 0',
  },
  heading: {
    fontFamily: "'Dancing Script', cursive",
    fontSize: 'clamp(2.3rem, 6vw, 3.8rem)',
    color: '#e91e63',
    marginBottom: '1rem',
    lineHeight: 1.2,
    // shimmer text effect
    background: 'linear-gradient(90deg, #e91e63, #ce93d8, #e91e63)',
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: 'textShimmer 4s linear infinite',
  },
  subtitle: {
    fontFamily: "'Nunito', sans-serif",
    fontSize: 'clamp(1rem, 2.8vw, 1.22rem)',
    color: '#7b3f6e',
    lineHeight: 1.85,
    marginBottom: '2.4rem',
    maxWidth: '500px',
    margin: '0 auto 2.4rem',
  },
  btn: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #e91e63, #f48fb1)',
    color: '#fff',
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 700,
    fontSize: '1.12rem',
    border: 'none',
    borderRadius: '50px',
    padding: '1rem 2.8rem',
    cursor: 'pointer',
    boxShadow: '0 8px 30px rgba(233,30,99,0.42)',
    transition: 'transform 0.18s, box-shadow 0.18s',
    letterSpacing: '0.03em',
    animation: 'idleBounce 2.2s ease-in-out 1s infinite',
  },
  bottomDeco: {
    marginTop: '1.8rem',
    fontSize: '1.3rem',
    letterSpacing: '0.3rem',
    opacity: 0.5,
    animation: 'fadeIn 1s ease 0.8s both',
  },
};

export default function WelcomeScreen({ onStart }) {
  const [heartBounce, setHeartBounce] = useState(false);

  function handleStart() {
    setHeartBounce(true);
    setTimeout(() => {
      setHeartBounce(false);
      onStart();
    }, 600);
  }

  return (
    <div style={S.screen}>
      <div style={S.card}>
        {/* Shine stripe */}
        <div style={S.cardShine} aria-hidden="true" />

        {/* Top deco — animated sparkles */}
        <div style={S.deco} aria-hidden="true">
          <span style={{ animation: 'twinkle 1.6s ease infinite' }}>🌸</span>
          {' '}
          <span style={{ animation: 'twinkle 2s ease 0.4s infinite' }}>✨</span>
          {' '}
          <span style={{ animation: 'twinkle 1.8s ease 0.8s infinite' }}>🌷</span>
        </div>

        {/* Heart with orbiting mini hearts */}
        <div style={S.heartContainer}>
          {/* Orbiting hearts */}
          <span style={S.orbit1} aria-hidden="true">💕</span>
          <span style={S.orbit2} aria-hidden="true">✨</span>

          <span
            style={{
              ...S.heart,
              animation: heartBounce
                ? 'heartBeat 0.6s ease both'
                : 'floatHeart 3s ease-in-out infinite',
            }}
            aria-hidden="true"
          >
            💗
          </span>
        </div>

        {/* Heading with shimmer */}
        <h1 style={S.heading}>{CONFIG.welcomeHeading}</h1>

        <p style={S.subtitle}>{CONFIG.welcomeSubtitle}</p>

        <button
          id="welcome-start-btn"
          style={S.btn}
          onClick={handleStart}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.06)';
            e.currentTarget.style.boxShadow = '0 14px 40px rgba(233,30,99,0.54)';
            e.currentTarget.style.animation = 'none';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(233,30,99,0.42)';
            e.currentTarget.style.animation = 'idleBounce 2.2s ease-in-out 1s infinite';
          }}
          aria-label="Open your surprise"
        >
          Open Your Surprise 💌
        </button>

        <div style={S.bottomDeco} aria-hidden="true">💗 💗 💗</div>
      </div>
    </div>
  );
}
