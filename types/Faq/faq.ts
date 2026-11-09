export interface FaqItem {
  /** Identificador estable (key de React y referencia en el JSON-LD). */
  id: string;
  question: string;
  /** Texto plano: se reutiliza tal cual en el JSON-LD `FAQPage`. */
  answer: string;
}
