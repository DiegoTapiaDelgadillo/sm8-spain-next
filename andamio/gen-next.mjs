// Genera los recursos de las figuras isométricas para sm8-spain-next.
// Uso: node andamio/gen-next.mjs            todas las figuras (necesita el kit "anatomy" en ~/.claude/skills)
//      node andamio/gen-next.mjs piramide   solo el andamio piramidal del hero (spec 04)
import { mkdirSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import * as k from "/Users/diegotapiadelgadillo/.claude/skills/anatomy/kit/iso-kit.mjs";
import * as F2 from "./fig2.mjs";
import * as OB from "./obra.mjs";
import * as IN from "./industria.mjs";
import { minifySvg } from "./lib/svg-min.mjs";

const ONLY = process.argv[2];
if (ONLY && ONLY !== "piramide") {
  console.error(`Figura desconocida: ${ONLY} (opciones: piramide)`);
  process.exit(1);
}

const ROOT = "/Users/diegotapiadelgadillo/SM8/sm8-spain-next";
const SHARED = `${ROOT}/components/Scaffolds/IsoBuildFigure`;
mkdirSync(SHARED, { recursive: true });
mkdirSync(`${ROOT}/public/figures`, { recursive: true });

if (!ONLY) writeFileSync(`${SHARED}/iso-figure.css`, `/* Estilos del kit isométrico (tema oscuro). Generado: no editar a mano. */\n${k.ISO_CSS}`);

function emit({ mod, svgName, dir, file, name, sliderLabel, aria }) {
  const svg = mod.figure();
  writeFileSync(`${ROOT}/public/figures/${svgName}`, svg);
  console.log(svgName, (svg.length / 1024) | 0, "KB · gzip", (gzipSync(svg).length / 1024) | 0, "KB");
  const [, zy] = k.axisVector(mod.P, [0, 0, 1]);
  mkdirSync(`${ROOT}/${dir}`, { recursive: true });
  writeFileSync(
    `${ROOT}/${dir}/${file}`,
    `// Generado desde el modelo de la figura (andamio/gen-next.mjs): no editar a mano.
import type { IsoBuildData } from "@/components/Scaffolds/IsoBuildFigure/IsoBuildFigure";

export const ${name}: IsoBuildData = {
  svgUrl: "/figures/${svgName}",
  screenPerCmUp: ${zy.toFixed(5)},
  steps: ${JSON.stringify(mod.STEPS.map((s) => s.text), null, 4).replace(/\n\]/, "\n  ]")},
  ariaLabel: ${JSON.stringify(aria)},
  sliderLabel: ${JSON.stringify(sliderLabel)},
  caption: ${JSON.stringify(mod.CAPTION)},
};
`,
  );
}

// Andamio piramidal del hero: versión ligera del modelo (sin detalles por debajo de 1 px),
// `d` compactados sin perder precisión y SVG decorativo (aria-hidden, sin role ni etiqueta).
async function emitHero() {
  process.env.PIR_LITE = "1";
  const PY = await import("./piramide.mjs");
  const svgName = "andamio-sm8-piramide.svg";
  const svg = minifySvg(PY.figure()).replace(/ role="img" aria-label="[^"]*"/, ' aria-hidden="true" focusable="false"');
  writeFileSync(`${ROOT}/public/figures/${svgName}`, svg);
  console.log(svgName, (svg.length / 1024) | 0, "KB · gzip", (gzipSync(svg).length / 1024) | 0, "KB ·", PY.count(), "piezas");
  const [zx, zy] = k.axisVector(PY.P, [0, 0, 1]);
  if (Math.abs(zx) > 1e-6) throw new Error("La caída del montaje supone un eje vertical en pantalla");
  const dir = "components/Home/HeroScaffold";
  mkdirSync(`${ROOT}/${dir}`, { recursive: true });
  writeFileSync(
    `${ROOT}/${dir}/heroScaffoldData.ts`,
    `// Generado desde el modelo de la figura (andamio/gen-next.mjs piramide): no editar a mano.
import type { HeroScaffoldData } from "@/types/Home/heroScaffold/heroScaffoldProps";

export const HERO_SCAFFOLD: HeroScaffoldData = {
  svgUrl: "/figures/${svgName}",
  screenPerCmUp: ${zy.toFixed(5)},
  steps: ${JSON.stringify(PY.STEPS.map((s) => s.text), null, 4).replace(/\n\]/, "\n  ]")},
  ratio: ${+(PY.W / PY.H).toFixed(4)},
};
`,
  );
}

if (ONLY === "piramide") {
  await emitHero();
  process.exit(0);
}

emit({
  mod: F2,
  svgName: "andamio-sm8-fachada.svg",
  dir: "components/Scaffolds/ScaffoldFigure",
  file: "scaffoldFigureData.ts",
  name: "FACHADA_FIGURE",
  sliderLabel: "Andamio de fachada: las flechas avanzan o retroceden el montaje",
  aria: "Andamio multidireccional de dos vanos y tres plataformas frente a la fachada de un edificio con ventanas y una cornisa. Los pies descansan sobre husillos regulables en un suelo con escalón; el andamio se monta nivel a nivel.",
});
emit({
  mod: OB,
  svgName: "andamio-sm8-obra.svg",
  dir: "components/Scaffolds/ConstructionFigure",
  file: "constructionFigureData.ts",
  name: "OBRA_FIGURE",
  sliderLabel: "Andamio en obra: las flechas avanzan o retroceden el montaje",
  aria: OB.ARIA,
});
emit({
  mod: IN,
  svgName: "andamio-sm8-industria.svg",
  dir: "components/Scaffolds/IndustryFigure",
  file: "industryFigureData.ts",
  name: "INDUSTRIA_FIGURE",
  sliderLabel: "Andamio en industria: las flechas avanzan o retroceden el montaje",
  aria: IN.ARIA,
});
await emitHero();
