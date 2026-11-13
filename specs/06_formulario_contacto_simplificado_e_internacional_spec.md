# 06 · Formulario de contacto simplificado y teléfono internacional

- **Estado:** Terminado
- **Fecha:** 13/11/2026
- **Rama:** `fix/form`
- **Solicitado por:** Diego

## 1. Objetivo

Reducir el formulario de contacto a cuatro campos (nombre completo, teléfono, correo y mensaje) y aceptar teléfonos de cualquier país, eligiendo la región en un selector para validar el número con las reglas de ese país. Caso real: un cliente italiano con número italiano y obra en España no podía enviar el formulario.

## 2. Requisitos

- El formulario solo tiene: **Nombre completo**, **Teléfono** (con selector de país), **Correo electrónico** y **Mensaje**, más la casilla de privacidad que ya existe.
- Se eliminan **Asunto**, **Empresa** y **Ciudad** del formulario, del esquema, del endpoint, del correo interno y de la vista previa `/email`.
- **Teléfono:**
  - `<select>` nativo con **todos los países** (nombre en español + prefijo, p. ej. "Italia +39"). **España preseleccionada** y un grupo "Frecuentes" arriba (España, Portugal, Francia, Italia, Andorra, Alemania, Reino Unido), después el resto en orden alfabético.
  - El número se valida según el país elegido con **`libphonenumber-js`**, igual en cliente y servidor (mismo esquema zod).
  - Si el usuario escribe el número con prefijo internacional (`+39 …`), se respeta ese prefijo aunque el selector marque otro país.
  - El número viaja y se guarda normalizado (E.164, `+393123456789`).
- **Correo interno a SM8 (`EmailInfo`):** solo Nombre, Teléfono, Correo y Mensaje. El teléfono en formato internacional legible (`+39 312 345 6789`) con el país entre paréntesis y enlace `tel:` en E.164.
  - Asunto: `Nuevo contacto web: {nombre}`.
  - El botón "Contactar cliente" abre `mailto:` con asunto `Re: Tu solicitud en SM8 España`.
- **Correo de confirmación al cliente (`EmailContact`): sin cambios.**
- Mobile-first: en móvil el selector y el input caben en una fila (selector estrecho), sin desbordes a 320 px.
- Fuera de alcance: banderas, buscador de países, detección automática del país por IP o idioma, enlace a la política de privacidad (sigue pendiente).

## 3. Preguntas y respuestas

- **P:** ¿Qué países se ofrecen?
  **R:** Todos, con España preseleccionada y un grupo de frecuentes arriba.
- **P:** ¿Cómo se valida el número?
  **R:** Con `libphonenumber-js`.
- **P:** ¿Cómo es el selector?
  **R:** `<select>` nativo + input en la misma fila (sin banderas).
- **P:** ¿Qué asunto lleva el correo interno sin el campo "Asunto"?
  **R:** `Nuevo contacto web: {nombre}`.

## 4. Estado actual

- `lib/contact/schema.ts`: esquema zod con `name`, `email`, `phone`, `subject`, `company`, `city`, `message`, `privacy`. El teléfono solo acepta España (`PHONE_REGEX = /^(?:\+34)?[6-9]\d{8}$/`). `MAX_LENGTHS` incluye los campos que se quitan.
- `components/Contact/ContactForm/ContactForm.tsx`: `TEXT_FIELDS` con 6 inputs, `INITIAL_VALUES` y `FIELD_ORDER` con todos los campos; filtros `filterNameInput` / `filterPhoneInput`.
- `app/api/contact/route.tsx`: construye `ContactPayload` con los 7 campos; asunto interno `Nuevo contacto web: {name} · {subject}`.
- `components/Email/EmailInfo/EmailInfo.tsx`: pinta Asunto, Empresa y Ciudad; `replyHref` usa `subject`.
- `types/email/email.ts`: `EmailInfoProps = ContactPayload`.
- `app/email/…` (vista previa en desarrollo): datos de ejemplo con `subject`, `company`, `city`.
- `components/shared/Forms/Inputs/InputText`: input con `label`, error y `aria-*`; no hay componente de teléfono ni de `<select>`.

