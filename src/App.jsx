import { useState, useEffect, useRef, useCallback } from 'react';
import './styles/global.css';
import './styles/animations.css';
import { CONFIG } from './data/config';
import FloatingHearts from './components/FloatingHearts';
import WelcomeScreen from './components/WelcomeScreen';
import QuestionScreen from './components/QuestionScreen';
import CelebrationScreen from './components/CelebrationScreen';
import VideoSurpriseScreen from './components/VideoSurpriseScreen';

// ─── Screens ────────────────────────────────────────────────
const SCREEN = {
  WELCOME: 'welcome',
  INTERSTITIAL: 'interstitial',
  QUESTION: 'question',
  CELEBRATION: 'celebration',
  VIDEO: 'video',
};

const MUSIC_SRC = '/music/background.mp3';

// ─── Music toggle button ─────────────────────────────────────
function MusicButton({ playing, onToggle }) {
  return (
    <button
      id="music-toggle-btn"
      onClick={onToggle}
      aria-label={playing ? 'Pause background music' : 'Play background music'}
      title={playing ? 'Pause music' : 'Play music'}
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 200,
        width: '46px',
        height: '46px',
        borderRadius: '50%',
        border: '2px solid rgba(244,143,177,0.55)',
        background: 'rgba(255,255,255,0.78)',
        backdropFilter: 'blur(10px)',
        cursor: 'pointer',
        fontSize: '1.2rem',
        boxShadow: playing
          ? '0 0 0 3px rgba(233,30,99,0.25), 0 4px 16px rgba(233,30,99,0.2)'
          : '0 4px 16px rgba(233,30,99,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.18s, box-shadow 0.22s',
        animation: playing ? 'heartBeat 1.8s ease-in-out infinite' : 'none',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.12)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = '')}
    >
      {playing ? '🎵' : '🎶'}
    </button>
  );
}

// ─── Interstitial ────────────────────────────────────────────
function InterstitialScreen({ text, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        animation: 'fadeIn 0.6s ease both',
      }}
    >
      <p
        style={{
          fontFamily: "'Dancing Script', cursive",
          fontSize: 'clamp(1.5rem, 4.5vw, 2.2rem)',
          color: '#e91e63',
          textAlign: 'center',
          lineHeight: 1.45,
          maxWidth: '480px',
          padding: '2rem 2.5rem',
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(18px)',
          borderRadius: '24px',
          boxShadow: '0 12px 48px rgba(233,30,99,0.14)',
          border: '1.5px solid rgba(244,143,177,0.38)',
          animation: 'bounceIn 0.5s cubic-bezier(0.22,1,0.36,1) both',
        }}
      >
        {text}
      </p>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]           = useState(SCREEN.WELCOME);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [musicPlaying, setMusicPlaying]   = useState(false);
  const audioRef = useRef(null);
  const total    = CONFIG.questions.length;

  // ── Auto-play music on page load (muted→unmute trick) ────────
  // Browsers always allow MUTED autoplay. We start muted, then
  // immediately unmute once playback begins — giving full volume
  // with zero user interaction required.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop   = true;
    audio.muted  = true;          // start muted so browser allows it
    audio.volume = 1.0;           // pre-set full volume

    audio.play()
      .then(() => {
        audio.muted = false;      // unmute instantly → full sound
        setMusicPlaying(true);
      })
      .catch(() => {
        // Extreme fallback (very old browsers): play on first tap
        const unlock = () => {
          audio.muted = false;
          audio.play()
            .then(() => setMusicPlaying(true))
            .catch(() => {});
        };
        document.addEventListener('click',      unlock, { once: true });
        document.addEventListener('touchstart', unlock, { once: true });
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Stop music when video screen appears ──────────────────────
  useEffect(() => {
    if (screen !== SCREEN.VIDEO) return;
    const audio = audioRef.current;
    if (!audio || audio.paused) return;

    // Smooth fade-out over 1.5 s then pause
    const step = 0.05;
    const interval = setInterval(() => {
      if (audio.volume > step) {
        audio.volume = Math.max(0, audio.volume - step);
      } else {
        audio.volume = 0;
        audio.pause();
        setMusicPlaying(false);
        clearInterval(interval);
      }
    }, 75);

    return () => clearInterval(interval);
  }, [screen]);

  // ── Toggle music via button ──────────────────────────────────
  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
    } else {
      audio.volume = 1.0;
      audio.loop   = true;
      audio.play()
        .then(() => setMusicPlaying(true))
        .catch(() => {});
    }
  }, [musicPlaying]);

  // Transition guard — prevents rapid double-clicks
  function safeTransition(fn) {
    if (transitioning) return;
    setTransitioning(true);
    fn();
    setTimeout(() => setTransitioning(false), 800);
  }

  // ── Screen handlers ──────────────────────────────────────────
  function handleWelcomeStart() {
    safeTransition(() => {
      if (CONFIG.interstitials.length > 0) {
        setScreen(SCREEN.INTERSTITIAL);
      } else {
        setScreen(SCREEN.QUESTION);
      }
    });
  }

  function handleInterstitialDone() {
    setScreen(SCREEN.QUESTION);
  }

  function handleYes() {
    safeTransition(() => {
      const nextIndex = questionIndex + 1;
      if (nextIndex >= total) {
        setScreen(SCREEN.CELEBRATION);
      } else {
        const hasInterstitial =
          nextIndex < total - 1 && CONFIG.interstitials.length > 0;
        if (hasInterstitial) {
          setScreen(SCREEN.INTERSTITIAL);
          setQuestionIndex(nextIndex);
        } else {
          setQuestionIndex(nextIndex);
          setScreen(SCREEN.QUESTION);
        }
      }
    });
  }

  function handleSurprise() {
    safeTransition(() => setScreen(SCREEN.VIDEO));
  }

  const interstitialText =
    CONFIG.interstitials[questionIndex % CONFIG.interstitials.length] ||
    'A little question, a lot of love. 💌';

  return (
    <>
      {/* Background music — auto-plays on load via muted→unmute trick */}
      <audio
        ref={audioRef}
        src={MUSIC_SRC}
        preload="auto"
        muted
        aria-hidden="true"
      />

      {/* Music toggle button — glows when playing */}
      <MusicButton playing={musicPlaying} onToggle={toggleMusic} />

      <FloatingHearts count={20} />

      {screen === SCREEN.WELCOME && (
        <WelcomeScreen onStart={handleWelcomeStart} />
      )}

      {screen === SCREEN.INTERSTITIAL && (
        <InterstitialScreen
          key={`interstitial-${questionIndex}`}
          text={interstitialText}
          onDone={handleInterstitialDone}
        />
      )}

      {screen === SCREEN.QUESTION && (
        <QuestionScreen
          key={`question-${questionIndex}`}
          questionIndex={questionIndex}
          total={total}
          onYes={handleYes}
        />
      )}

      {screen === SCREEN.CELEBRATION && (
        <CelebrationScreen onSurprise={handleSurprise} />
      )}

      {screen === SCREEN.VIDEO && (
        <VideoSurpriseScreen />
      )}
    </>
  );
}
