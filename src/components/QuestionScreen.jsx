import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { CONFIG } from '../data/config';

// ─── Helpers ──────────────────────────────────────────────────
const DODGE_MESSAGES = [
  'Hehe, too slow! 🙈',
  'Are you sure about that? 🥺',
  'Wrong button, cutie! 💗',
  'Nope, try again! 😂',
  'My heart says YES! 💘',
  'Nice try! 🌸',
  'Not today! 💕',
  'Run run run! 🏃‍♀️💨',
  'You can\'t catch me! 🦋',
  'Gotcha! Just kidding 😜',
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

const BTN_W  = 132;
const BTN_H  = 46;
const MARGIN = 16;

// ─── Sparkle ring around card ─────────────────────────────────
function SparkleRing() {
  const sparks = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      symbol: ['✨','💖','🌸','⭐','💕','🌟','💗','🌷'][i],
      angle: (i / 8) * 360,
      delay: i * 0.4,
    })), []);

  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
    >
      {sparks.map((s) => (
        <span
          key={s.id}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            fontSize: '1rem',
            opacity: 0.7,
            animation: `twinkle ${2 + s.id * 0.3}s ease-in-out ${s.delay}s infinite`,
            transform: `rotate(${s.angle}deg) translateX(${160 + (s.id % 3) * 20}px)`,
            transformOrigin: '0 0',
            marginTop: '-0.5rem',
            marginLeft: '-0.5rem',
            display: 'inline-block',
          }}
        >
          {s.symbol}
        </span>
      ))}
    </div>
  );
}

// ─── Burst particles when Yes is clicked ──────────────────────
function YesBurst({ active }) {
  if (!active) return null;
  const particles = Array.from({ length: 28 }, (_, i) => {
    const angle = (i / 28) * 2 * Math.PI;
    const dist  = 70 + Math.random() * 100;
    return {
      id: i,
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist - 70,
      symbol: ['❤️','💖','✨','🌸','💕','🌟','🌷'][Math.floor(Math.random() * 7)],
      size: 14 + Math.random() * 18,
      delay: Math.random() * 0.2,
    };
  });
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50 }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            fontSize: `${p.size}px`,
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            animation: `particleFloat 1s ease-out ${p.delay}s both`,
            display: 'inline-block',
            pointerEvents: 'none',
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}

// ─── Mini heart trail from No button when it dodges ───────────
function DodgeTrail({ trails }) {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
      {trails.map((t) => (
        <span
          key={t.id}
          style={{
            position: 'absolute',
            left: t.x,
            top: t.y,
            fontSize: '1rem',
            animation: 'particleFloat 0.7s ease-out both',
            '--tx': `${(Math.random() - 0.5) * 40}px`,
            '--ty': '-40px',
            display: 'inline-block',
            pointerEvents: 'none',
          }}
        >
          {['💕','✨','💗'][t.id % 3]}
        </span>
      ))}
    </div>
  );
}

