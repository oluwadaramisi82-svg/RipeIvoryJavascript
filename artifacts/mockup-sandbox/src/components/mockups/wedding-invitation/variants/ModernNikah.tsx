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
    <div className="modern-nikah">
      <link
        rel="stylesheet"
        media="print"
        onLoad={(event) => { event.currentTarget.media = 'all'; }}
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@400;500;600&display=swap"
      />
      <style>{`
        .modern-nikah {
          --ink: #181818;
          --sage: #4a7c6a;
          background: #ffffff;
          color: var(--ink);
          font-family: 'DM Sans', sans-serif;
          min-height: 100dvh;
          overflow: hidden;
        }
        .modern-nikah * { box-sizing: border-box; }
        .modern-nikah a { color: inherit; text-decoration: none; }
        .mn-serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        .mn-wrap { margin: 0 auto; max-width: 1320px; padding-left: clamp(24px, 5vw, 76px); padding-right: clamp(24px, 5vw, 76px); }
        .mn-kicker { font-size: 10px; font-weight: 600; letter-spacing: .2em; line-height: 1.4; text-transform: uppercase; }
        .mn-hero { display: grid; grid-template-columns: minmax(0, 1.02fr) minmax(300px, .98fr); min-height: min(860px, 100dvh); }
        .mn-hero-copy { align-self: center; padding: 72px clamp(24px, 7vw, 112px) 72px clamp(24px, 8vw, 120px); }
        .mn-opening { margin: 0 0 72px; max-width: 230px; font-size: 11px; line-height: 1.8; }
        .mn-names { font-size: clamp(75px, 10.8vw, 166px); font-weight: 500; letter-spacing: -.065em; line-height: .76; margin: 0; }
        .mn-names span { display: block; margin-left: clamp(30px, 5vw, 78px); }
        .mn-hero-note { font-size: 12px; line-height: 1.7; margin: 62px 0 0; max-width: 270px; }
        .mn-photo { min-height: 620px; overflow: hidden; }
        .mn-photo img { display: block; height: 100%; width: 100%; object-fit: cover; object-position: center; }
        .mn-section { padding-bottom: clamp(96px, 13vw, 190px); padding-top: clamp(96px, 13vw, 190px); }
        .mn-intro { display: grid; grid-template-columns: minmax(180px, .7fr) minmax(0, 1.3fr); gap: 8vw; }
        .mn-intro-label { padding-top: 8px; }
        .mn-quote { font-size: clamp(32px, 4.2vw, 62px); letter-spacing: -.035em; line-height: 1.01; margin: 0; max-width: 830px; }
        .mn-quote em { font-style: normal; }
        .mn-details { border-top: 1px solid var(--ink); display: grid; grid-template-columns: 1.15fr .65fr 1.2fr; gap: 28px; margin-top: 130px; padding-top: 18px; }
        .mn-detail-label { font-size: 9px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; }
        .mn-detail-value { display: block; font-size: 14px; line-height: 1.5; margin-top: 13px; }
        .mn-event { display: grid; grid-template-columns: .65fr 1.35fr; gap: 8vw; }
        .mn-event-title { font-size: clamp(48px, 6.5vw, 92px); letter-spacing: -.055em; line-height: .82; margin: 0; }
        .mn-event-copy { font-size: 14px; line-height: 1.8; max-width: 520px; }
        .mn-event-copy p { margin: 0 0 34px; }
        .mn-event-copy strong { font-weight: 600; }
        .mn-countdown { align-items: baseline; display: flex; gap: 22px; margin-top: 42px; }
        .mn-count-item { display: flex; flex-direction: column; }
        .mn-count-number { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 42px; line-height: 1; }
        .mn-count-label { font-size: 8px; font-weight: 600; letter-spacing: .16em; margin-top: 6px; text-transform: uppercase; }
        .mn-countdown .mn-count-item:first-child .mn-count-number { color: var(--sage); }
        .mn-verse { padding-bottom: clamp(112px, 16vw, 220px); padding-top: clamp(112px, 16vw, 220px); text-align: center; }
        .mn-verse blockquote { font-size: clamp(25px, 3.25vw, 48px); font-style: italic; letter-spacing: -.025em; line-height: 1.12; margin: 28px auto 0; max-width: 930px; }
        .mn-attribution { font-size: 10px; font-weight: 600; letter-spacing: .15em; margin-top: 28px; text-transform: uppercase; }
        .mn-toast { border-top: 1px solid var(--ink); font-size: clamp(22px, 2.8vw, 38px); font-style: italic; line-height: 1.1; margin: 110px auto 0; max-width: 590px; padding-top: 24px; }
        .mn-toast cite { display: block; font-size: 10px; font-style: normal; font-weight: 600; letter-spacing: .15em; margin-top: 23px; text-transform: uppercase; }
        .mn-rsvp { padding-bottom: 80px; }
        .mn-rsvp-head { align-items: end; display: flex; justify-content: space-between; margin-bottom: 34px; }
        .mn-rsvp-title { font-size: clamp(48px, 6vw, 86px); letter-spacing: -.06em; line-height: .8; margin: 0; }
        .mn-dress { font-size: 11px; line-height: 1.8; text-align: right; }
        .mn-dress strong { font-weight: 600; }
        .mn-contacts { display: grid; gap: 10px; grid-template-columns: repeat(4, 1fr); }
        .mn-contact { border: 1px solid var(--ink); border-radius: 999px; display: flex; font-size: 11px; justify-content: space-between; padding: 14px 17px; transition: background .2s ease, color .2s ease; }
        .mn-contact:hover { background: var(--ink); color: #ffffff; }
        .mn-contact span:last-child { font-variant-numeric: tabular-nums; }
        @media (max-width: 760px) {
          .mn-hero { display: flex; flex-direction: column; min-height: 0; }
          .mn-hero-copy { padding-bottom: 90px; padding-top: 52px; }
          .mn-opening { margin-bottom: 64px; }
          .mn-photo { height: 74vw; min-height: 400px; }
          .mn-intro, .mn-event { grid-template-columns: 1fr; gap: 40px; }
          .mn-details { margin-top: 82px; }
          .mn-contacts { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .mn-names { font-size: 21vw; }
          .mn-details { gap: 16px; grid-template-columns: 1fr; }
          .mn-detail-value { margin-top: 7px; }
          .mn-rsvp-head { align-items: start; flex-direction: column; gap: 32px; }
          .mn-dress { text-align: left; }
          .mn-contacts { grid-template-columns: 1fr; }
          .mn-contact { padding: 15px 18px; }
        }
        @media (prefers-reduced-motion: no-preference) {
          .mn-hero-copy, .mn-photo { animation: mn-in .8s ease both; }
          .mn-photo { animation-delay: .12s; }
          @keyframes mn-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        }
      `}</style>

      <header className="mn-hero">
        <div className="mn-hero-copy">
          <p className="mn-opening">In the name of Allah, the Most Gracious, the Most Merciful</p>
          <h1 className="mn-serif mn-names">Ahmad<span>&amp; Toyibat</span></h1>
          <p className="mn-hero-note">A solemnization of marriage, held with gratitude, faith and the presence of those we love.</p>
        </div>
        <div className="mn-photo">
          <img src="/__mockup/images/couple.png" alt="Ahmad Opeyemi and Toyibat Adeola" />
        </div>
      </header>

      <main>
        <section className="mn-wrap mn-section">
          <div className="mn-intro">
            <div className="mn-intro-label">
              <p className="mn-kicker">With the blessing of</p>
              <p className="mn-kicker" style={{ color: 'var(--ink)', marginTop: 16 }}>Two families</p>
            </div>
            <blockquote className="mn-serif mn-quote">
              The families of <em>Prof Taofiki &amp; Alhaja Basirat Salako</em> and <em>Khalifah Abdul-Hafeez &amp; Alhaja Kudratu-Llah Otunuyi</em> invite <em>V.C. TASUED (Prof. Banjo)</em> to witness the solemnization of <em>Ahmad Opeyemi &amp; Toyibat Adeola.</em>
            </blockquote>
          </div>
          <div className="mn-details">
            <div><span className="mn-detail-label">Date</span><span className="mn-detail-value">Saturday, 21st November 2026</span></div>
            <div><span className="mn-detail-label">Time</span><span className="mn-detail-value">11:00 AM</span></div>
            <div><span className="mn-detail-label">Venue</span><span className="mn-detail-value">Rolak Hotel and Suites, Adetola Hall, Imowo Eleran, Ijebu Ode</span></div>
          </div>
        </section>

        <section className="mn-wrap mn-section mn-event">
          <h2 className="mn-serif mn-event-title">The day,<br />in full.</h2>
          <div className="mn-event-copy">
            <p><strong>Reception:</strong> follows immediately at the same venue.</p>
            <p><strong>Directions:</strong> From Lagos Garage to Rolak Hotel &amp; Suites — Beside Imowo Community Primary School, Ijebu Ode, Ogun State</p>
            <div className="mn-countdown" aria-label="Countdown to the nikah">
              {countdown ? Object.entries(countdown).map(([label, value]) => (
                <div className="mn-count-item" key={label}>
                  <span className="mn-count-number">{twoDigits(value)}</span>
                  <span className="mn-count-label">{label}</span>
                </div>
              )) : <span className="mn-detail-value">The day has arrived.</span>}
            </div>
          </div>
        </section>

        <section className="mn-wrap mn-verse">
          <p className="mn-kicker">A verse for the day</p>
          <blockquote className="mn-serif">“And among His signs is this, that He created for you mates from among yourselves, that you may dwell in tranquility with, and He has put love and mercy between your hearts. Verily in that are signs for those who reflect.”</blockquote>
          <p className="mn-attribution">— Al-Rum (30:21)</p>
          <p className="mn-serif mn-toast">Love brought us together. Faith keeps us together. But God made it possible. It is marvellous in our eyes.<cite>— Ahmad &amp; Toyibat</cite></p>
        </section>

        <section className="mn-wrap mn-rsvp">
          <div className="mn-rsvp-head">
          <div><p className="mn-kicker">Kindly respond</p><h2 className="mn-serif mn-rsvp-title">RSVP.</h2></div>
            <p className="mn-dress"><strong>Dress code</strong><br />Bride — Emerald Green<br />Groom — Champagne Gold</p>
          </div>
          <div className="mn-contacts">
            {rsvpContacts.map(([name, phone]) => <a className="mn-contact" href={`tel:${phone}`} key={phone}><span>{name}</span><span>{phone}</span></a>)}
          </div>
        </section>
      </main>
    </div>
  );
}