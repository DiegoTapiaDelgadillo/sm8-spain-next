// Fig 4 · Andamio SM8 en industria: anillo circular alrededor de un tanque,
// torre de acceso con escalera y puente. Unidades: centímetros reales.
import * as k from "/Users/diegotapiadelgadillo/.claude/skills/anatomy/kit/iso-kit.mjs";
import * as G from "/Users/diegotapiadelgadillo/.claude/skills/anatomy/kit/lathe.mjs";
import { tubePieces, tubeSvg } from "/Users/diegotapiadelgadillo/.claude/skills/anatomy/kit/tube.mjs";

export const W = 600;
export const H = 600;

const RT = 2.415;                      // Ø48,3 mm
const TANK_R = 273;                    // tanque Ø5,46 m
const TANK_H = 500;
const BAY = 30;                        // 12 vanos de 30° por vuelta
const R_OUT = 207 / (2 * Math.sin((BAY / 2) * Math.PI / 180));   // horizontal exterior 2,07 m → R 4,00 m
const R_IN = 157 / (2 * Math.sin((BAY / 2) * Math.PI / 180));    // horizontal interior 1,57 m → R 3,03 m
const AZ = 50;
const GAP_CENTRE = AZ + 180;           // el hueco del anillo queda detrás del tanque
const ANGLES = Array.from({ length: 10 }, (_, i) => GAP_CENTRE + 45 + BAY * i);   // 10 postes por anillo, 9 vanos = 270°
const LIFTS = [25, 225, 425];
const PAD = { x: -440, y: -540, w: 1050, d: 960, r: 0 };

const rad = (d) => (d * Math.PI) / 180;
const polar = (r, deg) => [r * Math.cos(rad(deg)), r * Math.sin(rad(deg))];

// torre de acceso y puente, alineados con el vano entre los postes de 305° y 335°
const BRIDGE_DEG = 320;
const U = [Math.cos(rad(BRIDGE_DEG)), Math.sin(rad(BRIDGE_DEG))];
const T = [-U[1], U[0]];
const radial = (s, t) => [U[0] * s + T[0] * t, U[1] * s + T[1] * t];
const S0 = R_OUT * Math.cos(rad(BAY / 2));      // 386,4: cuerda exterior del anillo
const S1 = S0 + 257;                            // puente de 2,57 m
const S2 = S1 + 109;                            // torre de 1,09 m de fondo

export const P = k.fitProjection(
  [...k.boxCorners(PAD, -30, 0), [0, 0, 600], [...radial(S2, 103.5), 540], [...radial(S2, -103.5), 540], [...polar(R_OUT, AZ + 90), 540], [...polar(R_OUT, AZ - 90), 540]],
  W,
  H,
  { pad: 10, azimuth: AZ, elevation: 38 },
);

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const V = G.viewOf(P);
const VIEW = [Math.cos(rad(AZ)), Math.sin(rad(AZ))];
const depth = (p) => G.dot3(p, V);
const poly = (pts, close = true) => "M" + pts.map((p) => at(p).join(" ")).join(" L") + (close ? "Z" : "");

