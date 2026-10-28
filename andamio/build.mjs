import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "/Users/diegotapiadelgadillo/.claude/skills/anatomy/kit/iso-kit.mjs";
import { kitScript } from "/Users/diegotapiadelgadillo/.claude/skills/anatomy/scripts/inline-kit.mjs";
import * as F1 from "./fig1.mjs";
import * as F2 from "./fig2.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const theme = process.argv.includes("--light") ? "light" : "dark";

// ---------- Fig 1 ----------
const degs = [];
for (let d = F1.ADJ.centre - F1.ADJ.span; d <= F1.ADJ.centre + F1.ADJ.span; d++) degs.push(d);
const frames = Object.fromEntries(degs.map((d) => [d, F1.adjustable(d)]));

const fig1 = k.plateHtml({
  fig: "Fig 1",
  title: "Nudo de roseta SM8",
  hint: "Puntero: girar · clic: cuña",
  readout: "315° · cuña suelta",
  keys: [
    { mark: "lit", label: "Cuña: al golpearla bloquea el cabezal contra la roseta" },
    { mark: "raised", label: "Roseta Ø124 mm, 9 mm, con 4 orificios pequeños y 4 grandes" },
  ],
  caption:
    "Cada 0,5 m el poste lleva una roseta soldada. En los 4 orificios pequeños el cabezal queda centrado a 90°; en los 4 grandes puede girar dentro de la ranura y fijarse al ángulo que pida la obra. Las mordazas abrazan el disco y la cuña atraviesa el orificio: un golpe de martillo y el nudo queda rígido, sin tornillos.",
  body: `<div class="iso-stage" id="f1" tabindex="0" role="slider" aria-label="Nudo de roseta: flechas giran el horizontal en el orificio grande, Enter o espacio golpean o sueltan la cuña" aria-valuemin="${degs[0]}" aria-valuemax="${degs[degs.length - 1]}" aria-valuenow="315" aria-valuetext="315 grados, cuña suelta">${F1.figure()}</div>`,
});

const live1 = `
const WEDGE = ${JSON.stringify(F1.WEDGE)};
const wedgePart = ${F1.wedgePart.toString()};
(() => {
const P = ${JSON.stringify(F1.P)};
const FR = ${JSON.stringify(frames)};
const LO = ${degs[0]}, HI = ${degs[degs.length - 1]}, DROP = ${F1.DROP};
const stage = document.getElementById("f1");
const svg = stage.querySelector("svg");
const part = (n) => svg.querySelector('[data-part="' + n + '"]');
const gLow = part("adj-low"), gWl = part("adj-wedge-low"), gHead = part("adj-head"), gW = part("adj-wedge");
const readout = stage.closest(".iso-plate").querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
let ang = 315, target = 315, shown = null, drawnW = null, lock = false, wz = { at: 0, rate: 0 };
let frame = 0, last = 0, clock = 0, touring = !still.matches, visible = false, idle = 0;
const TOUR = [[0, 315, false], [1.6, 306, false], [3.4, 324, false], [5.2, 320, false], [6.4, 320, true], [9.6, 320, false], [10.6, 315, false]];
const TOUR_LEN = 12;
function tourAt(t) { t %= TOUR_LEN; let s = TOUR[0]; for (const step of TOUR) if (t >= step[0]) s = step; return s; }
function paint() {
  const d = Math.round(ang);
  if (d !== shown) { const f = FR[d]; gLow.innerHTML = f.low; gHead.innerHTML = f.head; shown = d; }
  const key = d + ":" + wz.at.toFixed(1);
  if (key !== drawnW) { gW.innerHTML = wedgePart(extrude, solidSvg, P, ang, wz.at, "high", "hi", true); gWl.innerHTML = wedgePart(extrude, solidSvg, P, ang, wz.at, "low", "hi", true); drawnW = key; }
  const state = wz.at > DROP - 1 ? "cuña asentada · rígido" : wz.at > 1 ? "cuña bajando" : "cuña suelta";
  const text = ang.toFixed(0) + "° · " + state;
  if (readout.textContent !== text) readout.textContent = text;
}
function describe() { stage.setAttribute("aria-valuenow", String(Math.round(target))); stage.setAttribute("aria-valuetext", Math.round(target) + " grados, " + (lock ? "cuña asentada" : "cuña suelta")); }
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60; last = now;
  const calm = still.matches;
  if (touring) { clock += dt; const s = tourAt(clock); if (s[1] !== target || s[2] !== lock) { target = s[1]; lock = s[2]; } }
  if (!lock || wz.at < 1) ang = calm ? target : ang + (target - ang) * (1 - Math.exp(-dt / 0.3));
  if (Math.abs(ang - target) < 0.02) ang = target;
  const want = lock ? DROP : 0;
  if (calm) { wz.at = want; wz.rate = 0; }
  else if (lock) {
    // cae por gravedad y rebota poco sobre el asiento (el martillo la clava)
    for (let i = 0; i < 4; i++) { wz.rate += 9810 * dt / 4; wz.at += wz.rate * dt / 4; if (wz.at >= want) { wz.at = want; wz.rate = Math.abs(wz.rate) > 300 ? -wz.rate * 0.12 : 0; } }
  } else { wz.at += (want - wz.at) * (1 - Math.exp(-dt / 0.12)); wz.rate = 0; if (wz.at < 0.05) wz.at = 0; }
  paint();
  const settled = !touring && ang === target && wz.at === want && wz.rate === 0;
  frame = visible && !settled ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const hold = () => { touring = false; clearTimeout(idle); idle = setTimeout(() => { touring = !still.matches; clock = 0; run(); }, 4200); run(); };
const clamp = (v) => Math.max(LO, Math.min(HI, v));
new IntersectionObserver((e) => { visible = e[e.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
stage.addEventListener("pointermove", (e) => {
  if (e.pointerType !== "mouse") return;
  const b = svg.getBoundingClientRect();
  const share = Math.max(0, Math.min(1, ((e.clientX - b.left) / b.width - 0.2) / 0.6));
  if (lock) { hold(); return; }
  target = clamp(Math.round(HI - share * (HI - LO))); hold(); describe();
});
stage.addEventListener("click", () => { lock = !lock; if (lock) wz.rate = 0; hold(); describe(); });
stage.addEventListener("keydown", (e) => {
  let used = true;
  if (e.key === "ArrowLeft" || e.key === "ArrowDown") { if (!lock) target = clamp(target + (e.shiftKey ? 5 : 1)); }
  else if (e.key === "ArrowRight" || e.key === "ArrowUp") { if (!lock) target = clamp(target - (e.shiftKey ? 5 : 1)); }
  else if (e.key === "Home") { if (!lock) target = LO; } else if (e.key === "End") { if (!lock) target = HI; }
  else if (e.key === "Enter" || e.key === " ") { lock = !lock; }
  else if (e.key === "Escape") { lock = false; }
  else used = false;
  if (used) { e.preventDefault(); hold(); describe(); }
});
paint();
})();
`;

