import { useEffect, useMemo, useRef, useState } from 'react';

/* ─── constants ──────────────────────────────────────── */
const RSVP_CONTACTS = [
  ['Mrs Khadijat', '08032278353'],
  ['Mr Oyedokun',  '07038207478'],
  ['OMOT',         '07017990204'],
  ['Aweda',        '08026642105'],
];
const WEDDING_DATE = new Date('2026-11-21T11:00:00');
const SPREAD_LABELS = ['Cover', 'Families', 'Invitation', 'Directions', 'Verse', 'RSVP'];
const TOTAL_SPREADS = 6;

/* ─── helpers ────────────────────────────────────────── */
function pad(n: number) { return String(n).padStart(2, '0'); }

function useGuestName() {
  const [name, setName] = useState('');
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('to') ?? '';
    setName(decodeURIComponent(p.replace(/\+/g, ' ')).trim());
  }, []);
  return name;
}

function useCountdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return useMemo(() => {
    const rem = WEDDING_DATE.getTime() - now;
    if (rem <= 0) return null;
    return {
      days:    Math.floor(rem / 86_400_000),
      hours:   Math.floor((rem % 86_400_000) / 3_600_000),
      minutes: Math.floor((rem % 3_600_000)  / 60_000),
      seconds: Math.floor((rem % 60_000)     / 1_000),
    };
  }, [now]);
}

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 640);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 640);
    window.addEventListener('resize', fn, { passive: true });
    return () => window.removeEventListener('resize', fn);
  }, []);
  return mobile;
}

/* ─── decorative atoms ───────────────────────────────── */
function Diamond({ color = '#c9a84c', size = 10 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden="true" style={{ flexShrink: 0 }}>
      <polygon points="5,0 10,5 5,10 0,5" fill={color} />
    </svg>
  );
}
function Rule({ color = '#c9a84c', my = 20 }: { color?: string; my?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: `${my}px 0` }}>
      <div style={{ flex: 1, height: 1, background: color, opacity: 0.35 }} />
      <Diamond color={color} size={7} />
      <div style={{ flex: 1, height: 1, background: color, opacity: 0.35 }} />
    </div>
  );
}
function Stars({ color = '#c9a84c', gap = 10 }: { color?: string; gap?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap, justifyContent: 'center' }}>
      <Diamond color={color} size={6} />
      <svg width="20" height="20" viewBox="0 0 24 24" fill={color} aria-hidden="true">
        <polygon points="12,1 14.5,9 23,9 16,14 18.5,22 12,17 5.5,22 8,14 1,9 9.5,9" />
      </svg>
      <Diamond color={color} size={6} />
    </div>
  );
}
function Moon({ size = 24, color = '#c9a84c' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z" fill={color} opacity="0.85" />
    </svg>
  );
}

/* ─── page wrappers ──────────────────────────────────── */
type PageProps = { children: React.ReactNode; center?: boolean; style?: React.CSSProperties };
function Emerald({ children, center, style }: PageProps) {
  return <div className="pg pg-emerald" style={{ ...(center ? { alignItems: 'center', textAlign: 'center' } : {}), ...style }}>{children}</div>;
}
function Ivory({ children, center, style }: PageProps) {
  return <div className="pg pg-ivory" style={{ ...(center ? { alignItems: 'center', textAlign: 'center' } : {}), ...style }}>{children}</div>;
}
function Gold({ children, center, style }: PageProps) {
  return <div className="pg pg-gold" style={{ ...(center ? { alignItems: 'center', textAlign: 'center' } : {}), ...style }}>{children}</div>;
}