// Orden: lo que está detrás del tanque, el tanque, lo que está delante.
const items = [];
const side = (p) => (Math.hypot(p[0], p[1]) < TANK_R + 400 && p[0] * VIEW[0] + p[1] * VIEW[1] < 0 ? -1 : 1);
const put = (step, mid, svg, bias = 0) => items.push({ step, key: depth(mid) + bias, layer: side(mid), svg });

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
  const svg = S(k.extrude([pt(2.7, -0.7), pt(9.6, -2.2), pt(9.6, 2.2), pt(2.7, 0.7)], c[2] - 3, 6.5, P), { tone, crease: "faint" });
  put(step, [...pt(6, 0), c[2]], svg, 0.3);
}
function ledger(step, a, b, z, opts = {}) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const n = Math.hypot(dx, dy), ux = dx / n, uy = dy / n;
  wedgeHead(step, [a[0], a[1], z], [ux, uy]);
  wedgeHead(step, [b[0], b[1], z], [-ux, -uy]);
  tube(step, [a[0] + ux * 9.6, a[1] + uy * 9.6, z], [b[0] - ux * 9.6, b[1] - uy * 9.6, z], RT, "mid", { pieces: opts.pieces ?? Math.max(2, Math.round(n / 80)) });
}
function diagonal(step, a, za, b, zb) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const n = Math.hypot(dx, dy), ux = dx / n, uy = dy / n;
  wedgeHead(step, [a[0], a[1], za], [ux, uy]);
  wedgeHead(step, [b[0], b[1], zb], [-ux, -uy]);
  tube(step, [a[0] + ux * 9.6, a[1] + uy * 9.6, za + 2], [b[0] - ux * 9.6, b[1] - uy * 9.6, zb - 2], RT, "mid", { pieces: 6, bias: 1 });
}
function standard(x, y, g, top, stepAt, { jack = 25 } = {}) {
  const nut = g + jack - 19, ros0 = g + jack;
  put(stepAt(g), [x, y, g], `<path class="iso-halo" d="${k.haloOf({ x: x - 9, y: y - 9, w: 18, d: 18, r: 2 }, g, 1, P)}" style="filter:blur(3px)"/>` + S(k.slabOf({ x: x - 7.5, y: y - 7.5, w: 15, d: 15, r: 0.8 }, g, 0.8, P, 2), { tone: "mid" }) + D(k.corners({ x: x - 7.5, y: y - 7.5, w: 15, d: 15 }, 2).map(([a, b]) => at([a, b, g + 0.8])), { size: 0.35 }), -2);
  const threads = [];
  for (let z = g + 3; z < nut - 0.5; z += 2.2) threads.push(k.sideArc(x, y, 1.9, z, P, 10));
  put(stepAt(g), [x, y, (g + nut) / 2], S(k.cylinder(x, y, 1.9, g + 0.8, nut - g - 0.8, P, 14), { tone: "mid", crease: "none", inner: L(threads.join(""), { tone: "faint" }) }), -1);
  put(stepAt(g), [x, y, nut], S(k.cylinder(x, y, 4, nut, 3, P, 16), { tone: "mid" }), -0.5);
  put(stepAt(g), [x, y, (nut + 3 + ros0) / 2], bar([x, y, nut + 3], [x, y, ros0], 3, "mid", "first"));
  put(stepAt(g), [x, y, ros0 + 7], bar([x, y, ros0 + 0.9], [x, y, ros0 + 15], 3, "mid", "last"));
  const ros = [];
  for (let z = ros0; z <= top - 8; z += 50) ros.push(z);
  ros.forEach((z, i) => {
    put(stepAt(z), [x, y, z], S(k.cylinder(x, y, 6.2, z, 0.9, P, 12), { tone: "hi", crease: "lo" }), 0.05);
    const next = i + 1 < ros.length ? ros[i + 1] : top;
    const a0 = z === ros0 ? ros0 + 15 : z + 0.9;
    const end = next === top;
    put(stepAt(Math.min(next, top - 1)), [x, y, (a0 + next) / 2], bar([x, y, a0], [x, y, next], RT, "mid", end ? "last" : "none"));
    if (end) put(stepAt(top - 1), [x, y, top], L(k.ring(x, y, RT - 0.5, top, P, 14), { tone: "lo" }), 0.1);
  });
}
function deck(step, ring, z, bias = 4) {
  // plataforma de acero perforada sobre cualquier contorno (trapecios del anillo)
  const cx = ring.reduce((s, p) => s + p[0], 0) / ring.length, cy = ring.reduce((s, p) => s + p[1], 0) / ring.length;
  const holes = [];
  const [a, b, c, d] = ring;
  for (let i = 1; i < 8; i++) for (let j = 1; j < 5; j++) {
    const u = i / 8, v = j / 5;
    const p0 = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
    const p1 = [d[0] + (c[0] - d[0]) * u, d[1] + (c[1] - d[1]) * u];
    holes.push(at([p0[0] + (p1[0] - p0[0]) * v, p0[1] + (p1[1] - p0[1]) * v, z + 6]));
  }
  put(step, [cx, cy, z + 4], S(k.extrude(ring, z + 2.4, 3.6, P, { bevel: 0.4 }), { tone: "hi", crease: "lo" }) + D(holes, { size: 0.28, tone: "lo" }), bias);
}

