export interface InputProps {
  label: string;
  /** También es el `id` del input; el error usa `{name}-error`. */
  name: string;
  placeholder?: string;
  value: string;
  type: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Mensaje de error; si existe, el campo se marca inválido. */
  error?: string;
  required?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: React.InputHTMLAttributes<HTMLInputElement>["autoComplete"];
  maxLength?: number;
}
