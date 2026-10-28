// Fig 3 · Andamio SM8 en obra: excavación profunda, escalera de obra, apuntalamiento
// de losa y torre de servicio. Unidades: centímetros reales.
import * as k from "/Users/diegotapiadelgadillo/.claude/skills/anatomy/kit/iso-kit.mjs";
import * as G from "/Users/diegotapiadelgadillo/.claude/skills/anatomy/kit/lathe.mjs";
import { tubePieces, tubeSvg } from "/Users/diegotapiadelgadillo/.claude/skills/anatomy/kit/tube.mjs";

export const W = 600;
export const H = 600;

const RT = 2.415;            // Ø48,3 mm
const FLOOR = -425;          // fondo de la excavación
const PIT = { x: 0, y: 0, w: 560, d: 340 };
const BACK = { x: -120, y: -150, w: 780, d: 150, r: 0 };   // terreno detrás (y < 0)
const SIDE = { x: -120, y: 0, w: 120, d: 340, r: 0 };      // terreno a la izquierda (x < 0)
const SLAB = { x: 0, y: 0, w: 560, d: 340, r: 0 };         // solera del fondo
const DEEP = -470;

export const P = k.fitProjection(
  [...k.boxCorners(BACK, DEEP, 0), ...k.boxCorners(SIDE, DEEP, 0), ...k.boxCorners(SLAB, DEEP, FLOOR), [-115, 75, 520], [-8, 332, 520]],
  W,
  H,
  { pad: 18, azimuth: 52, elevation: 33 },
);

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const V = G.viewOf(P);
const depth = (p) => G.dot3(p, V);
const poly = (pts, close = true) => "M" + pts.map((p) => at(p).join(" ")).join(" L") + (close ? "Z" : "");

const items = [];
const put = (step, mid, svg, bias = 0) => items.push({ step, key: depth(mid) + bias, svg });

// ---------- piezas del sistema ----------
function bar(a, b, r, tone, rims = "all") {
  const d = G.sub3(b, a);
  return S(G.disc(0, G.len3(d), r, G.frameAlong(a, d), P, { rims, steps: 10 }), { tone, crease: "faint" });
}
function tube(step, a, b, r, tone = "mid", { pieces = 4, bias = 0, ends = [true, true] } = {}) {
  const len = G.len3(G.sub3(b, a));
  for (const piece of tubePieces([a, b], r, P, { maxLength: len / pieces + 0.01, caps: ends, spacing: Math.max(4, len / pieces / 3) })) put(step, piece.mid, tubeSvg(piece, { tone }), bias);
}
function wedgeHead(step, c, dir, tone = "mid") {
  const n = Math.hypot(dir[0], dir[1]);
  const ux = dir[0] / n, uy = dir[1] / n;
  const pt = (r, t) => [c[0] + ux * r - uy * t, c[1] + uy * r + ux * t];
  const svg = S(k.extrude([pt(2.7, -0.7), pt(9.6, -2.2), pt(9.6, 2.2), pt(2.7, 0.7)], c[2] - 3, 6.5, P), { tone, crease: "faint" }) +
    S(k.extrude([pt(4.2, -0.45), pt(5, -0.45), pt(5, 0.45), pt(4.2, 0.45)], c[2] + 3.5, 3.5, P), { tone: "hi" });
  put(step, [...pt(6, 0), c[2]], svg, 0.3);
}
function ledger(step, a, b, z, opts = {}) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const n = Math.hypot(dx, dy), ux = dx / n, uy = dy / n;
  wedgeHead(step, [a[0], a[1], z], [ux, uy]);
  wedgeHead(step, [b[0], b[1], z], [-ux, -uy]);
  tube(step, [a[0] + ux * 9.6, a[1] + uy * 9.6, z], [b[0] - ux * 9.6, b[1] - uy * 9.6, z], RT, "mid", { pieces: opts.pieces ?? Math.max(2, Math.round(n / 55)) });
}
function diagonal(step, a, za, b, zb) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const n = Math.hypot(dx, dy), ux = dx / n, uy = dy / n;
  // desplazada hacia fuera del plano para no cruzar los horizontales
  const ox = -uy * 1.5 * 0, oy = 0;
  wedgeHead(step, [a[0], a[1], za], [ux, uy]);
  wedgeHead(step, [b[0], b[1], zb], [-ux, -uy]);
  tube(step, [a[0] + ux * 9.6 + ox, a[1] + uy * 9.6 + oy, za + 2], [b[0] - ux * 9.6 + ox, b[1] - uy * 9.6 + oy, zb - 2], RT, "mid", { pieces: 6, bias: 1 });
}

