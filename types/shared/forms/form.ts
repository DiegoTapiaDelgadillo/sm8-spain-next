export interface FormProps {
  children: React.ReactNode;
  onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
  /** Estado de la casilla de privacidad (controlada por el formulario padre). */
  privacyChecked: boolean;
  onPrivacyChange: (checked: boolean) => void;
  privacyError?: string;
  /** Deshabilita el botón y muestra "Enviando…". */
  isSubmitting?: boolean;
}
