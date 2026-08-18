import { useEffect, useMemo, useState } from "react";

function CulturalCelebration() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const countdown = useMemo(() => {
    const target = new Date("2026-11-21T11:00:00").getTime();
    const remaining = Math.max(0, target - now);
    return {
      days: Math.floor(remaining / 86400000),
      hours: Math.floor((remaining % 86400000) / 3600000),
      minutes: Math.floor((remaining % 3600000) / 60000),
      seconds: Math.floor((remaining % 60000) / 1000),
    };
  }, [now]);

  const contacts = [
    ["Mrs Khadijat", "08032278353"],
    ["Mr Oyedokun", "07038207478"],
    ["OMOT", "07017990204"],
    ["Aweda", "08026642105"],
  ];

  return (
    <div className="celebration">
      <link
        rel="stylesheet"
        media="print"
        onLoad={(event) => { event.currentTarget.media = "all"; }}
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap"
      />
      <style>{`
        :root { --terracotta:#b85c2a; --forest:#1a4d2e; --gold:#d4a020; --cream:#fdf4e3; --ink:#2d251d; }
        * { box-sizing:border-box; }
        .celebration { min-height:100dvh; overflow:hidden; background:var(--cream); color:var(--ink); font-family:"DM Sans",sans-serif; }
        .celebration a { color:inherit; }
        .adire { background-color:var(--terracotta); background-image:
          linear-gradient(45deg, transparent 42%, rgba(253,244,227,.18) 43% 47%, transparent 48%),
          linear-gradient(-45deg, transparent 42%, rgba(253,244,227,.18) 43% 47%, transparent 48%),
          repeating-linear-gradient(90deg, transparent 0 26px, rgba(26,77,46,.24) 27px 31px, transparent 32px 54px);
          background-size:54px 54px,54px 54px,108px 100%; }
        .topbar { display:flex; justify-content:space-between; align-items:center; padding:24px clamp(20px,5vw,72px); border-bottom:1px solid rgba(253,244,227,.3); color:var(--cream); }
        .monogram { font-family:"Playfair Display",serif; font-size:24px; color:var(--gold); letter-spacing:.08em; }
        .topnav { display:flex; gap:25px; font-size:10px; font-weight:700; letter-spacing:.16em; text-transform:uppercase; }
        .topnav a { text-decoration:none; }
        .hero { padding:clamp(48px,9vw,120px) clamp(20px,7vw,110px) clamp(80px,12vw,160px); position:relative; }
        .hero-copy { position:relative; z-index:2; max-width:900px; }
        .eyebrow,.label { color:var(--gold); font-size:11px; font-weight:700; letter-spacing:.24em; text-transform:uppercase; }
        .hero h1 { margin:23px 0 0; color:var(--cream); font-family:"Playfair Display",serif; font-size:clamp(64px,13vw,190px); font-weight:500; letter-spacing:-.07em; line-height:.76; }
        .hero h1 em { color:var(--gold); font-size:.7em; }
        .hero-sub { max-width:470px; margin:42px 0 0; color:#f8dfbd; font-family:"Playfair Display",serif; font-size:clamp(19px,2.3vw,29px); line-height:1.3; }
        .hero-date { display:flex; gap:28px; margin-top:32px; color:var(--cream); font-size:11px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; }
        .hero-seal { position:absolute; right:7%; bottom:10%; width:138px; height:138px; display:grid; place-content:center; border:2px solid var(--gold); border-radius:50%; color:var(--gold); font-family:"Playfair Display",serif; font-size:27px; line-height:.9; text-align:center; transform:rotate(12deg); }
        .hero-seal span { font-size:13px; }
        .photo-wrap { position:relative; margin:-45px auto 0; width:min(90%,1080px); padding:13px; background:var(--terracotta); border-radius:6px; box-shadow:18px 18px 0 var(--gold); }
        .photo-wrap:before,.photo-wrap:after { content:""; position:absolute; width:60px; height:60px; border:3px solid var(--forest); }
        .photo-wrap:before { left:-18px; top:-18px; border-right:0; border-bottom:0; }
        .photo-wrap:after { right:-18px; bottom:-18px; border-left:0; border-top:0; }
        .photo-wrap img { display:block; width:100%; height:clamp(240px,45vw,550px); object-fit:cover; object-position:center 38%; border:5px solid var(--cream); }
        .section { padding:clamp(75px,10vw,140px) clamp(20px,7vw,110px); }
        .intro { display:grid; grid-template-columns:minmax(210px,.7fr) 1.3fr; gap:clamp(35px,8vw,130px); }
        .section h2 { margin:15px 0 0; color:var(--forest); font-family:"Playfair Display",serif; font-size:clamp(48px,7vw,100px); font-weight:500; letter-spacing:-.06em; line-height:.84; }
        .section h2 em { color:var(--terracotta); }
        .opening { border-left:5px solid var(--gold); padding:8px 0 8px 30px; }
        .opening .islamic { margin:0 0 38px; color:var(--forest); font-family:"Playfair Display",serif; font-size:clamp(24px,3vw,37px); line-height:1.14; }
        .opening .label { color:var(--terracotta); }
        .families { margin-top:12px; font-family:"Playfair Display",serif; font-size:clamp(23px,3vw,37px); line-height:1.13; }
        .and { margin:12px 0; color:var(--terracotta); font-style:italic; }
        .honour { margin:28px 0 0; color:var(--forest); font-family:"Playfair Display",serif; font-size:25px; }
        .programme { background:#ead5b4; position:relative; }
        .programme:before { content:""; position:absolute; inset:0 0 auto; height:15px; background:var(--forest); background-image:repeating-linear-gradient(135deg, transparent 0 18px, rgba(212,160,32,.9) 19px 23px, transparent 24px 42px); }
        .program-head { display:flex; justify-content:space-between; align-items:end; gap:30px; margin-bottom:52px; }
        .program-head p { max-width:300px; color:#5d513e; font-family:"Playfair Display",serif; font-size:20px; font-style:italic; line-height:1.2; }
        .schedule { display:grid; grid-template-columns:1fr 1fr; gap:18px; }
        .schedule article { background:var(--cream); padding:30px; border-top:8px solid var(--terracotta); box-shadow:9px 9px 0 var(--forest); }
        .schedule article:nth-child(2) { border-top-color:var(--gold); }
        .schedule .number { color:var(--terracotta); font-size:13px; font-weight:700; letter-spacing:.18em; }
        .schedule h3 { margin:42px 0 10px; color:var(--forest); font-family:"Playfair Display",serif; font-size:clamp(28px,4vw,48px); font-weight:500; line-height:.95; }
        .schedule p { color:#5d513e; font-family:"Playfair Display",serif; font-size:20px; line-height:1.25; }
        .venue { margin-top:28px; padding:28px; border:2px solid var(--forest); background:var(--cream); }
        .venue-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-top:13px; }
        .venue-grid p { margin:0; color:var(--forest); font-family:"Playfair Display",serif; font-size:24px; line-height:1.15; }
        .venue-grid p:last-child { color:#5d513e; font-size:19px; }
        .verse { background:var(--forest); color:var(--cream); text-align:center; }
        .verse blockquote { max-width:950px; margin:28px auto 0; color:#f8d987; font-family:"Playfair Display",serif; font-size:clamp(25px,4vw,47px); font-style:italic; line-height:1.15; }
        .verse cite { display:block; margin-top:25px; color:var(--gold); font-size:11px; font-style:normal; font-weight:700; letter-spacing:.2em; text-transform:uppercase; }
        .toast { max-width:600px; margin:55px auto 0; padding-top:32px; border-top:1px solid rgba(212,160,32,.6); color:var(--cream); font-family:"Playfair Display",serif; font-size:23px; line-height:1.3; }
        .rsvp { display:grid; grid-template-columns:.7fr 1.3fr; gap:clamp(35px,8vw,130px); }
        .rsvp-intro p { max-width:300px; color:#685943; font-family:"Playfair Display",serif; font-size:21px; line-height:1.25; }
        .contacts { display:grid; grid-template-columns:1fr 1fr; border-top:2px solid var(--forest); }
        .contact { display:flex; flex-direction:column; gap:10px; padding:22px 10px; border-bottom:1px solid #cdb88f; text-decoration:none; }
        .contact:nth-child(odd) { border-right:1px solid #cdb88f; padding-left:0; }
        .contact strong { color:var(--forest); font-family:"Playfair Display",serif; font-size:25px; font-weight:500; }
        .contact span { color:var(--terracotta); font-size:12px; font-weight:700; letter-spacing:.08em; }
        .dress { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:40px; }
        .dress-card { padding:25px; color:var(--cream); background:var(--forest); }
        .dress-card:last-child { color:var(--ink); background:var(--gold); }
        .dress-card small { display:block; font-size:10px; font-weight:700; letter-spacing:.2em; text-transform:uppercase; }
        .dress-card b { display:block; margin-top:8px; font-family:"Playfair Display",serif; font-size:26px; font-weight:500; }
        .countdown { display:flex; gap:22px; margin-top:40px; padding-top:20px; border-top:1px solid #cdb88f; }
        .countdown b { display:block; color:var(--forest); font-family:"Playfair Display",serif; font-size:30px; }
        .countdown span { color:var(--terracotta); font-size:9px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; }
        footer { padding:36px 20px; background:var(--terracotta); color:var(--cream); text-align:center; }
        footer strong { color:var(--gold); font-family:"Playfair Display",serif; font-size:30px; font-weight:500; }
        footer p { margin:6px 0 0; font-size:11px; letter-spacing:.14em; text-transform:uppercase; }
        @media (max-width:700px) {
          .topnav { gap:11px; font-size:9px; }
          .hero h1 { font-size:clamp(64px,20vw,120px); }
          .hero-seal { width:90px; height:90px; right:5%; bottom:7%; font-size:20px; }
          .hero-seal span { font-size:10px; }
          .hero-date { flex-direction:column; gap:9px; }
          .intro,.rsvp,.schedule { grid-template-columns:1fr; }
          .program-head { display:block; }
          .program-head p { margin-top:25px; }
          .venue-grid { grid-template-columns:1fr; }
          .photo-wrap { box-shadow:10px 10px 0 var(--gold); }
        }
      `}</style>

      <header className="adire">
        <nav className="topbar">
          <a className="monogram" href="#top">A / T</a>
          <div className="topnav"><a href="#story">The families</a><a href="#program">Programme</a><a href="#rsvp">RSVP</a></div>
        </nav>
        <div id="top" className="hero">
          <div className="hero-copy">
            <div className="eyebrow">A Yoruba aso-ebi celebration</div>
            <h1>Ahmad <em>&amp;</em><br />Toyibat</h1>
            <p className="hero-sub">Two families, one joyful gathering, and a day dressed in faith, colour, and love.</p>
            <div className="hero-date"><span>Saturday, 21st November 2026</span><span>11:00 AM</span></div>
          </div>
          <div className="hero-seal">A<br /><span>&amp;</span><br />T</div>
        </div>
      </header>

      <div className="photo-wrap"><img src="/__mockup/images/couple2.png" alt="Ahmad and Toyibat" /></div>

      <main>
        <section id="story" className="section intro">
          <div><div className="label">The invitation</div><h2>Come<br />share<br /><em>our joy.</em></h2></div>
          <div className="opening">
            <p className="islamic">In the name of Allah, the Most Gracious, the Most Merciful</p>
            <div className="label">The families of</div>
            <div className="families">Prof Taofiki &amp; Alhaja Basirat Salako<div className="and">and</div>Khalifah Abdul-Hafeez &amp; Alhaja Kudratu-Llah Otunuyi</div>
            <div className="label" style={{ marginTop: 34 }}>Guest of honour</div>
            <div className="honour">V.C. TASUED (Prof. Banjo)</div>
            <p className="families" style={{ marginTop: 34 }}>cordially invite you to celebrate the union of<br /><span style={{ color: "var(--terracotta)" }}>Ahmad Opeyemi &amp; Toyibat Adeola</span></p>
          </div>
        </section>

        <section id="program" className="section programme">
          <div className="program-head"><div><div className="label">Read the rhythm</div><h2>The<br /><em>programme</em></h2></div><p>A day of solemn promises, warm embraces, and a reception shared together.</p></div>
          <div className="schedule">
            <article><div className="number">01 / THE CEREMONY</div><h3>Join us for the solemnization</h3><p>✦ Saturday, 21st November 2026<br />✦ 11:00 AM</p></article>
            <article><div className="number">02 / THE RECEPTION</div><h3>Eat, dance, and celebrate</h3><p>✦ Reception follows immediately at the same venue<br />✦ Rolak Hotel and Suites</p></article>
          </div>
          <div className="venue"><div className="label">Find us</div><div className="venue-grid"><p>Rolak Hotel and Suites<br />Adetola Hall, Imowo Eleran, Ijebu Ode</p><p><strong>Directions:</strong><br />From Lagos Garage to Rolak Hotel &amp; Suites — Beside Imowo Community Primary School, Ijebu Ode, Ogun State</p></div></div>
        </section>

        <section className="section verse">
          <div className="label">A prayer for the couple</div>
          <blockquote>“And among His signs is this, that He created for you mates from among yourselves, that you may dwell in tranquility with, and He has put love and mercy between your hearts. Verily in that are signs for those who reflect.”</blockquote>
          <cite>— Al-Rum (30:21)</cite>
          <div className="toast">Love brought us together. Faith keeps us together. But God made it possible. It is marvellous in our eyes.<br /><span>— Ahmad &amp; Toyibat</span></div>
        </section>

        <section id="rsvp" className="section rsvp">
          <div className="rsvp-intro"><div className="label">Make it a full house</div><h2>Come<br /><em>celebrate.</em></h2><p>Kindly contact any of the following for attendance confirmation.</p></div>
          <div>
            <div className="contacts">{contacts.map(([name, phone]) => <a className="contact" href={`tel:${phone}`} key={phone}><strong>{name}</strong><span>tel: {phone}</span></a>)}</div>
            <div className="dress"><div className="dress-card"><small>Bride</small><b>Emerald Green</b></div><div className="dress-card"><small>Groom</small><b>Champagne Gold</b></div></div>
            <div className="countdown"><div><b>{String(countdown.days).padStart(3, "0")}</b><span>days</span></div><div><b>{String(countdown.hours).padStart(2, "0")}</b><span>hours</span></div><div><b>{String(countdown.minutes).padStart(2, "0")}</b><span>minutes</span></div><div><b>{String(countdown.seconds).padStart(2, "0")}</b><span>seconds</span></div></div>
          </div>
        </section>
      </main>
      <footer><strong>Ahmad &amp; Toyibat</strong><p>With gratitude to Allah and joy in our hearts.</p></footer>
    </div>
  );
}

export { CulturalCelebration };
export default CulturalCelebration;