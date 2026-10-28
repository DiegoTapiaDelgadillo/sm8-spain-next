import { writeFileSync } from "node:fs";
import * as k from "/Users/diegotapiadelgadillo/.claude/skills/anatomy/kit/iso-kit.mjs";
import * as O from "./industria.mjs";
const svg = O.figure();
const step = process.argv.find((a) => a.startsWith("--step="));
const css = step ? `<style>${[0,1,2,3,4].filter((s) => s > +step.slice(7)).map((s) => `[data-step="${s}"]{display:none}`).join("")}</style>` : "";
const body = k.plateHtml({ fig: "Fig 4", title: "Andamio en industria", hint: "", readout: O.STEPS[4].text, caption: O.CAPTION, body: `<div class="iso-stage" id="f4">${svg}</div>` });
writeFileSync(`industria-dark.html`, k.pageHtml({ title: "Industria", theme: "dark", body: css + body, width: 720 }));
console.log("svg KB", svg.length / 1024 | 0);