// Pie completo: placa, husillo, tuerca, collarín con roseta y poste en tramos entre rosetas.
// `stepAt(z)` dice en qué paso aparece cada tramo.
function standard(x, y, g, top, stepAt, { jack = 25, uhead = false } = {}) {
  const nut = g + jack - 19;
  const ros0 = g + jack;
  put(stepAt(g), [x, y, g], `<path class="iso-halo" d="${k.haloOf({ x: x - 9, y: y - 9, w: 18, d: 18, r: 2 }, g, 1, P)}" style="filter:blur(3px)"/>` + S(k.slabOf({ x: x - 7.5, y: y - 7.5, w: 15, d: 15, r: 0.8 }, g, 0.8, P, 2), { tone: "mid" }) + D(k.corners({ x: x - 7.5, y: y - 7.5, w: 15, d: 15 }, 2).map(([a, b]) => at([a, b, g + 0.8])), { size: 0.35 }), -2);
  const threads = [];
  for (let z = g + 3; z < nut - 0.5; z += 2.2) threads.push(k.sideArc(x, y, 1.9, z, P, 10));
  put(stepAt(g), [x, y, (g + nut) / 2], S(k.cylinder(x, y, 1.9, g + 0.8, nut - g - 0.8, P, 14), { tone: "mid", crease: "none", inner: L(threads.join(""), { tone: "faint" }) }), -1);
  put(stepAt(g), [x, y, nut], S(k.cylinder(x, y, 4, nut, 3, P, 16), { tone: "mid" }) + S(k.slabOf({ x: x - 7, y: y - 0.8, w: 14, d: 1.6, r: 0.6 }, nut + 0.5, 2, P, 2), { tone: "mid" }), -0.5);
  put(stepAt(g), [x, y, (nut + 3 + ros0) / 2], bar([x, y, nut + 3], [x, y, ros0], 3, "mid", "first"));
  put(stepAt(g), [x, y, ros0 + 7], bar([x, y, ros0 + 0.9], [x, y, ros0 + 15], 3, "mid", "last"));
  const ros = [];
  for (let z = ros0; z <= top - 8; z += 50) ros.push(z);
  ros.forEach((z, i) => {
    const s = stepAt(z);
    put(s, [x, y, z], S(k.cylinder(x, y, 6.2, z, 0.9, P, 16), { tone: "hi", crease: "lo" }), 0.05);
    const next = i + 1 < ros.length ? ros[i + 1] : top;
    const a0 = z === ros0 ? ros0 + 15 : z + 0.9;
    const end = next === top;
    put(stepAt(Math.min(next, top - 1)), [x, y, (a0 + next) / 2], bar([x, y, a0], [x, y, next], RT, "mid", end && !uhead ? "last" : "none"));
    if (end && !uhead) put(stepAt(top - 1), [x, y, top], L(k.ring(x, y, RT - 0.5, top, P, 14), { tone: "lo" }), 0.1);
  });
  return ros;
}

