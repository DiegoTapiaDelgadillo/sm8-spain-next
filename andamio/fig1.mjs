// Fig 1 · El nudo de roseta. Unidades: milímetros reales.
import * as k from "/Users/diegotapiadelgadillo/.claude/skills/anatomy/kit/iso-kit.mjs";
import * as G from "/Users/diegotapiadelgadillo/.claude/skills/anatomy/kit/lathe.mjs";

export const W = 600;
export const H = 430;

// Datos del sistema (roseta de 8 orificios, tubo Ø48,3 mm)
const R_TUBE = 24.15;          // poste Ø48,3
const R_SPIGOT = 19;           // espiga Ø38
const ROS_R = 62;              // roseta Ø124
const ROS_Z = 300;             // cara inferior de la roseta
const ROS_T = 9;               // espesor 9 mm
const ROS_TOP = ROS_Z + ROS_T;
const MID = ROS_Z + ROS_T / 2; // eje de los horizontales
const POST_TOP = 500;
const SPIGOT_TOP = 580;
const LEDGER_END = 300;
export const ADJ = { centre: 315, span: 12 };   // orificio grande a 45°, holgura dibujada ±12°
export const DROP = 42;                        // recorrido de la cuña al golpearla

const PLATE = { x: -270, y: -270, w: 540, d: 540, r: 24 };
const PLATE_H = 34;
const FOOT_H = 14;

export const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [0, 0, SPIGOT_TOP + 10], [LEDGER_END, 0, MID + 30], [0, -LEDGER_END, MID + 30]],
  W,
  H,
  { pad: 22, azimuth: 40, elevation: 38 },
);

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const rad = (deg) => (deg * Math.PI) / 180;
const V = G.viewOf(P);
const byDepth = (pts) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

// Punto en coordenadas locales de un brazo a ángulo θ: r radial, t tangencial
const local = (deg, r, t) => {
  const a = rad(deg);
  return [Math.cos(a) * r - Math.sin(a) * t, Math.sin(a) * r + Math.cos(a) * t];
};
const trap = (deg, r0, r1, h0, h1) => [local(deg, r0, -h0), local(deg, r1, -h1), local(deg, r1, h1), local(deg, r0, h0)];
const arcRing = (deg, r0, r1, half, steps = 10) => {
  const out = [];
  for (let i = 0; i <= steps; i++) {
    const a = rad(deg - half + (2 * half * i) / steps);
    out.push([Math.cos(a) * r1, Math.sin(a) * r1]);
  }
  for (let i = steps; i >= 0; i--) {
    const a = rad(deg - half + (2 * half * i) / steps);
    out.push([Math.cos(a) * r0, Math.sin(a) * r0]);
  }
  return out;
};

