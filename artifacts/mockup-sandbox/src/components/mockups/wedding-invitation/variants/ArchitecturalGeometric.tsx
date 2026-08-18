import { useEffect, useMemo, useState } from 'react';

function pad(value: number) {
  return String(value).padStart(2, '0');
}

export function ArchitecturalGeometric() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const countdown = useMemo(() => {
    const gap = new Date('November 21, 2026 11:00:00').getTime() - now;
    if (gap <= 0) return null;
    return [
      ['days', Math.floor(gap / 86400000)],
      ['hours', Math.floor((gap % 86400000) / 3600000)],
      ['minutes', Math.floor((gap % 3600000) / 60000)],
      ['seconds', Math.floor((gap % 60000) / 1000)],
    ] as const;
  }, [now]);

  return (
    <div className="ag-page">
      <link rel="stylesheet" media="print" onLoad={(event) => { event.currentTarget.media = 'all'; }} href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Mono:wght@400;500&display=swap" />
      <style>{`
        .ag-page{--bg:#0d1c16;--bg2:#12251e;--bg3:#162d24;--gold:#c9a96e;--gold-soft:rgba(201,169,110,.48);--faint:rgba(201,169,110,.17);--text:#e8d7b6;min-height:100dvh;background:var(--bg);color:var(--text);font-family:"DM Mono",monospace;overflow:hidden}
        .ag-page *{box-sizing:border-box}.ag-page a{color:inherit}.ag-display{font-family:"Cormorant Garamond",Georgia,serif}.ag-rule{height:1px;background:var(--gold-soft)}
        .ag-top{max-width:1320px;margin:auto;padding:25px 5vw;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--faint);font-size:10px;letter-spacing:.22em;text-transform:uppercase}
        .ag-monogram{font:italic 30px "Cormorant Garamond",serif;letter-spacing:0}.ag-monogram span{color:var(--gold)}.ag-top a{text-decoration:none}
        .ag-hero{min-height:890px;position:relative;padding:76px 20px 88px;display:flex;justify-content:center;text-align:center;background:radial-gradient(ellipse at center 36%,#183328 0%,var(--bg) 61%)}
        .ag-hero:before,.ag-hero:after{content:"";position:absolute;inset:34px 7%;border:1px solid var(--faint);clip-path:polygon(50% 0,100% 24%,100% 76%,50% 100%,0 76%,0 24%);pointer-events:none}
        .ag-hero:after{inset:70px 14%;transform:rotate(30deg);border-color:rgba(201,169,110,.1)}
        .ag-hero-content{position:relative;z-index:1;width:min(900px,100%)}.ag-kicker{font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:var(--gold)}
        .ag-opening{max-width:390px;margin:26px auto 0;font:italic 21px/1.1 "Cormorant Garamond",serif;color:#efdcb5}
        .ag-arch-stage{position:relative;width:min(500px,88vw);height:470px;margin:47px auto 30px}
        .ag-arch-stage:before,.ag-arch-stage:after{content:"";position:absolute;top:145px;width:55px;height:55px;border:1px solid var(--gold);clip-path:polygon(50% 0,61% 35%,100% 50%,61% 65%,50% 100%,39% 65%,0 50%,39% 35%);opacity:.9}
        .ag-arch-stage:before{left:-85px}.ag-arch-stage:after{right:-85px}
        .ag-star{position:absolute;top:145px;width:55px;height:55px;background:var(--gold);clip-path:polygon(50% 0,61% 35%,100% 50%,61% 65%,50% 100%,39% 65%,0 50%,39% 35%);opacity:.12}
        .ag-star.left{left:-85px}.ag-star.right{right:-85px}
        .ag-arch{position:absolute;inset:0 80px 0;background:var(--bg3);border:1px solid var(--gold);border-bottom:0;border-radius:250px 250px 0 0;padding:13px}
        .ag-arch:before{content:"";position:absolute;inset:-11px;border:1px solid var(--faint);border-radius:260px 260px 0 0;pointer-events:none}
        .ag-photo{display:block;width:100%;height:100%;object-fit:cover;object-position:center;filter:grayscale(.62) sepia(.12) brightness(.78) contrast(1.08);border-radius:220px 220px 0 0}
        .ag-hero-names{font:italic 600 clamp(4rem,11vw,8rem)/.78 "Cormorant Garamond",serif;letter-spacing:-.06em}.ag-hero-names em{color:var(--gold);font-weight:400}
        .ag-date{display:flex;justify-content:center;gap:28px;margin:25px auto 0;padding:14px 20px;border-top:1px solid var(--gold);border-bottom:1px solid var(--gold);font-size:10px;letter-spacing:.13em;text-transform:uppercase;max-width:max-content}
        .ag-countdown{display:flex;justify-content:center;gap:30px;margin-top:34px}.ag-countdown b{display:block;font:400 30px "Cormorant Garamond",serif}.ag-countdown small{font-size:8px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold)}
        .ag-section{border-top:1px solid var(--faint);padding:78px 6vw}.ag-section-inner{max-width:1120px;margin:auto}.ag-section-head{display:flex;align-items:end;justify-content:space-between;gap:24px;border-bottom:1px solid var(--gold-soft);padding-bottom:17px;margin-bottom:32px}.ag-section-head h2{margin:0;font:500 clamp(2.7rem,6vw,5rem)/.8 "Cormorant Garamond",serif}.ag-index{font-size:10px;color:var(--gold);letter-spacing:.2em}
        .ag-family-frame{border:1px solid var(--gold-soft);padding:28px;display:grid;grid-template-columns:1fr 42px 1fr;align-items:center;text-align:center;background:linear-gradient(90deg,transparent 49.9%,var(--faint) 50%,transparent 50.1%)}
        .ag-family-frame p{margin:0;font:500 clamp(1.45rem,3vw,2.35rem)/1 "Cormorant Garamond",serif}.ag-family-frame .and{font:italic 20px "Cormorant Garamond",serif;color:var(--gold)}
        .ag-honour{text-align:center;margin:39px 0 0}.ag-honour span{display:block;margin-bottom:10px;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold)}.ag-honour strong{font:500 2rem "Cormorant Garamond",serif}
        .ag-grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--gold-soft);border:1px solid var(--gold-soft)}.ag-cell{min-height:245px;padding:30px;background:var(--bg);position:relative}.ag-cell:before{content:"";position:absolute;top:16px;left:16px;width:8px;height:8px;border:1px solid var(--gold);transform:rotate(45deg)}.ag-cell h3{margin:0 0 22px;font:500 2.1rem "Cormorant Garamond",serif;color:var(--gold)}.ag-cell p{margin:0;font-size:11px;line-height:2;color:#ddcba9}.ag-cell strong{font-weight:500;color:var(--text)}
        .ag-verse{background:var(--bg2);text-align:center;position:relative;overflow:hidden}.ag-muqarnas{height:88px;display:flex;justify-content:center;align-items:start;gap:4px;margin:-78px auto 34px}.ag-muqarnas i{display:block;width:42px;height:44px;background:var(--gold);opacity:.18;border-radius:22px 22px 0 0}.ag-muqarnas i:nth-child(2),.ag-muqarnas i:nth-child(6){height:61px}.ag-muqarnas i:nth-child(3),.ag-muqarnas i:nth-child(5){height:76px}.ag-muqarnas i:nth-child(4){height:88px}.ag-verse blockquote{max-width:890px;margin:0 auto 17px;font:italic clamp(1.5rem,3vw,2.25rem)/1.35 "Cormorant Garamond",serif;color:#ebd8b1}.ag-cite{font-size:10px;letter-spacing:.18em;color:var(--gold)}.ag-toast{max-width:530px;margin:44px auto 0;padding-top:23px;border-top:1px solid var(--faint);font:italic 1.35rem/1.35 "Cormorant Garamond",serif}
        .ag-rsvp-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.ag-contact{min-height:190px;padding:23px 15px;border:1px solid var(--gold-soft);display:flex;flex-direction:column;justify-content:space-between;text-align:center;background:linear-gradient(145deg,var(--bg3),var(--bg))}.ag-portrait{width:62px;height:62px;margin:0 auto;border:1px solid var(--gold);border-radius:50%;display:grid;place-items:center;font:italic 28px "Cormorant Garamond",serif;color:var(--gold)}.ag-contact strong{font:500 1.4rem "Cormorant Garamond",serif}.ag-contact a{font-size:10px;letter-spacing:.06em;text-decoration:none;color:var(--gold);word-break:break-word}.ag-dress{display:grid;grid-template-columns:1fr 1fr;margin-top:36px;border:1px solid var(--gold-soft)}.ag-dress div{padding:22px;text-align:center}.ag-dress div+div{border-left:1px solid var(--gold-soft)}.ag-dress small{display:block;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin-bottom:7px}.ag-dress span{font:1.55rem "Cormorant Garamond",serif}.ag-footer{text-align:center;border-top:1px solid var(--faint);padding:28px 20px;font:italic 1.7rem "Cormorant Garamond",serif;color:var(--gold)}
        @media(max-width:700px){.ag-top{padding:18px 20px}.ag-top a{font-size:8px}.ag-hero{min-height:760px;padding-top:55px}.ag-hero:before{inset:24px 3%}.ag-hero:after{inset:55px 9%}.ag-arch-stage{height:370px;margin-top:38px}.ag-arch{inset:0 38px}.ag-arch-stage:before,.ag-arch-stage:after,.ag-star{width:38px;height:38px;top:115px}.ag-arch-stage:before,.ag-star.left{left:-5px}.ag-arch-stage:after,.ag-star.right{right:-5px}.ag-date{gap:12px;font-size:8px}.ag-countdown{gap:16px}.ag-countdown b{font-size:24px}.ag-section{padding:58px 20px}.ag-section-head{display:block}.ag-section-head h2{margin-top:16px}.ag-family-frame{grid-template-columns:1fr;gap:17px;background:linear-gradient(180deg,transparent 49.9%,var(--faint) 50%,transparent 50.1%)}.ag-family-frame .and{display:none}.ag-grid,.ag-rsvp-grid{grid-template-columns:1fr}.ag-cell{min-height:200px}.ag-muqarnas{transform:scale(.75);margin-top:-66px}.ag-dress{grid-template-columns:1fr}.ag-dress div+div{border-left:0;border-top:1px solid var(--gold-soft)}}
      `}</style>

      <nav className="ag-top"><div className="ag-monogram">A <span>&amp;</span> T</div><a href="#ag-rsvp">R.S.V.P.</a></nav>
      <header className="ag-hero">
        <div className="ag-hero-content">
          <div className="ag-kicker">The solemnization of marriage</div>
          <div className="ag-opening">In the name of Allah, the Most Gracious, the Most Merciful</div>
          <div className="ag-arch-stage"><i className="ag-star left" /><i className="ag-star right" /><div className="ag-arch"><img className="ag-photo" src="/__mockup/images/couple3.png" alt="Ahmad Opeyemi and Toyibat Adeola" /></div></div>
          <div className="ag-hero-names">Ahmad <em>&amp;</em> Toyibat</div>
          <div className="ag-date"><span>Saturday, 21st November 2026</span><span>11:00 AM</span></div>
          <div className="ag-countdown" aria-label="Countdown to November 21 2026 11:00 AM">{countdown ? countdown.map(([label, value]) => <div key={label}><b>{pad(value)}</b><small>{label}</small></div>) : <div>11:00 AM</div>}</div>
        </div>
      </header>

      <main>
        <section className="ag-section"><div className="ag-section-inner">
          <div className="ag-section-head"><span className="ag-index">01 / Families</span><h2 className="ag-display">With their families</h2></div>
          <div className="ag-family-frame"><p>Prof Taofiki &amp; Alhaja Basirat Salako</p><span className="and">&amp;</span><p>Khalifah Abdul-Hafeez &amp; Alhaja Kudratu-Llah Otunuyi</p></div>
          <div className="ag-honour"><span>Guest of honour</span><strong>V.C. TASUED (Prof. Banjo)</strong></div>
        </div></section>

        <section className="ag-section"><div className="ag-section-inner">
          <div className="ag-section-head"><span className="ag-index">02 / The plan</span><h2 className="ag-display">A day in two rooms</h2></div>
          <div className="ag-grid">
            <article className="ag-cell"><h3>Ceremony</h3><p><strong>Saturday, 21st November 2026</strong><br />11:00 AM<br /><br /><strong>Rolak Hotel and Suites</strong><br />Adetola Hall, Imowo Eleran, Ijebu Ode</p></article>
            <article className="ag-cell"><h3>Reception</h3><p>Reception: follows immediately at the same venue</p></article>
            <article className="ag-cell"><h3>Directions</h3><p><strong>From Lagos Garage to Rolak Hotel &amp; Suites</strong><br /><br />Beside Imowo Community Primary School, Ijebu Ode, Ogun State</p></article>
            <article className="ag-cell"><h3>Venue</h3><p>Rolak Hotel and Suites<br />Adetola Hall<br />Imowo Eleran, Ijebu Ode</p></article>
          </div>
        </div></section>

        <section className="ag-section ag-verse"><div className="ag-section-inner"><div className="ag-muqarnas"><i /><i /><i /><i /><i /><i /><i /></div>
          <blockquote>“And among His signs is this, that He created for you mates from among yourselves, that you may dwell in tranquility with, and He has put love and mercy between your hearts. Verily in that are signs for those who reflect.”</blockquote><div className="ag-cite">— Al-Rum (30:21)</div>
          <div className="ag-toast">Love brought us together. Faith keeps us together. But God made it possible. It is marvellous in our eyes.<br /><br />— Ahmad &amp; Toyibat</div>
        </div></section>

        <section className="ag-section" id="ag-rsvp"><div className="ag-section-inner">
          <div className="ag-section-head"><span className="ag-index">03 / R.S.V.P.</span><h2 className="ag-display">Kindly respond</h2></div>
          <div className="ag-rsvp-grid">
            {[
              ['Mrs Khadijat', '08032278353', 'K'],
              ['Mr Oyedokun', '07038207478', 'O'],
              ['OMOT', '07017990204', 'O'],
              ['Aweda', '08026642105', 'A'],
            ].map(([name, phone, initial]) => <article className="ag-contact" key={phone}><div className="ag-portrait">{initial}</div><strong>{name}</strong><a href={`tel:${phone}`}>{phone}</a></article>)}
          </div>
          <div className="ag-dress"><div><small>Bride</small><span>Emerald Green</span></div><div><small>Groom</small><span>Champagne Gold</span></div></div>
        </div></section>
      </main>
      <footer className="ag-footer">Ahmad &amp; Toyibat</footer>
    </div>
  );
}