// ---------- terreno, entibación y excavación (estático) ----------
function ground() {
  const out = [];
  const strata = [-90, -210, -330];
  // solera del fondo con hormigón de limpieza
  out.push(S(k.slabOf(SLAB, DEEP, FLOOR - DEEP, P, 2), { tone: "lo", inner: L(k.sideSeam(SLAB, FLOOR - 12, P, 2), { tone: "faint" }) }));
  for (let x = 60; x < SLAB.w; x += 60) out.push(L(k.lineOnTop([x, 0], [x, SLAB.d], FLOOR, P), { tone: "faint" }));
  // terreno al fondo y a la izquierda; estratos en las caras de corte, de canto a canto
  for (const blk of [BACK, SIDE]) {
    out.push(S(k.slabOf(blk, DEEP, -DEEP, P, 2), { tone: "lo", inner: L(strata.map((z) => k.sideSeam(blk, z, P, 2)).join(""), { tone: "faint" }) }));
  }
  // acera / explanada: juntas en la parte superior
  for (let x = BACK.x + 60; x < BACK.x + BACK.w; x += 60) out.push(L(k.lineOnTop([x, BACK.y], [x, 0], 0, P), { tone: "faint" }));
  for (let y = 60; y < SIDE.d; y += 60) out.push(L(k.lineOnTop([SIDE.x, y], [0, y], 0, P), { tone: "faint" }));
  // entibación: tablones horizontales en las dos caras de la excavación, de canto a canto
  for (let z = FLOOR + 30; z < 0; z += 30) {
    out.push(L(poly([[0, 0, z], [PIT.w, 0, z]], false), { tone: "faint" }));
    out.push(L(poly([[0, 0, z], [0, PIT.d, z]], false), { tone: "faint" }));
  }
  // fin del entibado en los bordes del corte
  out.push(L(poly([[PIT.w, 0, FLOOR], [PIT.w, 0, 0]], false), { tone: "lo" }));
  out.push(L(poly([[0, PIT.d, FLOOR], [0, PIT.d, 0]], false), { tone: "lo" }));
  // perfiles verticales (pilotes HEB) y vigas de reparto con cabezas de anclaje
  const piles = [];
  for (let x = 70; x < PIT.w; x += 140) piles.push(["x", x]);
  for (let y = 85; y < PIT.d; y += 140) piles.push(["y", y]);
  for (const [axis, v] of piles) {
    const plan = axis === "x" ? { x: v - 8, y: 0, w: 16, d: 3, r: 0 } : { x: 0, y: v - 8, w: 3, d: 16, r: 0 };
    out.push(S(k.slabOf(plan, FLOOR, -FLOOR, P, 2), { tone: "mid" }));
  }
  for (const z of [-130, -290]) {
    out.push(S(k.slabOf({ x: 3, y: 3, w: PIT.w - 3, d: 9, r: 0 }, z - 10, 20, P, 2, 0.4), { tone: "mid" }));
    out.push(S(k.slabOf({ x: 3, y: 12, w: 9, d: PIT.d - 12, r: 0 }, z - 10, 20, P, 2, 0.4), { tone: "mid" }));
    for (const [axis, v] of piles) {
      const c = axis === "x" ? [v, 12, z] : [12, v, z];
      const plate = axis === "x" ? { x: v - 7, y: 12, w: 14, d: 2, r: 0 } : { x: 12, y: v - 7, w: 2, d: 14, r: 0 };
      out.push(S(k.slabOf(plate, z - 7, 14, P, 2), { tone: "mid" }));
      out.push(S(G.disc(0, 4, 3, G.frameAlong(axis === "x" ? [c[0], 14, z] : [14, c[1], z], axis === "x" ? [0, 1, 0] : [1, 0, 0]), P, { steps: 14 }), { tone: "mid" }));
    }
  }
  // bordillo de coronación del muro
  out.push(S(k.slabOf({ x: 0, y: -12, w: PIT.w, d: 12, r: 0 }, 0, 6, P, 2, 0.4), { tone: "mid" }));
  out.push(S(k.slabOf({ x: -12, y: 0, w: 12, d: PIT.d, r: 0 }, 0, 6, P, 2, 0.4), { tone: "mid" }));
  return out.join("");
}

