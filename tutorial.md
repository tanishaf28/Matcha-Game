# Build a "Fill the Matcha Cup" Game with HTML, CSS & JavaScript 🍵

**Difficulty:** Beginner | **Time:** ~45 minutes | **Files:** 4

> Hold a button, watch matcha rise, release at the perfect moment. One mechanic, infinite replayability, and you'll learn the core JavaScript skills used in basically every interactive web page ever made.

---

## What Are We Building?

"Fill the Matcha Cup" is a one-button precision game. You hold a button to pour matcha into a kawaii ceramic mug, release it when you think you've hit the target percentage, and see how close you got. Every round picks a random target : and pours at a slightly different speed : so you can't just memorize the timing.

**Here's what you'll learn building it:**

| Concept | What it does in this game |
|---|---|
| `setInterval` | Ticks the liquid level up every 30ms while the button is held |
| Event listeners | Detect mousedown, mouseup, touchstart, touchend |
| DOM manipulation | Update the cup fill height and text labels in real time |
| Game state | Track whether a round is active, won, or over |
| `classList.toggle` | Drives live visual feedback (the gold "in the zone" glow) |

No prior game experience needed if you've written a little HTML and seen some JavaScript, you're ready. Let's go! ✨

---

## Prerequisites

- A code editor (VS Code is great grab the **Live Server** extension by Ritwick Dey so your browser auto-refreshes on save)
- A browser (Chrome, Firefox, Safari anything works)
- Basic familiarity with HTML tags and CSS properties