// ─── NO Dodge Button — stays strictly INSIDE the card and off text ─────
function NoDodgeButton({ cardRef, textRef, onDodge, questionIndex }) {
  const btnRef  = useRef(null);
  const [pos, setPos] = useState(null);       // null = normal flow; {x,y} = absolute
  const [shaking, setShaking] = useState(false);
  const lastPosRef = useRef(null);

  // Reset button to initial position when question changes
  useEffect(() => {
    setPos(null);
    lastPosRef.current = null;
  }, [questionIndex]);

  const getRandomPos = useCallback(() => {
    const card = cardRef.current;
    const btn  = btnRef.current;
    if (!card || !btn) return null;

    const cardRect = card.getBoundingClientRect();
    const btnRect  = btn.getBoundingClientRect();

    const bw = btnRect.width || BTN_W;
    const bh = btnRect.height || BTN_H;

    // Boundary margins
    const safeMarginX = 30;
    const safeMarginTop = 60;
    const safeMarginBottom = 30;

    const minX = safeMarginX;
    const maxX = Math.max(minX, cardRect.width - bw - safeMarginX);

    const minY = safeMarginTop;
    const maxY = Math.max(minY, cardRect.height - bh - safeMarginBottom);

    // Question text collision box relative to card
    let textZone = null;
    if (textRef && textRef.current) {
      const tr = textRef.current.getBoundingClientRect();
      textZone = {
        left: tr.left - cardRect.left - 15,
        right: tr.right - cardRect.left + 15,
        top: tr.top - cardRect.top - 15,
        bottom: tr.bottom - cardRect.top + 15,
      };
    }

    for (let t = 0; t < 40; t++) {
      const nx = clamp(minX + Math.random() * (maxX - minX), minX, maxX);
      const ny = clamp(minY + Math.random() * (maxY - minY), minY, maxY);

      // 1. Avoid overlapping question text
      if (textZone) {
        const overlapsX = nx + bw > textZone.left && nx < textZone.right;
        const overlapsY = ny + bh > textZone.top && ny < textZone.bottom;
        if (overlapsX && overlapsY) continue;
      }

      // 2. Avoid jumping to identical spot
      if (lastPosRef.current) {
        const dx = Math.abs(nx - lastPosRef.current.x);
        const dy = Math.abs(ny - lastPosRef.current.y);
        if (dx < 70 && dy < 40) continue;
      }

      // 3. Avoid overlapping Yes button directly (center-lower area)
      const yesCx = cardRect.width / 2;
      const yesCy = cardRect.height - bh - 60;
      if (Math.hypot(nx + bw / 2 - yesCx, ny + bh / 2 - yesCy) < 110) continue;

      return { x: Math.round(nx), y: Math.round(ny) };
    }

    // fallback safe coordinates (bottom area away from text)
    return { x: maxX, y: maxY };
  }, [cardRef, textRef]);

  const dodge = useCallback(() => {
    const newPos = getRandomPos();
    if (!newPos) return;
    lastPosRef.current = newPos;
    setPos(newPos);
    setShaking(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setShaking(true)));
    setTimeout(() => setShaking(false), 450);
    onDodge(newPos);
  }, [getRandomPos, onDodge]);

  function handleTouch(e) {
    e.preventDefault();
    dodge();
  }

  const btnStyle = {
    background: 'linear-gradient(135deg, #ce93d8, #f48fb1)',
    color: '#fff',
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 700,
    fontSize: '1.05rem',
    border: 'none',
    borderRadius: '50px',
    padding: '0.88rem 2rem',
    cursor: 'pointer',
    boxShadow: '0 6px 22px rgba(206,147,216,0.5)',
    whiteSpace: 'nowrap',
    zIndex: 25,
    animation: shaking
      ? 'noButtonEscape 0.4s cubic-bezier(0.22,1,0.36,1) both'
      : 'idleBounce 2.2s ease-in-out infinite',
    ...(pos
      ? {
          position: 'absolute',
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          margin: 0,
          transition: 'left 0.22s cubic-bezier(0.22,1,0.36,1), top 0.22s cubic-bezier(0.22,1,0.36,1)',
        }
      : {
          position: 'relative',
          transition: 'none',
        }),
  };

  return (
    <button
      ref={btnRef}
      id="no-btn"
      style={btnStyle}
      onMouseEnter={dodge}
      onTouchStart={handleTouch}
      onClick={dodge}
      aria-label="No button — it keeps running away!"
    >
      No 🙈
    </button>
  );
}

