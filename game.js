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
let pouring  = false; // is the player holding the button?
let gameOver = false; // has this round ended?
let interval = null;  // stores our setInterval so we can stop it
let pourRate  = 0.18; // how fast the liquid rises per tick

let target;                    // the single target % for this round
const TOLERANCE = 2;           // how many % away still counts as a win
let bestScore = null;         // best distance from target ever
let attempts  = [];            // list of recent attempt results

// Both the liquid and the target line measure their % against this same
// "inner" height (the cup minus the rim strip) — that's what keeps the
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

  // No extra rim offset here — the liquid's 0–100% already maps onto this
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

  liquid.style.height   = '0px';
  curPctEl.textContent  = '0%';
  resultEl.textContent  = '';
  resultEl.className    = 'result';
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
  liquid.style.height    = (INNER_H * h / 100) + 'px'; // same scale as the target line
  curPctEl.textContent   = Math.round(h) + '%';

  // Glow gold while the pour is inside the winning window — live feedback!
  const inZone = Math.abs(Math.round(h) - target) <= TOLERANCE;
  cupEl.classList.toggle('in-zone', inZone);
}

// ── Step 7: Start pouring ──────────────────────────────────
function startPour() {
  if (gameOver || pouring) return; // don't start twice
  pouring = true;
  cupEl.classList.add('pouring'); // little wobble + ripple while filling

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
// mousedown = mouse button pressed down (desktop)
pourBtn.addEventListener('mousedown', startPour);

// touchstart = finger touches screen (mobile)
pourBtn.addEventListener('touchstart', (e) => {
  e.preventDefault(); // stops mobile from firing mousedown twice
  startPour();
});

// Listen on the whole document — so releasing anywhere stops the pour
document.addEventListener('mouseup',  () => { if (pouring) stopPour(); });
document.addEventListener('touchend', () => { if (pouring) stopPour(); });

// Restart button
restartBtn.addEventListener('click', initRound);

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
  // We store the closest distance — smaller = better
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