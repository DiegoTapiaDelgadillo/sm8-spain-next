import type Lenis from "lenis";

/**
 * Instancia única de Lenis (la crea y destruye `SmoothScroll`). `null` cuando el scroll es
 * nativo: táctil, `prefers-reduced-motion` o antes de hidratar. Solo se usa en el cliente.
 */
let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis;
};

export const getLenis = () => instance;

/**
 * Píxeles que le faltan al scroll real para llegar al destino de Lenis (0 sin Lenis).
 * Lo usa `useScrollProgress` para medir contra el destino y no contra la posición
 * interpolada, así la escena de Andamios no suma una segunda inercia.
 */
export const getScrollLead = () =>
  instance ? instance.targetScroll - window.scrollY : 0;

/**
 * Scroll vertical inmediato (sin animación). Con Lenis activo pasa por él para que no
 * "devuelva" la página a su posición interpolada en el siguiente frame.
 */
export const scrollToImmediate = (top: number) => {
  if (instance) instance.scrollTo(top, { immediate: true, force: true });
  else window.scrollTo({ top, behavior: "instant" });
};

/** Para Lenis mientras hay un overlay que bloquea el scroll (menú móvil). */
export const stopLenis = () => instance?.stop();
export const startLenis = () => instance?.start();
