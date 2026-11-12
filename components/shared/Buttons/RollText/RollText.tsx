import { RollTextProps } from "@/types/shared/button/buttonProps";

/**
 * Texto que rueda al pasar el ratón (estilos `.roll-text` en globals.css). El
 * elemento clicable debe llevar la clase `roll-trigger`. La copia que entra desde
 * abajo es un `::after` con texto alternativo vacío: no está en el DOM (ni en el
 * texto del enlace, Ctrl+F o al copiar) y los lectores de pantalla no la leen.
 */
export const RollText = ({ text }: RollTextProps) => {
  return (
    <span className="roll-text" data-text={text}>
      <span>{text}</span>
    </span>
  );
};
