/** Datos del andamio piramidal del hero (generados por `node andamio/gen-next.mjs piramide`). */
export interface HeroScaffoldData {
  svgUrl: string;
  /** Desplazamiento en pantalla (px del viewBox) por cada cm de altura real. */
  screenPerCmUp: number;
  /** Un texto por paso de montaje (base, niveles y barandillas). */
  steps: readonly string[];
  /** Ancho / alto del viewBox del SVG. */
  ratio: number;
}

export interface HeroScaffoldProps {
  /** Clases extra del escenario (márgenes, etc.); el escenario ya ocupa el alto libre con `flex-1`. */
  className?: string;
}