// ─── Styles ───────────────────────────────────────────────────
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
    overflowY: 'auto',
  },
  card: {
    position: 'relative',
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(24px)',
    borderRadius: '32px',
    // Extra bottom padding = dodge arena for No button
    padding: 'clamp(1.8rem, 4vw, 2.8rem) clamp(1.5rem, 3.5vw, 2.5rem) clamp(5.5rem, 13vw, 7.5rem)',
    maxWidth: '600px',
    width: '100%',
    minHeight: '380px',
    textAlign: 'center',
    border: '2px solid rgba(244,143,177,0.45)',
    overflow: 'hidden',
    animation: 'fadeInUp 0.7s cubic-bezier(0.22,1,0.36,1) both, borderGlow 4s ease-in-out 1s infinite',
  },
  progressWrap: {
    position: 'absolute',
    top: 0, left: 0, right: 0, height: '6px',
    background: 'rgba(252,228,236,0.6)',
    borderRadius: '32px 32px 0 0',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #e91e63, #f48fb1, #ce93d8, #f48fb1)',
    backgroundSize: '200% 100%',
    animation: 'gradientShift 3s ease infinite',
    transition: 'width 0.55s cubic-bezier(0.22,1,0.36,1)',
    borderRadius: '32px 32px 0 0',
  },
  counterBadge: {
    display: 'inline-block',
    position: 'relative',
    zIndex: 10,
    background: 'linear-gradient(135deg, #fce4ec, #f3e5f5)',
    color: '#e91e63',
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 700,
    fontSize: '0.85rem',
    borderRadius: '50px',
    padding: '0.3rem 1rem',
    marginBottom: '1.1rem',
    letterSpacing: '0.03em',
    border: '1px solid rgba(244,143,177,0.45)',
    boxShadow: '0 2px 10px rgba(233,30,99,0.1)',
  },
  decoRow: {
    position: 'relative',
    zIndex: 10,
    fontSize: '1.7rem',
    letterSpacing: '0.5rem',
    marginBottom: '1.2rem',
    opacity: 0.8,
  },
  question: {
    position: 'relative',
    zIndex: 10,
    fontFamily: "'Dancing Script', cursive",
    fontSize: 'clamp(1.65rem, 4.5vw, 2.3rem)',
    color: '#4a2040',
    lineHeight: 1.38,
    marginBottom: '1.4rem',
    minHeight: '85px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textShadow: '0 1px 8px rgba(233,30,99,0.08)',
    animation: 'fadeInUp 0.5s ease both',
  },
  btnContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'clamp(2rem, 5vw, 3.5rem)',
    marginTop: '0.8rem',
    width: '100%',
    zIndex: 15,
  },
  yesBtn: {
    position: 'relative',
    zIndex: 15,
    background: 'linear-gradient(135deg, #e91e63, #f48fb1)',
    color: '#fff',
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 700,
    fontSize: '1.1rem',
    border: 'none',
    borderRadius: '50px',
    padding: '0.92rem 2.8rem',
    cursor: 'pointer',
    boxShadow: '0 6px 24px rgba(233,30,99,0.44)',
    transition: 'transform 0.18s, box-shadow 0.18s',
    display: 'inline-block',
    margin: '0',
    animation: 'idleBounce 2s ease-in-out 0.5s infinite',
    letterSpacing: '0.02em',
  },
  responseCard: {
    marginTop: '1.5rem',
    background: 'linear-gradient(135deg, #fce4ec, #f3e5f5)',
    borderRadius: '20px',
    padding: '1.2rem 1.8rem',
    fontFamily: "'Nunito', sans-serif",
    fontSize: '1.08rem',
    color: '#7b3f6e',
    fontWeight: 600,
    animation: 'bounceIn 0.5s ease both',
    border: '1.5px solid rgba(244,143,177,0.35)',
    boxShadow: '0 4px 20px rgba(233,30,99,0.1)',
  },
  dodgeMsg: {
    position: 'absolute',
    pointerEvents: 'none',
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 700,
    fontSize: '0.88rem',
    color: '#e91e63',
    background: 'rgba(255,255,255,0.96)',
    borderRadius: '50px',
    padding: '0.28rem 0.9rem',
    boxShadow: '0 4px 14px rgba(233,30,99,0.2)',
    zIndex: 60,
    animation: 'fadeOut 1.8s ease 0.4s both',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    top: '1rem',
    left: '50%',
    transform: 'translateX(-50%)',
  },
};