/* ─── main component ─────────────────────────────────── */
export function ModernNikah() {
  const guest    = useGuestName();
  const countdown = useCountdown();
  const isMobile = useIsMobile();

  /* navigation state */
  const [spread, setSpread] = useState(0);   // 0-5 (desktop=spread, mobile=which spread)
  const [half,   setHalf  ] = useState(0);   // 0=left page, 1=right page (mobile only)
  const [flipping, setFlipping] = useState(false);
  const [slideDir, setSlideDir] = useState<'left' | 'right' | null>(null);

  /* sender bar */
  const [senderName, setSenderName] = useState('');
  const [copied, setCopied] = useState(false);

  const rightRef  = useRef<HTMLDivElement>(null);
  const touchX    = useRef(0);
  const slideKey  = useRef(0);

  const displayGuest   = guest || 'Distinguished Guest';
  const isPersonalised = Boolean(guest);

  /* ── mobile page index (0-11) ── */
  const mobileIndex = spread * 2 + half;
  const mobileTotal = TOTAL_SPREADS * 2;

  /* ── desktop flip ── */
  function desktopFlipTo(next: number) {
    if (flipping || next < 0 || next >= TOTAL_SPREADS) return;
    const el = rightRef.current;
    if (!el) return;
    setFlipping(true);
    const outKf = next > spread ? 'bk-fwd-out' : 'bk-back-out';
    const inKf  = next > spread ? 'bk-fwd-in'  : 'bk-back-in';
    el.style.animation = `${outKf} 0.42s cubic-bezier(.4,0,.6,1) forwards`;
    setTimeout(() => {
      setSpread(next);
      el.style.animation = 'none';
      void el.offsetHeight;
      el.style.animation = `${inKf} 0.42s cubic-bezier(.4,0,1,1) forwards`;
      setTimeout(() => { el.style.animation = ''; setFlipping(false); }, 420);
    }, 420);
  }

  /* ── mobile page turn ── */
  function mobileTo(dir: 'next' | 'prev') {
    if (flipping) return;
    setFlipping(true);
    setSlideDir(dir === 'next' ? 'left' : 'right');
    slideKey.current += 1;
    setTimeout(() => {
      if (dir === 'next') {
        if (half === 0) { setHalf(1); }
        else if (spread < TOTAL_SPREADS - 1) { setSpread(s => s + 1); setHalf(0); }
      } else {
        if (half === 1) { setHalf(0); }
        else if (spread > 0) { setSpread(s => s - 1); setHalf(1); }
      }
      setSlideDir(null);
      setFlipping(false);
    }, 280);
  }

  /* ── touch / swipe ── */
  function onTouchStart(e: React.TouchEvent) { touchX.current = e.touches[0].clientX; }
  function onTouchEnd(e: React.TouchEvent) {
    const delta = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(delta) < 44) return;
    mobileTo(delta < 0 ? 'next' : 'prev');
  }

  /* ── copy link ── */
  function copyLink() {
    if (!senderName.trim()) return;
    const enc = encodeURIComponent(senderName.trim()).replace(/%20/g, '+');
    const url = `${window.location.origin}${window.location.pathname}?to=${enc}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  /* ── content spreads ── */
  type Spread = { left: React.ReactNode; right: React.ReactNode };

  const spreads: Spread[] = [

    /* 0 — COVER */
    {
      left: (
        <Emerald center>
          <div className="cover-frame">
            <Stars color="#c9a84c" gap={12} />
            <p className="cover-bismillah mn-serif">
              In the name of Allah,<br />the Most Beneficent,<br />the Most Merciful
            </p>
            <Rule color="#c9a84c" my={14} />
            <h1 className="cover-names mn-serif">
              Ahmad<br /><span className="cover-amp">&amp;</span><br />Toyibat
            </h1>
            <Rule color="#c9a84c" my={14} />
            <p className="cover-date mn-serif">Saturday, 21st November 2026</p>
            <p className="cover-place">Ijebu Ode · Ogun State · Nigeria</p>
            <div style={{ marginTop: 18 }}><Stars color="#c9a84c" gap={12} /></div>
          </div>
        </Emerald>
      ),
      right: (
        <div className="pg cover-photo-pg">
          <img src="/__mockup/images/couple4.png" alt="Ahmad Opeyemi and Toyibat Adeola" className="cover-photo" />
          <div className="cover-photo-footer">
            <Rule color="#c9a84c" my={8} />
            <p className="cover-caption mn-serif">Ahmad Opeyemi &amp; Toyibat Adeola</p>
          </div>
        </div>
      ),
    },

    /* 1 — GUEST + FAMILIES */
    {
      left: (
        <Emerald center>
          <Moon size={30} color="#c9a84c" />
          <p className="kicker" style={{ color: 'var(--gold)', marginTop: 14 }}>A personal invitation for</p>
          <p className="guest-name mn-serif">{displayGuest}</p>
          <Rule color="rgba(201,168,76,.45)" my={18} />
          <p className="guest-sub" style={{ color: 'rgba(253,248,240,.62)' }}>
            You are warmly and joyfully invited to witness the Nikah of our beloved children
          </p>
          <p className="mn-serif" style={{ fontSize: 'clamp(14px,2.6vw,26px)', color: '#fff', marginTop: 10, fontStyle: 'italic', letterSpacing: '-.02em' }}>
            Ahmad &amp; Toyibat
          </p>
        </Emerald>
      ),
      right: (
        <Ivory>
          <p className="kicker">With the blessings of</p>
          <h2 className="section-title mn-serif">Two Families</h2>
          <Rule my={16} />
          <div className="family-card">
            <p className="kicker family-sub-kicker">The Groom's Family</p>
            <p className="family-name mn-serif">Prof Taofiki<br />&amp; Alhaja Basirat Salako</p>
          </div>
          <div className="family-and-row">
            <div className="family-line" /><span className="family-and">and</span><div className="family-line" />
          </div>
          <div className="family-card">
            <p className="kicker family-sub-kicker">The Bride's Family</p>
            <p className="family-name mn-serif">Khalifah Abdul-Hafeez<br />&amp; Alhaja Kudratu-Llah Otunuyi</p>
          </div>
        </Ivory>
      ),
    },

    /* 2 — INVITE + DATE */
    {
      left: (
        <Ivory center>
          <p className="kicker">Cordially invite</p>
          <p className="invite-guest mn-serif">{displayGuest}</p>
          <p className="invite-sub">to witness the solemnization of</p>
          <Rule my={14} />
          <p className="invite-couple mn-serif">
            Ahmad Opeyemi<br /><span className="invite-amp">&amp;</span><br />Toyibat Adeola
          </p>
          <Rule my={14} />
          <p className="footnote-i">Reception follows immediately at the same venue</p>
        </Ivory>
      ),
      right: (
        <Emerald>
          <p className="kicker" style={{ color: 'var(--gold)' }}>The occasion</p>
          <h2 className="section-title mn-serif" style={{ color: '#fff' }}>Date &amp; Venue</h2>
          <Rule color="rgba(201,168,76,.5)" my={18} />
          {[
            ['Date', <span key="d">Saturday<br />21st November 2026</span>],
            ['Time', '11 : 00 am'],
            ['Venue', <span key="v">Rolak Hotel &amp; Suites<br />Adetola Hall, Imowo Eleran<br />Ijebu Ode, Ogun State</span>],
          ].map(([lbl, val]) => (
            <div key={String(lbl)} className="detail-item">
              <span className="detail-lbl" style={{ color: 'var(--gold)' }}>{lbl}</span>
              <span className="detail-val mn-serif" style={{ color: '#fff' }}>{val}</span>
            </div>
          ))}
        </Emerald>
      ),
    },

    /* 3 — DIRECTIONS + COUNTDOWN */
    {
      left: (
        <Ivory>
          <p className="kicker">Getting there</p>
          <h2 className="section-title mn-serif">Directions</h2>
          <Rule my={16} />
          <div className="dir-flow">
            <div className="dir-step">
              <div className="dir-dot" />
              <p className="dir-text mn-serif">From Lagos Garage</p>
            </div>
            <div className="dir-line-v" />
            <div className="dir-step">
              <div className="dir-dot dir-dot-dest" />
              <div>
                <p className="dir-text mn-serif" style={{ color: 'var(--emerald)' }}>Rolak Hotel &amp; Suites</p>
                <p className="dir-sub">Beside Imowo Community<br />Primary School, Ijebu Ode</p>
              </div>
            </div>
          </div>
          <Rule my={18} />
          <p className="footnote-i">Reception immediately follows at the same venue</p>
        </Ivory>
      ),
      right: (
        <Gold center>
          <Moon size={26} color="var(--emerald)" />
          <p className="kicker" style={{ color: 'var(--emerald)', marginTop: 12 }}>Counting down to</p>
          <p className="mn-serif" style={{ fontSize: 'clamp(22px,4.5vw,46px)', fontWeight: 500, color: 'var(--emerald)', letterSpacing: '-.04em', margin: '6px 0' }}>
            The Nikah
          </p>
          <Rule color="var(--emerald)" my={14} />
          {countdown ? (
            <div className="cd-grid">
              {Object.entries(countdown).map(([lbl, val]) => (
                <div key={lbl} className="cd-cell">
                  <span className="cd-num mn-serif">{pad(val)}</span>
                  <span className="cd-lbl">{lbl}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mn-serif" style={{ color: 'var(--emerald)', fontSize: 17, fontStyle: 'italic', lineHeight: 1.7 }}>
              The day has arrived.<br />Barak Allahu Lakuma.
            </p>
          )}
          <Rule color="var(--emerald)" my={14} />
          <p className="mn-serif" style={{ fontSize: 'clamp(14px,2.4vw,22px)', color: 'var(--emerald)', letterSpacing: '.1em' }}>21 · 11 · 2026</p>
        </Gold>
      ),
    },

    /* 4 — TOAST + VERSE */
    {
      left: (
        <Emerald center>
          <Stars color="#c9a84c" gap={10} />
          <p className="kicker" style={{ color: 'var(--gold)', marginTop: 14 }}>A toast</p>
          <Rule color="rgba(201,168,76,.4)" my={14} />
          <blockquote className="toast mn-serif">
            <p>By fate, we met. By choice, we stay.</p>
            <p>Today, we begin our journey as one soul,</p>
            <p>two hearts beating as one.</p>
            <p>We promise to grow together,</p>
            <p>pray and love each other forever.</p>
          </blockquote>
          <Rule color="rgba(201,168,76,.4)" my={14} />
          <p className="toast-finale mn-serif">To our beautiful beginning 🎉🎉</p>
          <cite className="toast-cite">T&amp;A Union · 2026</cite>
        </Emerald>
      ),
      right: (
        <Ivory center>
          <Moon size={26} color="var(--emerald)" />
          <p className="kicker" style={{ marginTop: 12 }}>A verse for the occasion</p>
          <Rule my={14} />
          <blockquote className="verse mn-serif">
            "And among His signs is this, that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts: Verily in that are signs for those who reflect."
          </blockquote>
          <p className="verse-ref">— Al-Rum (30:21)</p>
          <Rule my={14} />
          <p className="mn-serif" style={{ fontSize: 'clamp(9px,1.4vw,13px)', fontStyle: 'italic', color: 'var(--ink-muted)', lineHeight: 1.6 }}>
            Barak Allahu Lakuma wa Baraka Alaykuma<br />wa Jama'a Baynakuma fi Khayr
          </p>
        </Ivory>
      ),
    },

    /* 5 — RSVP + DRESS */
    {
      left: (
        <Ivory>
          <p className="kicker">Kindly respond</p>
          <h2 className="section-title mn-serif">R&nbsp;S&nbsp;V&nbsp;P</h2>
          <Rule my={16} />
          <div className="rsvp-list">
            {RSVP_CONTACTS.map(([name, phone]) => (
              <a key={phone} href={`tel:${phone}`} className="rsvp-row">
                <span className="rsvp-name">{name}</span>
                <span className="rsvp-phone">{phone}</span>
              </a>
            ))}
          </div>
          <Rule my={16} />
          <p className="footnote-i">Tap any contact to call directly</p>
        </Ivory>
      ),
      right: (
        <Emerald center>
          <p className="kicker" style={{ color: 'var(--gold)' }}>Aso-Ebi</p>
          <h2 className="section-title mn-serif" style={{ color: '#fff' }}>Dress Code</h2>
          <Rule color="rgba(201,168,76,.45)" my={18} />
          <div className="dress-row">
            <div className="dress-swatch" style={{ background: '#c9a84c' }} />
            <div>
              <p className="dress-side">Bride&apos;s Colour</p>
              <p className="dress-colour mn-serif">Champagne Gold</p>
            </div>
          </div>
          <Rule color="rgba(201,168,76,.3)" my={14} />
          <div className="dress-row">
            <div className="dress-swatch" style={{ background: '#e8f0ec' }} />
            <div>
              <p className="dress-side">Groom&apos;s Colour</p>
              <p className="dress-colour mn-serif">Emerald Green</p>
            </div>
          </div>
          <Rule color="rgba(201,168,76,.3)" my={18} />
          <p className="mn-serif" style={{ fontSize: 'clamp(10px,1.6vw,15px)', fontStyle: 'italic', color: 'rgba(253,248,240,.7)', lineHeight: 1.6 }}>
            We look forward to celebrating<br />this joyous occasion with you.
          </p>
        </Emerald>
      ),
    },
  ];

  const currentLeft  = spreads[spread].left;
  const currentRight = spreads[spread].right;
  const mobileContent = half === 0 ? currentLeft : currentRight;

  const canPrev = isMobile ? mobileIndex > 0 : spread > 0;
  const canNext = isMobile ? mobileIndex < mobileTotal - 1 : spread < TOTAL_SPREADS - 1;

  return (
    <div className="bk-root">
      <link
        rel="stylesheet" media="print"
        onLoad={(e) => { e.currentTarget.media = 'all'; }}
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap"
      />
      <style>{CSS}</style>

      {/* ── sender bar ── */}
      {!isPersonalised && (
        <div className="sender-bar">
          <span className="sender-label">Personalise</span>
          <input
            className="sender-input"
            type="text"
            placeholder="Guest name…"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && copyLink()}
          />
          <button className="sender-btn" onClick={copyLink} disabled={!senderName.trim()}>
            {copied ? '✓ Copied!' : 'Copy link'}
          </button>
        </div>
      )}

      <div className="bk-scene">

        {isMobile ? (
          /* ══ MOBILE: single page ══ */
          <div
            className="bk-phone"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* tap zones */}
            <button
              className="tap-zone tap-zone-left"
              onClick={() => mobileTo('prev')}
              disabled={!canPrev || flipping}
              aria-label="Previous page"
            />
            <button
              className="tap-zone tap-zone-right"
              onClick={() => mobileTo('next')}
              disabled={!canNext || flipping}
              aria-label="Next page"
            />

            {/* page content */}
            <div
              key={slideKey.current}
              className={`bk-phone-page ${slideDir === 'left' ? 'slide-out-left' : slideDir === 'right' ? 'slide-out-right' : 'slide-in'}`}
            >
              {mobileContent}
            </div>

            {/* page indicator */}
            <div className="phone-pg-num">
              {mobileIndex + 1} / {mobileTotal}
            </div>
          </div>

        ) : (
          /* ══ DESKTOP: open book ══ */
          <div className="bk-book">
            <div className="bk-half bk-left">
              {currentLeft}
              <span className="pg-num pg-left">{spread * 2 + 1}</span>
            </div>
            <div className="bk-spine"><div className="bk-spine-inner" /></div>
            <div className="bk-half bk-right" ref={rightRef}>
              {currentRight}
              <span className="pg-num pg-right">{spread * 2 + 2}</span>
            </div>
          </div>
        )}

        {/* ── nav ── */}
        <nav className={`bk-nav${isMobile ? ' bk-nav-mobile' : ''}`} aria-label="Page navigation">
          <button
            className="bk-arrow"
            onClick={() => isMobile ? mobileTo('prev') : desktopFlipTo(spread - 1)}
            disabled={!canPrev || flipping}
            aria-label="Previous"
          >‹</button>

          <div className="bk-dots" role="tablist">
            {spreads.map((_, i) => {
              const isActive = isMobile
                ? (spread === i && half === 0) || (spread === i && half === 1)
                  ? spread === i
                  : false
                : spread === i;
              return (
                <button
                  key={i}
                  role="tab"
                  aria-selected={isActive}
                  className={`bk-dot${isActive ? ' bk-dot-on' : ''}`}
                  onClick={() => {
                    if (isMobile) { setSpread(i); setHalf(0); }
                    else desktopFlipTo(i);
                  }}
                  disabled={flipping}
                  aria-label={SPREAD_LABELS[i]}
                />
              );
            })}
            {/* mobile: half-dot to show which page in spread */}
            {isMobile && (
              <button
                className={`bk-half-dot${half === 1 ? ' bk-dot-on' : ''}`}
                onClick={() => setHalf(h => h === 0 ? 1 : 0)}
                aria-label="Toggle page"
              />
            )}
          </div>

          <button
            className="bk-arrow"
            onClick={() => isMobile ? mobileTo('next') : desktopFlipTo(spread + 1)}
            disabled={!canNext || flipping}
            aria-label="Next"
          >›</button>
        </nav>

        {!isMobile && (
          <p className="bk-label">
            {SPREAD_LABELS[spread]} · {spread + 1} / {TOTAL_SPREADS}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── CSS ─────────────────────────────────────────────── */
const CSS = `
  /* ── tokens ── */
  .bk-root {
    --emerald:      #1a5c42;
    --emerald-mid:  #246650;
    --emerald-dark: #0e3d2a;
    --gold:         #c9a84c;
    --gold-light:   #e8d49a;
    --gold-pale:    #f8f0dc;
    --ivory:        #fdf8f0;
    --ivory-mid:    #f5edd8;
    --ink:          #1a1a18;
    --ink-muted:    #6a6a60;

    background: #e8ddc8;
    background-image: radial-gradient(ellipse at 30% 30%, #d9cdb0, #e8ddc8 60%);
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    padding: 16px;
  }
  .bk-root * { box-sizing: border-box; margin: 0; }
  .bk-root a { color: inherit; text-decoration: none; }
  .mn-serif { font-family: 'Cormorant Garamond', Georgia, serif; }

  /* ── sender bar ── */
  .sender-bar {
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
    background: var(--emerald-dark);
    color: var(--gold-light);
    padding: 10px 16px;
    border-radius: 6px;
    margin-bottom: 14px;
    width: 100%; max-width: 880px;
  }
  .sender-label {
    font-size: 10px; font-weight: 600; letter-spacing: .18em;
    text-transform: uppercase; white-space: nowrap; flex-shrink: 0;
  }
  .sender-input {
    flex: 1; min-width: 120px;
    background: rgba(255,255,255,.1);
    border: 1px solid rgba(201,168,76,.4);
    border-radius: 4px; color: #fff;
    font-size: 13px; padding: 6px 12px; outline: none;
    font-family: 'DM Sans', sans-serif;
  }
  .sender-input::placeholder { color: rgba(255,255,255,.35); }
  .sender-input:focus { border-color: var(--gold); }
  .sender-btn {
    background: var(--gold); color: var(--emerald-dark);
    border: none; border-radius: 4px;
    font-size: 12px; font-weight: 700; letter-spacing: .06em;
    padding: 7px 14px; cursor: pointer; white-space: nowrap;
    flex-shrink: 0; transition: opacity .2s;
    font-family: 'DM Sans', sans-serif;
  }
  .sender-btn:disabled { opacity: .38; cursor: default; }

  /* ── scene ── */
  .bk-scene {
    display: flex; flex-direction: column;
    align-items: center; gap: 18px;
    width: 100%; max-width: 880px;
  }

  /* ── desktop book ── */
  .bk-book {
    display: flex; width: 100%; aspect-ratio: 1.52;
    box-shadow: 0 28px 70px rgba(0,0,0,.30), 0 8px 20px rgba(0,0,0,.16), 0 2px 6px rgba(0,0,0,.10);
    border-radius: 3px 6px 6px 3px;
    perspective: 2400px;
  }
  .bk-half { flex: 1; position: relative; overflow: hidden; }
  .bk-left  { border-radius: 3px 0 0 3px; }
  .bk-right {
    border-radius: 0 6px 6px 0;
    transform-origin: left center;
    transform-style: preserve-3d;
    will-change: transform;
  }
  .bk-spine {
    width: 12px; flex-shrink: 0;
    background: linear-gradient(to right, #8a7455 0%, #d4bc90 35%, #f0e2c0 50%, #d4bc90 65%, #8a7455 100%);
    position: relative; z-index: 2;
  }
  .bk-spine-inner {
    position: absolute; inset: 0;
    background: repeating-linear-gradient(to bottom, transparent 0, transparent 18px, rgba(0,0,0,.06) 18px, rgba(0,0,0,.06) 19px);
  }
  .pg-num {
    position: absolute; bottom: 11px;
    font-size: 9px; font-weight: 600; letter-spacing: .16em;
    text-transform: uppercase; opacity: .5; color: var(--gold);
  }
  .pg-left  { left: 14px; }
  .pg-right { right: 14px; }

  /* ── desktop flip keyframes ── */
  @keyframes bk-fwd-out  { from{transform:perspective(2400px) rotateY(0)}    to{transform:perspective(2400px) rotateY(-90deg)} }
  @keyframes bk-fwd-in   { from{transform:perspective(2400px) rotateY(90deg)} to{transform:perspective(2400px) rotateY(0)} }
  @keyframes bk-back-out { from{transform:perspective(2400px) rotateY(0)}    to{transform:perspective(2400px) rotateY(90deg)} }
  @keyframes bk-back-in  { from{transform:perspective(2400px) rotateY(-90deg)} to{transform:perspective(2400px) rotateY(0)} }

  /* ── mobile phone single-page ── */
  .bk-phone {
    width: 100%;
    max-width: 420px;
    aspect-ratio: 0.62;
    border-radius: 18px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 24px 64px rgba(0,0,0,.28), 0 6px 18px rgba(0,0,0,.16);
  }
  .bk-phone-page {
    width: 100%; height: 100%;
    position: absolute; inset: 0;
  }
  /* tap zones */
  .tap-zone {
    position: absolute; top: 0; bottom: 0;
    width: 30%; z-index: 10;
    background: transparent; border: none; cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .tap-zone-left  { left: 0; }
  .tap-zone-right { right: 0; }
  .tap-zone:disabled { cursor: default; }

  /* mobile slide animations */
  @keyframes slide-enter { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slide-exit-l { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(-32px)} }
  @keyframes slide-exit-r { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(32px)} }
  .slide-in      { animation: slide-enter .32s cubic-bezier(.25,.8,.5,1) both; }
  .slide-out-left  { animation: slide-exit-l .28s ease both; }
  .slide-out-right { animation: slide-exit-r .28s ease both; }

  .phone-pg-num {
    position: absolute; bottom: 12px; left: 0; right: 0;
    text-align: center;
    font-size: 10px; font-weight: 600; letter-spacing: .16em;
    text-transform: uppercase; color: var(--gold); opacity: .7;
    pointer-events: none; z-index: 5;
  }

  /* ── nav ── */
  .bk-nav {
    display: flex; align-items: center; gap: 16px;
  }
  .bk-nav-mobile {
    width: 100%; max-width: 420px;
    background: rgba(14,61,42,.88);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 999px;
    padding: 10px 20px;
    justify-content: center;
  }
  .bk-arrow {
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--emerald); color: var(--gold);
    border: none; font-size: 26px; line-height: 1;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background .18s, opacity .18s;
    padding-bottom: 2px; font-family: serif; flex-shrink: 0;
  }
  .bk-nav-mobile .bk-arrow {
    width: 44px; height: 44px; font-size: 28px;
    background: transparent; color: var(--gold);
  }
  .bk-nav-mobile .bk-arrow:hover:not(:disabled) { background: rgba(255,255,255,.08); }
  .bk-arrow:hover:not(:disabled) { background: var(--emerald-dark); }
  .bk-arrow:disabled { opacity: .28; cursor: default; }
  .bk-dots { display: flex; gap: 7px; align-items: center; }
  .bk-dot {
    width: 8px; height: 8px; border-radius: 50%;
    border: 1.5px solid var(--gold); background: transparent;
    cursor: pointer; padding: 0;
    transition: background .18s, transform .18s, border-color .18s;
  }
  .bk-nav-mobile .bk-dot { border-color: rgba(201,168,76,.55); }
  .bk-dot-on { background: var(--gold); transform: scale(1.25); }
  .bk-dot:hover:not(.bk-dot-on):not(:disabled) { background: rgba(201,168,76,.3); }
  .bk-half-dot {
    width: 5px; height: 5px; border-radius: 50%;
    border: 1px solid rgba(201,168,76,.5); background: transparent;
    cursor: pointer; padding: 0; margin-left: -3px;
    transition: background .18s;
  }
  .bk-half-dot.bk-dot-on { background: rgba(201,168,76,.6); }
  .bk-label {
    font-size: 10px; font-weight: 600; letter-spacing: .18em;
    text-transform: uppercase; color: var(--emerald); opacity: .6;
  }

  /* ── page base ── */
  .pg {
    height: 100%; display: flex; flex-direction: column;
    justify-content: center;
    padding: clamp(18px,4.5%,44px) clamp(16px,4%,40px);
    overflow: hidden;
  }
  .pg-emerald {
    background: var(--emerald);
    background-image: radial-gradient(ellipse at 70% 20%, var(--emerald-mid), var(--emerald) 60%);
    color: var(--ivory);
  }
  .pg-ivory {
    background: var(--ivory);
    background-image: linear-gradient(135deg,#fdf8f0,#f8f0e2 100%);
    color: var(--ink);
  }
  .pg-gold {
    background: var(--gold-pale);
    background-image: radial-gradient(ellipse at 50% 80%,#f0e0b0,var(--gold-pale) 70%);
    color: var(--ink);
  }
  .cover-photo-pg {
    height: 100%; overflow: hidden; position: relative;
    background: var(--ivory-mid);
    display: flex; flex-direction: column;
  }
  .cover-photo {
    flex: 1; width: 100%;
    object-fit: cover; object-position: center top;
    display: block; min-height: 0;
  }
  .cover-photo-footer { padding: 4px 16px 14px; background: #fff; }
  .cover-caption {
    font-size: clamp(10px,1.5vw,14px); font-style: italic;
    color: var(--ink-muted); text-align: center;
  }

  /* ── type atoms ── */
  .kicker {
    font-size: clamp(7px,1.1vw,10px); font-weight: 600;
    letter-spacing: .22em; text-transform: uppercase; color: var(--gold);
  }
  .section-title {
    font-size: clamp(24px,4.2vw,50px); font-weight: 500;
    letter-spacing: -.04em; line-height: .9;
    color: var(--emerald); margin-top: 6px;
  }

  /* cover */
  .cover-frame { display:flex; flex-direction:column; align-items:center; gap:4px; text-align:center; width:100%; }
  .cover-bismillah { font-size:clamp(10px,1.5vw,14px); font-style:italic; color:rgba(253,248,240,.7); line-height:1.7; margin-top:10px; }
  .cover-names { font-size:clamp(40px,7.5vw,90px); font-weight:500; color:#fff; line-height:.88; letter-spacing:-.045em; margin:4px 0; }
  .cover-amp { display:block; font-size:clamp(22px,4vw,48px); color:var(--gold); font-style:italic; line-height:1.2; }
  .cover-date { font-size:clamp(12px,2vw,22px); color:var(--gold); font-style:italic; }
  .cover-place { font-size:clamp(7px,1.1vw,10px); letter-spacing:.22em; text-transform:uppercase; color:rgba(253,248,240,.5); margin-top:4px; }

  /* guest */
  .guest-name { font-size:clamp(20px,4vw,48px); font-weight:500; color:var(--gold); line-height:1.1; letter-spacing:-.03em; margin:10px 0 4px; overflow-wrap:break-word; }
  .guest-sub { font-size:clamp(10px,1.4vw,13px); line-height:1.7; max-width:90%; }

  /* families */
  .family-card { background:rgba(26,92,66,.05); border-left:3px solid var(--gold); padding:clamp(8px,1.5%,14px) clamp(10px,2%,18px); }
  .family-sub-kicker { color:var(--ink-muted)!important; margin-bottom:4px; }
  .family-name { font-size:clamp(12px,2.2vw,24px); color:var(--emerald); font-weight:500; line-height:1.25; }
  .family-and-row { display:flex; align-items:center; gap:10px; margin:10px 0; }
  .family-line { flex:1; height:1px; background:var(--gold); opacity:.35; }
  .family-and { font-size:clamp(8px,1.2vw,11px); font-weight:600; letter-spacing:.18em; text-transform:uppercase; color:var(--gold); }

  /* invite */
  .invite-guest { font-size:clamp(18px,3.5vw,42px); font-weight:500; color:var(--emerald); line-height:1.1; letter-spacing:-.025em; margin:8px 0; overflow-wrap:break-word; }
  .invite-sub { font-size:clamp(9px,1.4vw,13px); color:var(--ink-muted); line-height:1.6; font-style:italic; }
  .invite-couple { font-size:clamp(20px,4vw,48px); font-weight:500; color:var(--emerald); line-height:1.0; letter-spacing:-.04em; }
  .invite-amp { display:block; font-size:.55em; color:var(--gold); font-style:italic; line-height:1.4; }
  .footnote-i { font-size:clamp(8px,1.2vw,11px); color:var(--ink-muted); font-style:italic; line-height:1.6; }

  /* detail */
  .detail-item { display:flex; flex-direction:column; gap:3px; padding:10px 0; border-bottom:1px solid rgba(201,168,76,.22); }
  .detail-item:last-child { border-bottom:none; }
  .detail-lbl { font-size:clamp(7px,1vw,9px); font-weight:600; letter-spacing:.22em; text-transform:uppercase; }
  .detail-val { font-size:clamp(13px,2.3vw,27px); line-height:1.25; }

  /* directions */
  .dir-flow { margin:10px 0; }
  .dir-step { display:flex; align-items:flex-start; gap:12px; }
  .dir-dot { width:10px; height:10px; border-radius:50%; background:var(--gold); flex-shrink:0; margin-top:5px; }
  .dir-dot-dest { background:var(--emerald); width:12px; height:12px; margin-top:4px; }
  .dir-line-v { width:1px; height:26px; background:var(--gold); opacity:.4; margin-left:4px; }
  .dir-text { font-size:clamp(13px,2.2vw,23px); color:var(--ink); }
  .dir-sub { font-size:clamp(8px,1.2vw,11px); color:var(--ink-muted); line-height:1.6; margin-top:3px; }

  /* countdown */
  .cd-grid { display:flex; gap:clamp(8px,2vw,20px); justify-content:center; flex-wrap:wrap; }
  .cd-cell { display:flex; flex-direction:column; align-items:center; }
  .cd-num { font-size:clamp(28px,5.5vw,60px); line-height:1; color:var(--emerald); font-weight:500; }
  .cd-lbl { font-size:clamp(6px,.9vw,8px); font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:var(--ink-muted); margin-top:4px; }

  /* toast */
  .toast { font-size:clamp(13px,2.3vw,26px); font-style:italic; line-height:1.75; color:#fff; text-align:center; }
  .toast p { margin:0; }
  .toast-s2 { opacity:.82; }
  .toast-divider { font-size:clamp(14px,1.8vw,18px); color:var(--gold); opacity:.65; margin:clamp(8px,1.4vw,14px) 0; letter-spacing:.4em; }
  .toast-finale { font-size:clamp(14px,2.4vw,28px); font-style:italic; font-weight:500; color:var(--gold); text-align:center; letter-spacing:-.01em; margin-bottom:4px; }
  .toast-cite { font-size:clamp(8px,1vw,10px); font-style:normal; font-weight:600; letter-spacing:.22em; text-transform:uppercase; color:rgba(201,168,76,.7); text-align:center; }

  /* verse */
  .verse { font-size:clamp(11px,1.7vw,17px); font-style:italic; line-height:1.75; color:var(--ink); text-align:center; max-width:90%; margin:0 auto; }
  .verse-ref { font-size:clamp(8px,1.1vw,10px); font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:var(--emerald); text-align:center; margin-top:8px; }

  /* rsvp */
  .rsvp-list { display:flex; flex-direction:column; gap:8px; }
  .rsvp-row { display:flex; justify-content:space-between; align-items:center; padding:clamp(9px,1.4%,13px) clamp(11px,2%,18px); border:1.5px solid var(--emerald); border-radius:3px; font-size:clamp(10px,1.4vw,13px); transition:background .18s,color .18s; cursor:pointer; }
  .rsvp-row:hover { background:var(--emerald); color:#fff; }
  .rsvp-name { font-weight:600; color:var(--emerald); transition:color .18s; }
  .rsvp-row:hover .rsvp-name { color:var(--gold); }
  .rsvp-phone { color:var(--ink-muted); font-variant-numeric:tabular-nums; font-size:clamp(9px,1.2vw,11px); }
  .rsvp-row:hover .rsvp-phone { color:rgba(255,255,255,.75); }

  /* dress */
  .dress-row { display:flex; align-items:center; gap:16px; }
  .dress-swatch { width:36px; height:36px; border-radius:50%; flex-shrink:0; box-shadow:0 0 0 3px rgba(255,255,255,.18); }
  .dress-side { font-size:clamp(7px,1.1vw,10px); font-weight:600; letter-spacing:.18em; text-transform:uppercase; color:var(--gold-light); }
  .dress-colour { font-size:clamp(15px,2.5vw,28px); font-weight:500; color:#fff; letter-spacing:-.02em; margin-top:2px; }

  /* ── mobile overrides ── */
  @media (max-width: 639px) {
    .bk-root { padding: 0; background: var(--emerald-dark); justify-content: flex-start; }
    .sender-bar { border-radius: 0; margin-bottom: 0; }
    .bk-scene { gap: 0; max-width: 100%; height: 100dvh; justify-content: flex-start; }
    .bk-phone { max-width: 100%; width: 100%; border-radius: 0; aspect-ratio: unset; flex: 1; }
    .bk-phone-page { border-radius: 0; }
    .bk-nav-mobile { max-width: 100%; border-radius: 0; padding: 12px 20px 20px; }

    /* larger text on phone */
    .cover-names  { font-size: clamp(56px, 17vw, 90px); }
    .cover-date   { font-size: clamp(16px, 4.5vw, 24px); }
    .cover-place  { font-size: clamp(9px, 2.2vw, 12px); }
    .cover-bismillah { font-size: clamp(12px, 3.2vw, 16px); }
    .guest-name   { font-size: clamp(28px, 8vw, 50px); }
    .section-title { font-size: clamp(32px, 9vw, 52px); }
    .family-name  { font-size: clamp(16px, 4.5vw, 24px); }
    .invite-guest { font-size: clamp(22px, 7vw, 38px); }
    .invite-couple { font-size: clamp(26px, 8vw, 42px); }
    .detail-val   { font-size: clamp(18px, 5vw, 28px); }
    .dir-text     { font-size: clamp(18px, 5vw, 24px); }
    .dir-sub      { font-size: clamp(11px, 3vw, 14px); }
    .cd-num       { font-size: clamp(36px, 10vw, 60px); }
    .toast        { font-size: clamp(20px, 5.5vw, 32px); }
    .verse        { font-size: clamp(14px, 4vw, 20px); }
    .rsvp-row     { padding: 14px 18px; }
    .rsvp-name    { font-size: 15px; }
    .rsvp-phone   { font-size: 14px; }
    .dress-colour { font-size: clamp(18px, 5vw, 28px); }
    .kicker       { font-size: clamp(9px, 2.2vw, 11px); }
    .pg           { padding: clamp(28px, 6%, 56px) clamp(24px, 6%, 48px); }
  }
`;
