import { useEffect, useMemo, useState } from "react";

const eventDate = new Date("November 21, 2026 11:00:00");

function twoDigits(value: number) {
  return String(value).padStart(2, "0");
}

export function EditorialColumn() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
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
    <div className="editorial-column">
      <style>{`
        .editorial-column{--ink:#11110f;--paper:#f5f1e9;--warm:#e8e0d2;--gold:#aa8249;min-height:100dvh;background:var(--paper);color:var(--ink);font-family:Manrope,Arial,sans-serif;overflow:hidden}
        .editorial-column *{box-sizing:border-box}.editorial-column a{color:inherit}
        .column-nav{display:flex;justify-content:space-between;align-items:center;padding:22px clamp(20px,5vw,70px);border-bottom:1px solid #c9bda9;font:500 10px "DM Mono",monospace;letter-spacing:.18em;text-transform:uppercase}
        .column-nav strong{font:600 22px "Cormorant Garamond",serif;letter-spacing:.08em}.column-nav a{text-decoration:none}
        .column-hero{display:grid;grid-template-columns:minmax(0,1.02fr) minmax(320px,.98fr);min-height:730px;border-bottom:1px solid #c9bda9}
        .column-hero-copy{display:flex;flex-direction:column;justify-content:space-between;padding:clamp(38px,6vw,90px) clamp(24px,6vw,100px) 45px}
        .column-kicker,.column-label{color:var(--gold);font:500 10px "DM Mono",monospace;letter-spacing:.16em;text-transform:uppercase}
        .column-title{margin:42px 0 0;font:900 clamp(5rem,13vw,11.5rem)/.7 "Cormorant Garamond",serif;letter-spacing:-.08em}
        .column-title em{display:block;margin-left:clamp(25px,5vw,80px);font-weight:400}
        .column-date{display:flex;justify-content:space-between;gap:25px;align-items:end;border-top:1px solid var(--gold);padding-top:16px;font:500 11px/1.5 "DM Mono",monospace;letter-spacing:.08em;text-transform:uppercase}
        .column-date strong{display:block;margin-top:7px;font:500 26px/1 "Cormorant Garamond",serif;letter-spacing:0;text-transform:none}
        .column-countdown{display:flex;gap:14px;text-align:right}.column-countdown b{display:block;font:500 32px/1 "Cormorant Garamond",serif}.column-countdown small{color:var(--gold);font-size:8px}
        .column-hero-photo{position:relative;min-height:500px;background:#25221d}.column-hero-photo:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(17,17,15,.25),transparent 42%,rgba(17,17,15,.08))}
        .column-hero-photo img{width:100%;height:100%;object-fit:cover;object-position:center 35%;filter:grayscale(22%) contrast(1.06)}
        .column-intro{display:grid;grid-template-columns:1fr 2fr;gap:clamp(30px,8vw,130px);padding:clamp(75px,10vw,150px) clamp(24px,10vw,170px);border-bottom:1px solid #c9bda9}
        .column-intro h2{margin:0;font:900 clamp(4rem,9vw,8.5rem)/.72 "Cormorant Garamond",serif;letter-spacing:-.07em}.column-intro h2 span{display:block;font-style:italic;font-weight:400}
        .column-intro-copy{max-width:700px;padding-top:10px}.column-opening{margin:0 0 42px;font:500 clamp(2rem,4vw,4.3rem)/.86 "Cormorant Garamond",serif;letter-spacing:-.025em}.column-copy{border-top:1px solid var(--gold);padding-top:23px;font:500 clamp(1.2rem,2vw,1.75rem)/1.15 "Cormorant Garamond",serif}
        .column-copy strong{font-weight:700}.column-copy:first-letter{float:left;padding:8px 10px 0 0;color:var(--gold);font:700 5rem/.65 "Cormorant Garamond",serif}
        .column-details{background:var(--warm);padding:clamp(70px,9vw,125px) clamp(24px,10vw,170px);border-bottom:1px solid #c9bda9}
        .column-details-head{display:flex;justify-content:space-between;align-items:end;gap:30px}.column-details h2,.column-rsvp h2{margin:15px 0 0;font:900 clamp(4.5rem,10vw,10rem)/.68 "Cormorant Garamond",serif;letter-spacing:-.075em}.column-side-note{max-width:240px;font:500 15px/1.1 "Cormorant Garamond",serif}
        .column-detail-list{display:grid;grid-template-columns:repeat(4,1fr);margin-top:75px;border-top:1px solid var(--ink)}.column-detail{min-height:210px;padding:22px 24px 20px 0;border-bottom:1px solid #c9bda9}.column-detail+.column-detail{border-left:1px solid #c9bda9;padding-left:24px}.column-detail h3{margin:0 0 22px;color:var(--gold);font:500 10px "DM Mono",monospace;letter-spacing:.16em;text-transform:uppercase}.column-detail p{margin:0;font:600 clamp(1.7rem,3vw,3rem)/.85 "Cormorant Garamond",serif}.column-detail small{display:block;margin-top:19px;font:500 11px/1.5 Manrope,sans-serif}
        .column-blessing{display:grid;grid-template-columns:1fr 2fr;gap:clamp(30px,8vw,130px);padding:clamp(80px,11vw,165px) clamp(24px,10vw,170px);background:var(--ink);color:var(--paper)}.column-blessing .column-label{padding-top:8px}.column-quote{max-width:850px;margin:0;font:500 italic clamp(2.3rem,5vw,5.2rem)/.88 "Cormorant Garamond",serif;letter-spacing:-.035em}.column-attribution{margin:30px 0 0;color:var(--gold);font:500 10px "DM Mono",monospace;letter-spacing:.15em;text-transform:uppercase}.column-toast{max-width:520px;margin:70px 0 0;border-top:1px solid var(--gold);padding-top:19px;font:500 1.4rem/1.05 "Cormorant Garamond",serif}
        .column-rsvp{padding:clamp(75px,10vw,140px) clamp(24px,10vw,170px)}.column-rsvp-head{display:flex;justify-content:space-between;align-items:end;gap:30px}.column-rsvp-note{max-width:260px;margin:0;font:500 1.3rem/1.05 "Cormorant Garamond",serif}.column-contacts{display:grid;grid-template-columns:repeat(4,1fr);margin-top:75px;border-top:1px solid var(--gold);border-bottom:1px solid var(--gold)}.column-contact{min-height:145px;padding:20px 18px 20px 0}.column-contact+.column-contact{border-left:1px solid var(--gold);padding-left:18px}.column-contact strong{display:block;font:600 1.35rem/1 "Cormorant Garamond",serif}.column-contact a{display:inline-block;margin-top:35px;color:var(--gold);font:500 10px "DM Mono",monospace;text-decoration:none}.column-dress{display:grid;grid-template-columns:1fr 2fr;gap:30px;margin-top:75px;border-bottom:1px solid var(--gold);padding:18px 0;font:500 10px "DM Mono",monospace;letter-spacing:.15em;text-transform:uppercase}.column-dress strong{font:600 clamp(1.7rem,3vw,3rem)/.85 "Cormorant Garamond",serif;letter-spacing:0;text-transform:none}.column-dress span{color:var(--gold)}
        .column-footer{display:flex;justify-content:space-between;padding:25px clamp(24px,10vw,170px);background:var(--ink);color:var(--paper);font:500 10px "DM Mono",monospace;letter-spacing:.1em;text-transform:uppercase}.column-footer strong{font:600 1.4rem "Cormorant Garamond",serif;letter-spacing:0;text-transform:none}
        @media(max-width:760px){.column-hero,.column-intro,.column-blessing{grid-template-columns:1fr}.column-hero{min-height:0}.column-hero-copy{min-height:650px}.column-hero-photo{height:470px}.column-intro h2{margin-bottom:35px}.column-details-head,.column-rsvp-head{display:block}.column-side-note,.column-rsvp-note{margin-top:28px}.column-detail-list,.column-contacts{grid-template-columns:1fr 1fr;margin-top:45px}.column-detail:nth-child(3){border-left:0;padding-left:0}.column-detail:nth-child(odd){padding-left:0}.column-contact:nth-child(3){border-left:0;padding-left:0}.column-dress{grid-template-columns:1fr;gap:18px;margin-top:50px}.column-footer{display:block;line-height:2}.column-footer strong{display:block}}
        @media(max-width:430px){.column-title{font-size:4.3rem}.column-countdown{gap:8px}.column-countdown b{font-size:25px}.column-detail,.column-contact{min-height:150px;padding-right:10px}.column-detail+.column-detail,.column-contact+.column-contact{padding-left:10px}.column-detail p{font-size:1.65rem}}
      `}</style>
      <nav className="column-nav"><strong>A / T</strong><a href="#column-rsvp">R.S.V.P. ↘</a></nav>
      <header className="column-hero">
        <div className="column-hero-copy"><div><div className="column-kicker">A formal announcement · 2026</div><h1 className="column-title">Ahmad <em>&amp; Toyibat</em></h1></div><div className="column-date"><div>Saturday, 21st November 2026<strong>11:00 AM</strong></div><div className="column-countdown">{countdown ? countdown.map(([label,value])=><div key={label}><b>{twoDigits(value)}</b><small>{label}</small></div>) : <span>The ceremony is today</span>}</div></div></div>
        <div className="column-hero-photo"><img src="/__mockup/images/couple3.png" alt="Ahmad Opeyemi and Toyibat Adeola" /></div>
      </header>
      <main>
        <section className="column-intro"><h2><span>01 /</span>The<br/>invitation</h2><div className="column-intro-copy"><p className="column-opening">In the name of Allah, the Most Gracious, the Most Merciful</p><p className="column-copy">The families of <strong>Prof Taofiki &amp; Alhaja Basirat Salako</strong> and <strong>Khalifah Abdul-Hafeez &amp; Alhaja Kudratu-Llah Otunuyi</strong> request the honour of the presence of <strong>V.C. TASUED (Prof. Banjo)</strong> at the solemnization of <strong>Ahmad Opeyemi &amp; Toyibat Adeola.</strong></p></div></section>
        <section className="column-details"><div className="column-details-head"><div><div className="column-label">02 / The particulars</div><h2>The day<br/>in full.</h2></div><p className="column-side-note">A clear, considered record of the ceremony and the celebration that follows.</p></div><div className="column-detail-list"><article className="column-detail"><h3>Date &amp; time</h3><p>Saturday, 21st<br/>November 2026</p><small>11:00 AM</small></article><article className="column-detail"><h3>Venue</h3><p>Rolak Hotel<br/>and Suites</p><small>Adetola Hall, Imowo Eleran, Ijebu Ode</small></article><article className="column-detail"><h3>Reception</h3><p>Follows<br/>immediately</p><small>At the same venue</small></article><article className="column-detail"><h3>Directions</h3><p>From Lagos<br/>Garage</p><small>Beside Imowo Community Primary School, Ijebu Ode</small></article></div></section>
        <section className="column-blessing"><div className="column-label">03 / A blessing</div><div><p className="column-quote">“And among His signs is this, that He created for you mates from among yourselves, that you may dwell in tranquility with, and He has put love and mercy between your hearts.”</p><p className="column-attribution">— Al-Rum (30:21)</p><p className="column-toast">Love brought us together. Faith keeps us together. But God made it possible. — Ahmad &amp; Toyibat</p></div></section>
        <section className="column-rsvp" id="column-rsvp"><div className="column-rsvp-head"><div><div className="column-label">04 / Attendance</div><h2>R.S.V.P.</h2></div><p className="column-rsvp-note">Kindly respond to one of the following.</p></div><div className="column-contacts">{[["Mrs Khadijat","08032278353"],["Mr Oyedokun","07038207478"],["OMOT","07017990204"],["Aweda","08026642105"]].map(([name,phone])=><div className="column-contact" key={name}><strong>{name}</strong><a href={`tel:${phone}`}>{phone}</a></div>)}</div><div className="column-dress"><div>Dress code</div><strong>Bride — <span>Emerald Green</span><br/>Groom — <span>Champagne Gold</span></strong></div></section>
      </main>
      <footer className="column-footer"><strong>Ahmad &amp; Toyibat</strong><span>Saturday, 21st November 2026 · Ijebu Ode</span></footer>
    </div>
  );
}

export default EditorialColumn;