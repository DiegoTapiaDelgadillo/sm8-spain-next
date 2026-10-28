// Fig 2 · Andamio de fachada a medida. Unidades: centímetros reales.
import * as k from "/Users/diegotapiadelgadillo/.claude/skills/anatomy/kit/iso-kit.mjs";
import * as G from "/Users/diegotapiadelgadillo/.claude/skills/anatomy/kit/lathe.mjs";
import { tubePieces, tubeSvg } from "/Users/diegotapiadelgadillo/.claude/skills/anatomy/kit/tube.mjs";

export const W = 600;
export const H = 600;

const RT = 2.415;                 // Ø48,3 mm
const XS = [20, 227, 434];        // horizontales de 2,07 m
const YIN = 35, YOUT = 108;       // ancho de 0,73 m, a 35 cm del muro
const COLLAR_ROS = 25;            // roseta del collarín de arranque
const LIFTS = [25, 225, 425, 625];// niveles de horizontales (2 m)
const TOP = 735;
const ground = (x) => (x > 300 ? -30 : 0);
const NUT = 6;

const WALL = { x: -70, y: -50, w: 580, d: 50, r: 0 };
const WALL_TOP = 790;
const WALK = { x: -70, y: 0, w: 370, d: 190, r: 0 };
const LOW = { x: 300, y: 0, w: 210, d: 190, r: 0 };

export const P = k.fitProjection(
  [...k.boxCorners(WALL, -50, WALL_TOP), ...k.boxCorners(WALK, -20, 0), ...k.boxCorners(LOW, -50, -30)],
  W,
  H,
  { pad: 22, azimuth: 62 },
);

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const V = G.viewOf(P);
const depth = (p) => G.dot3(p, V);

const items = [];
const put = (step, mid, svg, bias = 0) => items.push({ step, key: depth(mid) + bias, svg });

// ---------- tubos ----------
// Un tramo recto de tubo como cilindro, con o sin bordes en sus extremos
function bar(a, b, r, tone, rims = "all", extra = "") {
  const d = G.sub3(b, a);
  const len = G.len3(d);
  const F = G.frameAlong(a, d);
  return S(G.disc(0, len, r, F, P, { rims, steps: 10 }), { tone, crease: "faint", inner: extra });
}
// Tubo largo cortado en trozos ordenables
function tube(step, a, b, r, tone, { pieces = 4, bias = 0, ends = [true, true] } = {}) {
  const len = G.len3(G.sub3(b, a));
  for (const piece of tubePieces([a, b], r, P, { maxLength: len / pieces + 0.01, caps: ends, spacing: Math.max(4, len / pieces / 3) })) put(step, piece.mid, tubeSvg(piece, { tone }), bias);
}
// Cabezal de cuña sobre una roseta, mirando hacia `dir`
function wedgeHead(step, c, dir, tone = "mid") {
  const [dx, dy] = dir;
  const n = Math.hypot(dx, dy);
  const ux = dx / n, uy = dy / n;
  const pt = (r, t) => [c[0] + ux * r - uy * t, c[1] + uy * r + ux * t];
  const ring = [pt(2.7, -0.7), pt(9.6, -2.2), pt(9.6, 2.2), pt(2.7, 0.7)];
  const svg = S(k.extrude(ring, c[2] - 3, 6.5, P), { tone, crease: "faint" }) +
    S(k.extrude([pt(4.2, -0.45), pt(5, -0.45), pt(5, 0.45), pt(4.2, 0.45)], c[2] + 3.5, 3.5, P), { tone: "hi" });
  put(step, [...pt(6, 0), c[2]], svg, 0.3);
}
// Horizontal entre dos rosetas: tubo + dos cabezales
function ledger(step, x0, y0, x1, y1, z, { tone = "mid", pieces = 4 } = {}) {
  const dx = x1 - x0, dy = y1 - y0;
  const n = Math.hypot(dx, dy);
  const ux = dx / n, uy = dy / n;
  wedgeHead(step, [x0, y0, z], [ux, uy], tone);
  wedgeHead(step, [x1, y1, z], [-ux, -uy], tone);
  tube(step, [x0 + ux * 9.6, y0 + uy * 9.6, z], [x1 - ux * 9.6, y1 - uy * 9.6, z], RT, tone, { pieces });
}

