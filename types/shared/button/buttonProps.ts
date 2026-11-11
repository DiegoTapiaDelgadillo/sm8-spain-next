export interface ButtonProps {
  onClick?: () => void;
  text: string;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
  /** Si se pasa, el botón se renderiza como `<a href>` con los mismos estilos. */
  href?: string;
  /** Solo para `<button>` (se ignora con `href`). */
  disabled?: boolean;
  /**
   * Acción en curso (p. ej. enviando): `aria-busy` + `aria-disabled`. No usa
   * `disabled` para no perder el foco; quien lo usa debe evitar el doble envío.
   */
  busy?: boolean;
}
