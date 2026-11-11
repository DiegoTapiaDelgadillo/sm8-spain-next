import * as z from "zod";

/**
 * Esquema único del formulario de contacto (spec 03). Lo usan el formulario
 * (cliente) y `POST /api/contact` (servidor), así las reglas no se separan.
 * Sin imports de servidor: se puede importar en componentes cliente.
 */

// Letras latinas (tildes, ñ, ü, ç…), marcas combinantes, espacios, guion y
// apóstrofo (recto o tipográfico, que es el que mete el teclado del móvil).
const NAME_CHARS = "\\p{Script=Latin}\\p{M}' ’\\-";
// Letras, números, espacios y . , & - '
const COMPANY_CHARS = "\\p{Script=Latin}\\p{M}\\d .,&'’\\-";

/** Nombre y ciudad válidos (al menos una letra). */
export const NAME_REGEX = new RegExp(`^(?=.*\\p{L})[${NAME_CHARS}]+$`, "u");
/** Empresa válida (al menos una letra o número). */
export const COMPANY_REGEX = new RegExp(
  `^(?=.*[\\p{L}\\d])[${COMPANY_CHARS}]+$`,
  "u",
);
/** Teléfono español ya normalizado (sin espacios): 9 cifras 6/7/8/9, con o sin +34. */
export const PHONE_REGEX = /^(?:\+34)?[6-9]\d{8}$/;

/** Caracteres no permitidos al escribir (para filtrar en el `onChange`). */
export const NAME_DISALLOWED_REGEX = new RegExp(`[^${NAME_CHARS}]`, "gu");
export const PHONE_DISALLOWED_REGEX = /[^\d+ ]/g;

/** Filtra nombre o ciudad mientras se escribe. */
export const filterNameInput = (value: string) =>
  value.replace(NAME_DISALLOWED_REGEX, "");

/** Filtra el teléfono mientras se escribe: dígitos, espacios y un `+` solo al inicio. */
export const filterPhoneInput = (value: string) =>
  value.replace(PHONE_DISALLOWED_REGEX, "").replace(/(?!^)\+/g, "");

/** Quita espacios del teléfono antes de validarlo y enviarlo. */
const normalizePhone = (value: string) => value.replace(/\s+/g, "");

// Texto obligatorio: recorta, exige valor y para ahí si está vacío.
const requiredText = (emptyMessage: string) =>
  z
    .string({ error: emptyMessage })
    .trim()
    .min(1, { error: emptyMessage, abort: true });

export const MAX_LENGTHS = {
  name: 60,
  email: 254,
  phone: 20,
  subject: 100,
  company: 80,
  city: 60,
  message: 2000,
} as const;

export const contactSchema = z.object({
  name: requiredText("Escribe tu nombre.")
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(MAX_LENGTHS.name, "El nombre no puede pasar de 60 caracteres.")
    .regex(
      NAME_REGEX,
      "El nombre solo puede llevar letras, espacios, guiones y apóstrofos.",
    ),
  email: requiredText("Escribe tu correo electrónico.")
    .max(MAX_LENGTHS.email, "El correo no puede pasar de 254 caracteres.")
    .pipe(z.email("Escribe un correo electrónico válido.")),
  phone: requiredText("Escribe tu teléfono.")
    .max(MAX_LENGTHS.phone, "Escribe un teléfono español válido.")
    .transform(normalizePhone)
    .pipe(
      z
        .string()
        .regex(
          PHONE_REGEX,
          "Escribe un teléfono español válido (9 cifras, con o sin +34).",
        ),
    ),
  subject: requiredText("Escribe el asunto.")
    .min(3, "El asunto debe tener al menos 3 caracteres.")
    .max(MAX_LENGTHS.subject, "El asunto no puede pasar de 100 caracteres."),
  company: requiredText("Escribe el nombre de tu empresa.")
    .min(2, "La empresa debe tener al menos 2 caracteres.")
    .max(MAX_LENGTHS.company, "La empresa no puede pasar de 80 caracteres.")
    .regex(
      COMPANY_REGEX,
      "La empresa solo puede llevar letras, números, espacios y . , & - '",
    ),
  city: requiredText("Escribe tu ciudad.")
    .min(2, "La ciudad debe tener al menos 2 caracteres.")
    .max(MAX_LENGTHS.city, "La ciudad no puede pasar de 60 caracteres.")
    .regex(
      NAME_REGEX,
      "La ciudad solo puede llevar letras, espacios, guiones y apóstrofos.",
    ),
  message: requiredText("Escribe tu mensaje.")
    .min(10, "El mensaje debe tener al menos 10 caracteres.")
    .max(MAX_LENGTHS.message, "El mensaje no puede pasar de 2000 caracteres."),
  privacy: z.literal(true, {
    error: "Debes aceptar la política de privacidad.",
  }),
});

/** Lo que rellena el formulario (antes de recortar y normalizar). */
export type ContactFormValues = Omit<
  z.input<typeof contactSchema>,
  "privacy"
> & {
  privacy: boolean;
};
/** Datos ya validados (con `privacy: true`). */
export type ContactSchemaOutput = z.output<typeof contactSchema>;
/** Datos del contacto para los correos (sin la casilla de privacidad). */
export type ContactPayload = Omit<ContactSchemaOutput, "privacy">;
/** Errores por campo, tal como los devuelve `POST /api/contact`. */
export type ContactFieldErrors = Partial<
  Record<keyof ContactFormValues, string[]>
>;

/** Respuesta JSON de `POST /api/contact`. */
export type ContactResponse =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: ContactFieldErrors };