// ---------- edificio y suelo (estático, detrás de todo) ----------
function building() {
  const out = [];
  out.push(S(k.slabOf(WALL, -50, WALL_TOP + 50, P, 2), { tone: "lo", crease: "faint" }));
  const face = (pts) => pts.map((p) => at(p));
  const poly = (pts, close = true) => "M" + face(pts).map((p) => p.join(" ")).join(" L") + (close ? "Z" : "");
  // juntas de forjado a lo ancho de la fachada, de canto a canto
  for (const z of [250, 470, 690]) out.push(L(poly([[WALL.x, 0, z], [WALL.x + WALL.w, 0, z]], false), { tone: "faint" }));
  // costados: la junta da la vuelta a la esquina
  for (const z of [250, 470, 690]) out.push(L(poly([[WALL.x + WALL.w, 0, z], [WALL.x + WALL.w, WALL.y, z]], false), { tone: "faint" }));
  // ventanas: hueco, marco, parteluz y alféizar
  const wins = [];
  for (const z0 of [290, 510]) for (const x0 of [70, 300]) wins.push([x0, z0]);
  wins.push([-40, 60]); wins.push([150, 60]);
  for (const [x0, z0] of wins) {
    const w = 110, h = 130;
    out.push(`<path d="${poly([[x0, 0, z0], [x0 + w, 0, z0], [x0 + w, 0, z0 + h], [x0, 0, z0 + h]])}" style="fill:var(--anatomy-shade-0)" class="iso-line" data-tone="lo"/>`);
    out.push(L(poly([[x0 + 6, 0, z0 + 6], [x0 + w - 6, 0, z0 + 6], [x0 + w - 6, 0, z0 + h - 6], [x0 + 6, 0, z0 + h - 6]]), { tone: "faint" }));
    out.push(L(poly([[x0 + w / 2, 0, z0 + 6], [x0 + w / 2, 0, z0 + h - 6]], false), { tone: "faint" }));
    out.push(S(k.slabOf({ x: x0 - 6, y: 0, w: w + 12, d: 6, r: 0 }, z0 - 6, 6, P, 2), { tone: "mid" }));
  }
  // cornisa: el obstáculo que el andamio debe salvar
  out.push(S(k.slabOf({ x: WALL.x, y: 0, w: WALL.w, d: 20, r: 0 }, 420, 18, P, 2, 0.8), { tone: "mid" }));
  out.push(S(k.slabOf({ x: WALL.x, y: 0, w: WALL.w, d: 12, r: 0 }, 438, 6, P, 2), { tone: "mid" }));
  // remate superior
  out.push(S(k.slabOf({ x: WALL.x - 4, y: WALL.y - 4, w: WALL.w + 8, d: WALL.d + 10, r: 0 }, WALL_TOP, 10, P, 2, 0.8), { tone: "mid" }));
  return out.join("");
}
function groundSvg() {
  const out = [];
  out.push(S(k.slabOf(LOW, -50, 20, P, 2), { tone: "lo" }));
  for (let x = LOW.x + 30; x < LOW.x + LOW.w; x += 30) out.push(L(k.lineOnTop([x, LOW.y], [x, LOW.y + LOW.d], -30, P), { tone: "faint" }));
  out.push(S(k.slabOf(WALK, -50, 50, P, 2), { tone: "lo" }));
  for (let x = WALK.x + 40; x < WALK.x + WALK.w; x += 40) out.push(L(k.lineOnTop([x, WALK.y], [x, WALK.y + WALK.d], 0, P), { tone: "faint" }));
  for (let y = 40; y < WALK.d; y += 40) out.push(L(k.lineOnTop([WALK.x, y], [WALK.x + WALK.w, y], 0, P), { tone: "faint" }));
  // bordillo en el escalón
  out.push(S(k.slabOf({ x: 296, y: 0, w: 4, d: 190, r: 0 }, 0, 2, P, 2), { tone: "mid" }));
  return out.join("");
}