// ---------- 1 · escalera de obra ----------
const ST = { xs: [30, 287], ys: [25, 134] };
function stairTower() {
  const step = (z) => (z < FLOOR + 30 ? 0 : 1);
  for (const x of ST.xs) for (const y of ST.ys) standard(x, y, FLOOR, 110, step);
  for (const z of [-400, -200, 0]) {
    for (const y of ST.ys) ledger(1, [ST.xs[0], y], [ST.xs[1], y], z);
    for (const x of ST.xs) ledger(1, [x, ST.ys[0]], [x, ST.ys[1]], z, { pieces: 2 });
  }
  // barandillas en la salida y protección exterior
  for (const z of [50, 100]) {
    ledger(1, [ST.xs[0], ST.ys[1]], [ST.xs[1], ST.ys[1]], z);
    for (const x of ST.xs) ledger(1, [x, ST.ys[0]], [x, ST.ys[1]], z, { pieces: 2 });
  }
  diagonal(1, [ST.xs[0], ST.ys[1]], -400, [ST.xs[1], ST.ys[1]], -200);
  // tramos de escalera: 8 peldaños de 25 cm por cada 2 m
  const flight = (z0, x0, x1, y0, y1) => {
    const n = 8, run = (x1 - x0) / n;
    for (let i = 0; i < n; i++) {
      const tx = x0 + run * (i + 0.5);
      const plan = { x: Math.min(tx - run / 2, tx + run / 2) + 1, y: y0 + 3, w: Math.abs(run) - 2, d: y1 - y0 - 6, r: 0.4 };
      const z = z0 + 25 * (i + 1) - 3;
      const holes = [];
      for (let y = plan.y + 4; y < plan.y + plan.d - 2; y += 6) holes.push(at([plan.x + plan.w / 2, y, z + 3]));
      put(1, [tx, (y0 + y1) / 2, z], S(k.slabOf(plan, z, 3, P, 2, 0.3), { tone: "hi", crease: "lo" }) + D(holes, { size: 0.28, tone: "lo" }), 0.5);
    }
    for (const y of [y0 + 1.5, y1 - 1.5]) tube(1, [x0, y, z0 + 4], [x1, y, z0 + 200 - 4], 2, "mid", { pieces: 5 });
    tube(1, [x0, y1 - 1, z0 + 100], [x1, y1 - 1, z0 + 300], 1.6, "mid", { pieces: 5, bias: 2 });
  };
  flight(-400, 60, 257, 25, 79);
  flight(-200, 257, 60, 80, 134);
  // rellanos: giro abajo, salida arriba con pasarela hasta la rasante
  const deck = (plan, z, s = 1) => {
    const holes = [];
    for (let x = plan.x + 6; x < plan.x + plan.w - 3; x += 8) for (let y = plan.y + 5; y < plan.y + plan.d - 3; y += 7) holes.push(at([x, y, z + 6]));
    put(s, [plan.x + plan.w / 2, plan.y + plan.d / 2, z + 4], S(k.slabOf(plan, z + 2.4, 3.6, P, 2, 0.4), { tone: "hi", crease: "lo" }) + D(holes, { size: 0.28, tone: "lo" }), 4);
  };
  deck({ x: 259, y: 28, w: 25, d: 103, r: 0.5 }, -200);
  deck({ x: 33, y: 28, w: 251, d: 49, r: 0.5 }, 0);
  deck({ x: 33, y: 80, w: 25, d: 51, r: 0.5 }, 0);
  deck({ x: 60, y: -10, w: 200, d: 33, r: 0.5 }, -3);
}

// ---------- 2-3 · apuntalamiento y encofrado de losa ----------
const SH = { xs: [330, 439, 548], ys: [50, 207] };
const SH_TOP = -90;
function shoring() {
  const step = (z) => (z < FLOOR + 30 ? 0 : 2);
  for (const x of SH.xs) for (const y of SH.ys) standard(x, y, FLOOR, SH_TOP, step, { uhead: true });
  for (const z of [-400, -250, -100]) {
    for (const y of SH.ys) for (let i = 0; i < 2; i++) ledger(2, [SH.xs[i], y], [SH.xs[i + 1], y], z, { pieces: 2 });
    for (const x of SH.xs) ledger(2, [x, SH.ys[0]], [x, SH.ys[1]], z, { pieces: 3 });
  }
  diagonal(2, [SH.xs[0], SH.ys[1]], -400, [SH.xs[1], SH.ys[1]], -250);
  diagonal(2, [SH.xs[2], SH.ys[1]], -250, [SH.xs[1], SH.ys[1]], -100);
  diagonal(2, [SH.xs[2], SH.ys[0]], -400, [SH.xs[2], SH.ys[1]], -250);
  // husillo superior con cabezal en U (paso 3)
  const UH = -65;
  for (const x of SH.xs) for (const y of SH.ys) {
    const threads = [];
    for (let z = SH_TOP + 3; z < UH - 4; z += 2.2) threads.push(k.sideArc(x, y, 1.9, z, P, 10));
    put(3, [x, y, (SH_TOP + UH) / 2], S(k.cylinder(x, y, 1.9, SH_TOP - 4, UH - SH_TOP + 4, P, 14), { tone: "mid", crease: "none", inner: L(threads.join(""), { tone: "faint" }) }), 0.2);
    put(3, [x, y, SH_TOP + 6], S(k.cylinder(x, y, 4, SH_TOP + 5, 3, P, 16), { tone: "mid" }) + S(k.slabOf({ x: x - 7, y: y - 0.8, w: 14, d: 1.6, r: 0.6 }, SH_TOP + 5.5, 2, P, 2), { tone: "mid" }), 0.3);
    put(3, [x, y, UH], S(k.slabOf({ x: x - 8, y: y - 9, w: 16, d: 18, r: 0.4 }, UH, 1, P, 2), { tone: "mid" }) +
      S(k.slabOf({ x: x - 8, y: y - 9, w: 16, d: 1.2, r: 0 }, UH + 1, 12, P, 2), { tone: "mid" }), 0.2);
  }
  // vigas primarias (madera H20) a lo largo de y, sobre los cabezales
  const PRI = { z: -64, h: 20 };
  for (const x of SH.xs) {
    const plan = { x: x - 4, y: 20, w: 8, d: 240, r: 0 };
    put(3, [x, 140, PRI.z + 10], S(k.slabOf(plan, PRI.z, PRI.h, P, 2, 0.3), { tone: "mid", inner: L(k.sideSeam(plan, PRI.z + 4, P, 2) + k.sideSeam(plan, PRI.z + PRI.h - 4, P, 2), { tone: "faint" }) }), 2);
  }
  // vigas secundarias a lo largo de x, cada 50 cm
  const SEC = { z: PRI.z + PRI.h, h: 16 };
  for (let y = 30; y <= 250; y += 50) {
    const plan = { x: 305, y: y - 4, w: 255, d: 8, r: 0 };
    put(3, [432, y, SEC.z + 8], S(k.slabOf(plan, SEC.z, SEC.h, P, 2, 0.3), { tone: "mid", inner: L(k.sideSeam(plan, SEC.z + 3.5, P, 2), { tone: "faint" }) }), 3);
  }
  // tablero fenólico, colocado solo en parte (la obra en curso), con juntas
  const TOP = SEC.z + SEC.h;
  for (const [y0, y1] of [[130, 200], [200, 255]]) {
    const plan = { x: 305, y: y0, w: 255, d: y1 - y0, r: 0 };
    const joints = [];
    for (let x = 305 + 62.5; x < 560; x += 62.5) joints.push(k.lineOnTop([x, y0], [x, y1], TOP + 2, P));
    put(3, [432, (y0 + y1) / 2, TOP + 1], S(k.slabOf(plan, TOP, 2, P, 2), { tone: "hi", crease: "lo" }) + L(joints.join(""), { tone: "faint" }), 6);
  }
}

