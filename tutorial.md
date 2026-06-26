# Build a "Fill the Matcha Cup" Game with HTML, CSS & JavaScript 🍵

**Difficulty:** Beginner | **Time:** ~45 minutes | **Files:** 3

> Hold a button, watch matcha rise, release at the perfect moment. One mechanic, infinite replayability, and you'll learn the core JavaScript skills used in basically every interactive web page ever made.

---

## What Are We Building?

"Fill the Matcha Cup" is a one-button precision game. You hold a button to pour liquid into a kawaii cup, release it when you think you've hit the target range, and see how close you got. Every round picks a random target — and pours at a slightly different speed — so you can't just memorize the timing.

**Here's what you'll learn building it:**

| Concept | What it does in this game |
|---|---|
| `setInterval` | Ticks the liquid level up every 30ms while the button is held |
| Event listeners | Detect mousedown, mouseup, touchstart, touchend |
| DOM manipulation | Update the cup fill height and text labels in real time |
| Game state | Track whether a round is active, won, or over |

No prior game experience needed — if you've written a little HTML and seen some JavaScript, you're ready. Let's go! ✨

---

## Prerequisites

- A code editor (VS Code is great — grab the **Live Server** extension by Ritwick Dey so your browser auto-refreshes on save)
- A browser (Chrome, Firefox, Safari — anything works)
- Basic familiarity with HTML tags and CSS properties

> 💡 **No local setup?** Use [CodePen](https://codepen.io) or [Replit](https://replit.com) — just paste each section as we go.

---

## Setting Up Your Project

Create a new folder called `matcha-game`. Inside it, make these three files:

```
matcha-game/
  ├── index.html   ← the page structure
  ├── style.css    ← all the visuals & kawaii-ness
  └── game.js      ← the game logic
```

That's it! Three files, one folder, one game. Open the folder in VS Code and let's start building.

---

## Step 1 — The HTML Structure

HTML is the skeleton. We're just laying out the pieces before we style or animate anything. Open `index.html` and add this:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Fill the Matcha Cup 🍵</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>

  <div class="card">

    <!-- Title + target label -->
    <h1>Fill the Matcha Cup 🍵</h1>
    <p class="target-label" id="target-label">Fill to ...%</p>

    <!-- The cup -->
    <div class="cup-wrap">
      <div class="cup" id="cup">

        <!-- The rising liquid -->
        <div class="liquid" id="liquid">
          <div class="liquid-surface"></div>
        </div>

        <!-- Golden target zone band -->
        <div class="target-zone" id="target-zone"></div>

        <!-- Kawaii face (drawn with CSS) -->
        <div class="cup-face">
          <div class="eyes">
            <div class="eye"></div>
            <div class="eye"></div>
          </div>
          <div class="blush-row">
            <div class="blush"></div>
            <div class="blush"></div>
          </div>
        </div>

        <!-- Cup rim (sits on top visually) -->
        <div class="cup-rim"></div>
      </div>
    </div>

    <!-- Stats row -->
    <div class="stats">
      <div class="stat">
        <span class="stat-label">Current</span>
        <span class="stat-val" id="cur-pct">0%</span>
      </div>
      <div class="stat">
        <span class="stat-label">Target</span>
        <span class="stat-val" id="tgt-pct">—</span>
      </div>
      <div class="stat">
        <span class="stat-label">Best</span>
        <span class="stat-val" id="best-pct">—</span>
      </div>
    </div>

    <!-- The pour button -->
    <button class="pour-btn" id="pour-btn">Hold to pour 🍵</button>
    <p class="hint">Release to stop</p>

    <!-- Result message -->
    <p class="result" id="result"></p>

    <!-- Attempt history pills -->
    <div class="attempts" id="attempts"></div>

    <!-- New round button -->
    <button class="restart-btn" id="restart-btn">↻ New round</button>

  </div>

  <script src="game.js"></script>
</body>
</html>
```

**A few things to notice:**

- Every element we want to update later has an `id=""` — that's how JavaScript will find and change it.
- The `<script src="game.js">` tag is at the **bottom** of `<body>`, not in `<head>`. This matters! It ensures the HTML loads first so JavaScript can actually find the elements. Put it in the head and it runs before the elements exist — nothing works. 🙅

> ✅ **Checkpoint:** Open `index.html` in your browser. You'll see raw unstyled text — totally expected. The bones are in place. Now let's paint them.

---

## Step 2 — The CSS Styles

Here's the fun part. We're going to build a cute kawaii cup using nothing but CSS `div`s — no images required. The key trick is `overflow: hidden` on the cup element, which clips the rising liquid so it stays inside the walls.

Open `style.css` and add Part 1 — the layout and cup:

```css
/* ── Reset ── */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Nunito', sans-serif; /* or any Google Font you like! */
  background: #f0f7f0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem 1rem;
}

