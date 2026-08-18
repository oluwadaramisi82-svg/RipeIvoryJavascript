import { useEffect, useMemo, useRef, useState } from 'react';

/* ─── data ─────────────────────────────────────────── */
const RSVP = [
  ['Mrs Khadijat', '08032278353'],
  ['Mr Oyedokun', '07038207478'],
  ['OMOT', '07017990204'],
  ['Aweda', '08026642105'],
];

function twoDigits(n: number) {
  return String(n).padStart(2, '0');
}

/* ─── types ─────────────────────────────────────────── */
type PageContent = { left: React.ReactNode; right: React.ReactNode };

/* ─── component ─────────────────────────────────────── */
export function ModernNikah() {
  const [spread, setSpread] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const countdown = useMemo(() => {
    const rem = new Date('2026-11-21T11:00:00').getTime() - now;
    if (rem <= 0) return null;
    return {
      days: Math.floor(rem / 86_400_000),
      hours: Math.floor((rem % 86_400_000) / 3_600_000),
      minutes: Math.floor((rem % 3_600_000) / 60_000),
      seconds: Math.floor((rem % 60_000) / 1_000),
    };
  }, [now]);

  const TOTAL = 6; // 0 = cover … 5 = last spread

  /* page-flip logic */
  function flipTo(next: number) {
    if (flipping || next < 0 || next >= TOTAL) return;
    const el = rightRef.current;
    if (!el) return;
    setFlipping(true);

    if (next > spread) {
      // forward: right page folds to left
      el.style.animation = 'none';
      el.offsetHeight; // reflow
      el.style.animation = 'book-fold-out 0.45s ease-in forwards';
      setTimeout(() => {
        setSpread(next);
        el.style.animation = 'none';
        el.offsetHeight;
        el.style.animation = 'book-fold-in 0.45s ease-out forwards';
        setTimeout(() => { el.style.animation = ''; setFlipping(false); }, 450);
      }, 450);
    } else {
      // backward: right page un-folds from left
      el.style.animation = 'none';
      el.offsetHeight;
      el.style.animation = 'book-unfold-out 0.45s ease-in forwards';
      setTimeout(() => {
        setSpread(next);
        el.style.animation = 'none';
        el.offsetHeight;
        el.style.animation = 'book-unfold-in 0.45s ease-out forwards';
        setTimeout(() => { el.style.animation = ''; setFlipping(false); }, 450);
      }, 450);
    }
  }

  /* spread definitions */
  const spreads: PageContent[] = [
    /* 0 — COVER */
    {
      left: (
        <div className="page-cover page-cover-left">
          <div className="cover-ornament">
            <StarRow />
          </div>
          <p className="cover-bismillah">In the name of Allah,<br />the Most Beneficent, the Most Merciful</p>
          <h1 className="cover-names mn-serif">
            Ahmad<br />
            <span className="cover-amp">&amp;</span>
            <br />Toyibat
          </h1>
          <p className="cover-date mn-serif">Saturday, 21st November 2026</p>
          <p className="cover-place">Ijebu Ode · Ogun State · Nigeria</p>
          <div className="cover-ornament">
            <StarRow />
          </div>
        </div>
      ),
      right: (
        <div className="page-cover page-cover-right">
          <img src="/__mockup/images/couple4.png" alt="Ahmad and Toyibat" className="cover-photo" />
          <div className="cover-photo-caption mn-serif">Ahmad Opeyemi &amp; Toyibat Adeola</div>
        </div>
      ),
    },
    /* 1 — FAMILIES */
    {
      left: (
        <div className="page-inner">
          <p className="page-kicker">With the blessings of</p>
          <h2 className="mn-serif page-heading">The Families</h2>
          <div className="family-block">
            <p className="family-name mn-serif">Prof Taofiki<br />&amp; Alhaja Basirat Salako</p>
          </div>
          <p className="family-and">and</p>
          <div className="family-block">
            <p className="family-name mn-serif">Khalifah Abdul-Hafeez<br />&amp; Alhaja Kudratu-Llah Otunuyi</p>
          </div>
          <GeoRule />
        </div>
      ),
      right: (
        <div className="page-inner page-invite-right">
          <p className="page-kicker">Cordially invite</p>
          <p className="invite-guest mn-serif">V.C. TASUED<br />(Prof. Banjo)</p>
          <p className="invite-witness">to witness the<br />solemnization of</p>
          <p className="invite-couple mn-serif">Ahmad Opeyemi<br /><span className="invite-couple-and">&amp;</span><br />Toyibat Adeola</p>
        </div>
      ),
    },
    /* 2 — DATE / VENUE */
    {
      left: (
        <div className="page-inner">
          <p className="page-kicker">The occasion</p>
          <h2 className="mn-serif page-heading">Date &amp; Venue</h2>
          <div className="detail-row">
            <span className="detail-label">Date</span>
            <span className="detail-value mn-serif">Saturday<br />21st November 2026</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Time</span>
            <span className="detail-value mn-serif">11 : 00 am</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Venue</span>
            <span className="detail-value mn-serif">Rolak Hotel &amp; Suites<br />Adetola Hall, Imowo Eleran<br />Ijebu Ode, Ogun State</span>
          </div>
          <GeoRule />
          <p className="footnote">Reception follows immediately<br />at the same venue.</p>
        </div>
      ),
      right: (
        <div className="page-inner">
          <p className="page-kicker">How to find us</p>
          <h2 className="mn-serif page-heading">Directions</h2>
          <p className="directions-text mn-serif">From Lagos Garage</p>
          <p className="directions-arrow">↓</p>
          <p className="directions-text mn-serif">Rolak Hotel &amp; Suites</p>
          <p className="directions-sub">Beside Imowo Community Primary School<br />Ijebu Ode, Ogun State</p>
          <GeoRule />
          {countdown ? (
            <div>
              <p className="page-kicker" style={{ marginBottom: 12 }}>Counting down</p>
              <div className="countdown-grid">
                {Object.entries(countdown).map(([lbl, val]) => (
                  <div key={lbl} className="countdown-cell">
                    <span className="countdown-num mn-serif">{twoDigits(val)}</span>
                    <span className="countdown-lbl">{lbl}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="mn-serif" style={{ color: 'var(--emerald)', fontSize: 18, marginTop: 20, fontStyle: 'italic' }}>
              The day has arrived.<br />Barak Allahu Lakuma.
            </p>
          )}
        </div>
      ),
    },
    /* 3 — TOAST */
    {
      left: (
        <div className="page-inner page-toast-left">
          <p className="page-kicker">A toast</p>
          <blockquote className="toast-text mn-serif">
            <p>Love brought us together.</p>
            <p>Faith keeps us together.</p>
            <p>But God made it possible.</p>
            <p>It is marvellous in our eyes.</p>
          </blockquote>
          <cite className="toast-cite">— Ahmad &amp; Toyibat</cite>
        </div>
      ),
      right: (
        <div className="page-inner page-verse-right">
          <div className="verse-stars"><StarRow /></div>
          <p className="page-kicker">A verse for the occasion</p>
          <blockquote className="verse-text mn-serif">
            "And among His signs is this, that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts: Verily in that are signs for those who reflect."
          </blockquote>
          <p className="verse-ref">— Al-Rum (30:21)</p>
        </div>
      ),
    },
    /* 4 — RSVP */
    {
      left: (
        <div className="page-inner">
          <p className="page-kicker">Kindly respond</p>
          <h2 className="mn-serif page-heading">R S V P</h2>
          <GeoRule />
          <div className="rsvp-list">
            {RSVP.map(([name, phone]) => (
              <a key={phone} href={`tel:${phone}`} className="rsvp-row">
                <span className="rsvp-name">{name}</span>
                <span className="rsvp-phone">{phone}</span>
              </a>
            ))}
          </div>
        </div>
      ),
      right: (
        <div className="page-inner page-dress-right">
          <p className="page-kicker">Aso-Ebi</p>
          <h2 className="mn-serif page-heading">Dress Code</h2>
          <GeoRule />
          <div className="dress-block">
            <div className="dress-swatch" style={{ background: '#c9a84c' }} />
            <div>
              <p className="dress-side">Bride's Colour</p>
              <p className="dress-colour mn-serif">Champagne Gold</p>
            </div>
          </div>
          <div className="dress-block">
            <div className="dress-swatch" style={{ background: '#1a5c42' }} />
            <div>
              <p className="dress-side">Groom's Colour</p>
              <p className="dress-colour mn-serif">Emerald Green</p>
            </div>
          </div>
          <GeoRule />
          <p className="dress-footer mn-serif">We look forward to celebrating<br />with you.</p>
        </div>
      ),
    },
    /* 5 — BACK COVER */
    {
      left: (
        <div className="page-cover page-cover-left" style={{ justifyContent: 'center' }}>
          <StarRow />
          <p className="mn-serif" style={{ fontSize: 22, color: 'var(--gold)', marginTop: 28, fontStyle: 'italic', textAlign: 'center', lineHeight: 1.6 }}>
            Jazakumullahu Khayran<br />for celebrating with us.
          </p>
          <p style={{ fontSize: 11, color: 'var(--ivory)', marginTop: 16, textAlign: 'center', opacity: 0.6, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Ahmad &amp; Toyibat · 21.11.2026
          </p>
        </div>
      ),
      right: (
        <div className="page-cover page-cover-right" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--emerald-mid)' }}>
          <GeometricPattern />
        </div>
      ),
    },
  ];

  const current = spreads[spread];

  return (
    <div className="bk-root">
      <link
        rel="stylesheet"
        media="print"
        onLoad={(e) => { e.currentTarget.media = 'all'; }}
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@400;500;600&display=swap"
      />
      <style>{css}</style>

      <div className="bk-scene">
        <div className="bk-book">
          {/* LEFT PAGE */}
          <div className="bk-page bk-left">
            {current.left}
            <span className="bk-pagenum bk-pagenum-left">{spread * 2 + 1}</span>
          </div>

          {/* SPINE */}
          <div className="bk-spine" />

          {/* RIGHT PAGE — this is the one that flips */}
          <div className="bk-page bk-right" ref={rightRef}>
            {current.right}
            <span className="bk-pagenum bk-pagenum-right">{spread * 2 + 2}</span>
          </div>
        </div>

        {/* NAV */}
        <div className="bk-nav">
          <button
            className="bk-btn"
            onClick={() => flipTo(spread - 1)}
            disabled={spread === 0 || flipping}
            aria-label="Previous page"
          >
            ‹
          </button>
          <div className="bk-dots">
            {spreads.map((_, i) => (
              <button
                key={i}
                className={`bk-dot${i === spread ? ' active' : ''}`}
                onClick={() => flipTo(i)}
                disabled={flipping}
                aria-label={`Go to spread ${i + 1}`}
              />
            ))}
          </div>
          <button
            className="bk-btn"
            onClick={() => flipTo(spread + 1)}
            disabled={spread === TOTAL - 1 || flipping}
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── decorative sub-components ─────────────────────── */
function StarRow() {
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
      {[0, 1, 2].map((i) => (
        <svg key={i} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <polygon
            points="12,1 14.5,9 23,9 16,14 18.5,22 12,17 5.5,22 8,14 1,9 9.5,9"
            fill="#c9a84c"
            opacity={i === 1 ? 1 : 0.55}
          />
        </svg>
      ))}
    </div>
  );
}

function GeoRule() {
  return (
    <svg width="100%" height="14" viewBox="0 0 200 14" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ margin: '20px 0' }}>
      <defs>
        <pattern id="geo-r" x="0" y="0" width="20" height="14" patternUnits="userSpaceOnUse">
          <polygon points="10,1 19,7 10,13 1,7" fill="none" stroke="#c9a84c" strokeWidth="0.9" opacity="0.6" />
          <rect x="8.5" y="5.5" width="3" height="3" fill="#c9a84c" opacity="0.35" transform="rotate(45 10 7)" />
        </pattern>
      </defs>
      <rect width="100%" height="14" fill="url(#geo-r)" />
    </svg>
  );
}

function GeometricPattern() {
  return (
    <svg width="240" height="240" viewBox="0 0 240 240" fill="none" aria-hidden="true" opacity="0.3">
      {/* Islamic 8-point star pattern */}
      {[120].map((cx) =>
        [120].map((cy) => (
          <g key={`${cx}-${cy}`} transform={`translate(${cx},${cy})`}>
            {Array.from({ length: 8 }).map((_, i) => (
              <line
                key={i}
                x1="0" y1="-90"
                x2="0" y2="-50"
                stroke="#c9a84c"
                strokeWidth="1.5"
                transform={`rotate(${i * 45})`}
              />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <polygon
                key={i}
                points="0,-85 8,-65 0,-50 -8,-65"
                fill="#c9a84c"
                transform={`rotate(${i * 45})`}
              />
            ))}
            <polygon points="0,-70 70,0 0,70 -70,0" fill="none" stroke="#c9a84c" strokeWidth="1" />
            <circle cx="0" cy="0" r="30" fill="none" stroke="#c9a84c" strokeWidth="1" />
            <polygon points="0,-55 55,0 0,55 -55,0" fill="none" stroke="#c9a84c" strokeWidth="0.8" opacity="0.6" transform="rotate(45)" />
          </g>
        ))
      )}
    </svg>
  );
}

/* ─── styles ─────────────────────────────────────────── */
const css = `
  .bk-root {
    --emerald: #1a5c42;
    --emerald-mid: #276b4e;
    --emerald-light: #e8f0ec;
    --gold: #c9a84c;
    --gold-pale: #f5ead2;
    --ivory: #fdf8f0;
    --ivory-dark: #f0e8d8;
    --ink: #1a1a18;
    --ink-muted: #6a6a60;
    --page-shadow: rgba(0,0,0,0.18);

    background: var(--ivory-dark);
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    padding: 24px 16px 36px;
    user-select: none;
  }
  .bk-root * { box-sizing: border-box; }
  .bk-root a { color: inherit; text-decoration: none; }
  .mn-serif { font-family: 'Cormorant Garamond', Georgia, serif; }

  /* ── Book scene ── */
  .bk-scene {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 28px;
    width: 100%;
    max-width: 900px;
  }

  .bk-book {
    display: flex;
    align-items: stretch;
    width: 100%;
    aspect-ratio: 1.55;
    border-radius: 4px;
    box-shadow:
      0 20px 60px rgba(0,0,0,0.28),
      0 6px 18px rgba(0,0,0,0.16),
      inset 0 0 0 1px rgba(0,0,0,0.06);
    position: relative;
    background: var(--ivory);
    perspective: 2200px;
    transform-style: preserve-3d;
  }

  /* ── Pages ── */
  .bk-page {
    flex: 1;
    overflow: hidden;
    position: relative;
    background: var(--ivory);
  }

  .bk-left {
    border-radius: 4px 0 0 4px;
    border-right: none;
    background: linear-gradient(to right, #ece4d4 0%, #fdf8f0 5%);
  }

  .bk-right {
    border-radius: 0 4px 4px 0;
    border-left: none;
    background: linear-gradient(to left, #ece4d4 0%, #fdf8f0 5%);
    transform-origin: left center;
    transform-style: preserve-3d;
    will-change: transform;
  }

  /* ── Spine ── */
  .bk-spine {
    width: 10px;
    background: linear-gradient(to right, #c9b08a 0%, #e8d8b8 40%, #c9b08a 100%);
    flex-shrink: 0;
    box-shadow: inset 2px 0 4px rgba(0,0,0,0.12), inset -2px 0 4px rgba(0,0,0,0.12);
  }

  /* ── Page numbers ── */
  .bk-pagenum {
    position: absolute;
    bottom: 14px;
    font-size: 9px;
    letter-spacing: 0.14em;
    color: var(--gold);
    opacity: 0.7;
    font-weight: 600;
    text-transform: uppercase;
  }
  .bk-pagenum-left { left: 20px; }
  .bk-pagenum-right { right: 20px; }

  /* ── Flip animations ── */
  @keyframes book-fold-out {
    from { transform: perspective(2200px) rotateY(0deg); }
    to   { transform: perspective(2200px) rotateY(-90deg); }
  }
  @keyframes book-fold-in {
    from { transform: perspective(2200px) rotateY(90deg); }
    to   { transform: perspective(2200px) rotateY(0deg); }
  }
  @keyframes book-unfold-out {
    from { transform: perspective(2200px) rotateY(0deg); }
    to   { transform: perspective(2200px) rotateY(90deg); }
  }
  @keyframes book-unfold-in {
    from { transform: perspective(2200px) rotateY(-90deg); }
    to   { transform: perspective(2200px) rotateY(0deg); }
  }

  /* ── Cover pages ── */
  .page-cover {
    background: var(--emerald);
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    padding: clamp(16px, 4%, 36px);
    text-align: center;
  }
  .page-cover-right {
    padding: 0;
    overflow: hidden;
  }
  .cover-bismillah {
    font-size: clamp(9px, 1.4vw, 13px);
    color: var(--gold-pale);
    line-height: 1.7;
    letter-spacing: 0.04em;
    margin: 0;
  }
  .cover-names {
    font-size: clamp(32px, 6.5vw, 72px);
    font-weight: 500;
    color: #fff;
    line-height: 0.9;
    letter-spacing: -0.04em;
    margin: 0;
  }
  .cover-amp {
    display: block;
    font-size: clamp(18px, 3.5vw, 40px);
    color: var(--gold);
    font-style: italic;
    line-height: 1.3;
  }
  .cover-date {
    font-size: clamp(11px, 2vw, 20px);
    color: var(--gold);
    margin: 0;
    font-style: italic;
  }
  .cover-place {
    font-size: clamp(8px, 1.3vw, 11px);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.55);
    margin: 0;
  }
  .cover-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
  }
  .cover-photo-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(26,92,66,0.82));
    color: var(--gold-pale);
    font-size: clamp(9px, 1.4vw, 13px);
    font-style: italic;
    text-align: center;
    padding: 20px 12px 14px;
  }

  /* ── Inner pages ── */
  .page-inner {
    padding: clamp(20px, 5%, 44px) clamp(16px, 4.5%, 40px);
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0;
  }
  .page-kicker {
    font-size: clamp(7px, 1.1vw, 10px);
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--gold);
    margin: 0 0 8px;
  }
  .page-heading {
    font-size: clamp(24px, 4.5vw, 52px);
    font-weight: 500;
    letter-spacing: -0.04em;
    line-height: 0.9;
    color: var(--emerald);
    margin: 0 0 4px;
  }

  /* Families */
  .family-block {
    background: var(--emerald-light);
    border-left: 3px solid var(--gold);
    padding: clamp(8px, 1.5%, 14px) clamp(10px, 2%, 16px);
    margin: 8px 0;
  }
  .family-name {
    font-size: clamp(11px, 2vw, 22px);
    line-height: 1.3;
    color: var(--emerald);
    margin: 0;
    font-weight: 500;
  }
  .family-and {
    font-size: clamp(9px, 1.3vw, 12px);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold);
    text-align: center;
    margin: 4px 0;
  }

  /* Invite right */
  .page-invite-right {
    background: var(--emerald);
    color: var(--ivory);
    text-align: center;
    align-items: center;
  }
  .page-invite-right .page-kicker { color: var(--gold); }
  .invite-guest {
    font-size: clamp(16px, 3.5vw, 40px);
    color: #fff;
    font-weight: 500;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin: 8px 0;
  }
  .invite-witness {
    font-size: clamp(9px, 1.3vw, 13px);
    color: var(--gold-pale);
    margin: 10px 0;
    line-height: 1.6;
  }
  .invite-couple {
    font-size: clamp(18px, 4vw, 46px);
    font-weight: 500;
    color: var(--gold);
    line-height: 1.05;
    letter-spacing: -0.03em;
    margin: 4px 0;
  }
  .invite-couple-and {
    font-size: 0.6em;
    color: rgba(255,255,255,0.6);
    font-style: italic;
    display: block;
    line-height: 1.4;
  }

  /* Details */
  .detail-row {
    display: flex;
    flex-direction: column;
    margin: 10px 0;
    border-bottom: 1px solid var(--gold);
    padding-bottom: 10px;
    gap: 3px;
  }
  .detail-label {
    font-size: clamp(7px, 1vw, 9px);
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
  }
  .detail-value {
    font-size: clamp(12px, 2.2vw, 24px);
    line-height: 1.25;
    color: var(--ink);
    font-weight: 400;
  }
  .footnote {
    font-size: clamp(8px, 1.2vw, 11px);
    color: var(--ink-muted);
    margin: 0;
    line-height: 1.6;
    font-style: italic;
  }

  /* Directions */
  .directions-text {
    font-size: clamp(12px, 2.2vw, 24px);
    color: var(--emerald);
    font-weight: 500;
    margin: 8px 0 2px;
  }
  .directions-arrow {
    font-size: clamp(16px, 2.8vw, 28px);
    color: var(--gold);
    margin: 2px 0;
    line-height: 1;
  }
  .directions-sub {
    font-size: clamp(8px, 1.3vw, 12px);
    color: var(--ink-muted);
    line-height: 1.6;
    margin: 4px 0 0;
  }

  /* Countdown */
  .countdown-grid {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  .countdown-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .countdown-num {
    font-size: clamp(20px, 4vw, 44px);
    line-height: 1;
    color: var(--emerald);
  }
  .countdown-lbl {
    font-size: clamp(6px, 0.9vw, 8px);
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--ink-muted);
    margin-top: 4px;
  }

  /* Toast */
  .page-toast-left {
    background: var(--emerald);
    color: var(--ivory);
    align-items: flex-start;
  }
  .page-toast-left .page-kicker { color: var(--gold); }
  .toast-text {
    font-size: clamp(14px, 2.8vw, 32px);
    font-style: italic;
    line-height: 1.5;
    color: #fff;
    margin: 12px 0;
  }
  .toast-text p { margin: 0 0 8px; }
  .toast-cite {
    font-size: clamp(8px, 1.2vw, 11px);
    font-style: normal;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--gold);
  }

  /* Verse */
  .page-verse-right {
    background: var(--gold-pale);
    align-items: center;
    text-align: center;
  }
  .page-verse-right .page-kicker { color: var(--emerald); }
  .verse-stars { margin-bottom: 10px; }
  .verse-text {
    font-size: clamp(10px, 1.8vw, 18px);
    font-style: italic;
    line-height: 1.6;
    color: var(--ink);
    margin: 10px 0;
    max-width: 90%;
  }
  .verse-ref {
    font-size: clamp(8px, 1.1vw, 10px);
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--emerald);
    margin: 4px 0 0;
  }

  /* RSVP */
  .rsvp-list { display: flex; flex-direction: column; gap: 8px; }
  .rsvp-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: clamp(8px, 1.2%, 12px) clamp(10px, 1.8%, 16px);
    border: 1.5px solid var(--emerald);
    border-radius: 3px;
    font-size: clamp(9px, 1.4vw, 13px);
    transition: background 0.2s, color 0.2s;
    cursor: pointer;
  }
  .rsvp-row:hover { background: var(--emerald); color: #fff; }
  .rsvp-name { font-weight: 600; color: var(--emerald); }
  .rsvp-row:hover .rsvp-name { color: var(--gold); }
  .rsvp-phone { color: var(--ink-muted); font-variant-numeric: tabular-nums; }
  .rsvp-row:hover .rsvp-phone { color: rgba(255,255,255,0.8); }

  /* Dress */
  .page-dress-right { justify-content: center; }
  .dress-block {
    display: flex;
    align-items: center;
    gap: 14px;
    margin: 10px 0;
  }
  .dress-swatch {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.18);
  }
  .dress-side {
    font-size: clamp(7px, 1.1vw, 10px);
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink-muted);
    margin: 0;
  }
  .dress-colour {
    font-size: clamp(14px, 2.6vw, 28px);
    font-weight: 500;
    color: var(--emerald);
    margin: 2px 0 0;
    line-height: 1.1;
  }
  .dress-footer {
    font-size: clamp(11px, 1.8vw, 18px);
    font-style: italic;
    color: var(--ink-muted);
    text-align: center;
    line-height: 1.5;
    margin: 4px 0 0;
  }

  /* ── Nav ── */
  .bk-nav {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .bk-btn {
    background: var(--emerald);
    color: var(--gold);
    border: none;
    border-radius: 50%;
    width: 42px;
    height: 42px;
    font-size: 26px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, opacity 0.2s;
    padding: 0;
    padding-bottom: 2px;
  }
  .bk-btn:hover:not(:disabled) { background: #0e3d2a; }
  .bk-btn:disabled { opacity: 0.3; cursor: default; }
  .bk-dots { display: flex; gap: 8px; }
  .bk-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 1.5px solid var(--emerald);
    background: transparent;
    cursor: pointer;
    padding: 0;
    transition: background 0.2s;
  }
  .bk-dot.active { background: var(--emerald); }
  .bk-dot:hover:not(.active):not(:disabled) { background: var(--emerald-light); }

  /* ── Responsive ── */
  @media (max-width: 600px) {
    .bk-book { aspect-ratio: 0.85; flex-direction: column; }
    .bk-left { border-radius: 4px 4px 0 0; }
    .bk-right { border-radius: 0 0 4px 4px; transform-origin: center top; }
    .bk-spine { width: 100%; height: 8px; }
    @keyframes book-fold-out {
      from { transform: perspective(900px) rotateX(0deg); }
      to   { transform: perspective(900px) rotateX(-90deg); }
    }
    @keyframes book-fold-in {
      from { transform: perspective(900px) rotateX(90deg); }
      to   { transform: perspective(900px) rotateX(0deg); }
    }
    @keyframes book-unfold-out {
      from { transform: perspective(900px) rotateX(0deg); }
      to   { transform: perspective(900px) rotateX(90deg); }
    }
    @keyframes book-unfold-in {
      from { transform: perspective(900px) rotateX(-90deg); }
      to   { transform: perspective(900px) rotateX(0deg); }
    }
  }
`;
