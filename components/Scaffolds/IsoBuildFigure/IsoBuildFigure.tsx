"use client";

import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from "react";
import "./iso-figure.css";
import {
  collectGroups,
  fetchSvg,
  paintSteps,
  type StepGroup,
} from "./isoSteps";

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

/** Control externo de la figura en `mode="scroll"`. */
export type IsoBuildHandle = {
  /**
   * Pinta el montaje en el progreso `p` (float de 0 a `steps.length - 1`; se recorta a ese rango).
   * Escribe directamente en el SVG, sin re-render de React. Si el SVG aún no ha cargado,
   * guarda el valor y lo pinta en cuanto llega. En `mode="auto"` no hace nada.
   */
  setProgress: (p: number) => void;
};

export type IsoBuildMode = "auto" | "scroll";

export type IsoBuildFigureProps = {
  data: IsoBuildData;
  showCaption?: boolean;
  className?: string;
  /**
   * `"auto"` (por defecto): bucle de montaje automático + ratón, clic y teclado (`role="slider"`).
   * `"scroll"`: sin bucle ni interacción propia; el padre marca el progreso con `ref.setProgress`.
   * Es una imagen (`role="img"`) que empieza en el paso 0 (solo la base).
   */
  mode?: IsoBuildMode;
  /**
   * Carga el SVG ya, sin esperar a que la figura se acerque a la pantalla (por defecto la
   * carga un IntersectionObserver con 400 px de margen). Puede pasar de `false` a `true`
   * en cualquier momento: así el padre decide cuándo precargar (p. ej. al acercarse la sección).
   */
  eager?: boolean;
  ref?: Ref<IsoBuildHandle>;
};

const TOUR_SECONDS = 12;

// Recorrido automático: base 1 s, un paso por segundo, y el andamio completo hasta el final.
const tourAt = (t: number, LAST: number) => {
  const s = t % TOUR_SECONDS;
  return s < 1 ? 0 : Math.min(LAST, Math.floor(s - 1));
};
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

export const IsoBuildFigure = ({
  data,
  showCaption = true,
  className = "",
  mode = "auto",
  eager = false,
  ref,
}: IsoBuildFigureProps) => {
  const { svgUrl, screenPerCmUp, steps, ariaLabel, sliderLabel, caption } = data;
  const LAST = steps.length - 1;
  const scroll = mode === "scroll";
  const stageRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const [loaded, setLoaded] = useState(false);
  // Modo scroll: progreso pedido por el padre y estado de pintado (grupos + último valor pintado).
  const progressRef = useRef(0);
  const controlledRef = useRef<{
    groups: StepGroup[];
    drawn: number | null;
  } | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      setProgress: (p: number) => {
        if (!scroll) return;
        progressRef.current = clamp(Number.isFinite(p) ? p : 0, 0, LAST);
        const c = controlledRef.current;
        if (c)
          c.drawn = paintSteps(
            c.groups,
            progressRef.current,
            screenPerCmUp,
            c.drawn,
          );
      },
    }),
    [scroll, LAST, screenPerCmUp],
  );

  // 1 · Carga el dibujo (≈130 KB comprimido) cuando la figura se acerca a la pantalla, o ya si `eager`.
  useEffect(() => {
    const stage = stageRef.current;
    const art = artRef.current;
    if (!stage || !art) return;
    let cancelled = false;

    const load = () =>
      fetchSvg(svgUrl)
        .then((svg) => {
          if (cancelled) return;
          if (art.dataset.src !== svgUrl) {
            art.innerHTML = svg;
            art.dataset.src = svgUrl;
          }
          if (scroll) {
            // Pinta en el mismo tick de la inyección para no enseñar un frame del andamio completo.
            const groups = collectGroups(art);
            controlledRef.current = {
              groups,
              drawn: paintSteps(groups, progressRef.current, screenPerCmUp, null),
            };
          } else {
            controlledRef.current = null;
          }
          setLoaded(true);
        })
        .catch(() => undefined);

    if (eager) {
      load();
      return () => {
        cancelled = true;
      };
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[entries.length - 1].isIntersecting) return;
        io.disconnect();
        load();
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(stage);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [svgUrl, eager, scroll, screenPerCmUp]);

  // 2 · Modo auto: un único bucle que escribe atributos, sin re-renderizar React.
  useEffect(() => {
    if (!loaded || scroll) return;
    const stage = stageRef.current!;
    const svg = artRef.current!.querySelector("svg");
    const readout = readoutRef.current;
    if (!svg) return;

    const groups = collectGroups(artRef.current!);
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
      drawn = paintSteps(groups, p, screenPerCmUp, drawn);
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
  }, [loaded, scroll, LAST, screenPerCmUp, steps]);

  const stageA11y = scroll
    ? { role: "img", "aria-label": ariaLabel }
    : {
        tabIndex: 0,
        role: "slider",
        "aria-label": sliderLabel,
        "aria-valuemin": 0,
        "aria-valuemax": LAST,
        "aria-valuenow": LAST,
        "aria-valuetext": steps[LAST],
      };

  return (
    <figure className={`m-0 ${className}`}>
      <div className="iso relative rounded-xl  bg-black ">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 font-mono text-[11px] uppercase tracking-wider text-neutral-500"
        ></div>
        <div
          ref={stageRef}
          {...stageA11y}
          className={`relative mx-auto aspect-square w-full max-w-150 rounded-lg ${
            scroll
              ? ""
              : "cursor-pointer touch-pan-y outline-none focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-neutral-500"
          }`}
        >
          <div
            ref={artRef}
            aria-label={scroll ? undefined : ariaLabel}
            className="h-full w-full"
          />
          {!loaded && (
            <div className="absolute inset-[18%] animate-pulse rounded-lg bg-neutral-900/60" />
          )}
        </div>
      </div>
      {showCaption && (
        <figcaption className="mt-3 text-sm text-neutral-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
