import type { ReactNode } from "react";

export interface MarqueeProps {
  /** Elementos de la marquesina; cada uno se envuelve en un `<li>`. */
  items: ReactNode[];
  /** Nombre accesible de la lista (p. ej. "Clientes de SM8 España"). */
  ariaLabel: string;
  /** Segundos por vuelta. Por defecto 40. */
  duration?: number;
  /** Separación entre elementos (cualquier longitud CSS). Por defecto `3rem`. */
  gap?: string;
  className?: string;
  /** Muestra el botón de pausa/reanudar (WCAG 2.2.2). Por defecto `true`. */
  showToggle?: boolean;
  /** Etiqueta del botón en marcha. Por defecto "Pausar animación de logos". */
  pauseLabel?: string;
  /** Etiqueta del botón en pausa. Por defecto "Reanudar animación de logos". */
  playLabel?: string;
}

export interface MarqueeToggleProps {
  pauseLabel: string;
  playLabel: string;
}