// ---------- Fig 2 ----------
const fig2 = k.plateHtml({
  fig: "Fig 2",
  title: "Andamio de fachada a medida",
  hint: "Puntero: montar nivel a nivel",
  readout: F2.readoutAt(F2.STEPS.length - 1),
  keys: F2.KEYS,
  caption: F2.CAPTION,
  body: `<div class="iso-stage" id="f2" tabindex="0" role="slider" aria-label="Andamio de fachada: flechas avanzan o retroceden el montaje" aria-valuemin="0" aria-valuemax="${F2.STEPS.length - 1}" aria-valuenow="${F2.STEPS.length - 1}">${F2.figure()}</div>`,
});
const live2 = F2.live();

const intro = `<header class="sm-head"><p class="sm-kicker">Andamio multidireccional · roseta SM8</p><h1>Un disco cada medio metro</h1><p>Todo el sistema cabe en una idea: postes verticales con rosetas soldadas cada 0,5 m, y piezas horizontales y diagonales que se enganchan a ellas con una cuña. La Fig 1 muestra un solo nudo; la Fig 2, un andamio montado frente a un edificio para su mantenimiento.</p></header>`;
const css = `<style>.sm-head{margin:0 0 40px}.sm-kicker{font:12px/1.4 var(--anatomy-mono);color:var(--anatomy-muted);margin:0 0 8px;text-transform:uppercase;letter-spacing:.06em}.sm-head h1{font-size:28px;line-height:1.2;color:var(--anatomy-strong);margin:0 0 12px;font-weight:600;letter-spacing:-.01em}.sm-head p{margin:0}.iso-figure+.iso-figure{margin-top:56px}.sm-notes{margin-top:56px}.sm-notes h2{font-size:17px;color:var(--anatomy-strong);margin:0 0 10px;font-weight:600}.sm-notes ul{margin:0 0 24px;padding-left:18px}.sm-notes li{margin:4px 0}</style>`;
const notes = F2.NOTES;

const name = theme === "light" ? "andamio-sm8-light.html" : "andamio-sm8.html";
writeFileSync(
  join(HERE, name),
  k.pageHtml({ title: "Andamio SM8", theme, body: css + intro + fig1 + fig2 + notes, script: kitScript() + live1 + live2, width: 720 }).replace('lang="en"', 'lang="es"'),
);
console.log("wrote", name);
