/** Figura isométrica de cada categoría (se resuelve al wrapper en el cliente). */
export type ScaffoldFigureKey = "fachada" | "obra" | "industria";

export interface ScaffoldCategory {
  category: string;
  title: string;
  description: string;
  figure: ScaffoldFigureKey;
}

export interface ScaffoldsScrollProps {
  categories: readonly ScaffoldCategory[];
}