> 💡 **No local setup?** Use [CodePen](https://codepen.io) or [Replit](https://replit.com) : just paste each section as we go.

---

## Setting Up Your Project

Create a new folder called `matcha-game`. Inside it, make these four files:

```
matcha-game/
  ├── index.html         ← the page structure
  ├── style.css           ← all the visuals & kawaii-ness
  ├── game.js             ← the game logic
  └── matcha-pattern.svg  ← a tiny tiled background pattern
```

That's it! Four files, one folder, one game. Open the folder in VS Code and let's start building.

---

## Step 1 : The HTML Structure

HTML is the skeleton. We're just laying out the pieces before we style or animate anything. Open `index.html` and add this:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Fill the Matcha Cup 🍵</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&family=Nunito:wght@600;700;800&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>

  <div class="card">

    <!-- Title + target label -->
    <h1>Fill the Matcha Cup 🍵</h1>
    <p class="target-label" id="target-label">Fill to ...%</p>

    <!-- The cup -->
    <div class="cup-wrap" id="cup-wrap">

      <!-- Rising steam puffs -->
      <div class="steam"><span></span><span></span><span></span></div>

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
          <div class="mouth"></div>
          <div class="blush-row">
            <div class="blush"></div>
            <div class="blush"></div>
          </div>
        </div>

        <!-- Cup rim (sits on top visually) -->
        <div class="cup-rim"></div>
      </div>

      <!-- Mug handle -->
      <div class="cup-handle"></div>
    </div>

    <!-- Stats row -->
    <div class="stats">
      <div class="stat">
        <span class="stat-label">Current</span>
        <span class="stat-val" id="cur-pct">0%</span>
      </div>
      <div class="stat">
        <span class="stat-label">Target</span>
        <span class="stat-val" id="tgt-pct">:</span>
      </div>
      <div class="stat">
        <span class="stat-label">Best</span>
        <span class="stat-val" id="best-pct">:</span>
      </div>
    </div>

    <!-- The pour button -->
    <button class="pour-btn" id="pour-btn">Hold to pour 🍵</button>
    <p class="hint">Let go when it feels right 🍃</p>

    <!-- Result message -->
    <p class="result" id="result"></p>

    <!-- Attempt history pills -->
    <div class="attempts" id="attempts"></div>

    <!-- New round button -->
    <button class="restart-btn" id="restart-btn">Pour again 🍵</button>

  </div>

  <script src="game.js"></script>
</body>
</html>
```

**A few things to notice:**

- Every element we want to update later has an `id=""` : that's how JavaScript will find and change it.
- The `<script src="game.js">` tag is at the **bottom** of `<body>`, not in `<head>`. This matters! It ensures the HTML loads first so JavaScript can actually find the elements. Put it in the head and it runs before the elements exist : nothing works. 🙅
- The cup is built from plain `<div>`s, no images. The handle and the steam puffs sit *outside* `.cup` so they don't get clipped by the cup's `overflow: hidden`.

> ✅ **Checkpoint:** Open `index.html` in your browser. You'll see raw unstyled text : totally expected. The bones are in place. Now let's paint them.

---

## Step 2 : A Tiny Background Pattern

Before the CSS, grab (or draw) one small asset: `matcha-pattern.svg`, a tiled line-art pattern of a leaf, a whisk, and a little cup, drawn at very low opacity. It tiles behind the card so the space outside the game isn't just a flat color. You don't need to hand-draw this yourself : any simple, repeatable SVG with a few thin strokes works. Save it next to your other files.

> 💡 **Why SVG and not a photo?** A tiny vector pattern tiles perfectly at any size, stays crisp on retina screens, and is a few hundred bytes instead of a multi-megabyte JPEG.

---

## Step 3 : The CSS Styles

Here's the fun part. We're going to build a cute ceramic mug using nothing but CSS `div`s : no images required for the cup itself. The key trick is `overflow: hidden` on the cup element, which clips the rising liquid so it stays inside the walls.

Open `style.css` and add Part 1 : palette, layout, and the cup:

```css
* { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Japanese-café palette ── */
:root {
  --cream:       #FBF3E7;
  --card-bg:     #FFF9EF;
  --cup-bg:      #FFF3DC;
  --matcha:      #7AA874;
  --matcha-dark: #567D46;
  --cup-edge:    #8A6E4C;
  --sakura:      #F8D8E8;
  --sakura-deep: #E8A9C4;
  --gold:        #E6C57F;
  --gold-deep:   #C99A3E;
  --ink:         #4A3F30;
  --text-soft:   #8C7F68;
}

body {
  font-family: 'Nunito', sans-serif;
  /* the tiled SVG pattern sits under the warm gradient */
  background-image:
    url('matcha-pattern.svg'),
    linear-gradient(160deg, var(--cream) 0%, #F3E8D6 45%, #FBEAE2 100%);
  background-repeat: repeat, no-repeat;
  background-size: 220px 220px, cover;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem 1rem;
  position: relative;
}
/* a soft warm glow behind the card instead of a flat color */
body::before {
  content: '';
  position: fixed;
  top: 38%; left: 50%;
  width: 560px; height: 560px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(230, 197, 127, .25), transparent 70%);
  pointer-events: none;
}

/* ── Main game card ── */
.card {
  position: relative;
  z-index: 1;
  background: var(--card-bg);
  border: 1px solid #F1E8D8;
  border-radius: 32px;
  padding: 2.2rem 2rem 2.6rem;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  box-shadow: 0 10px 0 #F4EBDB, 0 18px 40px rgba(140, 120, 80, .18);
}

h1 {
  font-family: 'Mochiy Pop One', cursive;
  font-size: 1.6rem;
  font-weight: 400;
  color: var(--ink);
}

.target-label {
  font-size: 13px;
  font-weight: 800;
  background: #F7E9C9;
  color: #8A6A2A;
  padding: 6px 18px;
  border-radius: 999px;
}

/* ── Cup container ── */
.cup-wrap {
  position: relative;
  width: 160px;
  height: 170px;
  margin: 0.75rem 0;
}

.cup {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: var(--cup-bg);
  border: 4px solid var(--cup-edge); /* bold, sticker-style outline */
  border-radius: 28px 28px 48px 48px; /* a stout, rounded mug : not a tall jar */
  overflow: hidden; /* ← KEY: clips the liquid inside the cup */
}

/* ── Rising liquid ── */
.liquid {
  position: absolute;
  bottom: 0;        /* starts at the bottom */
  left: 0;
  width: 100%;
  height: 0px;       /* JS will increase this while the button is held */
  background: linear-gradient(180deg, #8FC183, var(--matcha));
  border-radius: 0 0 44px 44px;
  transition: height 0.04s linear;
}

.liquid-surface {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 7px;
  background: rgba(190, 230, 170, .5);
  border-radius: 4px 4px 0 0;
}

/* Mug handle : sits outside the cup so it never gets clipped */
.cup-handle {
  position: absolute;
  top: 40%;
  right: -19px;
  width: 26px;
  height: 48px;
  border: 5px solid var(--cup-edge);
  border-left: none;
  border-radius: 0 30px 30px 0;
  background: var(--card-bg);
  z-index: 0;
}

/* ── Target line ── */
.target-zone {
  position: absolute;
  left: 0; width: 100%;
  background: rgba(230, 197, 127, .2);
  pointer-events: none;
  z-index: 2;
}
.target-zone::before {
  content: '';
  position: absolute;
  left: 0; top: 50%; width: 100%;
  border-top: 2px dashed var(--gold-deep);
  transform: translateY(-1px);
}
.target-zone::after {
  content: '✨';
  position: absolute;
  right: -2px; top: 50%;
  transform: translate(100%, -50%);
  font-size: 12px;
}

/* ── Cup rim (top strip, sits above liquid visually) ── */
.cup-rim {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 14px;
  background: #F2EBDA;
  border-bottom: 2px solid var(--cup-edge);
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
.eyes { display: flex; gap: 14px; }
.eye {
  width: 9px; height: 9px;
  background: var(--ink);
  border-radius: 50%;
}
.mouth {
  width: 10px; height: 5px;
  border-bottom: 2px solid var(--ink);
  border-radius: 0 0 10px 10px;
}
.blush-row { display: flex; gap: 28px; margin-top: 3px; }
.blush {
  width: 14px; height: 8px;
  background: var(--sakura-deep);
  border-radius: 50%;
  opacity: .75;
}
```

**How does the cup trick work?** The `.cup` div has `overflow: hidden`. The `.liquid` div lives inside it and its height starts at `0`. When JavaScript increases that height, the liquid fills from the bottom up : but anything above the cup's edges gets clipped. No images, no canvas, just CSS. 🌿

**Why a bold 4px outline instead of a thin pale border?** A thin, low-contrast border reads as a generic web-template shape. A thicker, slightly darker "sticker" outline is what makes hand-drawn kawaii illustrations feel intentional rather than default.

Now add Part 2 : buttons, stats, and history:

```css
.stats { display: flex; gap: 10px; }
.stat {
  background: #EEF4E8;
  border-radius: 14px;
  padding: 8px 16px;
  text-align: center;
}
.stat-label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .05em;
  color: #8B9C7E;
}
.stat-val {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--matcha-dark);
}

/* ── Pour button ── */
.pour-btn {
  width: 230px;
  padding: 16px;
  background: linear-gradient(180deg, #8FC183, #6FA563);
  color: #FFFDF8;
  border: none;
  border-radius: 999px;
  font-family: inherit;
  font-size: 1.05rem;
  font-weight: 800;
  cursor: pointer;
  user-select: none;
  touch-action: none; /* stops the page scrolling on mobile when held */
  box-shadow:
    inset 0 2px 0 rgba(255,255,255,.35),
    0 6px 0 #4F7A45,
    0 10px 22px rgba(86,125,70,.35);
  transition: transform .12s ease, box-shadow .12s ease;
}
.pour-btn:hover:not(:disabled) { transform: translateY(-2px); }
.pour-btn:active:not(:disabled) { transform: translateY(3px) scale(.98); }
.pour-btn:disabled {
  background: #D9E5D2;
  color: #8FA086;
  box-shadow: 0 4px 0 #C3D2BB;
  cursor: default;
}

.hint { font-size: 12px; color: var(--text-soft); }

.result {
  font-size: 1rem;
  font-weight: 800;
  min-height: 22px;
  color: var(--matcha-dark);
}
.result.win {
  font-size: 1.45rem; /* the winning message gets to be bigger and louder */
  color: #4C7A3D;
}
.result.lose { color: #C15F86; }

/* ── Attempt history ── */
.attempts { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; min-height: 26px; }
.attempt { font-size: 12px; font-weight: 700; padding: 3px 12px; border-radius: 999px; }
.attempt.win  { background: #DCEFD4; color: #4C7A3D; }
.attempt.lose { background: #FBE3EC; color: #C15F86; }

/* ── Restart button ── */
.restart-btn {
  background: linear-gradient(180deg, #FCE6F0, #F8D2E4);
  border: none;
  border-radius: 999px;
  padding: 10px 26px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  color: #B5577E;
  cursor: pointer;
}
```

> ✅ **Checkpoint:** Refresh the browser. You should see a warm cream card with a ceramic-mug-shaped cup, three stat boxes, and a green pill button. The cup is empty for now : we bring it to life next.

---

## Step 4 : The JavaScript: Pour Engine

Here's the magic. The whole mechanic is two JavaScript functions:

- `startPour()` : called when the player presses the button. Uses `setInterval` to bump the level up every 30ms.
- `stopPour()` : called when they release. Uses `clearInterval` to stop the timer.

That's it. Open `game.js` and add Part 1:

```js
// ── Step 1: Grab all the elements we need ──────────────────
// document.getElementById() finds an element by its id=""

const cupWrapEl = document.getElementById('cup-wrap');
const cupEl     = document.getElementById('cup');
const liquid    = document.getElementById('liquid');
const pourBtn   = document.getElementById('pour-btn');
const curPctEl  = document.getElementById('cur-pct');
const tgtPctEl  = document.getElementById('tgt-pct');
const bestEl    = document.getElementById('best-pct');
const resultEl  = document.getElementById('result');
const targetZone = document.getElementById('target-zone');
const labelEl   = document.getElementById('target-label');
const attemptsEl = document.getElementById('attempts');
const restartBtn = document.getElementById('restart-btn');

// ── Step 2: Game state variables ───────────────────────────
// These track what's happening in the current round

let level    = 0;      // current fill % (0 to 100)
let pouring  = false;  // is the player holding the button?
let gameOver = false;  // has this round ended?
let interval = null;   // stores our setInterval so we can stop it
let pourRate = 0.18;   // how fast the liquid rises per tick

let target;                  // the single target % for this round
const TOLERANCE = 2;         // how many % away still counts as a win
let bestScore = null;        // best distance from target ever
let attempts  = [];          // list of recent attempt results

// Both the liquid and the target line measure their % against this same
// "inner" height (the cup minus the rim strip) : that's what keeps the
// gold line and the liquid surface lined up at the same percentage.
const CUP_H   = 170; // must match .cup-wrap height in CSS (px)
const RIM_H   = 14;  // must match .cup-rim height in CSS (px)
const INNER_H = CUP_H - RIM_H;

// ── Step 3: Pick a random target % ──────────────────────────
function pickTarget() {
  const choices = [30, 40, 45, 50, 55, 60, 65, 70, 75];
  target = choices[Math.floor(Math.random() * choices.length)];
}

// ── Step 4: Draw the golden target line in the cup ─────────
function drawTargetZone() {
  // Convert % to pixels from the bottom (thin band = the tolerance window)
  const bottomPx = INNER_H * ((target - TOLERANCE) / 100);
  const topPx    = INNER_H * ((target + TOLERANCE) / 100);

  // No extra rim offset here : the liquid's 0–100% already maps onto this
  // same INNER_H range (see updateDisplay), so this lines up with it exactly.
  targetZone.style.bottom = bottomPx + 'px';
  targetZone.style.height = (topPx - bottomPx) + 'px';
}

// ── Step 5: Initialize (or re-initialize) a round ──────────
function initRound() {
  pickTarget();

  level    = 0;
  pouring  = false;
  gameOver = false;
  pourRate = 0.14 + Math.random() * 0.10; // small random speed

  liquid.style.height  = '0px';
  curPctEl.textContent = '0%';
  resultEl.textContent = '';
  resultEl.className   = 'result';
  cupEl.classList.remove('pouring', 'in-zone');
  pourBtn.disabled      = false;
  pourBtn.textContent   = 'Hold to pour 🍵';
  tgtPctEl.textContent  = target + '%';
  labelEl.textContent   = '🍵 Today\'s perfect pour: ' + target + '%';

  drawTargetZone();
}

// ── Step 6: Update the cup display each tick ───────────────
function updateDisplay() {
  const h = Math.min(level, 100); // cap at 100%
  liquid.style.height  = (INNER_H * h / 100) + 'px'; // same scale as the target line
  curPctEl.textContent = Math.round(h) + '%';

  // Glow gold while the pour is inside the winning window : live feedback!
  const inZone = Math.abs(Math.round(h) - target) <= TOLERANCE;
  cupEl.classList.toggle('in-zone', inZone);
}

// ── Step 7: Start pouring ──────────────────────────────────
function startPour() {
  if (gameOver || pouring) return; // don't start twice
  pouring = true;
  cupEl.classList.add('pouring');

  // setInterval runs a function repeatedly on a timer
  // here: every 30 milliseconds, bump the level up
  interval = setInterval(() => {
    level += pourRate;
    if (level >= 100) {
      level = 100;
      stopPour();   // auto-stop if cup overflows
    } else {
      updateDisplay();
    }
  }, 30);
}

// ── Step 8: Stop pouring ───────────────────────────────────
function stopPour() {
  if (!pouring) return;
  pouring = false;
  cupEl.classList.remove('pouring', 'in-zone');
  clearInterval(interval);  // stop the timer!
  updateDisplay();
  if (!gameOver) endRound();
}

// ── Step 9: Attach events to the button ────────────────────
pourBtn.addEventListener('mousedown', startPour);

pourBtn.addEventListener('touchstart', (e) => {
  e.preventDefault(); // stops mobile from firing mousedown twice
  startPour();
});

// Listen on the whole document : so releasing anywhere stops the pour
document.addEventListener('mouseup',  () => { if (pouring) stopPour(); });
document.addEventListener('touchend', () => { if (pouring) stopPour(); });

// Restart button
restartBtn.addEventListener('click', initRound);
```

**Why `document.addEventListener('mouseup')` and not `pourBtn.addEventListener('mouseup')`?**

If you attach `mouseup` to the button, releasing the mouse while the cursor has drifted slightly off the button won't stop the pour : the liquid just keeps rising forever. Attaching it to `document` catches the release no matter where the mouse ends up. Trust me on this one. 😅

> ⚠️ **A bug worth knowing about:** an earlier version of this game set the liquid's height as a *percentage* of the full cup (`liquid.style.height = h + '%'`), while the target line was positioned in pixels against the cup *minus the rim*. Those are two different scales, so the gold line and the actual liquid surface never quite lined up : off by exactly the rim's height. The fix is to measure both against the same `INNER_H` constant, as shown above. **The lesson:** whenever two visuals are supposed to represent the same number, make sure they're computed from the same reference, not two that happen to look similar.

---

## Step 5 : The JavaScript: Win/Lose Logic & Celebration

Now let's write `endRound()` : the function that checks the result, gives feedback, tracks history, and throws a little confetti on a win. Add this to the bottom of `game.js`:

```js
function endRound() {
  gameOver = true;
  pourBtn.disabled    = true;
  pourBtn.textContent = 'Poured! 🍵';

  const rounded = Math.round(level);

  // How far from the target? (used for win check + best score)
  const distance = Math.abs(rounded - target);

  // Did they land within the tolerance window of the target?
  const win = distance <= TOLERANCE;

  // ── Show feedback message ──
  resultEl.className = 'result ' + (win ? 'win' : 'lose'); // styling via CSS classes
  if (win) {
    resultEl.textContent = 'Yay! Perfect pour! 🌸✨';
    spawnConfetti();
  } else if (rounded < target) {
    resultEl.textContent = distance <= 5
      ? 'So close just a tiny drop more! 😅'
      : 'Too little! Hold a bit longer. 💧';
  } else {
    resultEl.textContent = distance <= 5
      ? 'Almost! Release a tiny bit sooner! ⏱️'
      : 'Too much! Release earlier next time. 😱';
  }

  // ── Update best score ──
  // We store the closest distance : smaller = better
  if (bestScore === null || distance < bestScore) {
    bestScore = distance;
    bestEl.textContent = rounded + '%';
  }

  // ── Add to attempt history ──
  attempts.unshift({ pct: rounded, win }); // add to front
  if (attempts.length > 5) attempts.pop(); // keep only last 5
  renderAttempts();
}

// ── Little celebration burst for a winning pour ────────────
function spawnConfetti() {
  const bits = ['🌸', '✨', '🍃', '🍡'];

  for (let i = 0; i < 10; i++) {
    const bit = document.createElement('span');
    bit.className   = 'confetti';
    bit.textContent = bits[Math.floor(Math.random() * bits.length)];

    // Send each piece flying off in a random direction
    const angle = Math.random() * Math.PI * 2;
    const dist  = 50 + Math.random() * 50;
    bit.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
    bit.style.setProperty('--ty', Math.sin(angle) * dist + 'px');

    cupWrapEl.appendChild(bit);
    setTimeout(() => bit.remove(), 900); // clean up after the animation ends
  }
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

Add the matching CSS for the confetti and the live in-zone glow:

```css
/* Glows gold the moment the pour enters the winning window */
.cup.in-zone {
  box-shadow: 0 0 0 4px rgba(230, 197, 127, .5), 0 0 18px rgba(230, 197, 127, .55);
  transition: box-shadow .15s ease;
}

/* Win celebration confetti (spawned by game.js) */
.confetti {
  position: absolute;
  left: 50%; top: 45%;
  font-size: 1rem;
  pointer-events: none;
  z-index: 8;
  animation: confetti-fly .9s ease-out forwards;
}
@keyframes confetti-fly {
  0%   { transform: translate(0, 0) scale(1);   opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) scale(.4); opacity: 0; }
}
```

**Why give live feedback (the gold glow) instead of waiting until release?** A precision game feels much better when you find out you're "in the zone" *while* you're still pouring, not only after committing to releasing. It's the same idea as a parking-sensor beep getting faster as you get closer : continuous feedback beats a single pass/fail check at the end.

> ✅ **Checkpoint:** Save everything and refresh. Your game is fully playable! Hold the button, watch the liquid rise (the cup glows gold when you're in the winning window), release at the right moment, and watch the confetti fly on a win.

---

## Your Final File Structure

```
matcha-game/
  ├── index.html         (~90 lines)
  ├── style.css           (~280 lines)
  ├── game.js             (~205 lines)
  └── matcha-pattern.svg  (a tiny tiled asset)
```

A fully playable, fully animated browser game. 🫗

---

## Stretch Goals

Your game works: now make it yours! Here are ideas from easy to spicy:

### 🟢 Easy
- **Win streak counter** : add a `streak` variable, increment on win, reset to 0 on miss, show "3 in a row! 🔥"
- **Shimmering title** : give `h1` an animated gradient with `background-clip: text` for a subtle color-shift effect

### 🟡 Medium
- **Narrowing target zone** : start with `TOLERANCE = 6` and subtract 1 every win. The game naturally gets harder as you improve
- **Persistent high score** : use `localStorage.setItem('best', score)` and `localStorage.getItem('best')` to save across browser sessions

### 🔴 Spicy
- **Sound effects** : use the Web Audio API to generate a pour sound and a "ding" on win. No audio files needed  it synthesizes tones in the browser
- **Share button** : add a "Share my score" button using `navigator.share()` on mobile to post your result to friends
- **Multiple cups** : add a second cup with a different target, race against it with keyboard controls

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
- `classList.toggle()` to drive live visual feedback from game state
- JavaScript variables and functions to manage game state
- `Math.random()` to randomize the target and pour speed
- `document.createElement()` and `appendChild()` to build the attempt history and confetti dynamically
- Why two visuals that represent "the same number" need to share one calculation, not two that merely look similar

These aren't game-specific skills : they're the foundation of every interactive website, web app, and game you'll ever build. You just learned them by making something fun. 🍵

---


*Written for the Codédex Monthly Challenge · "Let's give 'em something to matcha 'bout."*
