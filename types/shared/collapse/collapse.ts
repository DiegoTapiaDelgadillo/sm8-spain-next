import type { ReactNode } from "react";

export interface CollapseProps {
  /** Texto del `summary` (la pregunta). */
  title: string;
  /** Contenido que se muestra al abrir. Siempre está en el HTML del servidor. */
  children: ReactNode;
  className?: string;
  /** Mismo `name` en varios `Collapse` = acordeón exclusivo (solo uno abierto). */
  name?: string;
  /** Semántica del título dentro del `summary`. `"none"` lo pinta como `span`. Por defecto `h3`. */
  headingLevel?: "h3" | "h4" | "none";
}
