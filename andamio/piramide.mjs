// Andamio exento escalonado (pirámide) con el sistema multidireccional SM8.
// Unidades: centímetros reales. x a lo largo, y en fondo, z arriba.
import * as k from "/Users/diegotapiadelgadillo/.claude/skills/anatomy/kit/iso-kit.mjs";
import * as G from "/Users/diegotapiadelgadillo/.claude/skills/anatomy/kit/lathe.mjs";
import { tubePieces, tubeSvg } from "/Users/diegotapiadelgadillo/.claude/skills/anatomy/kit/tube.mjs";

export const W = 1600;

// ---------- modelo ----------
const RT = 2.415;                         // poste y horizontal Ø48,3 mm
const BAY = +(process.env.BAY ?? 207);                          // vano de 2,07 m
const DEEP = +(process.env.DEEP ?? 207);                         // fondo de 2,07 m (torres cuadradas)
export const LEVELS = [1, 2, 3, 4, 3, 2, 1]; // plataformas por vano: 2-4-6-8-6-4-2 m
const NB = LEVELS.length;
const XS = Array.from({ length: NB + 1 }, (_, i) => i * BAY);
const YS = [0, DEEP];
const Z0 = 25;                            // primera roseta (collarín de arranque)
const LIFT = 200;                         // niveles cada 2 m
const deckZ = (s) => Z0 + LIFT * s;       // altura de la plataforma del nivel s
const NUT = 6;                            // altura de la tuerca del husillo
const STAIR = 3;                          // vano central: escalera con trampilla
const levelOf = (i) => (i < 0 || i >= NB ? 0 : LEVELS[i]);
const lineLevel = (j) => Math.max(levelOf(j - 1), levelOf(j));
const topOf = (j) => deckZ(lineLevel(j)) + 110; // poste hasta la barandilla de 1 m + espiga
const MAXL = Math.max(...LEVELS);

const FLOOR = { x: -70, y: -80, w: XS[NB] + 140, d: DEEP + 160, r: 0 };

const AZ = +(process.env.AZ ?? 84);
// Versión ligera para la web (spec 04, fase 2): mismo dibujo a escala de hero (≈1 px por cm),
// sin detalles por debajo de ~1 px (perforaciones, roscas, tornillos) y con menos vértices.
// La activa andamio/gen-next.mjs; la página de iteración (build-piramide.mjs) sigue con todo el detalle.
const LITE = process.env.PIR_LITE === "1";
// Trozos por larguero (× los del modelo). Diagonales y escalera conservan los suyos: cruzan en profundidad
// y con menos trozos cambia el orden de pintado en los cruces.
const TUBE_SPLIT = +(process.env.PIR_SPLIT ?? (LITE ? 0.5 : 1));
const ROUND = LITE ? 10 : 16;             // lados de rosetas y tuercas
const PAD = 4;
const BOUNDS = [...k.boxCorners(FLOOR, -8, 0), ...XS.flatMap((x, j) => YS.map((y) => [x, y, topOf(j) + 2]))];
// Alto del lienzo ajustado al dibujo: sin aire arriba ni a los lados
const flat = BOUNDS.map((p) => k.iso(p, { origin: [0, 0], scale: 1, azimuth: AZ, elevation: 30 }));
const span = (i) => Math.max(...flat.map((q) => q[i])) - Math.min(...flat.map((q) => q[i]));
export const H = Math.ceil(((W - PAD * 2) * span(1)) / span(0) + PAD * 2);
export const P = k.fitProjection(BOUNDS, W, H, { pad: PAD, azimuth: AZ });

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const V = G.viewOf(P);
const depth = (p) => G.dot3(p, V);

const items = [];
const put = (step, mid, svg, bias = 0) => {
  // Lo que sale con NaN no se pinta en el navegador: en la versión ligera ni se emite
  if (LITE && svg.includes("NaN")) return;
  items.push({ step, key: depth(mid) + bias, svg });
};
const dots = (pts, style) => (LITE ? "" : D(pts, style));
// Paso de montaje según la altura: 0 base, s = nivel s (de deckZ(s-1) a deckZ(s)), MAXL+1 barandillas del pico
const stepOfZ = (z) => (z <= Z0 + 0.5 ? 0 : Math.min(MAXL + 1, Math.ceil((z - Z0 - 0.5) / LIFT)));

