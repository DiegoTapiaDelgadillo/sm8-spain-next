import { PhoneInputProps } from "@/types/shared/forms/phoneInput/phoneInput";
import { ChevronDownSvg } from "../../Icons/ChevronDownSvg";
import { FieldError } from "../FieldError/FieldError";
import { fieldClasses } from "../Inputs/fieldClasses";

/**
 * Teléfono con selector de país: `<select>` nativo + `<input type="tel">` en una fila.
 * Controlado por completo desde el padre (sin estado propio).
 * Un solo `<div>` raíz para que `data-reveal-group` del `Form` lo trate como un hijo.
 */
export const PhoneInput = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  country,
  onCountryChange,
  countries,
  frequentCodes = [],
  error,
  required,
  maxLength,
  placeholder,
  autoComplete = "tel-national",
  selectLabel = "País del teléfono",
}: PhoneInputProps) => {
  const errorId = `${name}-error`;
  const selectId = `${name}-country`;
  const invalid = Boolean(error);

  const frequent = frequentCodes
    .map((code) => countries.find((c) => c.code === code))
    .filter((c) => c !== undefined);

  return (
    <div>
      <label htmlFor={name} className=" text-sm text-neutral-400">
        {label}
      </label>
      <div className=" mt-1 flex gap-2">
        {/* Estrecho en móvil (cabe la fila a 320 px): el prefijo va delante para que siempre se vea. */}
        <div className=" relative w-32 shrink-0 sm:w-44">
          <select
            id={selectId}
            name={selectId}
            value={country}
            onChange={(event) => onCountryChange(event.target.value)}
            aria-label={selectLabel}
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? errorId : undefined}
            autoComplete="off"
            className={`${fieldClasses(invalid, { inline: true })} w-full cursor-pointer appearance-none truncate bg-neutral-950 pr-8 scheme-dark`}
          >
            {frequent.length > 0 && (
              <optgroup label="Frecuentes">
                {frequent.map((c) => (
                  <option key={`f-${c.code}`} value={c.code}>
                    {`${c.dialCode} ${c.name}`}
                  </option>
                ))}
              </optgroup>
            )}
            <optgroup label="Todos los países">
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {`${c.dialCode} ${c.name}`}
                </option>
              ))}
            </optgroup>
          </select>
          <span
            aria-hidden="true"
            className=" pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-400"
          >
            <ChevronDownSvg className=" size-4" />
          </span>
        </div>
        <input
          id={name}
          name={name}
          type="tel"
          inputMode="tel"
          className={`${fieldClasses(invalid, { inline: true })} w-0 min-w-0 flex-1`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          aria-required={required || undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? errorId : undefined}
          autoComplete={autoComplete}
          maxLength={maxLength}
        />
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
};
