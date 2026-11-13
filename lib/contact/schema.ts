import {
  parsePhoneNumberFromString,
  type PhoneNumber,
} from "libphonenumber-js";
import * as z from "zod";
import {
  getCountry,
  isCountryCode,
  type CountryCode,
} from "@/lib/contact/countries";

/**
 * Esquema único del formulario de contacto (specs 03 y 06). Lo usan el
 * formulario (cliente) y `POST /api/contact` (servidor), así las reglas no se
 * separan. Sin imports de servidor: se puede importar en componentes cliente.
 *
 * El teléfono se valida con `libphonenumber-js` (metadatos `min`) según el país
 * elegido; si el número trae su propio prefijo (`+39 …`) manda ese prefijo.
 * La salida da `phone` en E.164 (`+393123456789`) y `phoneCountry` con el país
 * real del número.
 */

// Letras latinas (tildes, ñ, ü, ç…), marcas combinantes, espacios, guion y
// apóstrofo (recto o tipográfico, que es el que mete el teclado del móvil).
const NAME_CHARS = "\\p{Script=Latin}\\p{M}' ’\\-";

/** Nombre válido (al menos una letra). */
export const NAME_REGEX = new RegExp(`^(?=.*\\p{L})[${NAME_CHARS}]+$`, "u");

/** Caracteres no permitidos al escribir (para filtrar en el `onChange`). */
export const NAME_DISALLOWED_REGEX = new RegExp(`[^${NAME_CHARS}]`, "gu");
/** Teléfono: dígitos, espacios, `-`, `(`, `)` y `+`. */
export const PHONE_DISALLOWED_REGEX = /[^\d+ ()-]/g;

/** Filtra el nombre mientras se escribe. */
export const filterNameInput = (value: string) =>
  value.replace(NAME_DISALLOWED_REGEX, "");

/**
 * Filtra el teléfono mientras se escribe: dígitos, espacios, `-`, `(`, `)` y
 * un `+` solo al inicio.
 */
export const filterPhoneInput = (value: string) =>
  value.replace(PHONE_DISALLOWED_REGEX, "").replace(/(?!^)\+/g, "");

/** Número parseado y válido, o `undefined`. */
const parseValidPhone = (
  phone: string,
  country: CountryCode,
): PhoneNumber | undefined => {
  const parsed = parsePhoneNumberFromString(phone, country);
  return parsed?.isValid() ? parsed : undefined;
};

/** Teléfono E.164 en formato internacional legible: `+39 312 345 6789`. */
export const formatPhoneInternational = (e164: string) =>
  parsePhoneNumberFromString(e164)?.formatInternational() ?? e164;

// Texto obligatorio: recorta, exige valor y para ahí si está vacío.
const requiredText = (emptyMessage: string) =>
  z
    .string({ error: emptyMessage })
    .trim()
    .min(1, { error: emptyMessage, abort: true });

export const MAX_LENGTHS = {
  name: 80,
  // E.164 tiene como mucho 15 cifras; el resto es margen para separadores.
  phone: 25,
  email: 254,
  message: 2000,
} as const;

const COUNTRY_ERROR = "Elige el país del teléfono.";

const nameField = requiredText("Escribe tu nombre completo.")
  .min(2, "El nombre debe tener al menos 2 caracteres.")
  .max(MAX_LENGTHS.name, "El nombre no puede pasar de 80 caracteres.")
  .regex(
    NAME_REGEX,
    "El nombre solo puede llevar letras, espacios, guiones y apóstrofos.",
  );

/**
 * Teléfono + país. Va en su propio objeto porque la validación necesita los
 * dos campos: un check sobre el objeto completo no se ejecutaría si otro campo
 * vacío corta con `abort` (zod 4), y el error del teléfono no saldría a la vez
 * que los demás.
 */
const phoneSchema = z
  .object({
    phone: requiredText("Escribe tu teléfono.").max(
      MAX_LENGTHS.phone,
      "Escribe un teléfono válido.",
    ),
    phoneCountry: z
      .string({ error: COUNTRY_ERROR })
      .refine(isCountryCode, { error: COUNTRY_ERROR, abort: true }),
  })
  .superRefine(({ phone, phoneCountry }, ctx) => {
    if (parseValidPhone(phone, phoneCountry)) return;
    // Con prefijo propio (`+39…`) manda el prefijo, no el país elegido.
    const ownPrefix = phone.trim().startsWith("+");
    const countryCode = ownPrefix
      ? parsePhoneNumberFromString(phone)?.country
      : phoneCountry;
    const country = countryCode ? getCountry(countryCode)?.name : undefined;
    ctx.addIssue({
      code: "custom",
      path: ["phone"],
      message: country
        ? `Escribe un teléfono válido de ${country}.`
        : "Escribe un teléfono válido.",
    });
  })
  .transform(({ phone, phoneCountry }) => {
    // Ya validado arriba: aquí siempre hay número.
    const parsed = parseValidPhone(phone, phoneCountry);
    return {
      phone: parsed?.number ?? phone,
      // Números no geográficos (+800…) no tienen país: se deja el elegido.
      phoneCountry: parsed?.country ?? phoneCountry,
    };
  });

const restSchema = z.object({
  email: requiredText("Escribe tu correo electrónico.")
    .max(MAX_LENGTHS.email, "El correo no puede pasar de 254 caracteres.")
    .pipe(z.email("Escribe un correo electrónico válido.")),
  message: requiredText("Escribe tu mensaje.")
    .min(10, "El mensaje debe tener al menos 10 caracteres.")
    .max(MAX_LENGTHS.message, "El mensaje no puede pasar de 2000 caracteres."),
  privacy: z.literal(true, {
    error: "Debes aceptar la política de privacidad.",
  }),
});

/** Campos en orden: name, phone, phoneCountry, email, message, privacy. */
export const contactSchema = z
  .object({ name: nameField })
  .and(phoneSchema)
  .and(restSchema);

/** Lo que rellena el formulario (antes de recortar y normalizar). */
export type ContactFormValues = Omit<
  z.input<typeof contactSchema>,
  "privacy"
> & {
  privacy: boolean;
};
/** Datos ya validados: `phone` en E.164 y `phoneCountry` real del número. */
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