// ---------- andamio ----------
function standards() {
  for (const x of XS) for (const y of [YIN, YOUT]) {
    const g = ground(x);
    // base: placa 15×15, husillo, tuerca de mariposa
    put(0, [x, y, g], `<path class="iso-halo" d="${k.haloOf({ x: x - 9, y: y - 9, w: 18, d: 18, r: 2 }, g, 1, P)}" style="filter:blur(3px)"/>` + S(k.slabOf({ x: x - 7.5, y: y - 7.5, w: 15, d: 15, r: 0.8 }, g, 0.8, P, 2), { tone: "mid" }) + D(k.corners({ x: x - 7.5, y: y - 7.5, w: 15, d: 15 }, 2).map(([a, b]) => at([a, b, g + 0.8])), { size: 0.35 }), -2);
    const threads = [];
    for (let z = g + 3; z < NUT - 0.5; z += 2.2) threads.push(k.sideArc(x, y, 1.9, z, P, 10));
    put(0, [x, y, (g + NUT) / 2], S(k.cylinder(x, y, 1.9, g + 0.8, NUT - g - 0.8, P, 16), { tone: "mid", crease: "none", inner: L(threads.join(""), { tone: "faint" }) }), -1);
    put(0, [x, y, NUT], S(k.cylinder(x, y, 4, NUT, 3, P, 18), { tone: "mid" }) + S(k.slabOf({ x: x - 7, y: y - 0.8, w: 14, d: 1.6, r: 0.6 }, NUT + 0.5, 2, P, 2), { tone: "mid" }), -0.5);
    // collarín con su roseta, y poste en tramos de 50 cm entre rosetas
    const ros = [];
    for (let z = COLLAR_ROS; z <= TOP - 5; z += 50) ros.push(z);
    const stepOf = (z) => (z <= 25 ? 0 : z <= 225 ? 1 : z <= 425 ? 2 : z <= 625 ? 3 : 4);
    put(0, [x, y, (NUT + 3 + COLLAR_ROS) / 2], bar([x, y, NUT + 3], [x, y, COLLAR_ROS], 3, "mid", "first"));
    put(0, [x, y, 33], bar([x, y, COLLAR_ROS + 0.9], [x, y, 40], 3, "mid", "last"));
    ros.forEach((z, i) => {
      put(stepOf(z), [x, y, z], S(k.cylinder(x, y, 6.2, z, 0.9, P, 16), { tone: "hi", crease: "lo" }), 0.05);
      const next = i + 1 < ros.length ? ros[i + 1] : TOP;
      const a0 = z === COLLAR_ROS ? 40 : z + 0.9;
      const st = stepOf(next === TOP ? 700 : next);
      const joint = [240, 440, 640].find((j) => j > a0 && j < next);
      if (joint) {
        put(stepOf(joint - 20), [x, y, (a0 + joint) / 2], bar([x, y, a0], [x, y, joint], RT, "mid", "none"));
        put(st, [x, y, (joint + next) / 2], bar([x, y, joint], [x, y, next], RT, "mid", "none"));
        put(st, [x, y, joint + 2], L(k.sideArc(x, y, RT, joint, P, 12), { tone: "lo" }) + D([at([x + RT * 0.9 * Math.cos(1.08), y + RT * 0.9 * Math.sin(1.08), joint + 4])], { size: 0.35 }), 0.2);
      } else put(st, [x, y, (a0 + next) / 2], bar([x, y, a0], [x, y, next], RT, "mid", next === TOP ? "last" : "none"));
      if (next === TOP) put(4, [x, y, TOP], L(k.ring(x, y, RT - 0.5, TOP, P, 16), { tone: "lo" }), 0.1);
    });
  }
}

function ledgers() {
  // largueros a lo largo de la fachada y travesaños en U
  LIFTS.forEach((z, li) => {
    const s = li === 0 ? 0 : li;
    for (let b = 0; b < 2; b++) for (const y of [YIN, YOUT]) ledger(s, XS[b], y, XS[b + 1], y, z);
    for (const x of XS) ledger(s, x, YIN, x, YOUT, z, { pieces: 2 });
  });
}

