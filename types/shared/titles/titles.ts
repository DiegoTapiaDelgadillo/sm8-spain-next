export interface TitlesProps {
  title: string;
  subtitle?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  /** Etiqueta del título. Por defecto `h2`: la página solo tiene un `h1` (hero). */
  as?: "h1" | "h2" | "h3";
  /**
   * Revelado al hacer scroll: el título sube palabra a palabra
   * (`data-reveal="words"`) y el subtítulo entra con fade-up. Por defecto `true`.
   */
  reveal?: boolean;
}
