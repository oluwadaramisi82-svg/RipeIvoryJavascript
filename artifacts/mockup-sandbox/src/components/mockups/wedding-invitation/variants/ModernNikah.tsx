import { useEffect, useMemo, useState } from 'react';

const rsvpContacts = [
  ['Mrs Khadijat', '08032278353'],
  ['Mr Oyedokun', '07038207478'],
  ['OMOT', '07017990204'],
  ['Aweda', '08026642105'],
];

function twoDigits(value: number) {
  return String(value).padStart(2, '0');
}

// Islamic 8-pointed star motif as inline SVG
function StarMotif({ size = 48, color = '#c9a84c' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <polygon points="24,2 29,18 44,18 32,28 37,44 24,35 11,44 16,28 4,18 19,18" fill={color} opacity="0.22" />
      <polygon points="24,6 28,19 42,19 31,27 35,41 24,33 13,41 17,27 6,19 20,19" fill={color} opacity="0.55" />
    </svg>
  );
}

// Geometric border strip
function GeoBorder({ color = '#c9a84c' }: { color?: string }) {
  return (
    <svg width="100%" height="16" viewBox="0 0 240 16" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="geo-diamond" x="0" y="0" width="24" height="16" patternUnits="userSpaceOnUse">
          <polygon points="12,1 23,8 12,15 1,8" fill="none" stroke={color} strokeWidth="1" opacity="0.6" />
          <rect x="10.5" y="6.5" width="3" height="3" fill={color} opacity="0.4" transform="rotate(45 12 8)" />
        </pattern>
      </defs>
      <rect width="100%" height="16" fill="url(#geo-diamond)" />
    </svg>
  );
}