// ---------- 4 · torre de servicio con polea sobre la excavación ----------
const SV = { xs: [-115, -8], ys: [75, 332] };
function serviceTower() {
  const step = (z) => (z < 30 ? 0 : 4);
  for (const x of SV.xs) for (const y of SV.ys) standard(x, y, 0, 510, step);
  for (const z of [25, 225, 425, 475]) {
    for (const y of SV.ys) ledger(4, [SV.xs[0], y], [SV.xs[1], y], z, { pieces: 2 });
    for (const x of SV.xs) if (z !== 475 || x === SV.xs[1] || true) ledger(4, [x, SV.ys[0]], [x, SV.ys[1]], z);
  }
  diagonal(4, [SV.xs[1], SV.ys[0]], 25, [SV.xs[1], SV.ys[1]], 225);
  diagonal(4, [SV.xs[1], SV.ys[1]], 225, [SV.xs[1], SV.ys[0]], 425);
  diagonal(4, [SV.xs[0], SV.ys[1]], 25, [SV.xs[1], SV.ys[1]], 225);
  // plataforma de trabajo arriba (dos planchas de 0,32 m a lo largo)
  for (const [x0, x1] of [[SV.xs[0] + 3, SV.xs[0] + 52], [SV.xs[0] + 55, SV.xs[1] - 3]]) {
    const plan = { x: x0, y: SV.ys[0] + 4, w: x1 - x0, d: SV.ys[1] - SV.ys[0] - 8, r: 0.5 };
    const holes = [];
    for (let x = plan.x + 5; x < plan.x + plan.w - 3; x += 7) for (let y = plan.y + 8; y < plan.y + plan.d - 4; y += 8) holes.push(at([x, y, 431]));
    put(4, [(x0 + x1) / 2, plan.y + plan.d / 2, 429], S(k.slabOf(plan, 427.4, 3.6, P, 2, 0.4), { tone: "hi", crease: "lo" }) + D(holes, { size: 0.28, tone: "lo" }), 4);
  }
  // ménsula con polea que vuela sobre la excavación
  const py = SV.ys[1], tip = 62;
  const beam = { x: SV.xs[1] + 6, y: py - 5, w: tip - SV.xs[1] - 6 + 8, d: 10, r: 0.5 };
  put(4, [(SV.xs[1] + tip) / 2, py, 437], S(k.slabOf(beam, 430, 14, P, 2, 0.4), { tone: "mid", inner: L(k.sideSeam(beam, 437, P, 2), { tone: "faint" }) }), 3);
  tube(4, [SV.xs[1] + 4, py, 330], [tip - 12, py, 428], 2, "mid", { pieces: 3 });
  put(4, [SV.xs[1] + 4, py, 330], S(k.slabOf({ x: SV.xs[1] + 2, y: py - 5, w: 6, d: 10, r: 0.5 }, 324, 12, P, 2), { tone: "mid" }), 0.5);
  // polea (garrucha) colgada de la punta
  const pc = [tip - 2, py, 416];
  put(4, pc, S(k.slabOf({ x: tip - 6, y: py - 4, w: 8, d: 8, r: 0.5 }, 424, 6, P, 2), { tone: "mid" }) +
    S(G.disc(-2.5, 2.5, 11, G.frameAlong(pc, [0, 1, 0]), P, { steps: 28 }), { tone: "hi", crease: "lo" }) +
    D([at(G.add3(pc, [0, 2.6, 0]))], { size: 0.5 }), 4);
  // cuerda y cubo dentro de la excavación: la línea iluminada es lo que la torre sirve
  const rx = tip + 9, bz = -170;
  const F = G.frameAlong([rx, py, bz - 28], [0, 0, 1]);
  put(4, [rx, py, 120], `<path class="iso-line" data-tone="lit" d="${poly([[rx, py, 416], [rx, py, bz + 22]], false)}" style="stroke-width:0.9"/>`, 8);
  put(4, [rx, py, bz - 10], S(G.disc(0, 28, 14, F, P, { steps: 28 }), { tone: "hi", crease: "lo", inner: L(G.arcOf(F, 20, 14.2, P), { tone: "faint" }) }) +
    L(G.circleOf(F, 28, 12, P), { tone: "lo" }) +
    `<path class="iso-line" data-tone="lit" d="${poly([[rx - 13, py, bz + 2], [rx, py, bz + 22], [rx + 13, py, bz + 2]], false)}" style="stroke-width:0.9"/>` +
    D([at([rx - 13, py, bz + 2]), at([rx + 13, py, bz + 2]), at([rx, py, bz + 22])], { size: 0.5 }), 9);
}

