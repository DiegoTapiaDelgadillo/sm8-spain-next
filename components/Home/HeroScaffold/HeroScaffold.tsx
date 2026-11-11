"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "@/components/Scaffolds/IsoBuildFigure/iso-figure.css";
import {
  collectGroups,
  fetchSvg,
  paintSteps,
} from "@/components/Scaffolds/IsoBuildFigure/isoSteps";
import type { HeroScaffoldProps } from "@/types/Home/heroScaffold/heroScaffoldProps";
import { HERO_SCAFFOLD } from "./heroScaffoldData";

const RATE = 2; // pasos de montaje por segundo (≈3 s en total)
const DROP_CM = 120; // cada nivel cae desde 1,20 m por encima de su sitio
const SHOW = 0.6; // parte del alto de la figura que se ve como mínimo (la base se corta bajo el degradado)

const { svgUrl, screenPerCmUp, steps, ratio } = HERO_SCAFFOLD;
const LAST = steps.length - 1;

/**
 * Andamio piramidal decorativo del hero. Es el "escenario": ocupa el alto libre del padre
 * (`flex-1`) y el SVG se ajusta a ese alto para que siempre se vea el pico. Carga el SVG al montarse,
 * reproduce el montaje una sola vez y se queda quieto; con `prefers-reduced-motion` aparece montado.
 */
export const HeroScaffold = ({ className = "" }: HeroScaffoldProps) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);

  // Alto libre del escenario en px como variable CSS: el ancho de la figura depende de él.
  // (Las unidades `cqh` daban 0 en Chrome cuando el alto sale de `flex-1` dentro de un `min-height`.)
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const ro = new ResizeObserver(([entry]) => {
      stage.style.setProperty("--stage-h", `${entry.contentRect.height}px`);
    });
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const art = artRef.current;
    if (!art) return;
    let cancelled = false;
    let frame = 0;
    let idle = 0;

    const mount = (svg: string) => {
      if (cancelled) return;
      // StrictMode o Fast Refresh repiten el efecto: el SVG se inyecta una sola vez
      if (art.dataset.src !== svgUrl) {
        art.innerHTML = svg;
        art.dataset.src = svgUrl;
      }
      const groups = collectGroups(art);
      const still = window.matchMedia("(prefers-reduced-motion: reduce)");
      let p = still.matches ? LAST : -1;
      let start = 0;
      // Se pinta en el mismo tick de la inyección para no enseñar un frame del andamio completo
      let drawn = paintSteps(groups, p, screenPerCmUp, null, DROP_CM);
      if (p >= LAST) return;

      // El progreso sale del tiempo transcurrido: en un móvil lento se saltan frames, pero el
      // montaje dura lo mismo (≈3 s) y nunca pasa de 5 s (WCAG 2.2.2)
      const tick = (now: number) => {
        start ||= now;
        p = still.matches ? LAST : Math.min(LAST, -1 + ((now - start) / 1000) * RATE);
        drawn = paintSteps(groups, p, screenPerCmUp, drawn, DROP_CM);
        frame = p < LAST ? requestAnimationFrame(tick) : 0;
      };
      frame = requestAnimationFrame(tick);
    };

    fetchSvg(svgUrl)
      .then((svg) => {
        if (cancelled) return;
        // Inyectar ≈1 MB de SVG es una tarea larga: se hace cuando el hilo está libre, tras el LCP
        if ("requestIdleCallback" in window) {
          idle = window.requestIdleCallback(() => mount(svg), { timeout: 600 });
        } else {
          idle = setTimeout(() => mount(svg), 0) as unknown as number;
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(idle);
      else clearTimeout(idle);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className={`iso pointer-events-none relative min-h-0 w-full flex-1 overflow-hidden select-none ${className}`}
    >
      {/* Ancho: el que quepa a lo alto (se ve al menos el 60 % superior), recortando los lados en móvil y en vertical */}
      <div
        ref={artRef}
        style={{ "--hero-fit": `calc(var(--stage-h, 0px) * ${ratio} / ${SHOW})` } as CSSProperties}
        className="absolute top-0 left-1/2 w-[min(170%,var(--hero-fit))] max-w-none -translate-x-1/2 sm:w-[min(150%,var(--hero-fit))] lg:landscape:w-[min(100%,1600px,var(--hero-fit))]"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%] bg-linear-to-b from-transparent to-neutral-900" />
    </div>
  );
};
