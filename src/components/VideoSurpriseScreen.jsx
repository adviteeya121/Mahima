import { useState, useRef, useEffect } from 'react';
import { CONFIG } from '../data/config';

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
    animation: 'fadeIn 0.8s ease both',
    overflowY: 'auto',
  },
  outerCard: {
    background: 'rgba(255,255,255,0.88)',
    backdropFilter: 'blur(22px)',
    borderRadius: '32px',
    padding: 'clamp(1.5rem, 4vw, 2.8rem) clamp(1.2rem, 3vw, 2.5rem)',
    maxWidth: '620px',
    width: '100%',
    boxShadow: '0 20px 72px rgba(233,30,99,0.2)',
    border: '2px solid rgba(244,143,177,0.45)',
    animation: 'fadeInUp 0.9s cubic-bezier(0.22,1,0.36,1) both',
    textAlign: 'center',
  },
  introMsg: {
    fontFamily: "'Dancing Script', cursive",
    fontSize: 'clamp(1.7rem, 5vw, 2.4rem)',
    color: '#e91e63',
    marginBottom: '0.5rem',
  },
  subMsg: {
    fontFamily: "'Nunito', sans-serif",
    fontSize: 'clamp(0.92rem, 2.6vw, 1.05rem)',
    color: '#7b3f6e',
    lineHeight: 1.75,
    marginBottom: '1.8rem',
  },
  videoWrapper: {
    position: 'relative',
    borderRadius: '20px',
    overflow: 'hidden',
    background: '#fce4ec',
    border: '2.5px solid rgba(244,143,177,0.6)',
    animation: 'glowPulse 3s ease-in-out infinite',
    marginBottom: '1.6rem',
  },
  video: {
    width: '100%',
    display: 'block',
    borderRadius: '17px',
    maxHeight: '420px',
    objectFit: 'contain',
    background: '#000',
  },
  placeholder: {
    padding: '3.5rem 2rem',
    textAlign: 'center',
  },
  placeholderIcon: {
    fontSize: '4rem',
    display: 'block',
    marginBottom: '1rem',
    animation: 'floatHeart 2.5s ease-in-out infinite',
  },
  placeholderTitle: {
    fontFamily: "'Dancing Script', cursive",
    fontSize: '1.7rem',
    color: '#e91e63',
    marginBottom: '0.7rem',
  },
  placeholderText: {
    fontFamily: "'Nunito', sans-serif",
    color: '#7b3f6e',
    lineHeight: 1.7,
    fontSize: '0.95rem',
  },
  code: {
    display: 'inline-block',
    background: '#fce4ec',
    color: '#c2185b',
    fontFamily: 'monospace',
    fontSize: '0.88rem',
    padding: '0.15rem 0.5rem',
    borderRadius: '6px',
    marginTop: '0.4rem',
  },
  closingMsg: {
    fontFamily: "'Nunito', sans-serif",
    fontSize: 'clamp(0.92rem, 2.5vw, 1.02rem)',
    color: '#7b3f6e',
    lineHeight: 1.8,
    marginBottom: '1.8rem',
    padding: '1.1rem 1.2rem',
    background: 'linear-gradient(135deg, rgba(252,228,236,0.6), rgba(243,229,245,0.6))',
    borderRadius: '16px',
    border: '1px solid rgba(244,143,177,0.3)',
    fontStyle: 'italic',
  },
  hugBtn: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #e91e63, #f48fb1)',
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
    marginBottom: '1rem',
  },
  hugMessage: {
    fontFamily: "'Dancing Script', cursive",
    fontSize: 'clamp(1.5rem, 4.5vw, 2.2rem)',
    color: '#e91e63',
    animation: 'hugPop 0.6s cubic-bezier(0.22,1,0.36,1) both',
    padding: '1rem',
    background: 'linear-gradient(135deg, #fce4ec, #f3e5f5)',
    borderRadius: '16px',
    border: '1px solid rgba(244,143,177,0.35)',
  },
};

// Auto-plays video 1 second after the screen appears
function VideoPlayer() {
  const [error, setError] = useState(false);
  const videoRef = useRef(null);

  // Auto-play after 1 s — works because the user has been clicking
  // throughout the question journey, satisfying browser autoplay policy
  useEffect(() => {
    const timer = setTimeout(() => {
      const video = videoRef.current;
      if (video && !error) {
        video.play().catch(() => {
          // Browser blocked autoplay — user can still press Play manually
        });
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [error]);

  return (
    <div style={styles.videoWrapper}>
      {!error ? (
        <video
          ref={videoRef}
          id="surprise-video"
          style={styles.video}
          controls
          playsInline
          preload="auto"
          poster={CONFIG.videoPosterPath}
          onError={() => setError(true)}
          aria-label="Special video surprise"
        >
          <source src={CONFIG.videoPath} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <div style={styles.placeholder}>
          <span style={styles.placeholderIcon} aria-hidden="true">🎬</span>
          <p style={styles.placeholderTitle}>Your Video Goes Here 🎥</p>
          <p style={styles.placeholderText}>
            To add your video, place your file at:
            <br />
            <span style={styles.code}>public/videos/our-special-video.mp4</span>
            <br /><br />
            Or update the path in:
            <br />
            <span style={styles.code}>src/data/config.js → videoPath</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default function VideoSurpriseScreen() {
  const [showHug, setShowHug] = useState(false);

  function handleHug() {
    setShowHug(true);
  }

  return (
    <div style={styles.screen}>
      <div style={styles.outerCard}>
        {/* Intro */}
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }} aria-hidden="true">💌</div>
        <h1 style={styles.introMsg}>{CONFIG.videoIntroMessage}</h1>
        <p style={styles.subMsg}>{CONFIG.videoSubMessage}</p>

        {/* Video */}
        <VideoPlayer />

        {/* Closing message */}
        <p style={styles.closingMsg}>{CONFIG.videoClosingMessage}</p>

        {/* Hug button */}
        {!showHug ? (
          <button
            id="hug-btn"
            style={styles.hugBtn}
            onClick={handleHug}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)';
              e.currentTarget.style.boxShadow = '0 14px 36px rgba(233,30,99,0.48)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 8px 28px rgba(233,30,99,0.38)';
            }}
            aria-label="Send a million hugs"
          >
            Send You a Million Hugs 🫂
          </button>
        ) : (
          <div
            style={styles.hugMessage}
            role="status"
            aria-live="polite"
          >
            Sending you the biggest virtual hug ever! 🫂💖
          </div>
        )}
      </div>
    </div>
  );
}