// ---------- barandilla perimetral de la excavación (paso 4) ----------
function edgeRail() {
  const posts = [];
  for (const x of [330, 587]) posts.push([x, -6]);
  for (const [x, y] of posts) {
    put(4, [x, y, 3], S(k.slabOf({ x: x - 7.5, y: y - 5, w: 15, d: 10, r: 0.6 }, 6, 1.2, P, 2), { tone: "mid" }), -1);
    put(4, [x, y, 60], bar([x, y, 7.2], [x, y, 110], RT, "mid", "last"), 0);
    for (const z of [57, 107]) put(4, [x, y, z], S(k.cylinder(x, y, 6.2, z, 0.9, P, 16), { tone: "hi", crease: "lo" }), 0.05);
  }
  for (let i = 0; i + 1 < posts.length; i++) for (const z of [57, 107]) ledger(4, posts[i], posts[i + 1], z);
}

stairTower();
shoring();
serviceTower();
edgeRail();

export const STEPS = [
  { text: "excavación de 4,25 m · husillos sobre el fondo" },
  { text: "escalera de obra · tramos de 2 m hasta la rasante" },
  { text: "apuntalamiento · torres de 1,09 × 1,57 m" },
  { text: "encofrado · cabezal en U, vigas y tablero" },
  { text: "servicio · torre de 5 m con polea al fondo" },
];

export const CAPTION =
  "Obra con excavación de 4,25 m entibada con perfiles y anclajes. Con las mismas piezas SM8 se monta una escalera de obra de 2,57 × 1,09 m con tramos de 2 m, torres de apuntalamiento con husillos y cabezal en U que sostienen el encofrado de una losa, y una torre de servicio de 5 m sobre la rasante con una polea que baja material al fondo.";

export const ARIA =
  "Excavación profunda vista en corte, con muros entibados. Dentro, una escalera de obra de andamio multidireccional sube del fondo a la rasante y unas torres de apuntalamiento sostienen el encofrado de una losa. En el borde, una torre de servicio con barandillas lleva una polea de la que cuelga un cubo dentro de la excavación.";

export function figure() {
  items.sort((a, b) => a.key - b.key);
  const body = [ground()];
  let run = null, buf = [];
  const flush = () => { if (buf.length) body.push(`<g data-step="${run}">${buf.join("")}</g>`); buf = []; };
  for (const it of items) { if (it.step !== run) { flush(); run = it.step; } buf.push(it.svg); }
  flush();
  return k.figureSvg({ width: W, height: H, label: ARIA, body });
}
