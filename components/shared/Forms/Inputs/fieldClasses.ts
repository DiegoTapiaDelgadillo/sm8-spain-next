/**
 * Clases comunes de `InputText` y `TextArea`.
 * Móvil: `text-base` (16 px, evita el zoom de iOS al enfocar) y 46 px de alto;
 * desde `md`, `text-sm` como el diseño original.
 */
export const fieldClasses = (invalid: boolean) =>
  ` mt-1 w-full rounded-xl border px-3 py-2.5 text-base text-white placeholder:text-neutral-500 transition-colors duration-200 focus:outline-none focus:ring-2 md:py-2 md:text-sm ${
    invalid
      ? "border-red-500 focus:border-red-500 focus:ring-blue-400"
      : "border-neutral-600 focus:border-blue-500 focus:ring-blue-500"
  }`;
