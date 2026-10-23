import { useEffect, useRef, useState } from 'react';
import { CONFIG } from '../data/config';

// Confetti piece
function ConfettiPiece({ color, x, delay, duration, size }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: `${x}%`,
        top: '-30px',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        background: color,
        opacity: 0.9,
        animation: `confettiFall ${duration}s ease-in ${delay}s both`,
        zIndex: 5,
        pointerEvents: 'none',
      }}
    />
  );
}

function Confetti() {
  const colors = ['#e91e63', '#f48fb1', '#ce93d8', '#fff176', '#80deea', '#ffcc80', '#f8bbd0'];
  const pieces = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    color: colors[Math.floor(Math.random() * colors.length)],
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2.5 + Math.random() * 2,
    size: 7 + Math.random() * 10,
  }));
  return (
    <>
      {pieces.map((p) => (
        <ConfettiPiece key={p.id} {...p} />
      ))}
    </>
  );
}

const styles = {
  screen: {
    position: 'relative',
    zIndex: 10,
    minHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 1.5rem 2rem',
    background: 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 50%, #fce4ec 100%)',
    animation: 'fadeIn 0.8s ease both',
    overflowY: 'auto',
  },
  card: {
    background: 'rgba(255,255,255,0.88)',
    backdropFilter: 'blur(20px)',
    borderRadius: '28px',
    padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1.2rem, 3vw, 2.5rem)',
    maxWidth: '560px',
    width: '100%',
    boxShadow: '0 20px 72px rgba(233,30,99,0.22)',
    textAlign: 'center',
    border: '1.5px solid rgba(244,143,177,0.45)',
    animation: 'bounceIn 0.7s cubic-bezier(0.22,1,0.36,1) both',
  },
  bigHeart: {
    fontSize: '5.5rem',
    display: 'block',
    margin: '0 auto 1.5rem',
    animation: 'celebHeartGrow 0.8s cubic-bezier(0.22,1,0.36,1) both, floatHeart 3s ease-in-out 1s infinite',
    filter: 'drop-shadow(0 6px 24px rgba(233,30,99,0.4))',
    userSelect: 'none',
  },
  heading: {
    fontFamily: "'Dancing Script', cursive",
    fontSize: 'clamp(2.2rem, 6.5vw, 3.2rem)',
    color: '#e91e63',
    marginBottom: '1rem',
    lineHeight: 1.15,
  },
  subtitle: {
    fontFamily: "'Nunito', sans-serif",
    fontSize: 'clamp(0.95rem, 2.8vw, 1.1rem)',
    color: '#7b3f6e',
    lineHeight: 1.75,
    marginBottom: '2.2rem',
  },
  btn: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #e91e63, #ce93d8)',
    color: '#fff',
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 700,
    fontSize: '1.08rem',
    border: 'none',
    borderRadius: '50px',
    padding: '0.9rem 2.4rem',
    cursor: 'pointer',
    boxShadow: '0 8px 28px rgba(233,30,99,0.38)',
    transition: 'transform 0.18s, box-shadow 0.18s',
    letterSpacing: '0.02em',
  },
  floatingEmojis: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.6rem',
    fontSize: '1.8rem',
    marginBottom: '1.2rem',
    animation: 'fadeInUp 0.8s ease 0.3s both',
  },
};

const floatingEmojis = ['🌸','💖','🌷','✨','💍','🎉','🥹','❤️'];

export default function CelebrationScreen({ onSurprise }) {
  return (
    <div style={styles.screen}>
      <Confetti />

      <div style={styles.card}>
        <span style={styles.bigHeart} aria-hidden="true">❤️</span>

        <div style={styles.floatingEmojis} aria-hidden="true">
          {floatingEmojis.map((e, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.08}s`, animation: 'wiggle 1.4s ease infinite' }}>
              {e}
            </span>
          ))}
        </div>

        <h1 style={styles.heading}>{CONFIG.celebrationHeading}</h1>

        <p style={styles.subtitle}>{CONFIG.celebrationSubtitle}</p>

        <button
          id="surprise-btn"
          style={styles.btn}
          onClick={onSurprise}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)';
            e.currentTarget.style.boxShadow = '0 14px 36px rgba(233,30,99,0.48)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '0 8px 28px rgba(233,30,99,0.38)';
          }}
          aria-label="See one last surprise"
        >
          One Last Surprise 🎁
        </button>
      </div>
    </div>
  );
}
