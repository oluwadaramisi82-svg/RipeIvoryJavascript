import { useEffect, useMemo, useState } from "react";

const eventDate = new Date("November 21, 2026 11:00:00");

function twoDigits(value: number) {
  return String(value).padStart(2, "0");
}

export function EditorialCeremony() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const countdown = useMemo(() => {
    const remaining = eventDate.getTime() - now;
    if (remaining <= 0) return null;
    return [
      ["days", Math.floor(remaining / 86400000)],
      ["hours", Math.floor((remaining % 86400000) / 3600000)],
      ["minutes", Math.floor((remaining % 3600000) / 60000)],
      ["seconds", Math.floor((remaining % 60000) / 1000)],
    ] as const;
  }, [now]);

  return (
    <div className="editorial-ceremony">
      <link
        rel="stylesheet"
        media="print"
        onLoad={(event) => {
          event.currentTarget.media = "all";
        }}
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700;900&family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700&display=swap"
      />
      <style>{`
        .editorial-ceremony {
          --ink: #0a0a0a;
          --paper: #fdfcf9;
          --soft-paper: #f3f0e9;
          --champagne: #b9975b;
          --line: rgba(185,151,91,.58);
          min-height: 100dvh;
          background: var(--paper);
          color: var(--ink);
          font-family: "Manrope", sans-serif;
          overflow: hidden;
        }
        .editorial-ceremony, .editorial-ceremony * { box-sizing: border-box; }
        .editorial-ceremony a { color: inherit; }
        .ec-mono { font: 500 10px/1.4 "DM Mono", monospace; letter-spacing: .16em; text-transform: uppercase; }
        .ec-serif { font-family: "Cormorant Garamond", Georgia, serif; }
        .ec-topline {
          position: absolute; z-index: 2; top: 0; left: 0; width: 100%;
          display: flex; justify-content: space-between; align-items: center;
          padding: 22px clamp(20px, 4vw, 64px); color: #fff;
        }
        .ec-topline a { text-decoration: none; }
        .ec-monogram { font: 600 21px/1 "Cormorant Garamond", serif; letter-spacing: .08em; }
        .ec-topline .ec-mono { color: rgba(255,255,255,.78); }
        .ec-hero { min-height: 920px; position: relative; background: var(--ink); color: #fff; }
        .ec-hero-photo { position: absolute; inset: 0; }
        .ec-hero-photo::after {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(10,10,10,.55) 0%, rgba(10,10,10,.06) 32%, rgba(10,10,10,.78) 100%);
        }
        .ec-hero-photo img { width: 100%; height: 100%; object-fit: cover; object-position: center 35%; filter: grayscale(18%) contrast(1.08); }
        .ec-hero-content {
          position: relative; z-index: 1; min-height: 920px; display: flex; flex-direction: column;
          justify-content: flex-end; padding: 120px clamp(22px, 7vw, 120px) 58px;
        }
        .ec-eyebrow { margin-bottom: 22px; color: var(--champagne); }
        .ec-hero h1 {
          max-width: 1120px; margin: 0; font: 900 clamp(5.4rem, 14vw, 12rem)/.68 "Cormorant Garamond", serif;
          letter-spacing: -.075em;
        }
        .ec-hero h1 span { display: block; margin-left: clamp(38px, 9vw, 160px); font-weight: 400; font-style: italic; }
        .ec-hero-footer { display: flex; align-items: flex-end; justify-content: space-between; gap: 30px; margin-top: 52px; }
        .ec-hero-date { max-width: 300px; color: rgba(255,255,255,.9); }
        .ec-hero-date strong { display: block; margin-top: 10px; color: #fff; font: 500 23px/1.05 "Cormorant Garamond", serif; letter-spacing: .01em; text-transform: none; }
        .ec-rule { width: 100%; height: 1px; margin: 16px 0 0; background: var(--champagne); }
        .ec-countdown { display: flex; gap: clamp(15px, 3vw, 36px); text-align: right; }
        .ec-countdown b { display: block; font: 500 clamp(27px, 3vw, 43px)/.9 "Cormorant Garamond", serif; }
        .ec-countdown small { color: var(--champagne); font-size: 8px; }
        .ec-body { background: var(--paper); }
        .ec-announcement { max-width: 1240px; margin: 0 auto; padding: 116px clamp(24px, 7vw, 110px) 125px; }
        .ec-section-grid { display: grid; grid-template-columns: minmax(160px, .45fr) minmax(0, 1.55fr); gap: clamp(35px, 8vw, 135px); }
        .ec-section-tag { color: var(--champagne); padding-top: 7px; }
        .ec-opening { max-width: 780px; margin: 0 0 48px; font: 500 clamp(2rem, 4.2vw, 4.2rem)/.88 "Cormorant Garamond", serif; letter-spacing: -.025em; }
        .ec-opening::first-line { font-weight: 600; }
        .ec-copy { max-width: 730px; border-top: 1px solid var(--line); padding-top: 25px; font: 500 clamp(1.2rem, 2vw, 1.75rem)/1.15 "Cormorant Garamond", serif; text-align: justify; text-align-last: left; }
        .ec-copy strong { font-weight: 700; }
        .ec-copy::first-letter { float: left; padding: 9px 10px 0 0; color: var(--champagne); font: 700 5.4rem/.65 "Cormorant Garamond", serif; }
        .ec-details { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); background: var(--soft-paper); }
        .ec-details-inner { max-width: 1240px; margin: 0 auto; padding: 85px clamp(24px, 7vw, 110px) 105px; }
        .ec-details h2, .ec-rsvp h2 { margin: 15px 0 0; font: 900 clamp(4.3rem, 9vw, 9rem)/.7 "Cormorant Garamond", serif; letter-spacing: -.065em; }
        .ec-detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); margin-top: 60px; border-top: 1px solid var(--ink); }
        .ec-detail { min-height: 195px; padding: 25px 28px 24px 0; border-bottom: 1px solid var(--line); }
        .ec-detail:nth-child(odd) { border-right: 1px solid var(--line); padding-right: 35px; }
        .ec-detail:nth-child(even) { padding-left: 35px; }
        .ec-detail h3 { margin: 0 0 19px; color: var(--champagne); }
        .ec-detail p { margin: 0; font: 600 clamp(1.8rem, 3.2vw, 3.1rem)/.85 "Cormorant Garamond", serif; letter-spacing: -.025em; }
        .ec-detail small { display: block; max-width: 330px; margin-top: 17px; font: 500 11px/1.5 "Manrope", sans-serif; }
        .ec-dark { padding: 112px clamp(24px, 10vw, 170px); background: var(--ink); color: #fff; }
        .ec-dark .ec-section-grid { align-items: start; }
        .ec-dark .ec-section-tag { color: var(--champagne); }
        .ec-quote { max-width: 900px; margin: 0; font: 500 italic clamp(2.1rem, 4.5vw, 4.7rem)/.92 "Cormorant Garamond", serif; letter-spacing: -.03em; }
        .ec-attribution { margin: 28px 0 0; color: var(--champagne); }
        .ec-toast { max-width: 520px; margin: 70px 0 0; padding-top: 20px; border-top: 1px solid var(--champagne); font: 500 1.35rem/1.05 "Cormorant Garamond", serif; }
        .ec-rsvp { max-width: 1240px; margin: 0 auto; padding: 110px clamp(24px, 7vw, 110px) 85px; }
        .ec-rsvp-intro { display: flex; justify-content: space-between; align-items: flex-end; gap: 30px; }
        .ec-rsvp-note { max-width: 340px; margin: 0; font: 500 1.3rem/1.05 "Cormorant Garamond", serif; }
        .ec-contact-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 65px; }
        .ec-contact { min-height: 145px; padding: 20px; border: 1px solid var(--champagne); }
        .ec-contact strong { display: block; font: 600 1.35rem/1 "Cormorant Garamond", serif; }
        .ec-contact a { display: inline-block; margin-top: 34px; color: var(--champagne); font: 500 10px "DM Mono", monospace; letter-spacing: .04em; text-decoration: none; }
        .ec-dress { display: grid; grid-template-columns: .45fr 1.55fr; gap: 35px; margin-top: 75px; padding: 18px 0; border-top: 1px solid var(--champagne); border-bottom: 1px solid var(--champagne); }
        .ec-dress-value { font: 600 clamp(1.8rem, 3vw, 3rem)/.85 "Cormorant Garamond", serif; }
        .ec-dress-value span { color: var(--champagne); }
        .ec-footer { display: flex; justify-content: space-between; gap: 20px; padding: 25px clamp(24px, 7vw, 110px); background: var(--ink); color: #fff; }
        .ec-footer strong { font: 600 1.4rem "Cormorant Garamond", serif; }
        @media (max-width: 720px) {
          .ec-hero, .ec-hero-content { min-height: 760px; }
          .ec-hero-content { padding-bottom: 35px; }
          .ec-hero-footer { display: block; }
          .ec-countdown { margin-top: 40px; text-align: left; }
          .ec-section-grid { grid-template-columns: 1fr; gap: 28px; }
          .ec-announcement, .ec-details-inner, .ec-rsvp { padding-top: 75px; padding-bottom: 78px; }
          .ec-detail-grid, .ec-contact-grid { grid-template-columns: 1fr 1fr; margin-top: 40px; }
          .ec-detail:nth-child(odd) { padding-right: 18px; }
          .ec-detail:nth-child(even) { padding-left: 18px; }
          .ec-dark { padding-top: 78px; padding-bottom: 80px; }
          .ec-rsvp-intro { display: block; }
          .ec-rsvp-note { margin-top: 30px; }
          .ec-contact { padding: 16px 12px; min-height: 125px; }
          .ec-contact a { margin-top: 24px; font-size: 9px; }
          .ec-dress { grid-template-columns: 1fr; gap: 16px; }
          .ec-footer { display: block; line-height: 2; }
          .ec-footer strong { display: block; }
        }
      `}</style>
      <header className="ec-hero" id="top">
        <div className="ec-topline">
          <a className="ec-monogram" href="#top">A / T</a>
          <a className="ec-mono" href="#rsvp">R.S.V.P. ↘</a>
        </div>
        <div className="ec-hero-photo">
          <img src="/__mockup/images/couple3.png" alt="Ahmad Opeyemi and Toyibat Adeola" />
        </div>
        <div className="ec-hero-content">
          <div className="ec-eyebrow ec-mono">A formal announcement · 2026</div>
          <h1 className="ec-serif">Ahmad <span>&amp; Toyibat</span></h1>
          <div className="ec-hero-footer">
            <div className="ec-hero-date ec-mono">
              Saturday, 21st November 2026
              <strong>11:00 AM</strong>
              <div className="ec-rule" />
            </div>
            <div className="ec-countdown" aria-label="Countdown to the ceremony">
              {countdown ? countdown.map(([label, value]) => (
                <div key={label}><b>{twoDigits(value)}</b><small className="ec-mono">{label}</small></div>
              )) : <span className="ec-mono">The ceremony is today</span>}
            </div>
          </div>
        </div>
      </header>
      <main className="ec-body">
        <section className="ec-announcement">
          <div className="ec-section-grid">
            <div className="ec-section-tag ec-mono">01 / The invitation</div>
            <div>
              <p className="ec-opening ec-serif">In the name of Allah, the Most Gracious, the Most Merciful</p>
              <p className="ec-copy">
                The families of <strong>Prof Taofiki &amp; Alhaja Basirat Salako</strong> and <strong>Khalifah Abdul-Hafeez &amp; Alhaja Kudratu-Llah Otunuyi</strong> request the honour of the presence of <strong>V.C. TASUED (Prof. Banjo)</strong> at the solemnization of <strong>Ahmad Opeyemi &amp; Toyibat Adeola.</strong>
              </p>
            </div>
          </div>
        </section>
        <section className="ec-details" id="ceremony">
          <div className="ec-details-inner">
            <div className="ec-section-tag ec-mono">02 / The particulars</div>
            <h2 className="ec-serif">The day<br />in full.</h2>
            <div className="ec-detail-grid">
              <article className="ec-detail"><h3 className="ec-mono">Date &amp; time</h3><p>Saturday, 21st<br />November 2026</p><small>11:00 AM</small></article>
              <article className="ec-detail"><h3 className="ec-mono">Venue</h3><p>Rolak Hotel<br />and Suites</p><small>Adetola Hall, Imowo Eleran, Ijebu Ode</small></article>
              <article className="ec-detail"><h3 className="ec-mono">Reception</h3><p>Follows<br />immediately</p><small>At the same venue</small></article>
              <article className="ec-detail"><h3 className="ec-mono">Directions</h3><p>From Lagos<br />Garage</p><small>From Lagos Garage to Rolak Hotel &amp; Suites — Beside Imowo Community Primary School, Ijebu Ode, Ogun State</small></article>
            </div>
          </div>
        </section>
        <section className="ec-dark">
          <div className="ec-section-grid">
            <div className="ec-section-tag ec-mono">03 / A blessing</div>
            <div>
              <p className="ec-quote ec-serif">“And among His signs is this, that He created for you mates from among yourselves, that you may dwell in tranquility with, and He has put love and mercy between your hearts. Verily in that are signs for those who reflect.”</p>
              <p className="ec-attribution ec-mono">— Al-Rum (30:21)</p>
              <p className="ec-toast ec-serif">Love brought us together. Faith keeps us together. But God made it possible. It is marvellous in our eyes. — Ahmad &amp; Toyibat</p>
            </div>
          </div>
        </section>
        <section className="ec-rsvp" id="rsvp">
          <div className="ec-rsvp-intro">
            <div><div className="ec-section-tag ec-mono">04 / Attendance</div><h2 className="ec-serif">R.S.V.P.</h2></div>
            <p className="ec-rsvp-note">Kindly respond to one of the following.</p>
          </div>
          <div className="ec-contact-grid">
            {[
              ["Mrs Khadijat", "08032278353"],
              ["Mr Oyedokun", "07038207478"],
              ["OMOT", "07017990204"],
              ["Aweda", "08026642105"],
            ].map(([name, phone]) => (
              <div className="ec-contact" key={name}><strong>{name}</strong><a href={`tel:${phone}`}>{phone}</a></div>
            ))}
          </div>
          <div className="ec-dress">
            <div className="ec-mono">Dress code</div>
            <div className="ec-dress-value ec-serif">Bride — <span>Emerald Green</span><br />Groom — <span>Champagne Gold</span></div>
          </div>
        </section>
      </main>
      <footer className="ec-footer"><strong>Ahmad &amp; Toyibat</strong><span className="ec-mono">Saturday, 21st November 2026 · Ijebu Ode</span></footer>
    </div>
  );
}