function decks() {
  for (const [li, z] of LIFTS.slice(1).entries()) {
    const s = li + 2;
    for (let b = 0; b < 2; b++) {
      const x0 = XS[b] + 4, x1 = XS[b + 1] - 4;
      for (const [y0, y1] of [[YIN + 2.5, YIN + 35], [YIN + 38, YOUT - 2.5]]) {
        const plan = { x: x0, y: y0, w: x1 - x0, d: y1 - y0, r: 0.6 };
        const holes = [];
        for (let x = x0 + 8; x < x1 - 4; x += 8) for (let y = y0 + 5; y < y1 - 3; y += 7) holes.push(at([x, y, z + 6]));
        const svg = S(k.slabOf(plan, z + 2.4, 3.6, P, 2, 0.4), { tone: "hi", crease: "lo", inner: L(k.sideSeam(plan, z + 4.2, P, 2), { tone: "faint" }) }) + D(holes, { size: 0.3, tone: "lo" });
        // trozos para ordenar con los postes
        put(s, [(x0 + x1) / 2, (y0 + y1) / 2, z + 4], svg, 4);
      }
      // rodapié exterior
      const toe = { x: x0, y: YOUT - 4.5, w: x1 - x0, d: 2, r: 0 };
      put(s, [(x0 + x1) / 2, YOUT - 3.5, z + 13], S(k.slabOf(toe, z + 6, 15, P, 2), { tone: "mid" }), 6);
    }
    // barandilla a 0,5 m y 1,0 m sobre la plataforma
    for (const dz of [50, 100]) {
      for (let b = 0; b < 2; b++) ledger(s, XS[b], YOUT, XS[b + 1], YOUT, z + dz);
      for (const x of [XS[0], XS[2]]) ledger(s, x, YIN, x, YOUT, z + dz, { pieces: 2 });
    }
  }
}

function diagonals() {
  // diagonal vertical en el plano exterior, alternando vano y sentido
  [[0, 25, 225, 1], [1, 225, 425, 2], [0, 425, 625, 3]].forEach(([b, z0, z1, s]) => {
    const flip = s % 2 === 0;
    const xa = flip ? XS[b + 1] : XS[b], xb = flip ? XS[b] : XS[b + 1];
    const sx = Math.sign(xb - xa);
    wedgeHead(s, [xa, YOUT, z0], [sx, 0]);
    wedgeHead(s, [xb, YOUT, z1], [-sx, 0]);
    tube(s, [xa + sx * 9.6, YOUT + 1.5, z0 + 2], [xb - sx * 9.6, YOUT + 1.5, z1 - 2], RT, "mid", { pieces: 6, bias: 1 });
  });
  // diagonal en el testero derecho
  wedgeHead(1, [XS[2], YIN, 25], [0, 1]);
  wedgeHead(1, [XS[2], YOUT, 225], [0, -1]);
  tube(1, [XS[2] + 1.5, YIN + 9.6, 27], [XS[2] + 1.5, YOUT - 9.6, 223], RT, "mid", { pieces: 4, bias: 1 });
}

function ties() {
  // anclajes a fachada cada 4 m: tubo, abrazadera y cáncamo en el muro
  for (const [z, s] of [[200, 2], [600, 4]]) for (const x of [XS[0], XS[2]]) {
    put(s, [x, 1, z], S(k.slabOf({ x: x - 5, y: 0, w: 10, d: 1.5, r: 0.4 }, z - 5, 10, P, 2), { tone: "mid" }) + D([at([x - 3, 1.5, z + 3]), at([x + 3, 1.5, z - 3])], { size: 0.35 }), -1);
    tube(s, [x, 1.5, z], [x, YIN - RT - 1, z], 1.6, "mid", { pieces: 2 });
    put(s, [x, YIN, z], S(k.slabOf({ x: x - 3.6, y: YIN - 3.6, w: 7.2, d: 7.2, r: 1.5 }, z - 2.5, 5, P, 3), { tone: "mid" }) + D([at([x, YIN + 3.6, z + 2.5])], { size: 0.35 }), 0.4);
  }
}

