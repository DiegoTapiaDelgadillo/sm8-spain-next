export interface ButtonProps {
  onClick?: () => void;
  text: string;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
  /** Si se pasa, el botón se renderiza como `<a href>` con los mismos estilos. */
  href?: string;
}