// ─── QuestionScreen ───────────────────────────────────────────
export default function QuestionScreen({ questionIndex, total, onYes }) {
  const cardRef          = useRef(null);
  const textRef          = useRef(null);
  const [showResponse, setShowResponse] = useState(false);
  const [burst,        setBurst]        = useState(false);
  const [answered,     setAnswered]     = useState(false);
  const [dodgeMsg,     setDodgeMsg]     = useState(null);
  const [trails,       setTrails]       = useState([]);
  const trailCounter                    = useRef(0);

  const qData = CONFIG.questions[questionIndex];

  useEffect(() => {
    setShowResponse(false);
    setBurst(false);
    setAnswered(false);
    setDodgeMsg(null);
    setTrails([]);
  }, [questionIndex]);

  function handleYes() {
    if (answered) return;
    setAnswered(true);
    setBurst(true);
    setShowResponse(true);
    setTimeout(() => setBurst(false), 1200);
    setTimeout(() => onYes(), 2400);
  }

  const handleDodge = useCallback((dodgePos) => {
    // Show funny message
    setDodgeMsg(randomFrom(DODGE_MESSAGES));
    setTimeout(() => setDodgeMsg(null), 2200);

    // Spawn a tiny heart trail at the old position
    if (dodgePos) {
      const id = trailCounter.current++;
      setTrails((prev) => [...prev.slice(-5), { id, x: dodgePos.x, y: dodgePos.y }]);
      setTimeout(() => setTrails((prev) => prev.filter((t) => t.id !== id)), 900);
    }
  }, []);

  const progress = (questionIndex / total) * 100;

  if (!qData) return null;

  return (
    <div style={S.screen}>
      <div
        key={questionIndex}
        ref={cardRef}
        style={S.card}
      >
        {/* Animated progress bar */}
        <div style={S.progressWrap}>
          <div
            style={{ ...S.progressBar, width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={questionIndex}
            aria-valuemax={total}
            aria-label={`Question ${questionIndex + 1} of ${total}`}
          />
        </div>

        {/* Dodge message */}
        {dodgeMsg && (
          <div style={S.dodgeMsg} aria-live="polite">{dodgeMsg}</div>
        )}

        {/* Trail hearts */}
        <DodgeTrail trails={trails} />

        {/* Burst on Yes */}
        <YesBurst active={burst} />

        {/* Counter */}
        <div style={S.counterBadge}>
          💌 Question {questionIndex + 1} of {total}
        </div>

        {/* Deco row */}
        <div style={S.decoRow} aria-hidden="true">
          <span style={{ animation: 'twinkle 1.8s ease infinite' }}>🌸</span>
          {' '}
          <span style={{ animation: 'heartBeat 1.4s ease-in-out infinite' }}>💗</span>
          {' '}
          <span style={{ animation: 'twinkle 2.2s ease 0.4s infinite' }}>🌷</span>
        </div>

        {/* Question text */}
        <div ref={textRef} style={{ ...S.question, key: questionIndex }}>
          {qData.question}
        </div>

        {/* Buttons */}
        {!showResponse && (
          <>
            <div style={S.btnContainer}>
              <button
                id={`yes-btn-q${questionIndex}`}
                style={S.yesBtn}
                onClick={handleYes}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.07)';
                  e.currentTarget.style.boxShadow = '0 14px 36px rgba(233,30,99,0.54)';
                  e.currentTarget.style.animation = 'none';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(233,30,99,0.44)';
                  e.currentTarget.style.animation = 'idleBounce 2s ease-in-out 0.5s infinite';
                }}
                aria-label="Yes"
              >
                Yes ❤️
              </button>

              <NoDodgeButton
                cardRef={cardRef}
                textRef={textRef}
                onDodge={handleDodge}
                questionIndex={questionIndex}
              />
            </div>
          </>
        )}

        {/* Response */}
        {showResponse && (
          <div style={S.responseCard} role="status" aria-live="polite">
            {qData.yesResponse}
          </div>
        )}
      </div>
    </div>
  );
}
