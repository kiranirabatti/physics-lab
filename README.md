# ⚛️ Physics Lab — Interactive CBSE Class 9 & 10 Simulations

Free, open-source, browser-only physics simulations that make the hardest CBSE
Class 9–10 concepts instantly intuitive. Think *PhET, but modern, mobile-first,
and made for CBSE*.

**A student needs only a browser.** No app, no login, no ads, no tracking, no
API keys, no backend — just static HTML, CSS, and JavaScript. Works great on a
360-px-wide Android phone and on a classroom projector, in light and dark mode.

## The 15 simulations

### Class 9
| Sim | What clicks |
|---|---|
| [Motion Graphs](sims/motion-graphs.html) | Drag an s–t / v–t graph, watch a vehicle move to match it |
| [Newton's Laws](sims/newtons-laws.html) | Push crates, toggle friction, feel F = ma |
| [Momentum & Collisions](sims/momentum-collisions.html) | Elastic vs sticky crashes; momentum never changes |
| [Gravitation & Free Fall](sims/gravitation-free-fall.html) | Ball vs feather, with/without air, Earth vs Moon |
| [Work & Energy](sims/work-energy.html) | Roller-coaster; KE ⇄ PE bars, joule for joule |
| [Sound Waves](sims/sound-waves.html) | See *and hear* frequency (pitch) and amplitude (loudness) |

### Class 10
| Sim | What clicks |
|---|---|
| [Curved Mirrors](sims/mirrors.html) | Drag a candle along the axis; ray diagram + image live |
| [Refraction & Lenses](sims/lenses.html) | Convex/concave lenses, the magnifying-glass moment |
| [Mirror & Lens Formula](sims/mirror-lens-formula.html) | 1/v + 1/u = 1/f with live signed numbers |
| [Dispersion & Scattering](sims/dispersion-scattering.html) | Prism spectrum; why the sky is blue, sunsets red |
| [The Human Eye](sims/human-eye.html) | Accommodation, myopia, hypermetropia + corrections |
| [Ohm's Law](sims/ohms-law.html) | V, R sliders → live current and the straight V–I line |
| [Series vs Parallel](sims/circuits.html) | Add/fuse bulbs; Diwali lights vs home wiring |
| [Electric Power & Heating](sims/electric-power.html) | P = VI and the real ₹ cost of running a geyser |
| [Magnetism & Motors](sims/magnetism-motor.html) | Field lines, DC motor, hand-cranked generator |

Every simulation has real physics computed from first principles (correct
equations, SI units, CBSE/NCERT sign conventions), a plain-language explanation,
a key formula, a "try this" prompt, and a **▶ Show me** button that animates the
classic exam scenario.

## Run it locally

No build step, no server needed:

1. Download or clone this repository.
2. Open `index.html` in any browser. That's it.

(Optionally serve it — `python -m http.server` or VS Code Live Server — but
plain `file://` works too.)

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. In the repo: **Settings → Pages → Source: Deploy from a branch**, pick
   `main` and `/ (root)`, save.
3. Your library is live at `https://<username>.github.io/<repo>/`.

No build pipeline, no secrets, nothing to configure.

## Tech

- 100 % static: vanilla HTML/CSS/JS + Canvas 2D. **Zero dependencies**, zero CDNs.
- Shared design system in [`assets/style.css`](assets/style.css) and a tiny
  harness in [`assets/sim.js`](assets/sim.js) (theme, DPR-aware canvas,
  unified touch/mouse pointer, sliders, animation loop).
- Each sim is one self-contained HTML file in [`sims/`](sims/) with its own
  shareable URL.
- Light + dark theme (respects system preference, remembered in localStorage).
- Accessible: native keyboard-operable sliders, labelled inputs, readable contrast.

## Contributing

Bug in the physics? Explanation unclear? A concept you wish existed? Open an
issue or PR. Please keep the rules: zero dependencies, one self-contained file
per sim, correct physics, plain language a 14-year-old understands.

## License

[MIT](LICENSE) — free to use, copy, remix, and translate. If you teach with it,
we'd love to hear about it.
