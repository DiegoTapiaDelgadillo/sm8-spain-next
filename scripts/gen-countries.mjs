// Genera lib/contact/countries.ts (spec 06): todos los países que conoce
// libphonenumber-js, con su nombre en español de España y su prefijo.
// Se versiona el resultado para que servidor y navegador pinten el mismo texto
// (sin depender del ICU de cada entorno). Uso: node scripts/gen-countries.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";

const OUT = fileURLToPath(new URL("../lib/contact/countries.ts", import.meta.url));
const FREQUENT = ["ES", "PT", "FR", "IT", "AD", "DE", "GB"];

const names = new Intl.DisplayNames(["es-ES"], { type: "region", fallback: "none" });

const countries = [];
const skipped = [];
for (const code of getCountries()) {
  const name = names.of(code);
  if (!name || name === code) {
    skipped.push(code);
    continue;
  }
  countries.push({ code, name, dialCode: `+${getCountryCallingCode(code)}` });
}
countries.sort((a, b) => a.name.localeCompare(b.name, "es"));

for (const code of FREQUENT) {
  if (!countries.some((c) => c.code === code)) {
    throw new Error(`Falta el país frecuente ${code}`);
  }
}

const rows = countries
  .map((c) => `  { code: ${JSON.stringify(c.code)}, name: ${JSON.stringify(c.name)}, dialCode: ${JSON.stringify(c.dialCode)} },`)
  .join("\n");

const file = `// ARCHIVO GENERADO por scripts/gen-countries.mjs: no editar a mano.
// Regenerar con: node scripts/gen-countries.mjs
// Países de libphonenumber-js con nombre en es-ES (Intl.DisplayNames) y prefijo.
// Sin imports de servidor: lo usan el formulario (cliente) y el endpoint.
import type { CountryCode as LibCountryCode } from "libphonenumber-js";

/** Código ISO 3166-1 alfa-2 que entiende libphonenumber-js ("ES", "IT"…). */
export type CountryCode = LibCountryCode;

export interface Country {
  code: CountryCode;
  /** Nombre en español de España. */
  name: string;
  /** Prefijo internacional con "+", p. ej. "+39". */
  dialCode: string;
}

/** Todos los países, ordenados por nombre en español. */
export const COUNTRIES: readonly Country[] = [
${rows}
];

/** Países que se muestran arriba del selector, en este orden. */
export const FREQUENT_COUNTRY_CODES = ${JSON.stringify(FREQUENT).replace(/,/g, ", ")} as const satisfies readonly CountryCode[];

/** País preseleccionado. */
export const DEFAULT_COUNTRY: CountryCode = "ES";

const BY_CODE: ReadonlyMap<string, Country> = new Map(
  COUNTRIES.map((country) => [country.code, country]),
);

/** País de la lista por su código, o \`undefined\` si no está. */
export const getCountry = (code: string): Country | undefined =>
  BY_CODE.get(code);

/** \`true\` si el texto es un código de país de la lista. */
export const isCountryCode = (value: string): value is CountryCode =>
  BY_CODE.has(value);
`;

writeFileSync(OUT, file);
console.log(`countries.ts: ${countries.length} países. Omitidos: ${skipped.join(", ") || "ninguno"}`);