// ---------- piezas ----------
function bar(a, b, r, tone, rims = "all") {
  const d = G.sub3(b, a);
  const F = G.frameAlong(a, d);
  return S(G.disc(0, G.len3(d), r, F, P, { rims, steps: LITE ? 8 : 10 }), { tone, crease: "faint" });
}
function tube(step, a, b, r, tone, { pieces = 4, bias = 0, ends = [true, true], split = TUBE_SPLIT } = {}) {
  const len = G.len3(G.sub3(b, a));
  const n = Math.max(1, Math.round(pieces * split));
  // un tubo recto no necesita vértices intermedios: en la versión ligera solo los extremos de cada trozo
  const spacing = LITE ? len / n : Math.max(4, len / pieces / 3);
  for (const piece of tubePieces([a, b], r, P, { maxLength: len / n + 0.01, caps: ends, spacing })) put(step, piece.mid, tubeSvg(piece, { tone }), bias);
}
// Cabezal de cuña sobre una roseta, mirando hacia `dir`
function wedgeHead(step, c, dir, tone = "mid") {
  const [dx, dy] = dir;
  const n = Math.hypot(dx, dy);
  const ux = dx / n, uy = dy / n;
  const pt = (r, t) => [c[0] + ux * r - uy * t, c[1] + uy * r + ux * t];
  const ring = [pt(2.7, -0.7), pt(9.6, -2.2), pt(9.6, 2.2), pt(2.7, 0.7)];
  // la cuña (0,8 × 0,9 cm) queda por debajo de 1 px: en la versión ligera no se dibuja
  const svg = S(k.extrude(ring, c[2] - 3, 6.5, P), { tone, crease: "faint" }) + (LITE ? "" :
    S(k.extrude([pt(4.2, -0.45), pt(5, -0.45), pt(5, 0.45), pt(4.2, 0.45)], c[2] + 3.5, 3.5, P), { tone: "hi" }));
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
// Diagonal vertical entre dos rosetas de niveles distintos (plano x o plano y)
function diagonal(step, a, b, side) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const n = Math.hypot(dx, dy);
  const ux = dx / n, uy = dy / n;
  wedgeHead(step, a, [ux, uy]);
  wedgeHead(step, b, [-ux, -uy]);
  const off = [side[0] * 1.5, side[1] * 1.5];
  tube(step, [a[0] + ux * 9.6 + off[0], a[1] + uy * 9.6 + off[1], a[2] + 2], [b[0] - ux * 9.6 + off[0], b[1] - uy * 9.6 + off[1], b[2] - 2], RT, "mid", { pieces: 7, bias: 1, split: 1 });
}

// ---------- suelo ----------
function floorSvg() {
  const out = [];
  out.push(S(k.slabOf(FLOOR, -8, 8, P, 2), { tone: "lo", crease: "faint" }));
  // losas de 60 cm de canto a canto
  for (let x = FLOOR.x + 60; x < FLOOR.x + FLOOR.w - 1; x += 60) out.push(L(k.lineOnTop([x, FLOOR.y], [x, FLOOR.y + FLOOR.d], 0, P), { tone: "faint" }));
  for (let y = FLOOR.y + 60; y < FLOOR.y + FLOOR.d - 1; y += 60) out.push(L(k.lineOnTop([FLOOR.x, y], [FLOOR.x + FLOOR.w, y], 0, P), { tone: "faint" }));
  // sombra suave bajo la estructura
  out.push(`<path class="iso-halo" d="${k.haloOf({ x: -30, y: -30, w: XS[NB] + 60, d: DEEP + 60, r: 30 }, 0, 1, P)}" style="filter:blur(14px);opacity:.55"/>`);
  return out.join("");
}

