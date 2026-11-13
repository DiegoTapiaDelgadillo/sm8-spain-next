/** País del selector. Tipo mínimo para no depender de `lib/contact`. */
export interface CountryOption {
  /** Código ISO 3166-1 alfa-2 (`ES`, `IT`…); es el `value` del `<option>`. */
  code: string;
  /** Nombre en español (`Italia`). */
  name: string;
  /** Prefijo con `+` (`+39`). */
  dialCode: string;
}

export interface PhoneInputProps {
  label: string;
  /** `id` del input; el select usa `{name}-country` y el error `{name}-error`. */
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Código ISO del país seleccionado. */
  country: string;
  onCountryChange: (code: string) => void;
  /** Todos los países, ya ordenados. */
  countries: readonly CountryOption[];
  /** Códigos del grupo "Frecuentes", en el orden en que se muestran. */
  frequentCodes?: readonly string[];
  /** Mensaje de error; si existe, input y select se marcan inválidos. */
  error?: string;
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
  /** Por defecto `tel-national` (el prefijo lo da el selector). */
  autoComplete?: React.InputHTMLAttributes<HTMLInputElement>["autoComplete"];
  /** Nombre accesible del select. Por defecto "País del teléfono". */
  selectLabel?: string;
}
