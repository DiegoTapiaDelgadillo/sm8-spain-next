export interface CheckBoxProps {
  /** `id` del botón (para `getElementById`, foco al error y `<label htmlFor>`). */
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** `id` del elemento que hace de etiqueta (`aria-labelledby`). */
  labelledBy?: string;
  /** `id` del mensaje de ayuda o error (`aria-describedby`). */
  describedBy?: string;
  /** Pinta el estado de error (borde rojo) y pone `aria-invalid`. */
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
}
