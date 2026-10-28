"use client";

import { useEffect, useRef, useState } from "react";
import "./iso-figure.css";

/** Datos de una figura isométrica que se monta por pasos (generados por andamio/gen-next.mjs). */
export type IsoBuildData = {
  svgUrl: string;
  /** Desplazamiento en pantalla (px del viewBox) por cada cm de altura real. */
  screenPerCmUp: number;
  steps: readonly string[];
  ariaLabel: string;
  sliderLabel: string;
  caption: string;
};

export type IsoBuildFigureProps = {
  data: IsoBuildData;
  showCaption?: boolean;
  className?: string;
};

const DROP_CM = 80; // cada nivel cae desde 80 cm por encima de su sitio
const TOUR_SECONDS = 12;

// Recorrido automático: base 1 s, un paso por segundo, y el andamio completo hasta el final.
const tourAt = (t: number, LAST: number) => {
  const s = t % TOUR_SECONDS;
  return s < 1 ? 0 : Math.min(LAST, Math.floor(s - 1));
};
const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(1 - t, 3));
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

export const IsoBuildFigure = ({
  data,
  showCaption = true,
  className = "",
}: IsoBuildFigureProps) => {
  const { svgUrl, screenPerCmUp, steps, ariaLabel, sliderLabel, caption } = data;
  const LAST = steps.length - 1;
  const stageRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const [loaded, setLoaded] = useState(false);

  // 1 · Carga el dibujo (≈130 KB comprimido) solo cuando la figura se acerca a la pantalla.
  useEffect(() => {
    const stage = stageRef.current;
    const art = artRef.current;
    if (!stage || !art) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[entries.length - 1].isIntersecting) return;
        io.disconnect();
        fetch(svgUrl)
          .then((r) => r.text())
          .then((svg) => {
            if (cancelled) return;
            art.innerHTML = svg;
            setLoaded(true);
          })
          .catch(() => undefined);
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(stage);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [svgUrl]);

  // 2 · Animación de montaje: un único bucle que escribe atributos, sin re-renderizar React.
  useEffect(() => {
    if (!loaded) return;
    const stage = stageRef.current!;
    const svg = artRef.current!.querySelector("svg");
    const readout = readoutRef.current;
    if (!svg) return;

    const groups = Array.from(
      svg.querySelectorAll<SVGGElement>("[data-step]"),
    ).map((g) => ({
      g,
      s: Number(g.dataset.step),
    }));
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    let p = LAST;
    let target = LAST;
    let frame = 0;
    let last = 0;
    let clock = 0;
    let touring = !still.matches;
    let visible = false;
    let idle: ReturnType<typeof setTimeout> | undefined;
    let drawn: number | null = null;

    const paint = () => {
      if (drawn !== p) {
        for (const { g, s } of groups) {
          const e = ease(p - s + 1);
          if (e <= 0) {
            g.style.display = "none";
            continue;
          }
          g.style.display = "";
          g.setAttribute("opacity", e.toFixed(3));
          const dy = screenPerCmUp * DROP_CM * (1 - e);
          if (e >= 1) g.removeAttribute("transform");
          else g.setAttribute("transform", `translate(0 ${dy.toFixed(2)})`);
        }
        drawn = p;
      }
      const text = steps[clamp(Math.round(p), 0, LAST)];
      if (readout && readout.textContent !== text) readout.textContent = text;
    };

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
      last = now;
      if (touring) {
        clock += dt;
        target = tourAt(clock, LAST);
      }
      if (still.matches) p = target;
      else {
        const dir = Math.sign(target - p);
        // monta despacio, desmonta rápido
        p += dir * Math.min(Math.abs(target - p), dt * (dir < 0 ? 4 : 1.4));
      }
      paint();
      const settled = !touring && p === target;
      frame = visible && !settled ? requestAnimationFrame(tick) : 0;
    };
    const run = () => {
      if (!frame && visible) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };
    const describe = () => {
      stage.setAttribute("aria-valuenow", String(target));
      stage.setAttribute("aria-valuetext", steps[target]);
    };
    const hold = () => {
      touring = false;
      clearTimeout(idle);
      idle = setTimeout(() => {
        touring = !still.matches;
        clock = 0;
        run();
      }, 4200);
      run();
      describe();
    };

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[entries.length - 1].isIntersecting;
        if (visible) run();
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(stage);

    const onMove = (e: PointerEvent) => {
      const b = svg.getBoundingClientRect();
      const share = clamp(((e.clientX - b.left) / b.width - 0.15) / 0.7, 0, 1);
      target = Math.round(share * LAST);
      hold();
    };
    const onClick = () => {
      target = target >= LAST ? 0 : target + 1;
      hold();
    };
    const onKey = (e: KeyboardEvent) => {
      let t: number | null = null;
      if (e.key === "ArrowRight" || e.key === "ArrowUp")
        t = Math.min(LAST, target + 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowDown")
        t = Math.max(0, target - 1);
      if (e.key === "Home") t = 0;
      if (e.key === "End") t = LAST;
      if (t === null) return;
      e.preventDefault();
      target = t;
      hold();
    };
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("click", onClick);
    stage.addEventListener("keydown", onKey);
    paint();

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(idle);
      io.disconnect();
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("click", onClick);
      stage.removeEventListener("keydown", onKey);
    };
  }, [loaded, LAST, screenPerCmUp, steps]);

  return (
    <figure className={`m-0 ${className}`}>
      <div className="iso relative rounded-xl  bg-black ">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 font-mono text-[11px] uppercase tracking-wider text-neutral-500"
        ></div>
        <div
          ref={stageRef}
          tabIndex={0}
          role="slider"
          aria-label={sliderLabel}
          aria-valuemin={0}
          aria-valuemax={LAST}
          aria-valuenow={LAST}
          aria-valuetext={steps[LAST]}
          className="relative mx-auto aspect-square w-full max-w-150 cursor-pointer touch-pan-y rounded-lg outline-none focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-neutral-500"
        >
          <div
            ref={artRef}
            aria-label={ariaLabel}
            className="h-full w-full"
          />
          {!loaded && (
            <div className="absolute inset-[18%] animate-pulse rounded-lg bg-neutral-900/60" />
          )}
        </div>
      </div>
      {showCaption && (
        <figcaption className="mt-3 text-sm text-neutral-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