/* ── Main game card ── */
.card {
  background: #fff;
  border-radius: 28px;
  padding: 2rem 2rem 2.5rem;
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  box-shadow: 0 8px 40px rgba(74, 156, 74, 0.12);
}

h1 {
  font-size: 1.5rem;
  font-weight: 900;
  color: #1c2b1c;
}

.target-label {
  font-size: 13px;
  font-weight: 800;
  background: #d6edd6;
  color: #2d7a2d;
  padding: 5px 16px;
  border-radius: 999px;
}

/* ── Cup container ── */
.cup-wrap {
  position: relative;
  width: 130px;
  height: 180px;
  margin: 0.5rem 0;
}

.cup {
  position: absolute;
  inset: 0;
  background: #f2f9f0;
  border: 3px solid #a8d0a8;
  border-radius: 10px 10px 32px 32px; /* flat top, very round bottom */
  overflow: hidden; /* ← KEY: clips the liquid inside the cup */
}

/* ── Rising liquid ── */
.liquid {
  position: absolute;
  bottom: 0;       /* starts at the bottom */
  left: 0;
  width: 100%;
  height: 0%;      /* JavaScript will increase this while held */
  background: #5faa5f;
  border-radius: 0 0 29px 29px;
  transition: height 0.04s linear;
}

.liquid-surface {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 7px;
  background: rgba(160, 230, 160, 0.5);
  border-radius: 4px 4px 0 0;
}

/* ── Golden target zone ── */
.target-zone {
  position: absolute;
  left: 0;
  width: 100%;
  background: rgba(233, 168, 37, 0.18);
  border-top: 2px dashed #e9a825;
  border-bottom: 2px dashed #e9a825;
  pointer-events: none;
  z-index: 2;
}

/* ── Cup rim (top strip, sits above liquid visually) ── */
.cup-rim {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 14px;
  background: #e4f2e4;
  border-bottom: 2px solid #a8d0a8;
  z-index: 4;
}

/* ── Kawaii face (CSS-only!) ── */
.cup-face {
  position: absolute;
  bottom: 22%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.eyes {
  display: flex;
  gap: 14px;
}

.eye {
  width: 8px;
  height: 8px;
  background: #2d4a2d;
  border-radius: 50%;
  position: relative;
}

/* Little shine dot on each eye */
.eye::after {
  content: '';
  position: absolute;
  top: 1px; right: 1px;
  width: 3px; height: 3px;
  background: #fff;
  border-radius: 50%;
}

.blush-row {
  display: flex;
  gap: 28px;
  margin-top: 3px;
}

.blush {
  width: 14px;
  height: 8px;
  background: #f9c0cb;
  border-radius: 50%;
  opacity: 0.7;
}
```

Now add Part 2 — buttons, stats, and history:

```css
/* ── Stats row ── */
.stats {
  display: flex;
  gap: 10px;
}

.stat {
  background: #f2faf2;
  border-radius: 12px;
  padding: 7px 15px;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6e8a6e;
}

.stat-val {
  font-size: 1.2rem;
  font-weight: 900;
  color: #4a9c4a;
}

/* ── Pour button ── */
.pour-btn {
  width: 210px;
  padding: 14px;
  background: #4a9c4a;
  color: #fff;
  border: none;
  border-radius: 999px;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  user-select: none;
  touch-action: none; /* stops the page scrolling on mobile when held */
  box-shadow: 0 4px 0 #2d7a2d;
  transition: transform 0.08s, box-shadow 0.08s;
}

.pour-btn:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 #2d7a2d;
}