// ---------- suelo y tanque (estático) ----------
function groundSvg() {
  const out = [];
  out.push(S(k.slabOf(PAD, -30, 30, P, 2), { tone: "lo" }));
  for (let x = PAD.x + 100; x < PAD.x + PAD.w; x += 100) out.push(L(k.lineOnTop([x, PAD.y], [x, PAD.y + PAD.d], 0, P), { tone: "faint" }));
  for (let y = PAD.y + 100; y < PAD.y + PAD.d; y += 100) out.push(L(k.lineOnTop([PAD.x, y], [PAD.x + PAD.w, y], 0, P), { tone: "faint" }));
  return out.join("");
}
function tankSvg() {
  const out = [];
  out.push(`<path class="iso-halo" d="${k.onTop(Array.from({ length: 64 }, (_, i) => polar(TANK_R + 30, (360 * i) / 64)), 0, P, true)}"/>`);
  // anillo de cimentación
  out.push(S(k.cylinder(0, 0, TANK_R + 22, 0, 18, P, 96, 1), { tone: "mid" }));
  // envolvente en virolas de 1,25 m, con soldaduras
  const seams = [125, 250, 375].map((z) => k.sideArc(0, 0, TANK_R, z, P, 96)).join("");
  out.push(S(k.cylinder(0, 0, TANK_R, 18, TANK_H - 18, P, 120), { tone: "mid", crease: "none", inner: L(seams, { tone: "faint" }) }));
  // angular de coronación y techo cónico con boca de hombre y venteo
  out.push(S(k.cylinder(0, 0, TANK_R + 4, TANK_H, 6, P, 120, 0.6), { tone: "mid" }));
  const F = G.frameAlong([0, 0, TANK_H + 6], [0, 0, 1]);
  out.push(S(G.solidOf([[0, TANK_R], [58, 22], [62, 22], [62, 0]], F, P, { steps: 120 }), { tone: "hi", crease: "lo" }));
  out.push(S(k.cylinder(0, 0, 14, TANK_H + 66, 22, P, 32, 0.5), { tone: "mid" }));
  out.push(S(k.cylinder(0, 0, 20, TANK_H + 88, 4, P, 32, 0.5), { tone: "mid" }));
  const mh = polar(150, AZ + 25);
  out.push(S(k.cylinder(mh[0], mh[1], 24, TANK_H + 34, 14, P, 40, 0.5), { tone: "mid" }));
  out.push(D(G.dotsOf(G.frameAlong([mh[0], mh[1], TANK_H + 48], [0, 0, 1]), 0, 20, 12, P, { all: true }), { size: 0.4 }));
  // tubuladuras con brida en la envolvente (lado visible)
  for (const [deg, z, r] of [[AZ + 20, 70, 16], [AZ - 12, 320, 11]]) {
    const u = [Math.cos(rad(deg)), Math.sin(rad(deg)), 0];
    const Fz = G.frameAlong([u[0] * (TANK_R - 4), u[1] * (TANK_R - 4), z], u);
    out.push(S(G.disc(0, 18, r, Fz, P, { steps: 32 }), { tone: "mid" }));
    out.push(S(G.disc(18, 24, r + 9, Fz, P, { steps: 40 }), { tone: "mid" }));
    out.push(D(G.dotsOf(Fz, 24, r + 5, 8, P, { all: true }), { size: 0.4 }));
  }
  // placa de características
  const np = AZ - 30;
  const u = [Math.cos(rad(np)), Math.sin(rad(np)), 0];
  const Fp = G.frameAlong([u[0] * TANK_R, u[1] * TANK_R, 150], u);
  out.push(S(G.prismOf(Fp, [[-12, -18], [12, -18], [12, 18], [-12, 18]], 0, 1.2, P), { tone: "mid" }));
  return out.join("");
}

