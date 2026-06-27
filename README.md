# 🍵 Fill the Matcha Cup

<p align="center">
  <em>Hold. Watch it rise. Let go at exactly the right moment.</em>
</p>

<p align="center">
  <img alt="HTML5" src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
  <img alt="CSS3" src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white">
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <img alt="No dependencies" src="https://img.shields.io/badge/dependencies-none-7AA874?style=for-the-badge">
</p>

<p align="center">
  <a href="https://tanishaf28.github.io/Matcha-Game/">
    🎮 Play "Master Matcha: Fill the Cup"
  </a>
</p>

---

## 🌸 What is this?

**Fill the Matcha Cup** is a one-button, one-mechanic precision game. A kawaii ceramic mug needs filling with matcha to a secret target percentage : somewhere between 30% and 75%. You **hold** the pour button, the green liquid rises, and you **release** when your gut says "now." Land within a small tolerance window and the cup glows gold, throws a confetti of sakura petals and matcha leaves, and you win the round.

Every pour is slightly different: the target changes, and so does the pour speed : so muscle memory only gets you so far. It's *Flappy Bird*-simple and just as hard to put down.

```
            ╭───────────────╮
            │   ╭◠╮   ╭◠╮  │   ← kawaii face
            │   ⌒ ⌒ ⌒ ⌒  │
            │░░░░░░░░░░░░░░░│   ← gold "perfect pour" zone
            │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│   ← rising matcha
            │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
            ╰───────────────╯
                 🍵 64%
```

## 🎮 Play it

No build step, no install, no server required : it's a static page.

1. Clone or download this repo
2. Open `index.html` in any browser

```bash
git clone <this-repo-url>
cd Matcha-game
open index.html   # or just double-click it
```

> 💡 Prefer auto-reload while tinkering? Use VS Code's **Live Server** extension.

### How to play

| Action | Result |
|---|---|
| **Hold** the pour button (mouse or touch) | Matcha rises in the cup |
| **Release** | Pour locks in at the current % |
| Land inside the gold zone | 🌸✨ Perfect pour : confetti! |
| Miss high or low | The cup nudges you toward "hold longer" / "release sooner" |

Your **current %**, the round's **target %**, and your all-time **best** are tracked live, with your last five attempts shown as colored pills underneath.

## ✨ Features

- 🎯 **Randomized target & pour speed** every round : no memorizing timing
- 😊 **Kawaii reactive mug** : eyes, blush, and a mouth that respond to your pour
- 🟡 **Live "in the zone" glow** as you cross into the winning window
- 🎉 **Confetti burst** of 🌸 ✨ 🍃 🍡 on a winning pour
- 📱 **Touch-friendly** : works identically on mobile and desktop
- 🪴 **Zero dependencies** : pure HTML, CSS, and vanilla JavaScript

## 🛠️ Built with

| File | Role |
|---|---|
| [`index.html`](index.html) | Page structure : the card, cup, stats, and buttons |
| [`style.css`](style.css) | Japanese-café color palette, cup shape, animations |
| [`game.js`](game.js) | Game loop, pour timing, scoring, confetti |
| [`matcha-pattern.svg`](matcha-pattern.svg) | Tiled background texture |

No frameworks, no bundler, no `node_modules` : open the files and read them top to bottom.

## 📖 Want to build it yourself?

This repo doubles as a **beginner-friendly tutorial**. [`tutorial.md`](tutorial.md) walks through building the entire game from scratch in ~45 minutes, covering:

- `setInterval` for the pour tick
- Mouse + touch event listeners
- DOM manipulation for live updates
- Basic game-state management
- `classList.toggle` for reactive styling

There's also an extended, fully-annotated walkthrough in [`matcha-cup-tutorial.html`](matcha-cup-tutorial.html).


## 🍃 License

This is a small fun project : feel free to fork it, remix the palette, or build your own precision-timing game on top of it.

<p align="center"><sub>"Drink your matcha slowly and reverently, as if it is the axis on which the whole world revolves."🍵🌸</sub></p>
