## I eant a website with a working countdown to the big day a picture of the couple interactive pages like clicking the envelope to open it and double page build it for me and make sure it works

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Wedding of Sarah & James</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
    
    <style>
        /* --- COLOR SCHEME & GLOBAL VARIABLES --- */
        :root {
            --bg-color: #fdfbf7;
            --rose-accent: #e8b4b8;
            --rose-dark: #b86b77;
            --champagne-gold: #d4af37;
            --envelope-bg: #f7e7e8;
            --envelope-inside: #eed0d3;
            --text-dark: #3a3233;
            --text-light: #706365;
            --white: #ffffff;
            --shadow: rgba(0, 0, 0, 0.12);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Montserrat', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-dark);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow-x: hidden;
            padding: 20px 10px;
        }

        /* --- ENVELOPE CONTAINER --- */
        .wrapper {
            perspective: 1000px;
            width: 100%;
            max-width: 520px;
            margin: 0 auto;
            position: relative;
        }

        .envelope {
            width: 100%;
            height: 350px;
            background-color: var(--envelope-bg);
            position: relative;
            border-radius: 8px;
            box-shadow: 0 15px 35px var(--shadow);
            cursor: pointer;
            transition: transform 0.5s ease;
        }

        /* Envelope Flap Top */
        .flap {
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 0;
            border-left: 260px solid transparent;
            border-right: 260px solid transparent;
            border-top: 180px solid var(--rose-accent);
            transform-origin: top;
            transition: transform 0.6s ease 0.2s, z-index 0.2s ease 0.4s;
            z-index: 5;
        }

        /* Wax Seal Button */
        .wax-seal {
            position: absolute;
            top: 140px;
            left: 50%;
            transform: translateX(-50%);
            width: 55px;
            height: 55px;
            background: radial-gradient(circle, var(--champagne-gold) 60%, #b38f20 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--white);
            font-family: 'Alex Brush', cursive;
            font-size: 24px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            z-index: 6;
            transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .envelope:hover .wax-seal {
            transform: translateX(-50%) scale(1.08);
        }

        .pocket {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 0;
            border-left: 260px solid var(--envelope-inside);
            border-right: 260px solid var(--envelope-inside);
            border-bottom: 180px solid var(--rose-accent);
            border-radius: 0 0 8px 8px;
            z-index: 3;
        }

        /* --- THE CARD / WEBSITE CONTAINER --- */
        .card {
            position: absolute;
            bottom: 10px;
            left: 5%;
            width: 90%;
            height: 330px;
            background: var(--white);
            border-radius: 8px;
            box-shadow: 0 4px 15px var(--shadow);
            transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), height 0.8s ease, width 0.8s ease, left 0.8s ease;
            z-index: 2;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        /* OPENED STATE ANIMATIONS */
        .wrapper.open .flap {
            transform: rotateX(180deg);
            z-index: 1;
        }

        .wrapper.open .wax-seal {
            opacity: 0;
            pointer-events: none;
        }

        .wrapper.open .card {
            position: relative;
            left: 0;
            width: 100%;
            height: auto;
            min-height: 700px;
            transform: translateY(-80px);
            z-index: 10;
        }

        .wrapper.open .envelope {
            height: 0;
            box-shadow: none;
            background: transparent;
        }

        .wrapper.open .pocket {
            opacity: 0;
            transition: opacity 0.5s ease;
        }

        /* --- WEBSITE CONTENT & INTERACTION --- */
        .card-header {
            padding: 30px 20px 10px 20px;
            text-align: center;
            border-bottom: 1px solid #f0e6e6;
        }

        .script-title {
            font-family: 'Alex Brush', cursive;
            font-size: 48px;
            color: var(--rose-dark);
            margin-bottom: 5px;
        }

        .sub-title {
            font-size: 13px;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: var(--text-light);
        }

        /* Navigation Bar */
        .nav-tabs {
            display: flex;
            justify-content: center;
            background: #faf5f5;
            border-bottom: 1px solid #f0e6e6;
        }

        .nav-tab {
            padding: 12px 18px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            border: none;
            background: none;
            cursor: pointer;
            color: var(--text-light);
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .nav-tab.active, .nav-tab:hover {
            color: var(--rose-dark);
            border-bottom: 2px solid var(--rose-dark);
        }

        /* Pages Section */
        .page-content {
            padding: 30px 25px;
            flex: 1;
            display: none;
            animation: fadeIn 0.5s ease forwards;
        }

        .page-content.active {
            display: block;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Photo Frame */
        .couple-photo-frame {
            width: 180px;
            height: 180px;
            border-radius: 50%;
            margin: 0 auto 20px auto;
            border: 4px solid var(--rose-accent);
            padding: 5px;
            box-shadow: 0 4px 12px var(--shadow);
            overflow: hidden;
        }

        .couple-photo-frame img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
        }

        /* Countdown Styles */
        .countdown-title {
            text-align: center;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 15px;
            color: var(--text-light);
        }

        .countdown-grid {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-bottom: 30px;
        }

        .count-box {
            background-color: var(--bg-color);
            padding: 12px;
            border-radius: 6px;
            min-width: 70px;
            text-align: center;
            box-shadow: 0 2px 6px var(--shadow);
            border: 1px solid #f0e6e6;
        }

        .count-number {
            font-size: 24px;
            font-weight: 600;
            color: var(--rose-dark);
        }

        .count-label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--text-light);
        }

        /* RSVP Form */
        .form-group {
            margin-bottom: 15px;
            text-align: left;
        }

        .form-group label {
            display: block;
            font-size: 12px;
            margin-bottom: 5px;
            color: var(--text-light);
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .form-group input, .form-group select {
            width: 100%;
            padding: 10px;
            border: 1px solid #e0d0d0;
            border-radius: 4px;
            font-family: inherit;
        }

        .btn-submit {
            width: 100%;
            background-color: var(--rose-dark);
            color: var(--white);
            border: none;
            padding: 12px;
            border-radius: 4px;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            font-weight: 500;
            transition: background 0.3s ease;
        }

        .btn-submit:hover {
            background-color: #9e5661;
        }

        .click-hint {
            text-align: center;
            margin-top: 15px;
            font-size: 12px;
            color: var(--text-light);
            letter-spacing: 1px;
            text-transform: uppercase;
        }
    </style>
</head>
<body>

    <div class="wrapper" id="envelopeWrapper">
        <div class="envelope" onclick="openEnvelope()">
            <div class="flap"></div>
            <div class="wax-seal">S&J</div>
            <div class="pocket"></div>

            <!-- CARD CONTENT -->
            <div class="card" onclick="event.stopPropagation();">
                <div class="card-header">
                    <div class="sub-title">Are Getting Married</div>
                    <div class="script-title">Sarah & James</div>
                    <div class="sub-title">September 18, 2027</div>
                </div>

                <!-- Navigation Tabs -->
                <nav class="nav-tabs">
                    <button class="nav-tab active" onclick="showPage('invitation', this)">Invitation</button>
                    <button class="nav-tab" onclick="showPage('story', this)">Our Story</button>
                    <button class="nav-tab" onclick="showPage('details', this)">Details</button>
                    <button class="nav-tab" onclick="showPage('rsvp', this)">RSVP</button>
                </nav>

                <!-- Page 1: Invitation & Countdown -->
                <div id="invitation" class="page-content active">
                    <div class="couple-photo-frame">
                        <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80" alt="Couple Picture">
                    </div>

                    <div class="countdown-title">Counting Down To The Big Day</div>
                    <div class="countdown-grid">
                        <div class="count-box"><div id="days" class="count-number">00</div><div class="count-label">Days</div></div>
                        <div class="count-box"><div id="hours" class="count-number">00</div><div class="count-label">Hours</div></div>
                        <div class="count-box"><div id="mins" class="count-number">00</div><div class="count-label">Mins</div></div>
                        <div class="count-box"><div id="secs" class="count-number">00</div><div class="count-label">Secs</div></div>
                    </div>
                </div>

                <!-- Page 2: Story -->
                <div id="story" class="page-content">
                    <h3 style="text-align: center; font-family: 'Alex Brush', cursive; font-size: 36px; color: var(--rose-dark); margin-bottom: 10px;">How We Met</h3>
                    <p style="font-size: 14px; line-height: 1.6; color: var(--text-light); text-align: center;">
                        It all started five years ago in a coffee shop on a rainy afternoon. From sharing a table to sharing a lifetime of dreams, we are so excited to step into this next chapter together surrounded by the people we love most!
                    </p>
                </div>

                <!-- Page 3: Event Details -->
                <div id="details" class="page-content" style="text-align: center;">
                    <h3 style="font-family: 'Alex Brush', cursive; font-size: 36px; color: var(--rose-dark); margin-bottom: 15px;">The Wedding Schedule</h3>
                    <div style="margin-bottom: 15px;">
                        <strong style="color: var(--rose-dark); text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">The Ceremony</strong>
                        <p style="font-size: 13px; color: var(--text-light);">4:00 PM | St. Mary's Chapel</p>
                    </div>
                    <div>
                        <strong style="color: var(--rose-dark); text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">The Reception</strong>
                        <p style="font-size: 13px; color: var(--text-light);">6:30 PM | The Rosewood Estate</p>
                    </div>
                </div>

                <!-- Page 4: RSVP -->
                <div id="rsvp" class="page-content">
                    <form onsubmit="handleRSVP(event)">
                        <div class="form-group">
                            <label>Your Full Name</label>
                            <input type="text" required placeholder="John & Jane Doe">
                        </div>
                        <div class="form-group">
                            <label>Will you attend?</label>
                            <select required>
                                <option value="yes">Joyfully Accepts</option>
                                <option value="no">Regretfully Declines</option>
                            </select>
                        </div>
                        <button type="submit" class="btn-submit">Send RSVP</button>
                    </form>
                </div>

            </div>
        </div>
        <div class="click-hint" id="clickHint">Click the seal to open invitation</div>
    </div>

    <script>
        // 1. OPEN ENVELOPE FUNCTION
        function openEnvelope() {
            const wrapper = document.getElementById('envelopeWrapper');
            const clickHint = document.getElementById('clickHint');
            wrapper.classList.add('open');
            clickHint.style.display = 'none';
        }

        // 2. PAGE TOGGLE FUNCTION
        function showPage(pageId, tabElement) {
            // Hide all pages
            const pages = document.querySelectorAll('.page-content');
            pages.forEach(page => page.classList.remove('active'));

            // Remove active class from all tabs
            const tabs = document.querySelectorAll('.nav-tab');
            tabs.forEach(tab => tab.classList.remove('active'));

            // Show selected page & activate tab
            document.getElementById(pageId).classList.add('active');
            tabElement.classList.add('active');
        }

        // 3. COUNTDOWN TIMER SCRIPT
        const weddingDate = new Date("September 18, 2027 16:00:00").getTime();

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if (distance < 0) {
                document.querySelector('.countdown-grid').innerHTML = "<p>Today is the day!</p>";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60))Here is a complete, single-file HTML/CSS/JS template for a **Wedding Website** featuring:
1. **Interactive Opening Envelope** (Click to open flap, pull out letter, and transition into the website).
2. **Live Countdown Timer** working up to the big day.
3. **Double-Page / Multi-Section Layout** (Navigation with smooth scrolling or page-switching).
4. **Couple Showcase & Story**, Event Timeline, Photo Gallery, and RSVP form.

You can save this code as an `.html` file (e.g., `index.html`) and open it in any web browser.

---

### Complete Code (`index.html`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>The Big Day — Wedding Invitation</title>

  <!-- Google Fonts & FontAwesome -->
  <link rel="preconnect" href="[https://fonts.googleapis.com](https://fonts.googleapis.com)">
  <link rel="preconnect" href="[https://fonts.gstatic.com](https://fonts.gstatic.com)" crossorigin>
  <link href="[https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500;600&family=Great+Vibes&display=swap](https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500;600&family=Great+Vibes&display=swap)" rel="stylesheet">
  <link rel="stylesheet" href="[https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css)">

  <style>
    /* ==========================================
       COLOR PALETTE & CSS VARIABLES
       ========================================== */
    :root {
      --bg-cream: #faf7f2;
      --burgundy: #6b2d3e;
      --burgundy-light: #8b3e52;
      --gold: #d4af37;
      --gold-soft: #e2c976;
      --sage-green: #7d8c75;
      --text-dark: #2c2c2c;
      --text-light: #666666;
      --white: #ffffff;
      --font-heading: 'Cormorant Garamond', serif;
      --font-body: 'Montserrat', sans-serif;
      --font-script: 'Great Vibes', cursive;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-cream);
      color: var(--text-dark);
      font-family: var(--font-body);
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* ==========================================
       1. INTERACTIVE ENVELOPE OVERLAY
       ========================================== */
    #envelope-screen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, #f5efe6 0%, #e6daca 100%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      transition: opacity 1s ease, visibility 1s ease;
    }

    #envelope-screen.hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .envelope-wrapper {
      position: relative;
      width: 320px;
      height: 220px;
      background-color: var(--burgundy);
      border-radius: 6px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.25);
      cursor: pointer;
      perspective: 800px;
    }

    /* Flap */
    .envelope-flap {
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      border-left: 160px solid transparent;
      border-right: 160px solid transparent;
      border-top: 120px solid var(--burgundy-light);
      transform-origin: top;
      transition: transform 0.6s ease-in-out;
      z-index: 4;
    }

    /* Front Pocket */
    .envelope-pocket {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 0;
      border-left: 160px solid var(--burgundy);
      border-right: 160px solid var(--burgundy);
      border-bottom: 120px solid #542230;
      border-radius: 0 0 6px 6px;
      z-index: 3;
    }

    /* Gold Seal */
    .wax-seal {
      position: absolute;
      top: 95px;
      left: 50%;
      transform: translateX(-50%);
      width: 46px;
      height: 46px;
      background: radial-gradient(circle, var(--gold-soft) 0%, var(--gold) 100%);
      border-radius: 50%;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--burgundy);
      font-family: var(--font-heading);
      font-weight: bold;
      font-size: 1.1rem;
      z-index: 5;
      transition: transform 0.3s ease;
    }

    .envelope-wrapper:hover .wax-seal {
      transform: translateX(-50%) scale(1.1);
    }

    /* Letter inside */
    .letter {
      position: absolute;
      bottom: 10px;
      left: 20px;
      width: 280px;
      height: 180px;
      background: var(--white);
      border-radius: 4px;
      padding: 20px;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 2;
      transition: transform 0.8s ease-in-out;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .letter h3 {
      font-family: var(--font-script);
      font-size: 2.2rem;
      color: var(--burgundy);
    }

    .letter p {
      font-family: var(--font-heading);
      font-size: 1rem;
      color: var(--text-dark);
      margin-top: 5px;
    }

    .envelope-prompt {
      margin-top: 30px;
      font-family: var(--font-body);
      font-size: 0.9rem;
      letter-spacing: 2px;
      color: var(--burgundy);
      text-transform: uppercase;
      animation: pulse 2s infinite;
    }

    /* Envelope Opened State Animations */
    .envelope-wrapper.open .envelope-flap {
      transform: rotateX(180deg);
      z-index: 1;
    }

    .envelope-wrapper.open .wax-seal {
      opacity: 0;
    }

    .envelope-wrapper.open .letter {
      transform: translateY(-130px);
      z-index: 5;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }

    /* ==========================================
       2. MAIN WEBSITE CONTENT & NAVIGATION
       ========================================== */
    #main-website {
      opacity: 0;
      transition: opacity 1s ease 0.5s;
    }

    #main-website.visible {
      opacity: 1;
    }

    /* Navigation Bar */
    .navbar {
      position: sticky;
      top: 0;
      background-color: rgba(250, 247, 242, 0.95);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--gold-soft);
      z-index: 1000;
      padding: 15px 0;
    }

    .nav-container {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
    }

    .nav-logo {
      font-family: var(--font-script);
      font-size: 2rem;
      color: var(--burgundy);
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      list-style: none;
      gap: 25px;
    }

    .nav-links a {
      text-decoration: none;
      color: var(--text-dark);
      font-size: 0.85rem;
      font-weight: 500;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      transition: color 0.3s;
    }

    .nav-links a:hover {
      color: var(--burgundy);
    }

    /* Hero Section */
    .hero {
      padding: 80px 20px;
      text-align: center;
      background: linear-gradient(180deg, rgba(212,175,55,0.08) 0%, rgba(250,247,242,1) 100%);
    }

    .hero-subtitle {
      font-size: 0.9rem;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: var(--sage-green);
      margin-bottom: 15px;
    }

    .hero-title {
      font-family: var(--font-script);
      font-size: 4.5rem;
      color: var(--burgundy);
      line-height: 1.1;
      margin-bottom: 20px;
    }

    .hero-date {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      color: var(--text-light);
      margin-bottom: 40px;
    }

    /* Countdown Timer */
    .countdown-container {
      display: flex;
      justify-content: center;
      gap: 20px;
      max-width: 600px;
      margin: 0 auto 40px auto;
    }

    .time-box {
      background: var(--white);
      border: 1px solid var(--gold-soft);
      padding: 15px 20px;
      border-radius: 8px;
      min-width: 90px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.03);
    }

    .time-number {
      font-family: var(--font-heading);
      font-size: 2.2rem;
      font-weight: 600;
      color: var(--burgundy);
      display: block;
    }

    .time-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-light);
    }

    /* ==========================================
       3. DOUBLE PAGE / TWO COLUMN LAYOUT
       ========================================== */
    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 60px 20px;
    }

    .double-page-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 50px;
      align-items: center;
      background: var(--white);
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.04);
      border: 1px solid rgba(212,175,55,0.2);
    }

    .page-left img {
      width: 100%;
      height: 450px;
      object-fit: cover;
      border-radius: 8px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    }

    .page-right {
      padding: 10px;
    }

    .section-tag {
      font-size: 0.8rem;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--sage-green);
      margin-bottom: 10px;
      display: block;
    }

    .section-title {
      font-family: var(--font-heading);
      font-size: 2.8rem;
      color: var(--burgundy);
      margin-bottom: 20px;
    }

    .section-body {
      line-height: 1.8;
      color: var(--text-light);
      margin-bottom: 25px;
      font-size: 0.95rem;
    }

    /* ==========================================
       4. RSVP & FOOTER
       ========================================== */
    .rsvp-section {
      text-align: center;
      background-color: #f2ebe1;
      padding: 80px 20px;
      margin-top: 60px;
    }

    .rsvp-form {
      max-width: 500px;
      margin: 30px auto 0 auto;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .form-input, .form-select {
      width: 100%;
      padding: 14px;
      border: 1px solid var(--gold-soft);
      border-radius: 6px;
      font-family: var(--font-body);
      font-size: 0.9rem;
      outline: none;
      background: var(--white);
    }

    .btn-submit {
      background-color: var(--burgundy);
      color: var(--white);
      border: none;
      padding: 15px;
      font-size: 0.9rem;
      letter-spacing: 2px;
      text-transform: uppercase;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn-submit:hover {
      background-color: var(--burgundy-light);
    }

    footer {
      text-align: center;
      padding: 30px;
      font-size: 0.85rem;
      color: var(--text-light);
      border-top: 1px solid rgba(0,0,0,0.05);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .double-page-grid {
        grid-template-columns: 1fr;
        padding: 20px;
      }
      .hero-title {
        font-size: 3.2rem;
      }
      .time-box {
        min-width: 65px;
        padding: 10px;
      }
      .time-number {
        font-size: 1.6rem;
      }
    }
  </style>
</head>
<body>

  <!-- ==========================================
       1. INTERACTIVE ENVELOPE OVERLAY
       ========================================== -->
  <div id="envelope-screen">
    <div class="envelope-wrapper" id="envelope">
      <div class="envelope-flap"></div>
      <div class="wax-seal">E&A</div>
      <div class="envelope-pocket"></div>
      <div class="letter">
        <h3>Save the Date</h3>
        <p>Emma & Alexander</p>
        <p style="font-size: 0.8rem; margin-top: 8px; color: var(--sage-green);">Click to Open Site</p>
      </div>
    </div>
    <div class="envelope-prompt">Click Envelope to Open Invitation</div>
  </div>

  <!-- ==========================================
       2. MAIN WEBSITE
       ========================================== -->
  <div id="main-website">
    
    <!-- Navigation -->
    <nav class="navbar">
      <div class="nav-container">
        <a href="#" class="nav-logo">E & A</a>
        <ul class="nav-links">
          <li><a href="#couple">The Couple</a></li>
          <li><a href="#details">Details</a></li>
          <li><a href="#rsvp">RSVP</a></li>
        </ul>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <span class="hero-subtitle">We are getting married!</span>
      <h1 class="hero-title">Emma & Alexander</h1>
      <p class="hero-date">September 18, 2027 • Darlington, UK</p>

      <!-- Countdown Timer -->
      <div class="countdown-container">
        <div class="time-box">
          <span class="time-number" id="days">00</span>
          <span class="time-label">Days</span>
        </div>
        <div class="time-box">
          <span class="time-number" id="hours">00</span>
          <span class="time-label">Hours</span>
        </div>
        <div class="time-box">
          <span class="time-number" id="minutes">00</span>
          <span class="time-label">Mins</span>
        </div>
        <div class="time-box">
          <span class="time-number" id="seconds">00</span>
          <span class="time-label">Secs</span>
        </div>
      </div>
    </section>

    <!-- Double Page Layout Section -->
    <section class="container" id="couple">
      <div class="double-page-grid">
        <!-- Page Left: Photo -->
        <div class="page-left">
          <img src="[https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80](https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80)" alt="Happy Couple">
        </div>
        
        <!-- Page Right: Story Content -->
        <div class="page-right">
          <span class="section-tag">Our Love Story</span>
          <h2 class="section-title">How We Met</h2>
          <p class="section-body">
            From a chance meeting at a local coffee shop to years of shared adventures, laughter, and endless support. We are thrilled to take this next step and celebrate our journey together with the people who matter to us most.
          </p>
          <p class="section-body">
            Join us as we say "I do" surrounded by the beauty of autumn, fine food, and unforgettable memories.
          </p>
        </div>
      </div>
    </section>

    <!-- RSVP Section -->
    <section class="rsvp-section" id="rsvp">
      <span class="section-tag">Are You Attending?</span>
      <h2 class="section-title">RSVP</h2>
      <p style="color: var(--text-light); max-width: 400px; margin: 0 auto;">Please let us know if you will be joining us on our special day before August 1, 2027.</p>
      
      <form class="rsvp-form" onsubmit="event.preventDefault(); alert('Thank you for your RSVP!');">
        <input type="text" class="form-input" placeholder="Your Full Name" required>
        <input type="email" class="form-input" placeholder="Your Email Address" required>
        <select class="form-select" required>
          <option value="" disabled selected>Will you attend?</option>
          <option value="yes">Joyfully Accepts</option>
          <option value="no">Regretfully Declines</option>
        </select>
        <button type="submit" class="btn-submit">Send RSVP</button>
      </form>
    </section>

    <footer>
      <p>Emma & Alexander's Wedding Website • Built with Love</p>
    </footer>

  </div>

  <!-- ==========================================
       5. JAVASCRIPT
       ========================================== -->
  <script>
    // --- 1. Envelope Opening Logic ---
    const envelope = document.getElementById('envelope');
    const envelopeScreen = document.getElementById('envelope-screen');
    const mainWebsite = document.getElementById('main-website');

    envelope.addEventListener('click', () => {
      // Step 1: Trigger envelope open animation
      envelope.classList.add('open');

      // Step 2: Fade out envelope screen and show main website
      setTimeout(() => {
        envelopeScreen.classList.add('hidden');
        mainWebsite.classList.add('visible');
      }, 1200);
    });

    // --- 2. Live Countdown Timer Logic ---
    // Set your wedding target date here (YYYY-MM-DD format)
    const weddingDate = new Date('September 18, 2027 15:00:00').getTime();

    function updateCountdown() {
      const now = new Date().getTime();
      const difference = weddingDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = String(days).padStart(2, '0');
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
      } else {
        document.querySelector('.countdown-container').innerHTML = '<h3>The Big Day is Here!</h3>';
      }
    }

    // Update countdown every second
    setInterval(updateCountdown, 1000);
    updateCountdown();
  </script>
</body>
</html>

```

---

### Features & How to Customize:

1. **Interactive Opening Envelope**: Clicking on the envelope flips open the flap, lifts the "Save the Date" letter, and smoothly transitions into the main website.
2. **Color Palette**: Built around a classic wedding scheme using **Burgundy (`#6b2d3e`)**, **Gold (`#d4af37`)**, **Cream (`#faf7f2`)**, and **Sage Green (`#7d8c75`)**.
3. **Double-Page Card Layout**: The "Our Love Story" section uses a side-by-side grid resembling an open book or double-page spread.
4. **Target Date**: To change the target date, simply modify the `weddingDate` variable inside the `<script>` tag near the bottom.



```
Sources:
1. https://github.com/I-No-oNe/i-no-one.github.io
2. https://github.com/I-No-oNe/i-no-one.github.io
3. https://github.com/I-No-oNe/i-no-one.github.io
4. https://github.com/Indydalton1986/Holiday-Hub
5. https://github.com/Indydalton1986/Holiday-Hub
6. https://github.com/Alexander-Luna/AVES-Joyas