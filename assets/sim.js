/* ============================================================
   Physics Lab — shared simulation harness (zero dependencies)
   Exposes a single global: Sim
   ============================================================ */
(function () {
  "use strict";
  const Sim = {};

  /* ---------- theme ---------- */
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("plab-theme", t); } catch (e) {}
    window.dispatchEvent(new CustomEvent("themechange"));
  }
  Sim.initTheme = function () {
    let t;
    try {
      const q = new URLSearchParams(location.search).get("theme");
      if (q === "light" || q === "dark") t = q;
    } catch (e) {}
    if (!t) try { t = localStorage.getItem("plab-theme"); } catch (e) {}
    if (t !== "light" && t !== "dark") {
      t = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-theme", t);
    document.addEventListener("DOMContentLoaded", function () {
      const btn = document.querySelector(".theme-btn");
      if (btn) btn.addEventListener("click", function () {
        applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
      });
    });
  };
  Sim.initTheme();

  /* ---------- theme-aware colours for canvas drawing ---------- */
  Sim.colors = function () {
    const s = getComputedStyle(document.documentElement);
    const g = (n) => s.getPropertyValue(n).trim();
    return {
      ink: g("--ink"), muted: g("--muted"), grid: g("--grid"),
      accent: g("--accent"), accent2: g("--accent-2"),
      hot: g("--hot"), warm: g("--warm"), cool: g("--cool"),
      surface: g("--surface"), surface2: g("--surface-2"),
      border: g("--border"), canvasBg: g("--canvas-bg"),
      dark: document.documentElement.getAttribute("data-theme") === "dark"
    };
  };

  /* ---------- canvas with DPR scaling + resize ----------
     Sim.canvas(el, { aspect: 16/9, maxH: 520, onResize })
     Returns { el, ctx, w, h }  (w/h in CSS pixels — draw in CSS px). */
  Sim.canvas = function (el, opts) {
    opts = opts || {};
    const aspect = opts.aspect || 16 / 9;
    const maxH = opts.maxH || 560;
    const view = { el: el, ctx: el.getContext("2d"), w: 0, h: 0 };
    function resize() {
      const cssW = el.clientWidth || el.parentElement.clientWidth;
      let cssH = Math.round(cssW / aspect);
      const cap = Math.max(240, Math.min(maxH, window.innerHeight - 220));
      if (cssH > cap) cssH = cap;
      el.style.height = cssH + "px";
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.round(cssW * dpr);
      el.height = Math.round(cssH * dpr);
      view.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      view.w = cssW; view.h = cssH;
      if (opts.onResize) opts.onResize(view);
    }
    let raf = 0;
    window.addEventListener("resize", function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(resize);
    });
    resize();
    view.resize = resize;
    return view;
  };

  /* ---------- animation loop with clamped dt (seconds) ---------- */
  Sim.loop = function (fn) {
    let running = false, last = -1, id = 0;
    function frame(t) {
      if (!running) return;
      const dt = last < 0 ? 0 : Math.max(0, Math.min((t - last) / 1000, 1 / 20));
      last = t;
      fn(dt, t / 1000);
      id = requestAnimationFrame(frame);
    }
    return {
      start: function () {
        if (running) return;
        running = true;
        last = -1;
        id = requestAnimationFrame(frame);
      },
      stop: function () { running = false; cancelAnimationFrame(id); },
      get running() { return running; }
    };
  };

  /* ---------- unified mouse + touch pointer on a canvas ----------
     Sim.pointer(canvas, { down, move, up })   coords in CSS px. */
  Sim.pointer = function (el, h) {
    function pos(e) {
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }
    el.addEventListener("pointerdown", function (e) {
      el.setPointerCapture(e.pointerId);
      e.preventDefault();
      if (h.down) h.down(pos(e), e);
    });
    el.addEventListener("pointermove", function (e) {
      if (h.move) h.move(pos(e), e, e.buttons > 0);
    });
    function end(e) { if (h.up) h.up(pos(e), e); }
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  };

  /* ---------- slider binding ----------
     HTML pattern:
       <div class="ctl">
         <div class="lab"><label for="mass">Mass</label><output id="massOut">2.0 kg</output></div>
         <input type="range" id="mass" min="0.5" max="10" step="0.1" value="2">
       </div>
     JS:  const mass = Sim.slider("mass", v => v.toFixed(1) + " kg", onChange)
          mass()   -> current numeric value
          mass.set(v) -> programmatic set (fires format + onChange)      */
  Sim.slider = function (id, format, onChange) {
    const el = document.getElementById(id);
    const out = document.getElementById(id + "Out");
    function show() { if (out) out.textContent = format ? format(+el.value) : el.value; }
    el.addEventListener("input", function () { show(); if (onChange) onChange(+el.value); });
    show();
    const get = function () { return +el.value; };
    get.set = function (v) { el.value = v; show(); if (onChange) onChange(+el.value); };
    get.el = el;
    return get;
  };

  /* ---------- misc ---------- */
  Sim.fmt = function (n, d) {
    if (!isFinite(n)) return "∞";
    return (+n).toFixed(d === undefined ? 2 : d);
  };
  Sim.clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  Sim.lerp = function (a, b, t) { return a + (b - a) * t; };

  /* rounded rect that works everywhere */
  Sim.rr = function (ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  /* arrow from (x1,y1) to (x2,y2) */
  Sim.arrow = function (ctx, x1, y1, x2, y2, head) {
    head = head || 9;
    const a = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - head * Math.cos(a - 0.42), y2 - head * Math.sin(a - 0.42));
    ctx.lineTo(x2 - head * Math.cos(a + 0.42), y2 - head * Math.sin(a + 0.42));
    ctx.closePath();
    ctx.fill();
  };

  window.Sim = Sim;
})();