// ---------- 0-2 · andamio circular ----------
function ring() {
  const step = (z) => (z < 30 ? 0 : z <= 225 ? 1 : 2);
  for (const deg of ANGLES) for (const r of [R_IN, R_OUT]) standard(...polar(r, deg), 0, 535, step);
  LIFTS.forEach((z, li) => {
    const s = li === 0 ? 0 : li;
    for (let i = 0; i + 1 < ANGLES.length; i++) {
      // horizontales en cuerda: 2,07 m fuera y 1,57 m dentro, girados 15° en los orificios grandes
      ledger(s, polar(R_OUT, ANGLES[i]), polar(R_OUT, ANGLES[i + 1]), z);
      ledger(s, polar(R_IN, ANGLES[i]), polar(R_IN, ANGLES[i + 1]), z, { pieces: 3 });
    }
    for (const deg of ANGLES) ledger(s, polar(R_IN, deg), polar(R_OUT, deg), z, { pieces: 2 });
  });
  // diagonales exteriores alternas
  ANGLES.slice(0, -1).forEach((deg, i) => {
    if (i % 2) return;
    const a = polar(R_OUT, deg), b = polar(R_OUT, ANGLES[i + 1]);
    diagonal(1, a, 25, b, 225);
    diagonal(2, b, 225, a, 425);
  });
  // plataformas trapezoidales en 2,25 y 4,25 m, y barandilla exterior arriba
  for (const [z, s] of [[225, 2], [425, 2]]) {
    for (let i = 0; i + 1 < ANGLES.length; i++) {
      const a0 = ANGLES[i] + 1.6, a1 = ANGLES[i + 1] - 1.6;
      deck(s, [polar(R_IN + 4, a0), polar(R_OUT - 4, a0), polar(R_OUT - 4, a1), polar(R_IN + 4, a1)], z);
    }
  }
  for (const z of [475, 525]) for (let i = 0; i + 1 < ANGLES.length; i++) ledger(2, polar(R_OUT, ANGLES[i]), polar(R_OUT, ANGLES[i + 1]), z);
  for (const z of [475, 525]) for (const deg of [ANGLES[0], ANGLES[ANGLES.length - 1]]) ledger(2, polar(R_IN, deg), polar(R_OUT, deg), z, { pieces: 2 });
  // rodapié exterior en el nivel superior
  for (let i = 0; i + 1 < ANGLES.length; i++) {
    const a = polar(R_OUT - 3, ANGLES[i] + 1.6), b = polar(R_OUT - 3, ANGLES[i + 1] - 1.6);
    const n = [b[1] - a[1], a[0] - b[0]], m = Math.hypot(...n);
    const o = [(n[0] / m) * 1.2, (n[1] / m) * 1.2];
    put(2, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 437], S(k.extrude([[a[0] - o[0], a[1] - o[1]], [b[0] - o[0], b[1] - o[1]], [b[0] + o[0], b[1] + o[1]], [a[0] + o[0], a[1] + o[1]]], 431, 15, P), { tone: "mid" }), 6);
  }
}

// ---------- 3 · torre de acceso con escalera ----------
const TW = [radial(S1, -103.5), radial(S1, 103.5), radial(S2, -103.5), radial(S2, 103.5)];
function tower() {
  const step = (z) => (z < 30 ? 0 : 3);
  for (const p of TW) standard(...p, 0, 535, step);
  for (const z of [25, 225, 425]) {
    ledger(3, TW[0], TW[1], z); ledger(3, TW[2], TW[3], z);
    ledger(3, TW[0], TW[2], z, { pieces: 2 }); ledger(3, TW[1], TW[3], z, { pieces: 2 });
  }
  for (const z of [475, 525]) { ledger(3, TW[2], TW[3], z); ledger(3, TW[1], TW[3], z, { pieces: 2 }); ledger(3, TW[0], TW[2], z, { pieces: 2 }); }
  diagonal(3, TW[3], 25, TW[2], 225);
  // tramos de escalera en las dos mitades del fondo de la torre
  const flight = (z0, sA, sB, t0, t1) => {
    const n = 8;
    for (let i = 0; i < n; i++) {
      const tA = t0 + ((t1 - t0) * i) / n + 1, tB = t0 + ((t1 - t0) * (i + 1)) / n - 1;
      const z = z0 + 25 * (i + 1) - 3;
      const ringT = [radial(sA + 3, tA), radial(sB - 3, tA), radial(sB - 3, tB), radial(sA + 3, tB)];
      put(3, [...radial((sA + sB) / 2, (tA + tB) / 2), z], S(k.extrude(ringT, z, 3, P, { bevel: 0.3 }), { tone: "hi", crease: "lo" }), 0.5);
    }
    for (const s of [sA + 1.5, sB - 1.5]) tube(3, [...radial(s, t0), z0 + 4], [...radial(s, t1), z0 + 196], 2, "mid", { pieces: 5 });
    tube(3, [...radial(sB - 1, t0), z0 + 100], [...radial(sB - 1, t1), z0 + 296], 1.6, "mid", { pieces: 5, bias: 2 });
  };
  flight(25, S1 + 55, S2, -80, 80);
  flight(225, S1, S1 + 54, 80, -80);
  // rellanos
  deck(3, [radial(S1 + 55, 83), radial(S2 - 3, 83), radial(S2 - 3, 100), radial(S1 + 55, 100)], 225);
  deck(3, [radial(S1 + 3, -100), radial(S2 - 3, -100), radial(S2 - 3, -83), radial(S1 + 3, -83)], 425);
  deck(3, [radial(S1 + 57, -83), radial(S2 - 3, -83), radial(S2 - 3, 100), radial(S1 + 57, 100)], 425);
}