.pour-btn:disabled {
  background: #b0ccb0;
  box-shadow: 0 4px 0 #8aaa8a;
  cursor: default;
}

.hint {
  font-size: 12px;
  color: #6e8a6e;
}

.result {
  font-size: 1rem;
  font-weight: 800;
  min-height: 22px;
  color: #4a9c4a;
}

/* ── Attempt history pills ── */
.attempts {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
  min-height: 26px;
}

.attempt {
  font-size: 12px;
  font-weight: 800;
  padding: 3px 12px;
  border-radius: 999px;
}

.attempt.win  { background: #d6edd6; color: #2d7a2d; }
.attempt.lose { background: #fde8e8; color: #c0392b; }

/* ── Restart button ── */
.restart-btn {
  background: transparent;
  border: 2px solid #cce5cc;
  border-radius: 999px;
  padding: 6px 20px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  color: #6e8a6e;
  cursor: pointer;
}

.restart-btn:hover {
  border-color: #4a9c4a;
  color: #4a9c4a;
}
```

**How does the cup trick work?**

The `.cup` div has `overflow: hidden`. The `.liquid` div lives inside it and its `height` starts at `0%`. When JavaScript increases that height (say, to 60%), the liquid fills from the bottom up — but anything above the cup's edges gets clipped. No images, no canvas, just CSS. 🌿

> 💡 **Want a Google Font?** Add this in `<head>` before your CSS link:
> ```html
> <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;900&display=swap" rel="stylesheet">
> ```
> Nunito's round letterforms are very matcha-coded.

> ✅ **Checkpoint:** Refresh the browser. You should see a green card with an empty white cup, three stat boxes, and a big green button. The cup is empty for now — we bring it to life next.

---

## Step 3 — The JavaScript: Pour Engine

Here's the magic. The whole mechanic is two JavaScript functions:

- `startPour()` — called when the player presses the button. Uses `setInterval` to bump the level up every 30ms.
- `stopPour()` — called when they release. Uses `clearInterval` to stop the timer.

That's it. Open `game.js` and add Part 1:

```js
// ── Step 1: Grab all the elements we need ──────────────────
// document.getElementById() finds an element by its id=""

const liquid     = document.getElementById('liquid');
const pourBtn    = document.getElementById('pour-btn');
const curPctEl   = document.getElementById('cur-pct');
const tgtPctEl   = document.getElementById('tgt-pct');
const bestEl     = document.getElementById('best-pct');
const resultEl   = document.getElementById('result');
const targetZone = document.getElementById('target-zone');
const labelEl    = document.getElementById('target-label');
const attemptsEl = document.getElementById('attempts');
const restartBtn = document.getElementById('restart-btn');

// ── Step 2: Game state variables ───────────────────────────
// These track what's happening in the current round

let level    = 0;      // current fill % (0 to 100)
let pouring  = false;  // is the player holding the button?
let gameOver = false;  // has this round ended?
let interval = null;   // stores our setInterval so we can stop it
let pourRate = 0.18;   // how fast the liquid rises per tick

let targetLow, targetHigh;  // the target range for this round
let bestScore = null;        // best distance from target center ever
let attempts  = [];          // list of recent attempt results

// ── Step 3: Pick a random target range ─────────────────────
function pickTarget() {
  // Each entry is [low%, high%] — a 5% window to hit
  const ranges = [
    [30, 35], [40, 45], [45, 50],
    [50, 55], [60, 65], [70, 75]
  ];
  const r = ranges[Math.floor(Math.random() * ranges.length)];
  targetLow  = r[0];
  targetHigh = r[1];
}

// ── Step 4: Draw the golden zone band inside the cup ───────
function drawTargetZone() {
  const cupH  = 180;  // must match .cup-wrap height in CSS
  const rimH  = 14;   // must match .cup-rim height in CSS
  const inner = cupH - rimH;

  // Convert percentages to actual pixel positions from the bottom
  const bottomPx = inner * (targetLow  / 100);
  const topPx    = inner * (targetHigh / 100);

  targetZone.style.bottom = (rimH + bottomPx) + 'px';
  targetZone.style.height = (topPx - bottomPx) + 'px';
}

// ── Step 5: Set up a fresh round ───────────────────────────
function initRound() {
  pickTarget();

  level    = 0;
  pouring  = false;
  gameOver = false;
  pourRate = 0.14 + Math.random() * 0.10; // slight random speed each round

  liquid.style.height  = '0%';
  curPctEl.textContent = '0%';
  resultEl.textContent = '';
  pourBtn.disabled     = false;
  pourBtn.textContent  = 'Hold to pour 🍵';
  tgtPctEl.textContent = targetLow + '–' + targetHigh + '%';
  labelEl.textContent  = 'Fill to ' + targetLow + '% – ' + targetHigh + '%';

  drawTargetZone();
}

// ── Step 6: Update the cup display each tick ───────────────
function updateDisplay() {
  const h = Math.min(level, 100); // cap at 100%
  liquid.style.height   = h + '%';
  curPctEl.textContent  = Math.round(h) + '%';
}

// ── Step 7: Start pouring ──────────────────────────────────
function startPour() {
  if (gameOver || pouring) return; // don't start twice

  pouring  = true;

  // setInterval calls a function repeatedly on a timer
  // here: every 30 milliseconds, we bump the level up by pourRate
  interval = setInterval(() => {
    level += pourRate;
    if (level >= 100) {
      level = 100;
      stopPour();   // auto-stop if the cup overflows
    } else {
      updateDisplay();
    }
  }, 30);
}

// ── Step 8: Stop pouring ───────────────────────────────────
function stopPour() {
  if (!pouring) return;
  pouring = false;
  clearInterval(interval);  // stop the timer!
  updateDisplay();
  if (!gameOver) endRound();
}

// ── Step 9: Attach events ──────────────────────────────────

// mousedown = mouse button pressed (desktop)
pourBtn.addEventListener('mousedown', startPour);

// touchstart = finger touches the screen (mobile)
pourBtn.addEventListener('touchstart', (e) => {
  e.preventDefault(); // stops mobile from also firing mousedown
  startPour();
});

// Listen on document — so releasing anywhere stops the pour,
// even if the cursor drifts off the button
document.addEventListener('mouseup',  () => { if (pouring) stopPour(); });
document.addEventListener('touchend', () => { if (pouring) stopPour(); });

// New round button
restartBtn.addEventListener('click', initRound);
```

**Why `document.addEventListener('mouseup')` and not `pourBtn.addEventListener('mouseup')`?**

If you attach `mouseup` to the button, releasing the mouse while the cursor has drifted slightly off the button won't stop the pour — the liquid just keeps rising forever. Attaching it to `document` catches the release no matter where the mouse ends up. Trust me on this one. 😅

> 💡 **The speed randomization** — `pourRate = 0.14 + Math.random() * 0.10` — means every round pours at a slightly different speed. Players can't just memorize a timing. Huge replay value for basically zero extra code.

---

## Step 4 — The JavaScript: Win/Lose Logic

Now let's write `endRound()` — the function that checks the result, gives feedback, and tracks history. Add this to the bottom of `game.js`:

```js
// ── endRound: called automatically when the player releases ─
function endRound() {
  gameOver = true;
  pourBtn.disabled    = true;
  pourBtn.textContent = 'Done! ✅';

  const rounded = Math.round(level);

  // Did they land inside the target range?
  const win = rounded >= targetLow && rounded <= targetHigh;

  // How far from the center of the zone? (used for best score)
  const center   = (targetLow + targetHigh) / 2;
  const distance = Math.abs(rounded - center);

  // ── Show feedback message ──
  if (win) {
    resultEl.textContent = '🍵 Perfect pour!';
    resultEl.style.color = '#2d7a2d';
  } else if (rounded < targetLow) {
    const off = targetLow - rounded;
    resultEl.textContent = off <= 5
      ? 'So close — just a tiny drop more! 😅'
      : 'Too little! Hold a bit longer. 💧';
    resultEl.style.color = '#c0392b';
  } else {
    const off = rounded - targetHigh;
    resultEl.textContent = off <= 5
      ? 'Almost! Release a tiny bit sooner! ⏱️'
      : 'Too much! Release earlier next time. 😱';
    resultEl.style.color = '#c0392b';
  }

  // ── Update best score ──
  // We store the smallest distance — closer to center = better
  if (bestScore === null || distance < bestScore) {
    bestScore = distance;
    bestEl.textContent = rounded + '%';
  }

  // ── Add to attempt history ──
  attempts.unshift({ pct: rounded, win }); // add to front of array
  if (attempts.length > 5) attempts.pop(); // keep only the last 5

  renderAttempts();
}

// ── Render the colored attempt pills ───────────────────────
function renderAttempts() {
  attemptsEl.innerHTML = ''; // clear old pills first

  attempts.forEach(a => {
    const pill = document.createElement('span');
    pill.className   = 'attempt ' + (a.win ? 'win' : 'lose');
    pill.textContent = a.pct + '%';
    attemptsEl.appendChild(pill);
  });
}

// ── Kick off the very first round! ─────────────────────────
initRound();
```

**Why "distance from center" for best score?**

Instead of storing the highest percentage, we store how close the player got to the *middle* of the target zone. A 47% pour when the target is 45–50% (center: 47.5, distance: 0.5) beats a lucky 50% (distance: 2.5). This rewards precision, not luck. ✨

> ✅ **Checkpoint:** Save everything and refresh. Your game is fully playable! Hold the button, watch the liquid rise, release at the golden zone. Green pill = win, red pill = miss.

---

## Your Final File Structure

After following all the steps, your project should look like this:

```
matcha-game/
  ├── index.html   (~50 lines)
  ├── style.css    (~120 lines)
  └── game.js      (~90 lines)
```

Under 260 lines total. A fully playable browser game. 🫗

---

## Stretch Goals

Your game works — now make it yours! Here are ideas from easy to spicy:

### 🟢 Easy
- **Animated cup face** — swap the CSS face for an emoji (`😶` empty, `🙂` mid, `😱` overflowing) by updating `innerHTML` in `updateDisplay()`
- **Win streak counter** — add a `streak` variable, increment on win, reset to 0 on miss, show "3 in a row! 🔥"

### 🟡 Medium
- **Narrowing target zone** — start the zone at 10%, narrow it by 1% every win. The game naturally gets harder as you improve
- **Persistent high score** — use `localStorage.setItem('best', score)` and `localStorage.getItem('best')` to save across browser sessions

### 🔴 Spicy
- **Sound effects** — use the Web Audio API to generate a pour sound and a "ding" on win. No audio files needed — it synthesizes tones in the browser
- **Share button** — add a "Share my score" button using `navigator.share()` on mobile to post your result to friends
- **Multiple cups** — add a second cup with a different target, race against it with keyboard controls

---

## Deploying Your Game

Want a live link to share with friends? Drag your whole `matcha-game/` folder to [Netlify Drop](https://netlify.com) you get a public URL in under 10 seconds. No account required.

Or push to GitHub and enable GitHub Pages under Settings → Pages → Deploy from main branch.

---

## What You Learned

By finishing this project, you used:

- `document.getElementById()` to grab elements from the page
- `addEventListener()` to respond to mouse and touch events
- `setInterval()` and `clearInterval()` to run code on a timer
- CSS `position: absolute` and `overflow: hidden` for the cup illusion
- JavaScript variables and functions to manage game state
- `Math.random()` to randomize the target and pour speed
- `document.createElement()` and `appendChild()` to build the attempt history dynamically

These aren't game-specific skills — they're the foundation of every interactive website, web app, and game you'll ever build. You just learned them by making something fun. 🍵

---

## Share Your Work!

Post your finished game in the [Codédex Project Showcase](https://www.codedex.io/community) — drop your GitHub link or a screenshot in the comments below. Challenge someone to beat your best score!

---

*Written for the Codédex Monthly Challenge · Build a X with Y · Made with 🍵 and a lot of precision*