"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import type {
  ScaffoldFigureKey,
  ScaffoldsScrollProps,
} from "@/types/Scaffolds/scaffolds";
import type { IsoBuildHandle } from "@/components/Scaffolds/IsoBuildFigure/IsoBuildFigure";
import { ScaffoldFigure } from "@/components/Scaffolds/ScaffoldFigure/ScaffoldFigure";
import { ConstructionFigure } from "@/components/Scaffolds/ConstructionFigure/ConstructionFigure";
import { IndustryFigure } from "@/components/Scaffolds/IndustryFigure/IndustryFigure";
import { MainButton } from "@/components/shared/Buttons/MainButton/MainButton";
import { DocumentTextSvg } from "@/components/shared/Icons/DocumentText";
import { useScrollProgress } from "./useScrollProgress";

// ── Recorrido (unidades: % de la altura de pantalla de scroll) ─────────────────────────
/** Pasos de montaje de cada figura (paso 0 = base … paso 4 = completo). */
const BUILD_STEPS = 4;
/** Scroll por cada paso de montaje. */
const STEP_VH = 60;
/** Pausa con el andamio completo antes del fundido. */
const PAUSE_VH = 30;
/** Fundido cruzado hacia la siguiente categoría (la última no tiene). */
const FADE_VH = 45;
/** Parte del fundido que ocupa cada lado: sale en [0, 0,6] y entra en [0,4, 1] (solapan en el centro). */
const FADE_SPLIT = 0.6;
/** Desplazamiento vertical del fundido (px): la que sale sube, la que entra llega desde abajo. */
const FADE_SHIFT_PX = 24;
/** Constante de tiempo del suavizado del scroll (s). */
const SMOOTH_SECONDS = 0.12;

const BUILD_VH = BUILD_STEPS * STEP_VH;
const CATEGORY_VH = BUILD_VH + PAUSE_VH + FADE_VH;
/** Recorrido total fijado para `n` categorías: la última no tiene fundido de salida. */
const travelVh = (n: number) => n * CATEGORY_VH - FADE_VH;

const FIGURES = {
  fachada: ScaffoldFigure,
  obra: ConstructionFigure,
  industria: IndustryFigure,
} satisfies Record<ScaffoldFigureKey, unknown>;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (t: number) => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};

// Movimiento reducido: `useSyncExternalStore` da `false` en el servidor y en la hidratación,
// y React vuelve a renderizar con el valor real justo después (sin desajuste de hidratación).
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const useReducedMotion = () =>
  useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );

type Frame = { o: number; y: number };

const writeFrame = (
  el: HTMLElement | null,
  prev: Frame | undefined,
  o: number,
  y: number,
  hide: boolean,
): Frame | undefined => {
  if (!el) return prev;
  const oq = Math.round(o * 1000) / 1000;
  const yq = Math.round(y * 10) / 10;
  if (prev && prev.o === oq && prev.y === yq) return prev;
  el.style.opacity = String(oq);
  el.style.transform = yq ? `translate3d(0, ${yq}px, 0)` : "";
  if (hide) el.style.visibility = oq <= 0 ? "hidden" : "visible";
  return { o: oq, y: yq };
};

const clearFrame = (el: HTMLElement | null) => {
  if (!el) return;
  el.style.removeProperty("opacity");
  el.style.removeProperty("transform");
  el.style.removeProperty("visibility");
};

/**
 * Escena fijada de la sección Andamios: al hacer scroll se monta la figura de cada categoría
 * paso a paso y se pasa a la siguiente con un fundido cruzado. Con `prefers-reduced-motion`
 * se muestra apilado y estático (todo el cambio de layout va por CSS `motion-reduce:`).
 */
