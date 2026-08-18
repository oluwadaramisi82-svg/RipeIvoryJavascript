import { useEffect, useMemo, useState } from 'react';

import './_group.css';

function pad(value: number) {
  return String(value).padStart(2, '0');
}

export function Current() {
  const [opened, setOpened] = useState(false);
  const [visible, setVisible] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const countdown = useMemo(() => {
    const weddingDate = new Date('November 21, 2026 11:00:00').getTime();
    const difference = weddingDate - now;
    if (difference <= 0) return null;
    const days = Math.floor(difference / 86400000);
    const hours = Math.floor((difference % 86400000) / 3600000);
    const minutes = Math.floor((difference % 3600000) / 60000);
    const seconds = Math.floor((difference % 60000) / 1000);
    return { days, hours, minutes, seconds };
  }, [now]);

  return (
    <div className="wedding-invitation-root">
      <section
        className={`wedding-invitation-envelope-screen ${opened ? 'hidden' : ''}`}
        aria-label="Open wedding invitation"
      >
        <p className="wedding-invitation-bismillah">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
        <div
          className={`wedding-invitation-envelope-wrap ${opened ? 'open' : ''}`}
          role="button"
          tabIndex={0}
          aria-label="Open invitation"
          onClick={() => setOpened(true)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setOpened(true);
            }
          }}
        >
          <div className="wedding-invitation-envelope">
            <div className="wedding-invitation-envelope-flap" />
            <div className="wedding-invitation-letter">
              <span className="wedding-invitation-letter-kicker">You are cordially invited</span>
              <h1>Ahmad &amp; Toyibat</h1>
              <span className="wedding-invitation-letter-date">Saturday, 21 November 2026</span>
            </div>
            <div className="wedding-invitation-wax-seal">A&amp;T</div>
            <div className="wedding-invitation-envelope-pocket" />
          </div>
        </div>
        <p className="wedding-invitation-open-prompt">Click the invitation to open</p>
      </section>

      <main className={`wedding-invitation-main-website ${visible ? 'visible' : ''}`}>
        <nav className="wedding-invitation-navbar" aria-label="Main navigation">
          <div className="wedding-invitation-nav-inner">
            <a className="wedding-invitation-nav-logo" href="#">
              A &amp; T
            </a>
            <ul className="wedding-invitation-nav-links">
              <li><a href="#invitation">Invitation</a></li>
              <li><a href="#details">Details</a></li>
              <li><a href="#rsvp">R.S.V.P.</a></li>
            </ul>
          </div>
        </nav>

        <header className="wedding-invitation-hero" id="invitation">
          <div className="wedding-invitation-hero-inner">
            <span className="wedding-invitation-eyebrow">The solemnization of</span>
            <h1 className="wedding-invitation-hero-title">
              Ahmad <span className="wedding-invitation-hero-amp">&amp;</span> Toyibat
            </h1>
            <p className="wedding-invitation-hero-subtitle">Opeyemi &amp; Adeola</p>
            <p className="wedding-invitation-hero-date">Saturday, 21st November 2026 &nbsp;•&nbsp; 11:00 AM</p>
            <div className="wedding-invitation-ornament" aria-hidden="true"><span>◆</span></div>
            <div className="wedding-invitation-countdown" aria-label="Countdown to the wedding">
              {countdown ? (
                <>
                  <div className="wedding-invitation-time-box"><span className="wedding-invitation-time-number">{pad(countdown.days)}</span><span className="wedding-invitation-time-label">Days</span></div>
                  <div className="wedding-invitation-time-box"><span className="wedding-invitation-time-number">{pad(countdown.hours)}</span><span className="wedding-invitation-time-label">Hours</span></div>
                  <div className="wedding-invitation-time-box"><span className="wedding-invitation-time-number">{pad(countdown.minutes)}</span><span className="wedding-invitation-time-label">Minutes</span></div>
                  <div className="wedding-invitation-time-box"><span className="wedding-invitation-time-number">{pad(countdown.seconds)}</span><span className="wedding-invitation-time-label">Seconds</span></div>
                </>
              ) : (
                <p>The celebration is today.</p>
              )}
            </div>
          </div>
        </header>

        <section className="wedding-invitation-content-shell">
          <div className="wedding-invitation-invitation-card">
            <img
              className="wedding-invitation-couple-photo"
              src="/__mockup/images/couple.png"
              alt="Ahmad and Toyibat together at their celebration"
            />
            <div className="wedding-invitation-invitation-copy">
              <p className="wedding-invitation-bismillah-main">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
              <p className="wedding-invitation-copy-intro">The families of</p>
              <p className="wedding-invitation-family-line">Prof Taofiki &amp; Alhaja Basirat Salako</p>
              <p className="wedding-invitation-family-amp">and</p>
              <p className="wedding-invitation-family-line">Khalifah Abdul-Hafeez &amp; Alhaja Kudratu-Llah Otunuyi</p>
              <p className="wedding-invitation-cordially">Cordially invite</p>
              <p className="wedding-invitation-guest">V.C. TASUED (Prof. Banjo)</p>
              <p className="wedding-invitation-witness">to witness the solemnization of</p>
              <div className="wedding-invitation-couple-names">
                <span>Ahmad Opeyemi</span>
                <span className="and">&amp;</span>
                <span>Toyibat Adeola</span>
              </div>
              <div className="wedding-invitation-ornament" aria-hidden="true"><span>◆</span></div>
              <div className="wedding-invitation-detail-strip">
                <div><strong>Date</strong><span>21 Nov. 2026</span></div>
                <div><strong>Time</strong><span>11:00 AM</span></div>
                <div><strong>Venue</strong><span>Rolak Hotel</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="wedding-invitation-content-shell" id="details">
          <div className="wedding-invitation-section-heading">
            <span className="wedding-invitation-section-label">Join us for this blessed occasion</span>
            <h2 className="wedding-invitation-section-title">The Celebration</h2>
          </div>
          <div className="wedding-invitation-info-grid">
            <article className="wedding-invitation-info-card">
              <h3>The Ceremony</h3>
              <p><strong>Saturday, 21st November 2026</strong><br />11:00 AM<br />Rolak Hotel and Suites<br />Adetola Hall</p>
            </article>
            <article className="wedding-invitation-info-card">
              <h3>Reception</h3>
              <p>Reception follows immediately<br />at the same venue.<br /><strong>Rolak Hotel and Suites</strong><br />Imowo Eleran, Ijebu Ode</p>
            </article>
            <article className="wedding-invitation-info-card wedding-invitation-wide-card">
              <h3>Directions</h3>
              <p className="wedding-invitation-directions"><strong>From Lagos Garage to Rolak Hotel &amp; Suites:</strong><br />Beside Imowo Community Primary School, Ijebu Ode, Ogun State.</p>
            </article>
          </div>
        </section>

        <section className="wedding-invitation-quote-section">
          <div className="wedding-invitation-quote-inner">
            <span className="wedding-invitation-section-label">A prayer for the couple</span>
            <p className="wedding-invitation-quote">“And among His signs is this, that He created for you mates from among yourselves, that you may dwell in tranquility with, and He has put love and mercy between your hearts. Verily in that are signs for those who reflect.”</p>
            <p className="wedding-invitation-quote-attribution">— Al-Rum (30:21)</p>
            <p className="wedding-invitation-toast">Love brought us together.<br />Faith keeps us together.<br />But God made it possible.<br />It is marvellous in our eyes.<br /><br />— Ahmad &amp; Toyibat</p>
          </div>
        </section>

        <section className="wedding-invitation-content-shell wedding-invitation-rsvp" id="rsvp">
          <div className="wedding-invitation-section-heading">
            <span className="wedding-invitation-section-label">Kindly respond</span>
            <h2 className="wedding-invitation-section-title">R.S.V.P.</h2>
          </div>
          <p className="wedding-invitation-rsvp-copy">We would be honoured to celebrate this special day with you. Kindly contact any of the following for attendance confirmation.</p>
          <div className="wedding-invitation-contact-list">
            <div className="wedding-invitation-contact"><strong>Mrs Khadijat</strong><a href="tel:08032278353">08032278353</a></div>
            <div className="wedding-invitation-contact"><strong>Mr Oyedokun</strong><a href="tel:07038207478">07038207478</a></div>
            <div className="wedding-invitation-contact"><strong>OMOT</strong><a href="tel:07017990204">07017990204</a></div>
            <div className="wedding-invitation-contact"><strong>Aweda</strong><a href="tel:08026642105">08026642105</a></div>
          </div>
          <div className="wedding-invitation-dress-code">
            <div className="wedding-invitation-dress-item"><strong>Bride's colour</strong><span>Champagne Gold</span></div>
            <div className="wedding-invitation-dress-item"><strong>Groom's colour</strong><span>Emerald Green</span></div>
          </div>
        </section>

        <footer className="wedding-invitation-footer">
          <strong>Ahmad &amp; Toyibat</strong>
          <p>With gratitude to Allah and joy in our hearts.</p>
        </footer>
      </main>
    </div>
  );
}

export default Current;