// ---------- base: tablón de reparto, placa, husillo y collarín ----------
function bases() {
  for (const x of XS) {
    // tablón de madera de 25 × 5 cm bajo cada pareja de postes
    const board = { x: x - 12.5, y: -22, w: 25, d: DEEP + 44, r: 0 };
    const grain = [];
    for (const f of [0.3, 0.62]) grain.push(k.lineOnTop([board.x + board.w * f, board.y + 3], [board.x + board.w * f, board.y + board.d - 3], 5, P));
    put(0, [x, DEEP / 2, 2.5], S(k.slabOf(board, 0, 5, P, 2, 0.4), { tone: "lo", crease: "faint", inner: L(grain.join(""), { tone: "faint", free: true }) }), -60);
    for (const y of YS) {
      const g = 5;
      put(0, [x, y, g], S(k.slabOf({ x: x - 7.5, y: y - 7.5, w: 15, d: 15, r: 0.8 }, g, 0.8, P, 2), { tone: "mid" }) + dots(k.corners({ x: x - 7.5, y: y - 7.5, w: 15, d: 15 }, 2).map(([a, b]) => at([a, b, g + 0.8])), { size: 0.35 }), -2);
      const threads = [];
      if (!LITE) for (let z = g + 3; z < g + NUT + 8 - 0.5; z += 2.2) threads.push(k.sideArc(x, y, 1.9, z, P, 10));
      put(0, [x, y, g + 6], S(k.cylinder(x, y, 1.9, g + 0.8, NUT + 8 - 0.8, P, LITE ? 8 : 16), { tone: "mid", crease: "none", inner: L(threads.join(""), { tone: "faint" }) }), -1);
      const nz = g + NUT + 8;
      put(0, [x, y, nz], S(k.cylinder(x, y, 4, nz, 3, P, LITE ? ROUND : 18), { tone: "mid" }) + S(k.slabOf({ x: x - 7, y: y - 0.8, w: 14, d: 1.6, r: 0.6 }, nz + 0.5, 2, P, 2), { tone: "mid" }), -0.5);
      put(0, [x, y, (nz + 3 + Z0) / 2], bar([x, y, nz + 3], [x, y, Z0], 3, "mid", "first"));
    }
  }
}

// ---------- postes con roseta cada 0,5 m, empalmes cada 2 m ----------
function standards() {
  for (const [j, x] of XS.entries()) for (const y of YS) {
    const top = topOf(j);
    const ros = [];
    for (let z = Z0; z <= top - 10; z += 50) ros.push(z);
    // espiga del collarín
    put(1, [x, y, Z0 + 8], bar([x, y, Z0 + 0.9], [x, y, Z0 + 15], 3, "mid", "last"));
    ros.forEach((z, i) => {
      put(stepOfZ(z), [x, y, z], S(k.cylinder(x, y, 6.2, z, 0.9, P, ROUND), { tone: "hi", crease: "lo" }), 0.05);
      const next = i + 1 < ros.length ? ros[i + 1] : top;
      const a0 = z === Z0 ? Z0 + 15 : z + 0.9;
      const st = stepOfZ(next === top ? top - 1 : next);
      const joint = ros.length && [240, 440, 640, 840].find((jz) => jz > a0 && jz < next);
      if (joint) {
        put(stepOfZ(joint), [x, y, (a0 + joint) / 2], bar([x, y, a0], [x, y, joint], RT, "mid", "none"));
        put(st, [x, y, (joint + next) / 2], bar([x, y, joint], [x, y, next], RT, "mid", next === top ? "last" : "none"));
        put(st, [x, y, joint + 2], L(k.sideArc(x, y, RT, joint, P, 12), { tone: "lo" }) + dots([at([x + RT * 0.9 * Math.cos(1.08), y + RT * 0.9 * Math.sin(1.08), joint + 4])], { size: 0.35 }), 0.2);
      } else put(st, [x, y, (a0 + next) / 2], bar([x, y, a0], [x, y, next], RT, "mid", next === top ? "last" : "none"));
      if (next === top) put(st, [x, y, top], L(k.ring(x, y, RT - 0.5, top, P, LITE ? 8 : 16), { tone: "lo" }), 0.1);
    });
  }
}

// ---------- horizontales (largueros en x) y travesaños en U (en y) ----------
function ledgers() {
  for (let i = 0; i < NB; i++) for (let s = 0; s <= LEVELS[i]; s++) for (const y of YS) ledger(Math.max(0, s), XS[i], y, XS[i + 1], y, deckZ(s), { pieces: 4 });
  for (const [j, x] of XS.entries()) for (let s = 0; s <= lineLevel(j); s++) ledger(s, x, YS[0], x, YS[1], deckZ(s), { pieces: 4 });
}