## 5. Análisis de impacto

- **Archivos que se modifican:**
  - `package.json` / `package-lock.json` (nueva dependencia `libphonenumber-js`).
  - `lib/contact/schema.ts` (campos, `phoneCountry`, validación por país, tipos).
  - `app/api/contact/route.tsx` (payload y asunto).
  - `components/Email/EmailInfo/EmailInfo.tsx` (campos, formato del teléfono, `mailto`).
  - `app/email/…` (datos de ejemplo de la vista previa).
  - `components/Contact/ContactForm/ContactForm.tsx` (campos y nuevo input de teléfono).
  - `types/email/email.ts` si cambia la forma del payload.
- **Archivos nuevos:**
  - `lib/contact/countries.ts`: lista estática `{ code, name, dialCode }` con nombres en español y la lista de frecuentes. Se genera una vez con `scripts/gen-countries.mjs` (`Intl.DisplayNames("es-ES")` + `getCountries()`/`getCountryCallingCode()` de `libphonenumber-js`) y se versiona: así servidor y navegador pintan exactamente el mismo texto (sin riesgo de *hydration mismatch* por diferencias de ICU).
  - `components/shared/Forms/PhoneInput/PhoneInput.tsx` + `types/shared/forms/phoneInput/phoneInput.ts`: selector de país + input `tel`, con un solo `label` ("Teléfono"), `aria-label="País del teléfono"` en el `<select>`, error y `aria-describedby` como `InputText`. Reutiliza `fieldClasses` y `FieldError`.
- **Se reutiliza:** `fieldClasses`, `FieldError`, `Form`, `TextArea`, `InputText`, `useToast`, la lógica de validación en vivo de `ContactForm` y toda la protección del endpoint (origen, BotID, límite de body) sin tocarla.
- **Decisiones técnicas:**
  - Payload: `{ name, phone, phoneCountry, email, message, privacy }`. `phoneCountry` es el código ISO (`ES`, `IT`…) y se valida contra la lista de países.
  - Validación con `isValidPhoneNumber`/`parsePhoneNumberFromString` de `libphonenumber-js` (metadatos `min`, ~40-50 KB gzip; solo llega al chunk del formulario y al endpoint). El esquema transforma el teléfono a E.164 y devuelve también el país real del número.
  - Mensajes de error con el país: "Escribe un teléfono válido de Italia." / "Elige el país del teléfono."
  - El filtro al escribir del teléfono se mantiene (dígitos, espacios, `+` inicial); se admiten también `-`, `(` y `)` porque son habituales en otros países, y se limpian al normalizar.
  - "Nombre completo": mismas reglas que hoy (letras latinas, espacios, guion, apóstrofo), mínimo 2 y máximo **80** caracteres (60 se queda corto para nombre y dos apellidos). `autoComplete="name"`.
  - Orden visual: Nombre completo → Teléfono → Correo → Mensaje → privacidad (también en `FIELD_ORDER`, para el foco al primer error). Al haber error en el teléfono el foco va al input, no al selector.
- **Riesgos de rotura:**
  - Los tipos `ContactPayload` / `ContactFormValues` cambian: rompe en compilación `EmailInfo`, el endpoint y la vista previa si no se actualizan a la vez (se hace en la misma fase).
  - `EmailContact` solo usa `name`: no se ve afectado.
  - El `Form` compartido no cambia (los campos van como `children`); `data-reveal-group` escalona hijos directos: `PhoneInput` debe ser un solo hijo (un `<div>`), igual que `InputText`.
  - Tamaño del bundle: comprobar en el build que `libphonenumber-js` no entra en el chunk de la página fuera del formulario.

## 6. Plan de implementación

