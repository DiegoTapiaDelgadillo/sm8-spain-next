// Página de iteración del andamio piramidal del hero (spec 04).
// Uso: node andamio/build-piramide.mjs  →  andamio/piramide-dark.html
//      PIR_LITE=1 node andamio/build-piramide.mjs  →  andamio/piramide-lite-dark.html (la versión de la web)
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import * as k from "/Users/diegotapiadelgadillo/.claude/skills/anatomy/kit/iso-kit.mjs";
import { kitScript } from "/Users/diegotapiadelgadillo/.claude/skills/anatomy/scripts/inline-kit.mjs";
import * as PY from "./piramide.mjs";
import { minifySvg } from "./lib/svg-min.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const LITE = process.env.PIR_LITE === "1";
const svg = LITE ? minifySvg(PY.figure()) : PY.figure();
// Parte del alto de la figura que se ve como mínimo (el resto, la base, queda cortado)
const SHOW = 0.6;

const css = `<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Mona+Sans:wght@400;500&display=swap" rel="stylesheet">
<style>
body{background:#000}
.iso-page{width:100%;margin:0}
.hero{height:100svh;min-height:560px;background:linear-gradient(#000,#171717);display:flex;flex-direction:column;align-items:center;padding:72px 0 0;overflow:hidden;font-family:"Mona Sans",system-ui,sans-serif}
.hero>:not(.stage){margin-left:16px;margin-right:16px}
.chip{display:flex;gap:6px;align-items:center;padding:8px 16px;border:1px solid #737373;border-radius:999px;background:linear-gradient(#0a0a0a,#262626);color:#a3a3a3;font-size:12px}
.hero h1{font-family:Montserrat,sans-serif;color:#fff;font-weight:700;text-align:center;font-size:clamp(20px,3.4vw,40px);line-height:1.2;margin:32px 0 0;max-width:1000px}
.hero h1 span{color:#fcd34d}
.hero p{color:#a3a3a3;text-align:center;max-width:820px;margin:16px 0 32px}
.ctas{display:flex;gap:16px;flex-wrap:wrap;justify-content:center}
.ctas a{padding:6px 24px;border-radius:999px;font-size:14px;text-decoration:none}
.cta1{border:1px solid #3b82f6;background:#3b82f64d;color:#60a5fa}
.cta2{border:1px solid #737373;color:#e5e5e5}
/* La figura ocupa el alto que queda bajo los botones: siempre se ve el pico y la base se corta bajo el degradado */
.stage{position:relative;flex:1 1 0;min-height:0;width:100%;margin-top:12px;overflow:hidden;container-type:size}
.stage::after{content:"";position:absolute;inset:auto 0 0 0;height:22%;background:linear-gradient(transparent,#171717);pointer-events:none}
.stage .iso-svg{position:absolute;top:0;left:50%;transform:translateX(-50%);max-width:none;width:min(100cqw,1600px,calc(100cqh * ${(PY.W / PY.H).toFixed(4)} / ${SHOW}))}
.tools{display:flex;gap:12px;justify-content:center;align-items:center;padding:16px;color:#737373;font:12px/1.4 ui-monospace,Menlo,monospace}
.tools button{background:#171717;color:#d4d4d4;border:1px solid #404040;border-radius:999px;padding:4px 14px;font:inherit;cursor:pointer}
@media (max-width:1023px),(orientation:portrait){.stage .iso-svg{width:min(150cqw,calc(100cqh * ${(PY.W / PY.H).toFixed(4)} / ${SHOW}))}}
@media (max-width:639px){.stage .iso-svg{width:min(170cqw,calc(100cqh * ${(PY.W / PY.H).toFixed(4)} / ${SHOW}))}}
</style>`;

const body = `${css}
<section class="hero">
  <div class="chip">◎ Andamio multidireccional · Comunidad de Madrid</div>
  <h1>Alquiler y montaje de andamios en Madrid <span>para fachadas, obra e industria</span></h1>
  <p>Sistema Multidireccional SM8 homologado, montado y desmontado por personal propio cualificado. También lo vendemos y nos encargamos del PMUD y las licencias.</p>
  <div class="ctas"><a class="cta1" href="#">Solicitar presupuesto</a><a class="cta2" href="#">Llamar</a></div>
  <div class="stage" id="hero-fig">${svg}</div>
</section>
<div class="tools"><button id="replay" type="button">Repetir montaje</button><span id="readout" aria-live="polite"></span></div>`;

const live = `
(() => {
const P = ${JSON.stringify(PY.P)};
const TEXT = ${JSON.stringify(PY.STEPS.map((s) => s.text))};
const N = TEXT.length;
const stage = document.getElementById("hero-fig");
const svg = stage.querySelector("svg");
const groups = [...svg.querySelectorAll("[data-step]")].map((g) => ({ g, s: +g.dataset.step }));
const readout = document.getElementById("readout");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const ease = (t) => t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(1 - t, 3);
const RATE = 1.25; // pasos por segundo
let p = still.matches ? N - 1 : -1, frame = 0, last = 0, drawn = null;
function paint() {
  if (drawn === p) return;
  for (const { g, s } of groups) {
    const e = ease(p - s + 1);
    if (e <= 0) { g.style.display = "none"; continue; }
    g.style.display = "";
    g.setAttribute("opacity", e.toFixed(3));
    g.setAttribute("transform", e >= 1 ? "" : translateAlong(P, [0, 0, 120 * (1 - e)]));
  }
  drawn = p;
  const i = Math.max(0, Math.min(N - 1, Math.ceil(p)));
  readout.textContent = p >= N - 1 ? "montado · " + TEXT[N - 1] : TEXT[i];
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60; last = now;
  p = Math.min(N - 1, p + dt * RATE);
  paint();
  frame = p < N - 1 ? requestAnimationFrame(tick) : 0;
}
const start = () => { cancelAnimationFrame(frame); last = 0; p = still.matches ? N - 1 : -1; drawn = null; paint(); if (!still.matches) frame = requestAnimationFrame(tick); };
document.getElementById("replay").addEventListener("click", start);
start();
})();
`;

writeFileSync(
  join(HERE, LITE ? "piramide-lite-dark.html" : "piramide-dark.html"),
  k.pageHtml({ title: "Andamio piramidal SM8", theme: "dark", body, script: kitScript() + live, width: 1600 }).replace('lang="en"', 'lang="es"'),
);
const still = LITE ? minifySvg(PY.figure({ steps: false })) : PY.figure({ steps: false });
console.log("items", PY.count(), "· svg", (svg.length / 1024) | 0, "KB · gzip", (gzipSync(still).length / 1024) | 0, "KB");