// ---------- plataformas de acero perforadas (0,32 m) y trampilla ----------
function plank(step, x0, x1, y0, y1, z, extra = "") {
  const plan = { x: x0, y: y0, w: x1 - x0, d: y1 - y0, r: 0.6 };
  const holes = [];
  if (!LITE) for (let x = x0 + 10; x < x1 - 6; x += 14) for (let y = y0 + 6; y < y1 - 4; y += 9.5) holes.push(at([x, y, z + 6]));
  const svg = S(k.slabOf(plan, z + 2.4, 3.6, P, 2, 0.4), { tone: "hi", crease: "lo", inner: L(k.sideSeam(plan, z + 4.2, P, 2), { tone: "faint" }) }) + dots(holes, { size: 0.28, tone: "lo" }) + extra;
  put(step, [(x0 + x1) / 2, (y0 + y1) / 2, z + 4], svg, 4);
}
function decks() {
  for (let i = 0; i < NB; i++) for (let s = 1; s <= LEVELS[i]; s++) {
    const z = deckZ(s);
    const x0 = XS[i] + 4, x1 = XS[i + 1] - 4;
    const rows = [];
    for (let r = 0; r < 6; r++) rows.push([7.5 + r * 32.2, 7.5 + r * 32.2 + 31.6]);
    const hatch = i === STAIR && s >= 1;
    rows.forEach(([y0, y1], r) => {
      if (hatch && r >= 4) return;
      plank(s, x0, x1, y0, y1, z);
    });
    if (hatch) {
      // plataforma con trampilla de 0,64 m: tapa con bisagras al lado de la escalera
      const y0 = rows[4][0], y1 = rows[5][1];
      const lid = { x: x1 - 92, y: y0 + 6, w: 72, d: y1 - y0 - 12 };
      const zt = z + 6;
      const edge = [[lid.x, lid.y], [lid.x + lid.w, lid.y], [lid.x + lid.w, lid.y + lid.d], [lid.x, lid.y + lid.d]];
      const frame = "M" + edge.map(([a, b]) => at([a, b, zt]).join(" ")).join(" L") + "Z";
      const hinges = [lid.y + 10, lid.y + lid.d - 10].map((y) => at([lid.x + lid.w, y, zt]));
      const grip = k.lineOnTop([lid.x + 8, lid.y + lid.d / 2 - 8], [lid.x + 8, lid.y + lid.d / 2 + 8], zt, P);
      const plan = { x: x0, y: y0, w: x1 - x0, d: y1 - y0, r: 0.6 };
      const holes = [];
      if (!LITE) for (let x = x0 + 10; x < x1 - 6; x += 14) for (let y = y0 + 6; y < y1 - 4; y += 9.5) if (x < lid.x - 3 || x > lid.x + lid.w + 3) holes.push(at([x, y, zt]));
      const svg = S(k.slabOf(plan, z + 2.4, 3.6, P, 2, 0.4), { tone: "hi", crease: "lo", inner: L(k.sideSeam(plan, z + 4.2, P, 2), { tone: "faint" }) }) +
        L(frame, { tone: "mid" }) + L(grip, { tone: "mid" }) + dots(holes, { size: 0.28, tone: "lo" }) + D(hinges, { size: 0.5 });
      put(s, [(x0 + x1) / 2, (y0 + y1) / 2, z + 4], svg, 4);
    }
  }
}

// ---------- rodapiés y barandillas a 0,5 y 1,0 m ----------
function toe(step, plan, z) {
  put(step, [plan.x + plan.w / 2, plan.y + plan.d / 2, z + 13], S(k.slabOf(plan, z + 6, 15, P, 2), { tone: "mid" }), 6);
}
function guards() {
  // frente y fondo de cada plataforma
  for (let i = 0; i < NB; i++) for (let s = 1; s <= LEVELS[i]; s++) {
    const z = deckZ(s);
    const st = s + 1;
    for (const y of YS) {
      for (const dz of [50, 100]) ledger(st, XS[i], y, XS[i + 1], y, z + dz, { pieces: 4 });
      const yy = y === 0 ? 3 : DEEP - 5;
      toe(st, { x: XS[i] + 4, y: yy, w: BAY - 8, d: 2 }, z);
    }
  }
  // costados donde el escalón baja
  for (const [j, x] of XS.entries()) for (let s = 1; s <= MAXL; s++) {
    const left = levelOf(j - 1) >= s, right = levelOf(j) >= s;
    if (left === right) continue;
    const z = deckZ(s);
    for (const dz of [50, 100]) ledger(s + 1, x, YS[0], x, YS[1], z + dz, { pieces: 4 });
    const xx = left ? x - 5 : x + 3;
    toe(s + 1, { x: xx, y: 4, w: 2, d: DEEP - 8 }, z);
  }
}

