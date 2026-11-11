export interface TextAreaProps {
  label: string;
  /** También es el `id` del textarea; el error usa `{name}-error`. */
  name: string;
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  /** Mensaje de error; si existe, el campo se marca inválido. */
  error?: string;
  required?: boolean;
  autoComplete?: React.TextareaHTMLAttributes<HTMLTextAreaElement>["autoComplete"];
  maxLength?: number;
  rows?: number;
}