### Fase 1 · Dependencia, países, esquema, endpoint y correo interno — `nextjs-platform-engineer`
- [x] 1.1 Instalar `libphonenumber-js` (versión exacta, `npm install`).
- [x] 1.2 Crear `scripts/gen-countries.mjs` y generar `lib/contact/countries.ts` (todos los países, nombres en español ordenados con `localeCompare("es")`, `FREQUENT_COUNTRIES`, `DEFAULT_COUNTRY = "ES"`).
- [x] 1.3 `lib/contact/schema.ts`: quitar `subject`, `company`, `city` (y sus regex/`MAX_LENGTHS`), añadir `phoneCountry`, validar el teléfono por país con `superRefine`/`transform` (error en `phone`), normalizar a E.164, subir `name` a 80, actualizar tipos y JSDoc.
- [x] 1.4 `app/api/contact/route.tsx`: payload con los 4 campos (+ país), asunto `Nuevo contacto web: {nombre}`.
- [x] 1.5 `EmailInfo`: solo Nombre, Teléfono (internacional + país, `tel:` en E.164), Correo y Mensaje; `mailto` con `Re: Tu solicitud en SM8 España`; `Preview` sin asunto.
- [x] 1.6 Vista previa `/email`: datos de ejemplo con un número extranjero.
- **Resultado esperado:** el endpoint acepta `+39 312 345 6789` con `IT` y `612 345 678` con `ES`, rechaza un número español con `IT` seleccionado sin prefijo, y el correo interno muestra solo los 4 datos.
- [x] Fase 1 verificada por el Lead

### Fase 2 · Componente `PhoneInput` — `ui-system-engineer`
- [x] 2.1 Crear `components/shared/Forms/PhoneInput/PhoneInput.tsx` y sus props en `types/shared/forms/phoneInput/phoneInput.ts` (`country`, `onCountryChange`, `value`, `onChange`, `onBlur`, `error`, `required`, `maxLength`, `countries`, `frequent`).
- [x] 2.2 `<select>` nativo con `<optgroup label="Frecuentes">` y `<optgroup label="Todos los países">`, opción "España +34"; ancho fijo estrecho en móvil y mismo alto y bordes que `fieldClasses`; estado de error en los dos controles.
- [x] 2.3 Accesibilidad: `label` "Teléfono" asociado al input, `aria-label` en el select, `aria-invalid`/`aria-describedby` al error, foco visible, 16 px en móvil (sin zoom de iOS), contraste AA.
- **Resultado esperado:** componente reutilizable que cabe en una fila desde 320 px.
- [x] Fase 2 verificada por el Lead

### Fase 3 · `ContactForm` con los cuatro campos — `sections-engineer`
- [x] 3.1 Quitar Asunto, Empresa y Ciudad de `INITIAL_VALUES`, `FIELD_ORDER` y `TEXT_FIELDS`; renombrar la etiqueta a "Nombre completo".
- [x] 3.2 Sustituir el input de teléfono por `PhoneInput` (estado `phoneCountry`, por defecto `ES`); al cambiar de país, revalidar el teléfono si ya estaba tocado. Placeholder según el país (ejemplo de `libphonenumber-js` o genérico "Número de teléfono").
- [x] 3.3 Mapear los `fieldErrors` del servidor (incluido `phoneCountry`) y mantener el foco al primer error.
- **Resultado esperado:** formulario de 4 campos que envía números de cualquier país; el éxito y los errores siguen funcionando como hoy.
- [x] Fase 3 verificada por el Lead

### Fase 4 · Revisión QA — `qa-a11y-reviewer`
- [x] Lint, typecheck y build sin errores
- [x] Accesibilidad WCAG 2.2 AA (select + input con lector de pantalla y teclado)
- [x] Responsive en móvil (320 y 375 px), tablet (768 px) y escritorio (1280 px+)
- [x] Pruebas de validación: ES, IT, PT, FR, número con `+` distinto al país elegido, número inválido, campos vacíos
- [x] Contenido en español de España
- **Resultado esperado:** veredicto ✅ o ⚠️ sin bloqueantes
- [x] Revisión QA verificada por el Lead

### Cierre — Frontend Lead
- [x] `npm run lint` sin errores
- [x] `npm run build` sin errores
- [x] Errores encontrados (si los hubo) reportados, corregidos y anotados en "Errores de lint y build aprendidos" de `CLAUDE.md`
- [x] Resumen final escrito
- [x] `CLAUDE.md` actualizado (fila "Formulario de contacto", `PhoneInput` en convenciones)
- [x] Resumen enviado a Diego