// ---------- diagonales verticales ----------
function diagonals() {
  // frente: vanos pares; fondo: vanos impares. Sentido alterno por nivel (zigzag)
  for (let i = 0; i < NB; i++) {
    const y = i % 2 === 0 ? YS[0] : YS[1];
    const side = y === 0 ? [0, -1] : [0, 1];
    for (let s = 1; s <= LEVELS[i]; s++) {
      const flip = (s + i) % 2 === 0;
      const xa = flip ? XS[i + 1] : XS[i], xb = flip ? XS[i] : XS[i + 1];
      diagonal(s, [xa, y, deckZ(s - 1)], [xb, y, deckZ(s)], side);
    }
  }
  // testeros: los dos extremos y los costados de cada escalón
  for (const [j, x] of XS.entries()) {
    const lo = Math.min(levelOf(j - 1), levelOf(j));
    const hi = lineLevel(j);
    const out = levelOf(j - 1) > levelOf(j) ? [1, 0] : [-1, 0];
    for (let s = lo + 1; s <= hi; s++) {
      const flip = s % 2 === 0;
      diagonal(s, [x, flip ? YS[1] : YS[0], deckZ(s - 1)], [x, flip ? YS[0] : YS[1], deckZ(s)], out);
    }
  }
}

// ---------- escalera de aluminio dentro del vano central ----------
function ladders() {
  const xa = XS[STAIR];
  const yL = DEEP - 7.5 - 64 + 14, yR = DEEP - 7.5 - 14;
  for (let s = 1; s <= LEVELS[STAIR]; s++) {
    const zb = s === 1 ? 0 : deckZ(s - 1) + 6;
    const zt = deckZ(s) + 6;
    const xTop = xa + BAY - 4 - 92 + 4;       // borde de la trampilla
    const xBot = xTop - 62;
    const st = s;
    for (const y of [yL, yR]) tube(st, [xBot, y, zb + 1], [xTop, y, zt], 1.6, "hi", { pieces: 6, bias: 2, split: 1 });
    const run = (zt - zb) / 30 | 0;
    for (let r = 1; r < run; r++) {
      const t = r / run;
      const xr = xBot + (xTop - xBot) * t, zr = zb + 1 + (zt - zb - 1) * t;
      put(st, [xr, (yL + yR) / 2, zr], bar([xr, yL + 1.6, zr], [xr, yR - 1.6, zr], 1.1, "mid"), 2.2);
    }
    // ganchos sobre el canto de la trampilla
    for (const y of [yL, yR]) put(st, [xTop + 3, y, zt], S(k.slabOf({ x: xTop - 1, y: y - 1.6, w: 7, d: 3.2, r: 0.4 }, zt - 1.5, 3, P, 2), { tone: "mid" }), 2.4);
  }
}

bases();
standards();
ledgers();
decks();
guards();
diagonals();
ladders();

export const STEPS = [
  { label: "base", text: "base · tablones, placas y husillos nivelados" },
  { label: "nivel 1", text: "nivel 1 · 7 vanos de 2,07 m a 2,25 m" },
  { label: "nivel 2", text: "nivel 2 · 5 vanos a 4,25 m" },
  { label: "nivel 3", text: "nivel 3 · 3 vanos a 6,25 m" },
  { label: "nivel 4", text: "nivel 4 · el pico a 8,25 m" },
  { label: "barandillas", text: "barandillas a 0,5 y 1,0 m en el pico" },
];

export const LABEL =
  "Estructura exenta de andamio multidireccional SM8 en forma de pirámide escalonada: siete torres de 2,07 por 2,07 metros unidas entre sí, de 2, 4, 6 y 8 metros de altura, con plataformas de acero, barandillas, diagonales y una escalera interior con trampilla en la torre central.";

export function figure({ steps = true } = {}) {
  items.sort((a, b) => a.key - b.key);
  const body = [floorSvg()];
  let run = null;
  let buf = [];
  const flush = () => { if (buf.length) body.push(steps ? `<g data-step="${run}">${buf.join("")}</g>` : buf.join("")); buf = []; };
  for (const it of items) { if (it.step !== run) { flush(); run = it.step; } buf.push(it.svg); }
  flush();
  return k.figureSvg({ width: W, height: H, label: LABEL, body });
}
export const count = () => items.length;
