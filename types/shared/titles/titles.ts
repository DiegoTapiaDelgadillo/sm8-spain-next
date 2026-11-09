export interface TitlesProps {
  title: string;
  subtitle?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  /** Etiqueta del título. Por defecto `h2`: la página solo tiene un `h1` (hero). */
  as?: "h1" | "h2" | "h3";
}
