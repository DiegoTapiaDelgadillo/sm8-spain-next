import { FieldErrorProps } from "@/types/shared/forms/fieldError/fieldError";

/** Mensaje de error bajo un campo. red-400 sobre el fondo de la tarjeta (~#0e0e0e): 6,7:1 (AA). */
export const FieldError = ({ id, message }: FieldErrorProps) => {
  if (!message) return null;

  return (
    <p id={id} className=" mt-1 text-xs text-red-400">
      {message}
    </p>
  );
};