export function ModernNikah() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const countdown = useMemo(() => {
    const remaining = new Date('2026-11-21T11:00:00').getTime() - now;
    if (remaining <= 0) return null;
    return {
      days: Math.floor(remaining / 86400000),
      hours: Math.floor((remaining % 86400000) / 3600000),
      minutes: Math.floor((remaining % 3600000) / 60000),
      seconds: Math.floor((remaining % 60000) / 1000),
    };
  }, [now]);

  return (
    <div className="mn-root">
      <link
        rel="stylesheet"
        media="print"
        onLoad={(e) => { e.currentTarget.media = 'all'; }}
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@400;500;600&display=swap"
      />
      <style>{`
        /* ── Tokens ── */
        .mn-root {
          --emerald: #1a5c42;
          --emerald-mid: #276b4e;
          --emerald-light: #e8f0ec;
          --gold: #c9a84c;
          --gold-pale: #f5ead2;
          --ivory: #fdf8f0;
          --ink: #1a1a18;
          --ink-muted: #5a5a50;
          background: var(--ivory);
          color: var(--ink);
          font-family: 'DM Sans', sans-serif;
          min-height: 100dvh;
        }
        .mn-root * { box-sizing: border-box; }
        .mn-root a { color: inherit; text-decoration: none; }
        .mn-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .mn-wrap { margin: 0 auto; max-width: 1280px; padding-left: clamp(20px, 5vw, 72px); padding-right: clamp(20px, 5vw, 72px); }
        .mn-kicker { font-size: 10px; font-weight: 600; letter-spacing: .22em; text-transform: uppercase; color: var(--gold); margin: 0; }

        /* ── Hero ── */
        .mn-hero {
          background: var(--emerald);
          color: var(--ivory);
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: min(860px, 100dvh);
          position: relative;
          overflow: hidden;
        }
        /* decorative arch behind photo */
        .mn-hero::before {
          content: '';
          position: absolute;
          inset: 0 50% 0 auto;
          width: 52%;
          background: var(--emerald-mid);
          clip-path: ellipse(100% 52% at 100% 50%);
          pointer-events: none;
        }
        .mn-hero-copy {
          align-self: center;
          padding: 72px clamp(20px, 6vw, 88px) 72px clamp(20px, 8vw, 104px);
          position: relative;
          z-index: 1;
        }
        .mn-bismillah {
          font-size: 11px;
          line-height: 1.8;
          color: var(--gold-pale);
          margin: 0 0 48px;
          max-width: 220px;
        }
        .mn-names {
          font-size: clamp(60px, 9vw, 140px);
          font-weight: 500;
          letter-spacing: -.06em;
          line-height: .78;
          margin: 0 0 48px;
          color: #fff;
        }
        .mn-names em {
          display: block;
          font-style: normal;
          color: var(--gold);
        }
        .mn-amp {
          font-size: clamp(18px, 2.5vw, 32px);
          color: var(--gold);
          display: block;
          margin: 12px 0 8px clamp(2px, 0.5vw, 8px);
          font-style: italic;
        }
        .mn-hero-sub {
          font-size: 12px;
          line-height: 1.8;
          color: var(--gold-pale);
          max-width: 240px;
        }
        .mn-photo-wrap {
          position: relative;
          z-index: 1;
          overflow: hidden;
          display: flex;
          align-items: stretch;
        }
        .mn-photo-wrap img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
        }
        /* gold frame line on photo */
        .mn-photo-wrap::after {
          content: '';
          position: absolute;
          inset: 20px;
          border: 1.5px solid var(--gold);
          opacity: .35;
          pointer-events: none;
        }

        /* ── Gold band ── */
        .mn-band {
          background: var(--gold);
          padding: 14px 0;
          text-align: center;
        }
        .mn-band-text {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .28em;
          text-transform: uppercase;
          color: var(--emerald);
        }

        /* ── Invitation block ── */
        .mn-invite {
          padding: clamp(72px, 10vw, 140px) 0;
        }
        .mn-invite-inner {
          display: grid;
          grid-template-columns: minmax(160px, .6fr) 1fr;
          gap: 6vw;
          align-items: start;
        }
        .mn-invite-label { padding-top: 6px; }
        .mn-invite-label p + p { margin-top: 12px; color: var(--ink-muted); font-size: 10px; letter-spacing: .1em; text-transform: uppercase; }
        .mn-quote {
          font-size: clamp(24px, 3.2vw, 50px);
          letter-spacing: -.03em;
          line-height: 1.1;
          margin: 0;
          font-weight: 400;
        }
        .mn-quote em { font-style: italic; color: var(--emerald); }

        /* ── Details strip ── */
        .mn-details-strip {
          background: var(--emerald-light);
          border-top: 3px solid var(--gold);
          border-bottom: 3px solid var(--gold);
          padding: clamp(36px, 5vw, 64px) 0;
          margin-top: clamp(48px, 6vw, 80px);
        }
        .mn-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1.6fr;
          gap: 32px;
        }
        .mn-detail-label {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: var(--gold);
        }
        .mn-detail-value {
          display: block;
          font-size: 15px;
          line-height: 1.5;
          margin-top: 10px;
          color: var(--ink);
        }
        .mn-detail-value strong { color: var(--emerald); font-weight: 600; }

        /* ── Programme ── */
        .mn-programme {
          padding: clamp(80px, 11vw, 160px) 0;
          display: grid;
          grid-template-columns: .5fr 1fr;
          gap: 8vw;
        }
        .mn-prog-title {
          font-size: clamp(42px, 6vw, 88px);
          letter-spacing: -.055em;
          line-height: .82;
          margin: 0;
          color: var(--emerald);
        }
        .mn-prog-body p { font-size: 14px; line-height: 1.9; margin: 0 0 28px; }
        .mn-prog-body strong { color: var(--emerald); font-weight: 600; }
        .mn-countdown {
          display: flex;
          gap: 20px;
          margin-top: 40px;
          padding-top: 28px;
          border-top: 1px solid var(--gold);
        }
        .mn-count-item { display: flex; flex-direction: column; align-items: center; }
        .mn-count-number {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 46px;
          line-height: 1;
          color: var(--emerald);
        }
        .mn-count-label {
          font-size: 8px;
          font-weight: 600;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: var(--ink-muted);
          margin-top: 6px;
        }

        /* ── Verse ── */
        .mn-verse {
          background: var(--emerald);
          color: var(--ivory);
          padding: clamp(80px, 12vw, 160px) 0;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        /* faint geometric background pattern */
        .mn-verse::before {
          content: '';
          position: absolute;
          inset: -20px;
          background-image: repeating-conic-gradient(var(--emerald-mid) 0% 25%, transparent 0% 50%);
          background-size: 32px 32px;
          opacity: .18;
          pointer-events: none;
        }
        .mn-verse > * { position: relative; z-index: 1; }
        .mn-verse .mn-kicker { color: var(--gold); }
        .mn-verse blockquote {
          font-size: clamp(22px, 3vw, 44px);
          font-style: italic;
          line-height: 1.15;
          letter-spacing: -.02em;
          margin: 28px auto 0;
          max-width: 860px;
          color: #fff;
        }
        .mn-attribution {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: var(--gold);
          margin-top: 24px;
        }
        .mn-couple-note {
          margin: 48px auto 0;
          max-width: 520px;
          padding-top: 32px;
          border-top: 1px solid rgba(201,168,76,.4);
          font-size: clamp(18px, 2.2vw, 28px);
          font-style: italic;
          line-height: 1.2;
          color: var(--gold-pale);
        }
        .mn-couple-note cite {
          display: block;
          font-size: 10px;
          font-style: normal;
          font-weight: 600;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: var(--gold);
          margin-top: 20px;
        }

        /* ── RSVP ── */
        .mn-rsvp {
          padding: clamp(72px, 10vw, 140px) 0 clamp(56px, 8vw, 100px);
        }
        .mn-rsvp-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 36px;
          gap: 24px;
          flex-wrap: wrap;
        }
        .mn-rsvp-title {
          font-size: clamp(52px, 7vw, 100px);
          letter-spacing: -.06em;
          line-height: .8;
          margin: 0;
          color: var(--emerald);
        }
        .mn-dress {
          font-size: 12px;
          line-height: 1.9;
          text-align: right;
          color: var(--ink-muted);
        }
        .mn-dress strong { color: var(--ink); font-weight: 600; display: block; margin-bottom: 2px; }
        .mn-dress span { display: block; }
        .mn-dress .bride { color: var(--emerald); font-weight: 500; }
        .mn-dress .groom { color: #b08d30; font-weight: 500; }
        .mn-contacts {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        .mn-contact {
          border: 1.5px solid var(--emerald);
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 16px 18px;
          font-size: 11px;
          transition: background .2s ease, color .2s ease, border-color .2s ease;
        }
        .mn-contact:hover {
          background: var(--emerald);
          color: #fff;
          border-color: var(--emerald);
        }
        .mn-contact-name { font-weight: 600; font-size: 12px; color: var(--emerald); transition: color .2s; }
        .mn-contact:hover .mn-contact-name { color: var(--gold); }
        .mn-contact-num { font-variant-numeric: tabular-nums; color: var(--ink-muted); font-size: 11px; }
        .mn-contact:hover .mn-contact-num { color: rgba(255,255,255,.8); }

        /* ── Footer ── */
        .mn-footer {
          background: var(--ink);
          color: rgba(255,255,255,.45);
          padding: 28px 0;
          font-size: 10px;
          letter-spacing: .1em;
          text-align: center;
          text-transform: uppercase;
        }

        /* ── Responsive ── */
        @media (max-width: 780px) {
          .mn-hero { grid-template-columns: 1fr; min-height: 0; }
          .mn-hero::before { display: none; }
          .mn-photo-wrap { height: 72vw; min-height: 340px; }
          .mn-invite-inner { grid-template-columns: 1fr; gap: 32px; }
          .mn-details-grid { grid-template-columns: 1fr 1fr; }
          .mn-programme { grid-template-columns: 1fr; gap: 40px; }
          .mn-contacts { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 480px) {
          .mn-hero-copy { padding-top: 52px; padding-bottom: 56px; }
          .mn-names { font-size: 19vw; }
          .mn-details-grid { grid-template-columns: 1fr; }
          .mn-contacts { grid-template-columns: 1fr; }
          .mn-rsvp-head { flex-direction: column; align-items: flex-start; }
          .mn-dress { text-align: left; }
        }

        /* ── Entrance animation ── */
        @media (prefers-reduced-motion: no-preference) {
          .mn-hero-copy { animation: mn-up .9s ease both; }
          .mn-photo-wrap { animation: mn-up .9s .15s ease both; }
          @keyframes mn-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        }
      `}</style>

      {/* ── HERO ── */}
      <header className="mn-hero">
        <div className="mn-hero-copy mn-wrap" style={{ maxWidth: 'none' }}>
          <p className="mn-bismillah">In the name of Allah,<br />the Most Gracious, the Most Merciful</p>
          <h1 className="mn-serif mn-names">
            Ahmad
            <em className="mn-amp">&amp;</em>
            Toyibat
          </h1>
          <p className="mn-hero-sub">A Nikah ceremony held in faith, love and the warmth of family — Ijebu Ode, Nigeria</p>
        </div>
        <div className="mn-photo-wrap">
          <img src="/__mockup/images/couple.png" alt="Ahmad Opeyemi and Toyibat Adeola" />
        </div>
      </header>

      {/* ── GOLD BAND ── */}
      <div className="mn-band">
        <p className="mn-band-text">Saturday · 21st November 2026 · Rolak Hotel &amp; Suites · Ijebu Ode</p>
      </div>

      <main>
        {/* ── INVITATION ── */}
        <section className="mn-invite mn-wrap">
          <div className="mn-invite-inner">
            <div className="mn-invite-label">
              <p className="mn-kicker">With the blessings of</p>
              <p className="mn-kicker" style={{ color: 'var(--ink)', marginTop: 14 }}>Two families</p>
            </div>
            <blockquote className="mn-serif mn-quote">
              The families of <em>Prof Taofiki &amp; Alhaja Basirat Salako</em> and <em>Khalifah Abdul-Hafeez &amp; Alhaja Kudratu-Llah Otunuyi</em> joyfully invite <em>V.C. TASUED (Prof. Banjo)</em> to witness the Nikah of <em>Ahmad Opeyemi &amp; Toyibat Adeola.</em>
            </blockquote>
          </div>

          {/* Details */}
          <div className="mn-details-strip" style={{ marginLeft: 'calc(-1 * clamp(20px, 5vw, 72px))', marginRight: 'calc(-1 * clamp(20px, 5vw, 72px))', paddingLeft: 'clamp(20px, 5vw, 72px)', paddingRight: 'clamp(20px, 5vw, 72px)' }}>
            <div className="mn-details-grid">
              <div>
                <span className="mn-detail-label">Date</span>
                <span className="mn-detail-value"><strong>Saturday</strong>, 21st November 2026</span>
              </div>
              <div>
                <span className="mn-detail-label">Time</span>
                <span className="mn-detail-value">11:00 AM</span>
              </div>
              <div>
                <span className="mn-detail-label">Venue</span>
                <span className="mn-detail-value"><strong>Rolak Hotel &amp; Suites</strong> — Adetola Hall, Imowo Eleran, Ijebu Ode, Ogun State</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── PROGRAMME ── */}
        <section className="mn-wrap mn-programme">
          <div>
            <p className="mn-kicker">Programme</p>
            <h2 className="mn-serif mn-prog-title">The<br />day,<br />in full.</h2>
          </div>
          <div className="mn-prog-body">
            <p><strong>Nikah Ceremony</strong><br />Commences at 11:00 AM at Rolak Hotel &amp; Suites, Adetola Hall, with readings, prayers and the solemnisation of marriage.</p>
            <p><strong>Reception</strong><br />Follows immediately at the same venue. Food, music and celebration with family and friends.</p>
            <p><strong>Directions</strong><br />From Lagos Garage → Rolak Hotel &amp; Suites, beside Imowo Community Primary School, Ijebu Ode, Ogun State.</p>

            {/* Countdown */}
            {countdown && (
              <div className="mn-countdown" aria-label="Countdown to the Nikah">
                {Object.entries(countdown).map(([label, value]) => (
                  <div className="mn-count-item" key={label}>
                    <span className="mn-count-number">{twoDigits(value)}</span>
                    <span className="mn-count-label">{label}</span>
                  </div>
                ))}
              </div>
            )}
            {!countdown && <p style={{ marginTop: 40, color: 'var(--emerald)', fontWeight: 600 }}>The day has arrived. Barak Allahu Lakuma.</p>}
          </div>
        </section>

        {/* ── VERSE ── */}
        <section className="mn-verse">
          <div className="mn-wrap">
            <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginBottom: 20 }}>
              <StarMotif color="#c9a84c" size={40} />
              <StarMotif color="#c9a84c" size={40} />
              <StarMotif color="#c9a84c" size={40} />
            </div>
            <p className="mn-kicker">A verse for the occasion</p>
            <blockquote className="mn-serif">
              "And among His signs is this, that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts. Verily in that are signs for those who reflect."
            </blockquote>
            <p className="mn-attribution">— Al-Rum 30:21</p>
            <p className="mn-serif mn-couple-note">
              Love brought us together. Faith keeps us together.<br />God made it all possible.
              <cite>— Ahmad &amp; Toyibat</cite>
            </p>
          </div>
        </section>

        {/* ── RSVP ── */}
        <section className="mn-wrap mn-rsvp">
          <div className="mn-rsvp-head">
            <div>
              <p className="mn-kicker">Kindly respond</p>
              <h2 className="mn-serif mn-rsvp-title">RSVP.</h2>
            </div>
            <p className="mn-dress">
              <strong>Aso-Ebi / Dress Code</strong>
              <span className="bride">Bride's side — Emerald Green</span>
              <span className="groom">Groom's side — Champagne Gold</span>
            </p>
          </div>
          <div className="mn-contacts">
            {rsvpContacts.map(([name, phone]) => (
              <a className="mn-contact" href={`tel:${phone}`} key={phone}>
                <span className="mn-contact-name">{name}</span>
                <span className="mn-contact-num">{phone}</span>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="mn-footer">
        <p>Ahmad Opeyemi &amp; Toyibat Adeola · 21 November 2026 · Ijebu Ode, Nigeria</p>
      </footer>
    </div>
  );
}