function brackets() {
  // ménsula de 0,39 m hacia el muro en el nivel superior + plataforma estrecha
  const z = 625;
  for (const x of XS) {
    wedgeHead(4, [x, YIN, z], [0, -1]);
    tube(4, [x, YIN - 9.6, z], [x, 4, z], RT, "mid", { pieces: 2 });
    wedgeHead(4, [x, YIN, z - 50], [0, -1]);
    tube(4, [x, YIN - 9.6, z - 48], [x, 8, z - 3], 1.8, "mid", { pieces: 2 });
  }
  for (let b = 0; b < 2; b++) {
    const plan = { x: XS[b] + 4, y: 5, w: XS[b + 1] - XS[b] - 8, d: 27, r: 0.6 };
    const holes = [];
    for (let x = plan.x + 8; x < plan.x + plan.w - 4; x += 8) for (let y = plan.y + 5; y < plan.y + plan.d - 3; y += 7) holes.push(at([x, y, z + 6]));
    put(4, [plan.x + plan.w / 2, plan.y + plan.d / 2, z + 4], S(k.slabOf(plan, z + 2.4, 3.6, P, 2, 0.4), { tone: "hi", crease: "lo" }) + D(holes, { size: 0.3, tone: "lo" }), 4);
  }
}

standards();
ledgers();
decks();
diagonals();
ties();
brackets();

export const STEPS = [
  { label: "base", text: "base · husillos a 5 y 35 cm: nivela el escalón" },
  { label: "nivel 1", text: "nivel 1 · rosetas cada 0,5 m hasta 2,25 m" },
  { label: "plataforma 1", text: "plataforma a 2,25 m · anclaje a fachada" },
  { label: "plataforma 2", text: "plataforma a 4,25 m · la cornisa queda en el hueco" },
  { label: "plataforma 3", text: "plataforma a 6,25 m + ménsula de 0,39 m al muro" },
];
export const readoutAt = (i) => STEPS[i].text;

export const KEYS = [
  { mark: "raised", label: "Rosetas y plataformas de acero perforadas" },
  { mark: "edge", label: "Postes, horizontales, diagonales y barandillas Ø48,3 mm" },
];
export const CAPTION =
  "Andamio de 2 vanos de 2,07 m × 0,73 m frente a una fachada de 7,9 m. Los husillos absorben el escalón de 30 cm, los travesaños en U llevan plataformas de 0,32 m, la cornisa a 4,2 m cabe entre el muro y el andamio, y en el último nivel una ménsula acerca el trabajo al muro. Anclajes a la fachada cada 4 m y barandillas a 0,5 y 1,0 m.";

export function figure() {
  items.sort((a, b) => a.key - b.key);
  const body = [groundSvg(), building()];
  let run = null;
  let buf = [];
  const flush = () => { if (buf.length) body.push(`<g data-step="${run}">${buf.join("")}</g>`); buf = []; };
  for (const it of items) { if (it.step !== run) { flush(); run = it.step; } buf.push(it.svg); }
  flush();
  return k.figureSvg({
    width: W,
    height: H,
    label:
      "Andamio multidireccional de dos vanos y tres plataformas frente a la fachada de un edificio con ventanas y una cornisa. Los pies descansan sobre husillos regulables en un suelo con escalón; el andamio se monta nivel a nivel.",
    body,
  });
}