// ---------- banco: placa de exhibición ----------
function bench() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 46))) {
    out.push(S(k.cylinder(x, y, 26, -PLATE_H - FOOT_H, 5, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 19, -PLATE_H - FOOT_H + 5, FOOT_H - 5, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 3), { tone: "mid", inner: L(k.sideSeam(PLATE, -PLATE_H / 2, P, 8), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 14), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 30);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 8, 0, P, 18)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // transportador impreso alrededor del poste: 0° hacia +x
  out.push(L(k.ring(0, 0, 210, 0, P, 120), { tone: "lo" }));
  out.push(L(k.ring(0, 0, 192, 0, P, 120), { tone: "faint" }));
  const t = k.radialTicks(0, 0, 210, 72, 9, 0, [8, 18], P);
  out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  // regla en el canto delantero (+y)
  const strip = { x: -200, y: PLATE.y + PLATE.d - 40, w: 330, d: 20, r: 3 };
  out.push(S(k.slabOf(strip, 0, 1.5, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 10, strip.x + strip.w - 10, 10, 5, strip.y + 1, 1.5, [6, 11], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at([strip.x + 5, strip.y + 10, 1.5]), at([strip.x + strip.w - 5, strip.y + 10, 1.5])], { size: 0.45 }));
  // placa de identificación con una única etiqueta grabada
  const tag = { x: PLATE.x + PLATE.w - 110, y: PLATE.y + 40, w: 80, d: 150, r: 4 };
  out.push(S(k.slabOf(tag, 0, 2, P, 4), { tone: "lo", crease: "none" }));
  out.push(L(k.planOutline(k.insetPlan(tag, 6), 2, P, 4), { tone: "faint" }));
  out.push(k.faceTextSvg(k.topMatrix([tag.x + 40, tag.y + 40], 2, P, "y"), "SM8", { size: 4.2, tone: "mid", anchor: "middle" }));
  for (const [i, len] of [[0, 90], [1, 70], [2, 50]]) out.push(L(k.lineOnTop([tag.x + 22 + i * 14, tag.y + 70], [tag.x + 22 + i * 14, tag.y + 70 + len], 2, P), { tone: "lo", free: true }));
  out.push(D([at([tag.x + 40, tag.y + 14, 2]), at([tag.x + 40, tag.y + tag.d - 14, 2])], { size: 0.45 }));
  // martillo de montaje (500 g) apoyado en la placa
  const hx = -240, hy = -60, ha = rad(60);
  const hp = (r, t) => [hx + Math.cos(ha) * r - Math.sin(ha) * t, hy + Math.sin(ha) * r + Math.cos(ha) * t];
  const box = (r0, r1, t0, t1) => [hp(r0, t0), hp(r1, t0), hp(r1, t1), hp(r0, t1)];
  out.push(`<path class="iso-halo" d="${k.onTop(box(-10, 290, -30, 30), 0, P, true)}" style="filter:blur(5px)"/>`);
  out.push(S(k.extrude(box(0, 260, -11, 11), 0, 20, P, { bevel: 0.6 }), { tone: "mid" }));
  out.push(L(k.onTop(box(14, 120, -6, 6), 20, P, true), { tone: "faint" }));
  out.push(S(k.extrude(box(232, 268, -52, 40), 0, 34, P, { bevel: 0.8 }), { tone: "mid" }));
  out.push(S(k.extrude(box(236, 264, 40, 58), 3, 28, P, { bevel: 0.5 }), { tone: "mid" }));
  out.push(D([at([...hp(250, -20), 34]), at([...hp(250, 10), 34])], { size: 0.45 }));
  // brida de anclaje y casquillo del poste
  out.push(S(k.cylinder(0, 0, 70, 0, 8, P, 56, 1), { tone: "mid" }));
  out.push(D(G.dotsOf(G.frameOf([0, 0, 8], [0, 0, 1], [1, 0, 0], [0, 1, 0]), 0, 56, 8, P, { all: true }), { size: 0.5 }));
  out.push(S(k.cylinder(0, 0, 36, 8, 60, P, 40, 0.8), { tone: "mid", inner: L(k.sideArc(0, 0, 36, 40, P, 30), { tone: "faint" }) }));
  // tornillo de fijación del casquillo, hacia el espectador
  const tv = k.towardViewer(P);
  const ax = [tv[0], tv[1], 0];
  const Fs = G.frameAlong([0, 0, 38], ax);
  out.push(S(G.disc(35, 44, 6, Fs, P), { tone: "mid" }));
  out.push(S(G.disc(44, 54, 11, Fs, P), { tone: "mid", inner: k.lineSvg(G.ribsOf(Fs, 44, 54, 11, 18, P, { seams: true }), { tone: "lo" }) }));
  return out.join("");
}

// ---------- poste y roseta ----------
const postLow = () => S(k.cylinder(0, 0, R_TUBE, 68, ROS_Z - 68, P, 48), { tone: "mid", crease: "none", inner: L(k.sideArc(0, 0, R_TUBE, 120, P, 24), { tone: "faint" }) });

function rosette() {
  const out = [S(k.cylinder(0, 0, ROS_R, ROS_Z, ROS_T, P, 72, 1), { tone: "hi", crease: "lo" })];
  // orificios: 4 pequeños (90°) y 4 grandes (ángulo libre)
  const hole = (ring) => `<path d="${k.onTop(ring, ROS_TOP, P, true)}" style="fill:var(--anatomy-shade-0)" class="iso-line" data-tone="lo"/>`;
  for (const deg of [0, 90, 180, 270]) out.push(hole(trap(deg, 38, 54, 6, 6)));
  for (const deg of [45, 135, 225, 315]) out.push(hole(arcRing(deg, 38, 56, 18)));
  // cordón de soldadura alrededor del poste
  out.push(L(k.ring(0, 0, R_TUBE + 2.4, ROS_TOP, P, 48), { tone: "lo" }));
  return out.join("");
}

function postHigh() {
  const out = [];
  out.push(S(k.cylinder(0, 0, R_TUBE, ROS_TOP, POST_TOP - ROS_TOP, P, 48), { tone: "mid", crease: "none", inner: L(k.sideArc(0, 0, R_TUBE, 440, P, 24), { tone: "faint" }) }));
  out.push(L(k.ring(0, 0, R_TUBE - 3.2, POST_TOP, P, 40), { tone: "lo" }));
  out.push(S(k.cylinder(0, 0, R_SPIGOT, POST_TOP, SPIGOT_TOP - POST_TOP, P, 40, 0.6), { tone: "mid" }));
  // remache pasante de la espiga
  out.push(D([at([...local(40, R_SPIGOT, 0), 540])], { size: 0.6 }));
  out.push(L(k.ring(0, 0, R_SPIGOT - 3, SPIGOT_TOP, P, 32), { tone: "faint" }));
  return out.join("");
}

// ---------- cabezal de cuña + tubo horizontal ----------
// Las mordazas abrazan el disco: inferior bajo la roseta, superior encima.
function jawLow(deg, tone) {
  return S(k.extrude(trap(deg, 27, 96, 7, 26), ROS_Z - 32, 31, P, { bevel: 0.6 }), { tone, crease: "faint" });
}
// La cuña: un mismo cuerpo de 70 mm + cabeza de 10 mm. Solo se dibuja lo que asoma
// por encima de la mordaza superior y por debajo de la inferior.
export const WEDGE = { zb: ROS_TOP + 7, jawTop: ROS_TOP + 27, jawBot: ROS_Z - 32 };
export function wedgePart(extrude, solidSvg, P, deg, dz, part, tone, lit) {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  const tr = (r0, r1, h) => [[c * r0 + s * h, s * r0 - c * h], [c * r1 + s * h, s * r1 - c * h], [c * r1 - s * h, s * r1 + c * h], [c * r0 - s * h, s * r0 + c * h]];
  const zb = WEDGE.zb - dz, zt = zb + 70;
  if (part === "low") return zb < WEDGE.jawBot ? solidSvg(extrude(tr(42, 50, 4.5), zb, WEDGE.jawBot - zb, P), { tone, lit }) : "";
  const z0 = Math.max(zb, WEDGE.jawTop);
  return solidSvg(extrude(tr(42, 50, 4.5), z0, zt - z0, P), { tone, lit }) + solidSvg(extrude(tr(39, 53, 6.5), zt, 10, P, { bevel: 0.4 }), { tone, lit });
}
const wedgeLow = (deg, tone, lit, dz = DROP) => wedgePart(k.extrude, k.solidSvg, P, deg, dz, "low", tone, lit);
function head(deg, tone, lit) {
  const out = [];
  out.push(S(k.extrude(trap(deg, 64, 96, 18, 26), ROS_Z - 1, ROS_T + 2, P), { tone, crease: "faint" }));
  out.push(S(k.extrude(trap(deg, 27, 96, 7, 26), ROS_TOP + 1, 26, P, { bevel: 0.6 }), { tone, crease: "faint" }));
  // ranura de la cuña en la mordaza superior
  out.push(L(k.onTop(trap(deg, 41, 51, 5.5, 5.5), ROS_TOP + 27, P, true), { tone: "faint" }));
  // tubo Ø48,3 soldado al cabezal
  const a = rad(deg);
  const F = G.frameAlong([0, 0, MID], [Math.cos(a), Math.sin(a), 0]);
  const facing = G.dot3(F.a, V) > 0;
  const weld = L(G.arcOf(F, 100, R_TUBE + 1.2, P), { tone: "faint" });
  out.push(S(G.disc(96, LEDGER_END, R_TUBE, F, P), { tone, crease: "faint", lit, inner: weld }));
  if (facing) out.push(L(G.circleOf(F, LEDGER_END, R_TUBE - 2.6, P), { tone: "lo" }));
  return out.join("");
}
const wedgeHigh = (deg, tone, lit, dz = 0) => wedgePart(k.extrude, k.solidSvg, P, deg, dz, "high", tone, lit);

const FIXED = [180, 270];
const front = (deg) => G.dot3([Math.cos(rad(deg)), Math.sin(rad(deg)), 0], V) > 0;

// Pieza ajustable, precalculada grado a grado
export function adjustable(deg) {
  return {
    low: jawLow(deg, "hi"),
    head: head(deg, "hi", false),
  };
}

export function figure() {
  const back = FIXED.filter((d) => !front(d));
  const fore = FIXED.filter((d) => front(d));
  const body = [
    bench(),
    ...back.map((d) => wedgeLow(d, "mid", false) + jawLow(d, "mid")),
    postLow(),
    ...fore.map((d) => wedgeLow(d, "mid", false) + jawLow(d, "mid")),
    `<g data-part="adj-wedge-low"></g><g data-part="adj-low"></g>`,
    rosette(),
    ...back.map((d) => head(d, "mid") + wedgeHigh(d, "mid", false, DROP)),
    postHigh(),
    ...fore.map((d) => head(d, "mid") + wedgeHigh(d, "mid", false, DROP)),
    `<g data-part="adj-head"></g><g data-part="adj-wedge"></g>`,
  ];
  return k.figureSvg({
    width: W,
    height: H,
    label:
      "Nudo de un andamio multidireccional: un poste de 48,3 mm con una roseta soldada de 8 orificios sobre una placa de exhibición. Tres horizontales encajan en orificios pequeños a 90°; un cuarto, en un orificio grande, puede girar dentro de la ranura hasta que se golpea su cuña.",
    body,
  });
}