// ---------- 4 · puente de acceso ----------
function bridge() {
  const RB = [radial(S0, -103.5), radial(S0, 103.5)];
  // dos vigas de celosía: cordón superior e inferior + diagonales, todo con piezas SM8
  for (let i = 0; i < 2; i++) {
    for (const z of [225, 425]) ledger(4, RB[i], TW[i], z, { pieces: 4 });
    diagonal(4, RB[i], 225, TW[i], 425);
  }
  for (const z of [475, 525]) for (let i = 0; i < 2; i++) ledger(4, RB[i], TW[i], z, { pieces: 4 });
  // travesaños y plataforma del puente
  ledger(4, RB[0], RB[1], 425);
  for (const [t0, t1] of [[-100, -1.5], [1.5, 100]]) deck(4, [radial(S0 + 4, t0), radial(S1 - 4, t0), radial(S1 - 4, t1), radial(S0 + 4, t1)], 425, 5);
}

ring();
tower();
bridge();

export const STEPS = [
  { text: "tanque Ø5,5 m · 20 bases en dos anillos" },
  { text: "anillo · 9 vanos de 30°: 2,07 m fuera, 1,57 m dentro" },
  { text: "plataformas a 2,25 y 4,25 m · barandilla curva" },
  { text: "torre de acceso · escalera en dos tramos" },
  { text: "puente de 2,57 m · de la torre al anillo" },
];

export const CAPTION =
  "Tanque industrial de Ø5,46 m rodeado por un andamio circular SM8 de tres cuartos de vuelta: 9 vanos de 30° con horizontales de 2,07 m en el anillo exterior (R 4,00 m) y de 1,57 m en el interior (R 3,03 m), girados en los orificios grandes de la roseta. Plataformas trapezoidales a 2,25 y 4,25 m, una torre de acceso con escalera y un puente de celosía de 2,57 m armado con horizontales y diagonales del mismo sistema.";

export const ARIA =
  "Tanque industrial cilíndrico con techo cónico, rodeado por un andamio multidireccional circular de dos anillos de postes con plataformas curvas y barandillas. A un lado, una torre de acceso con escalera se une al anillo por un puente de celosía.";

export function figure() {
  items.sort((a, b) => a.layer - b.layer || a.key - b.key);
  const body = [groundSvg()];
  let run = null, buf = [], tankDone = false;
  const flush = () => { if (buf.length) body.push(`<g data-step="${run}">${buf.join("")}</g>`); buf = []; };
  for (const it of items) {
    if (!tankDone && it.layer > 0) { flush(); run = null; body.push(tankSvg()); tankDone = true; }
    if (it.step !== run) { flush(); run = it.step; }
    buf.push(it.svg);
  }
  flush();
  if (!tankDone) body.push(tankSvg());
  return k.figureSvg({ width: W, height: H, label: ARIA, body });
}
