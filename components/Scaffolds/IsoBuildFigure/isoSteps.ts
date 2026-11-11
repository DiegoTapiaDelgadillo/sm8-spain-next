// Montaje por pasos de las figuras isométricas generadas por andamio/gen-next.mjs.
// Lo comparten IsoBuildFigure (sección Andamios) y HeroScaffold (hero). Sin React: solo DOM.

/**
 * Grupo `<g data-step>` del SVG y el paso de montaje al que pertenece.
 * `e` guarda el último avance pintado para no reescribir el DOM de los grupos que no cambian.
 */
export type StepGroup = { g: SVGGElement; s: number; e?: number };

/** Caída por defecto de cada nivel al montarse, en cm reales. */
export const DROP_CM = 80;

/** Ease-out cúbico recortado a [0, 1]. */
export const ease = (t: number) =>
  t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(1 - t, 3);

export const collectGroups = (root: ParentNode): StepGroup[] =>
  Array.from(root.querySelectorAll<SVGGElement>("svg [data-step]")).map(
    (g) => ({ g, s: Number(g.dataset.step) }),
  );

/**
 * Pinta los grupos `[data-step]` para el progreso `p`: cada grupo cae desde `dropCm` y aparece
 * con fundido (ease-out cúbico) mientras `p` recorre su tramo. Si `p === drawn` no toca el DOM.
 * Devuelve el progreso pintado para pasarlo como `drawn` en la siguiente llamada.
 */
export const paintSteps = (
  groups: readonly StepGroup[],
  p: number,
  screenPerCmUp: number,
  drawn: number | null,
  dropCm: number = DROP_CM,
): number => {
  if (drawn === p) return p;
  for (const group of groups) {
    const { g, s } = group;
    const e = ease(p - s + 1);
    if (group.e === e) continue;
    group.e = e;
    if (e <= 0) {
      g.style.display = "none";
      continue;
    }
    g.style.display = "";
    g.setAttribute("opacity", e.toFixed(3));
    const dy = screenPerCmUp * dropCm * (1 - e);
    if (e >= 1) g.removeAttribute("transform");
    else g.setAttribute("transform", `translate(0 ${dy.toFixed(2)})`);
  }
  return p;
};

// Una sola descarga por SVG aunque haya varias instancias o el efecto se repita (StrictMode).
const svgCache = new Map<string, Promise<string>>();
export const fetchSvg = (url: string) => {
  let pending = svgCache.get(url);
  if (!pending) {
    pending = fetch(url).then((r) => {
      if (!r.ok) throw new Error(`${r.status} ${url}`);
      return r.text();
    });
    pending.catch(() => svgCache.delete(url));
    svgCache.set(url, pending);
  }
  return pending;
};