export const live = () => `
(() => {
const P = ${JSON.stringify(P)};
const N = ${STEPS.length};
const TEXT = ${JSON.stringify(STEPS.map((s) => s.text))};
const stage = document.getElementById("f2");
const svg = stage.querySelector("svg");
const groups = [...svg.querySelectorAll("[data-step]")].map((g) => ({ g, s: +g.dataset.step }));
const readout = stage.closest(".iso-plate").querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
let p = N - 1, target = N - 1, frame = 0, last = 0, clock = 0, touring = !still.matches, visible = false, idle = 0, drawn = null;
const ease = (t) => t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(1 - t, 3);
function tourAt(t) { t %= 12; return t < 1 ? 0 : t < 7 ? Math.min(N - 1, Math.floor(t - 1) + 0) : N - 1; }
function paint() {
  if (drawn !== p) {
    for (const { g, s } of groups) {
      const e = ease(p - s + 1);
      if (e <= 0) { g.style.display = "none"; continue; }
      g.style.display = "";
      g.setAttribute("opacity", e.toFixed(3));
      g.setAttribute("transform", e >= 1 ? "" : translateAlong(P, [0, 0, 80 * (1 - e)]));
    }
    drawn = p;
  }
  const i = Math.max(0, Math.min(N - 1, Math.round(p)));
  const text = TEXT[i];
  if (readout.textContent !== text) readout.textContent = text;
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60; last = now;
  if (touring) { clock += dt; target = tourAt(clock); }
  const calm = still.matches;
  if (calm) p = target; else { const dir = Math.sign(target - p); p += dir * Math.min(Math.abs(target - p), dt * (dir < 0 ? 4 : 1.4)); }
  paint();
  const settled = !touring && p === target;
  frame = visible && !settled ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const describe = () => { stage.setAttribute("aria-valuenow", String(target)); stage.setAttribute("aria-valuetext", TEXT[target]); };
const hold = () => { touring = false; clearTimeout(idle); idle = setTimeout(() => { touring = !still.matches; clock = 0; run(); }, 4200); run(); describe(); };
new IntersectionObserver((e) => { visible = e[e.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
stage.addEventListener("pointermove", (e) => {
  const b = svg.getBoundingClientRect();
  const share = Math.max(0, Math.min(1, ((e.clientX - b.left) / b.width - 0.15) / 0.7));
  target = Math.round(share * (N - 1)); hold();
});
stage.addEventListener("click", () => { target = target >= N - 1 ? 0 : target + 1; hold(); });
stage.addEventListener("keydown", (e) => {
  let t = null;
  if (e.key === "ArrowRight" || e.key === "ArrowUp") t = Math.min(N - 1, target + 1);
  if (e.key === "ArrowLeft" || e.key === "ArrowDown") t = Math.max(0, target - 1);
  if (e.key === "Home") t = 0; if (e.key === "End") t = N - 1;
  if (t === null) return; e.preventDefault(); target = t; hold();
});
paint();
})();
`;

export const NOTES = `<section class="sm-notes">
<h2>Cómo funciona el nudo</h2>
<ul>
<li><b>Poste (vertical):</b> tubo de acero galvanizado Ø48,3 mm con una roseta soldada cada 0,5 m. Se empalma con el siguiente por una espiga.</li>
<li><b>Roseta de 8 orificios:</b> 4 pequeños fijan horizontales a 90° exactos (se centran solos); 4 grandes dejan girar la pieza para ángulos que no son rectos y alojan las diagonales.</li>
<li><b>Cabezal + cuña:</b> el cabezal del horizontal abraza la roseta por arriba y por abajo; la cuña atraviesa el orificio y, al golpearla con el martillo, aprieta el cabezal contra el poste. Sin tornillos ni piezas sueltas.</li>
<li><b>Hasta 8 piezas por nudo</b>, en varias direcciones a la vez; por eso se llama multidireccional.</li>
</ul>
<h2>Ejemplo: mantenimiento de una fachada</h2>
<ul>
<li><b>Base:</b> placas y husillos regulables nivelan cada pie de forma independiente (en la figura, 5 cm en la acera y 35 cm en el escalón).</li>
<li><b>Estructura:</b> horizontales de 2,07 m a lo largo y travesaños de 0,73 m hacia el muro, cada 2 m de altura; diagonales verticales alternadas que rigidizan el plano exterior.</li>
<li><b>Trabajo:</b> plataformas de acero de 0,32 m sobre travesaños en U, rodapié y barandillas a 0,5 y 1,0 m.</li>
<li><b>A medida:</b> la cornisa queda en el hueco entre andamio y muro; arriba, ménsulas de 0,39 m acercan una plataforma extra para trabajar pegado a la fachada; anclajes al muro cada 4 m.</li>
</ul>
<h2>Adaptación a otros entornos</h2>
<ul>
<li><b>Fachadas curvas o con quiebros:</b> los orificios grandes permiten girar los horizontales y seguir el contorno.</li>
<li><b>Plantas industriales y tuberías:</b> las rosetas cada 0,5 m dan muchas alturas posibles para rodear equipos y pasar entre conductos.</li>
<li><b>Terreno irregular o escaleras:</b> husillos regulables y collarines de arranque nivelan cada pie.</li>
<li><b>Cimbras, torres y tribunas:</b> con las mismas piezas se arman estructuras de apoyo o escenarios; la capacidad depende de la configuración y debe salir de las tablas del fabricante (clase de carga EN 12811: p. ej. clase 4 = 3,0 kN/m², clase 6 = 6,0 kN/m²).</li>
</ul>
</section>`;