export const ScaffoldsScroll = ({ categories, id }: ScaffoldsScrollProps) => {
  const n = categories.length;
  const total = travelVh(n);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [eager, setEager] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const figures = useRef<(IsoBuildHandle | null)[]>([]);
  const figureBoxes = useRef<(HTMLDivElement | null)[]>([]);
  const textBoxes = useRef<(HTMLDivElement | null)[]>([]);
  const frames = useRef<{
    fig: (Frame | undefined)[];
    txt: (Frame | undefined)[];
  }>({
    fig: [],
    txt: [],
  });

  // Reparte el progreso 0–1 en tramos: [montaje → pausa → fundido] por categoría.
  const paint = (p: number) => {
    const u = p * total;
    let best = 0;
    let bestO = -1;
    for (let i = 0; i < n; i++) {
      const local = u - i * CATEGORY_VH;
      let o = 1;
      let y = 0;
      let step: number;
      if (i > 0 && local < 0) {
        // Entra desde abajo durante el fundido de la anterior; su figura espera en el paso 0.
        const t = clamp01((local + FADE_VH) / FADE_VH);
        o = smooth((t - (1 - FADE_SPLIT)) / FADE_SPLIT);
        y = (1 - smooth(t)) * FADE_SHIFT_PX;
        step = 0;
      } else if (i < n - 1 && local > BUILD_VH + PAUSE_VH) {
        // Sale hacia arriba con la figura completa.
        const t = clamp01((local - BUILD_VH - PAUSE_VH) / FADE_VH);
        o = 1 - smooth(t / FADE_SPLIT);
        y = -smooth(t) * FADE_SHIFT_PX;
        step = BUILD_STEPS;
      } else {
        step = Math.min(BUILD_STEPS, Math.max(0, local / STEP_VH));
      }
      figures.current[i]?.setProgress(step);
      const f = frames.current;
      f.fig[i] = writeFrame(figureBoxes.current[i], f.fig[i], o, y, true);
      f.txt[i] = writeFrame(textBoxes.current[i], f.txt[i], o, y, false);
      if (o > bestO) {
        bestO = o;
        best = i;
      }
    }
    if (best !== activeRef.current) {
      const prevText = textBoxes.current[activeRef.current];
      activeRef.current = best;
      setActive(best);
      // Si el foco estaba en el botón de la categoría que se desvanece, pásalo al de la nueva
      // (sin scroll; como `activeRef` ya apunta a ella, `focusCategory` no salta).
      if (prevText?.contains(document.activeElement)) {
        textBoxes.current[best]
          ?.querySelector<HTMLElement>("a, button")
          ?.focus({ preventScroll: true });
      }
    }
  };

  const snap = useScrollProgress(containerRef, paint, {
    enabled: !reduced,
    smoothTime: SMOOTH_SECONDS,
  });

  // Precarga de los tres SVG cuando la sección está a menos de una pantalla.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || eager) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        setEager(true);
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager]);

  // Movimiento reducido: sin estilos en línea y con los andamios completos y estáticos.
  useEffect(() => {
    if (!reduced) return;
    frames.current = { fig: [], txt: [] };
    figureBoxes.current.forEach(clearFrame);
    textBoxes.current.forEach(clearFrame);
    figures.current.forEach((h) => h?.setProgress(BUILD_STEPS));
  }, [reduced]);

  // Si el botón de una categoría no activa recibe foco (tabulador o lector de pantalla),
  // salta al inicio de su tramo. Con ratón/toque no ocurre: los bloques inactivos no reciben clics.
  const focusCategory = (i: number) => () => {
    if (reduced || i === activeRef.current) return;
    const el = containerRef.current;
    if (!el) return;
    const travel = el.offsetHeight - window.innerHeight;
    const top =
      window.scrollY +
      el.getBoundingClientRect().top +
      ((i * CATEGORY_VH) / total) * travel;
    snap();
    window.scrollTo({ top: Math.ceil(top), behavior: "instant" });
  };

  const containerStyle = {
    "--scaffolds-h": `calc(${total}svh + 100dvh)`,
  } as CSSProperties;

  return (
    <div
      id={id}
      ref={containerRef}
      style={containerStyle}
      className="relative h-(--scaffolds-h) scroll-mt-0 motion-reduce:h-auto motion-reduce:scroll-mt-20 motion-reduce:lg:scroll-mt-28"
    >
      {/*
        Escena fijada. Por debajo de `xl` las filas son [hueco · texto · figura · hueco]: la figura
        crece hasta su tamaño ideal (min(ancho, 600px), vía `contain-intrinsic-height`) y lo que sobra
        se reparte arriba y abajo, así texto y figura quedan juntos y centrados como un bloque.
        En `xl` y en móvil apaisado (pantallas bajas) pasa a dos columnas: figura | texto.
      */}
      <div className="sticky top-0 grid h-dvh grid-rows-[1fr_auto_minmax(0,auto)_1fr] overflow-hidden pt-20 pb-4 [container-type:inline-size] lg:pt-28 xl:grid-cols-2 xl:grid-rows-1 xl:items-center xl:gap-x-12 xl:pb-12 motion-safe:[@media(orientation:landscape)_and_(max-height:35rem)_and_(max-width:80rem)]:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] motion-safe:[@media(orientation:landscape)_and_(max-height:35rem)_and_(max-width:80rem)]:grid-rows-1 motion-safe:[@media(orientation:landscape)_and_(max-height:35rem)_and_(max-width:80rem)]:items-center motion-safe:[@media(orientation:landscape)_and_(max-height:35rem)_and_(max-width:80rem)]:gap-x-6 motion-safe:[@media(orientation:landscape)_and_(max-height:35rem)_and_(max-width:80rem)]:pb-3 motion-reduce:static motion-reduce:flex motion-reduce:h-auto motion-reduce:flex-col motion-reduce:gap-24 motion-reduce:overflow-visible motion-reduce:p-0 motion-reduce:[container-type:normal]">
        {categories.map((item, i) => {
          const Figure = FIGURES[item.figure];
          const hidden = !reduced && i !== active;
          const initiallyHidden = i > 0;
          return (
            // En modo animado el envoltorio es `display: contents` y todas las figuras/textos
            // se apilan en la misma celda de la escena; con movimiento reducido es una fila.
            <div
              key={item.title}
              className="contents motion-reduce:grid motion-reduce:items-center motion-reduce:gap-4 motion-reduce:xl:grid-cols-2"
            >
              <div
                ref={(node) => {
                  figureBoxes.current[i] = node;
                }}
                aria-hidden={hidden || undefined}
                inert={hidden}
                className={`col-start-1 row-start-3 flex min-h-0 items-center justify-center pt-4 [contain-intrinsic-height:min(100cqw,37.5rem)] [container-type:size] xl:row-start-1 xl:h-full xl:pt-0 motion-safe:[@media(orientation:landscape)_and_(max-height:35rem)_and_(max-width:80rem)]:row-start-1 motion-safe:[@media(orientation:landscape)_and_(max-height:35rem)_and_(max-width:80rem)]:h-full motion-safe:[@media(orientation:landscape)_and_(max-height:35rem)_and_(max-width:80rem)]:pt-0 motion-safe:will-change-[opacity,transform] motion-reduce:col-start-auto motion-reduce:row-start-auto motion-reduce:block motion-reduce:h-auto motion-reduce:pt-0 motion-reduce:[container-type:normal] ${
                  initiallyHidden
                    ? "invisible opacity-0 motion-reduce:visible motion-reduce:opacity-100"
                    : ""
                }`}
              >
                <Figure
                  ref={(handle: IsoBuildHandle | null) => {
                    figures.current[i] = handle;
                  }}
                  mode="scroll"
                  eager={eager}
                  showCaption={false}
                  className="w-[100cqmin] motion-reduce:w-full"
                />
              </div>
              <div
                ref={(node) => {
                  textBoxes.current[i] = node;
                }}
                className={`col-start-1 row-start-2 self-end xl:col-start-2 xl:row-start-1 xl:self-center motion-safe:[@media(orientation:landscape)_and_(max-height:35rem)_and_(max-width:80rem)]:col-start-2 motion-safe:[@media(orientation:landscape)_and_(max-height:35rem)_and_(max-width:80rem)]:row-start-1 motion-safe:[@media(orientation:landscape)_and_(max-height:35rem)_and_(max-width:80rem)]:self-center motion-reduce:col-start-auto motion-reduce:row-start-auto ${
                  hidden ? "pointer-events-none" : ""
                } ${initiallyHidden ? "opacity-0 motion-reduce:opacity-100" : ""}`}
              >
                {/* El texto no se oculta al lector de pantalla: las tres categorías son legibles. */}
                <div>
                  <p className="text-sm text-yellow-400 sm:text-base">
                    0{i + 1} {item.category}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white [font-family:var(--font-heading),serif] sm:text-3xl xl:mt-6 xl:text-4xl motion-safe:[@media(orientation:landscape)_and_(max-height:35rem)_and_(max-width:80rem)]:mt-1 motion-safe:[@media(orientation:landscape)_and_(max-height:35rem)_and_(max-width:80rem)]:text-xl">
                    {item.title}
                  </h2>
                  <p className="mt-2 mb-4 text-sm text-neutral-400 sm:text-base xl:mb-6 motion-safe:[@media(orientation:landscape)_and_(max-height:35rem)_and_(max-width:80rem)]:mb-3 motion-safe:[@media(orientation:landscape)_and_(max-height:35rem)_and_(max-width:80rem)]:text-sm">
                    {item.description}
                  </p>
                </div>
                {/* Al recibir foco el botón de otra categoría, la escena salta a ella. */}
                <div onFocus={focusCategory(i)}>
                  <MainButton
                    icon={<DocumentTextSvg className=" w-4" />}
                    text="Solicitar presupuesto"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