## 7. Cambios sobre el plan

- Fase 2: la prop de frecuentes se llama `frequentCodes` (no `frequent`); se añadió el icono `components/shared/Icons/ChevronDownSvg.tsx` (flecha del select) y la opción `fieldClasses(invalid, { inline: true })` (sin `mt-1 w-full`) para controles en fila. `InputText` y `TextArea` no cambian.
- Fase 1: `libphonenumber-js` fijado en `1.13.16`; `lib/contact/countries.ts` (245 países) se regenera con `node scripts/gen-countries.mjs`; la constante de frecuentes es `FREQUENT_COUNTRY_CODES`. En zod 4 un campo vacío con `abort: true` impide los checks a nivel de objeto, así que teléfono + país van en un `phoneSchema` propio (`superRefine` + `transform`) unido al resto con `.and()`: el error del teléfono sale a la vez que los demás. `MAX_LENGTHS.phone` sube a 25 (separadores). No hay placeholder por país (necesitaría los ejemplos de `libphonenumber-js`): se usa uno genérico.
- QA (ronda 1, ❌): scroll horizontal a 320/375 px (el `<input>` impone su ancho intrínseco en flex) → `w-0 min-w-0 flex-1`; el select con error no tenía `aria-describedby` → añadido. Mensaje de error: si el número trae `+`, nombra el país del prefijo o usa uno genérico, no el país elegido.
- Decisiones de Diego tras QA: (1) **prefijo delante** en las opciones (`+34 España`), para que se vea con el select cerrado; (2) **formulario en diferido**: `ContactFormLazy` (cliente, `next/dynamic` con `ssr: false` + IntersectionObserver con `rootMargin` 1200 px) y `ContactFormSkeleton` con las mismas medidas mientras llega. El chunk del formulario (formulario + `libphonenumber-js` + zod + axios, ~87 KB gzip) ya no está en la carga inicial: JS inicial de `/` ≈ 203 KB gzip (antes ≈ 287 KB).
- Placeholder del teléfono: "Número" (el genérico largo se cortaba en móvil).

## 8. Resumen final

- **Formulario:** solo Nombre completo, Teléfono (con país), Correo y Mensaje + privacidad. Asunto, Empresa y Ciudad eliminados del formulario, esquema, endpoint, correo interno y `/email`.
- **Teléfono internacional:** `PhoneInput` (compartido) = `<select>` nativo con 245 países ("Frecuentes": ES, PT, FR, IT, AD, DE, GB; España por defecto) + input `tel`. Validación con `libphonenumber-js` 1.13.16 (metadatos `min`) en cliente y servidor; si se escribe `+XX`, manda el prefijo. Se envía en E.164 con el país real.
- **Correo interno:** Nombre, Teléfono (`+39 312 345 6789 (Italia)`, `tel:` en E.164), Email y Mensaje; asunto `Nuevo contacto web: {nombre}`; responder con `Re: Tu solicitud en SM8 España`. `EmailContact` sin cambios.
- **Rendimiento:** el formulario se carga en diferido (≈ 84 KB gzip menos en la carga inicial). CLS medido ≈ 0 (0,0025 antes de ajustar las alturas del esqueleto).
- **Archivos nuevos:** `lib/contact/countries.ts` (generado), `scripts/gen-countries.mjs`, `components/shared/Forms/PhoneInput/`, `types/shared/forms/phoneInput/`, `components/shared/Icons/ChevronDownSvg.tsx`, `components/Contact/ContactFormLazy/`, `components/Contact/ContactFormSkeleton/`.
- **Pendientes:** el select no cambia solo de país al escribir `+XX` (el servidor guarda el país correcto); con alturas del esqueleto ya ajustadas según QA, falta re-medirlas en navegador; probar un envío real con un número extranjero; "8:00 hrs" en Contacto (cambio pequeño aparte); probar el desplegable nativo en Windows.
