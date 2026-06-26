// ── Step 1: Grab all the elements we need ──────────────────
// document.getElementById() finds an element by its id=""

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

// ── Step 3: Pick a random target % ──────────────────────────
function pickTarget() {
  const choices = [30, 40, 45, 50, 55, 60, 65, 70, 75];
  target = choices[Math.floor(Math.random() * choices.length)];
}

// ── Step 4: Draw the golden target line in the cup ─────────
function drawTargetZone() {
  const cupH  = 180;  // must match .cup-wrap height in CSS (px)
  const rimH  = 14;   // must match .cup-rim height in CSS (px)
  const inner = cupH - rimH;

  // Convert % to pixels from the bottom (thin band = the tolerance window)
  const bottomPx = inner * ((target - TOLERANCE) / 100);
  const topPx    = inner * ((target + TOLERANCE) / 100);

  targetZone.style.bottom = (rimH + bottomPx) + 'px';
  targetZone.style.height = (topPx - bottomPx) + 'px';
}

// ── Step 5: Initialize (or re-initialize) a round ──────────
function initRound() {
  pickTarget();

  level    = 0;
  pouring  = false;
  gameOver = false;
  pourRate = 0.14 + Math.random() * 0.10; // small random speed

  liquid.style.height   = '0%';
  curPctEl.textContent  = '0%';
  resultEl.textContent  = '';
  pourBtn.disabled      = false;
  pourBtn.textContent   = 'Hold to pour 🍵';
  tgtPctEl.textContent  = target + '%';
  labelEl.textContent   = 'Fill to ' + target + '% ✨';

  drawTargetZone();
}

// ── Step 6: Update the cup display each tick ───────────────
function updateDisplay() {
  const h = Math.min(level, 100); // cap at 100%
  liquid.style.height    = h + '%';
  curPctEl.textContent   = Math.round(h) + '%';
}

// ── Step 7: Start pouring ──────────────────────────────────
function startPour() {
  if (gameOver || pouring) return; // don't start twice
  pouring = true;

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
  pourBtn.textContent = 'Done! ✅';

  const rounded = Math.round(level);

  // How far from the target? (used for win check + best score)
  const distance = Math.abs(rounded - target);

  // Did they land within the tolerance window of the target?
  const win = distance <= TOLERANCE;

  // ── Show feedback message ──
  if (win) {
    resultEl.textContent = '🍵 Perfect pour!';
    resultEl.style.color = '#2d7a2d';
  } else if (rounded < target) {
    resultEl.textContent = distance <= 5
      ? 'So close just a tiny drop more! 😅'
      : 'Too little! Hold a bit longer. 💧';
    resultEl.style.color = '#c0392b';
  } else {
    resultEl.textContent = distance <= 5
      ? 'Almost! Release a tiny bit sooner! ⏱️'
      : 'Too much! Release earlier next time. 😱';
    resultEl.style.color = '#c0392b';
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