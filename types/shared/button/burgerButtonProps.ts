import type { Ref } from "react";

export interface BurgerButtonProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  /** `id` del menú que controla el botón (para `aria-controls`). */
  controlsId?: string;
  /** Ref al `<button>` (para devolverle el foco al cerrar con Escape). */
  ref?: Ref<HTMLButtonElement>;
}
