# 03 · Envío del formulario de contacto (Resend + Axios + BotID)

- **Estado:** Terminado (09/11/2026) · pendientes: política de privacidad y límite por IP (§8)
- **Fecha:** 09/11/2026
- **Rama:** `feat/resend`
- **Solicitado por:** Diego

## 1. Objetivo

Que el formulario de contacto envíe dos correos con Resend: un acuse de recibo al cliente (`EmailContact`, con su nombre) y un aviso a Diego (`EmailInfo`, con todos los datos del cliente y un botón para escribirle). El formulario valida todos los campos, exige aceptar la política de privacidad, avisa con toasts, y el endpoint solo acepta peticiones del dominio `sm8.es` y de usuarios reales (no bots).

## 2. Requisitos

### Formulario (`ContactForm`)
- Campos, **todos obligatorios**: nombre, email, **teléfono (nuevo)**, asunto, empresa, ciudad y mensaje + casilla de privacidad.
- Reglas (las mismas en cliente y servidor, un único esquema zod):

| Campo | Regla |
|---|---|
| Nombre | Solo letras (incluye tildes, `ñ`, `ü`), espacios, guion y apóstrofo. 2–60 caracteres. |
| Email | Formato válido. Máx. 254. |
| Teléfono | Solo dígitos, `+` inicial opcional y espacios. Español: 9 cifras empezando por 6, 7, 8 o 9, con o sin `+34`. El input filtra lo que no sea número al escribir (`inputMode="tel"`). |
| Asunto | 3–100 caracteres. |
| Empresa | Letras, números, espacios y `. , & - '`. 2–80 caracteres. |
| Ciudad | Igual que Nombre. 2–60 caracteres. |
| Mensaje | 10–2000 caracteres. |
| Privacidad | Debe estar aceptada. |

- Los errores se muestran **debajo de cada campo** (`aria-invalid`, `aria-describedby`), al enviar y después al corregir. Al fallar el envío, el foco va al primer campo con error.
- Botón "Enviar" con estado "Enviando…" y deshabilitado mientras se envía. Al éxito se vacía el formulario.
- Toast de éxito o error (componente propio).

### Correos
- **Al cliente** (`EmailContact`): "Hola, {nombre}". Tuteo (regla es-ES de `CLAUDE.md`). Asunto: "Hemos recibido tu mensaje · SM8 España".
- **A Diego** (`EmailInfo`): título "Nuevo cliente interesado" (sin "Hola, Diego Alejandro"), nombre, email, teléfono, asunto, empresa, ciudad y mensaje. `replyTo` = email del cliente. Botón "Contactar cliente" = `mailto:{email}?subject=Re: {asunto}`. Asunto del correo: "Nuevo contacto web: {nombre} · {asunto}".
- Destinatario interno `dtapia@sm8.com.mx` en variable de entorno (`CONTACT_TO_EMAIL`).
- Plantillas con `@react-email/components` (`Html`, `Head`, `Preview`, `Tailwind`, `Body`, `Container`, `Img`, `Text`, `Link`, `Button`), sin `next/image` ni `"use client"`. Se conserva el diseño actual de las maquetas.
- Imágenes por URL absoluta en **PNG** (Outlook no muestra WebP): `${EMAIL_ASSETS_URL}/img/email/…`, con `EMAIL_ASSETS_URL` (env) por defecto `https://www.sm8.es`. El cliente de correo descarga la imagen al abrir el mensaje, así que se ven cuando la web nueva esté publicada en `www.sm8.es`; antes, se puede apuntar la variable a un preview de Vercel público (sin Deployment Protection). Datos de contacto y redes desde `lib/business.ts`.
- Todo texto del usuario se escapa (React lo hace al renderizar) y se recorta (`trim`); el asunto del correo se limpia de saltos de línea.

### Instancia de Axios
- `lib/http/api.ts`: `axios.create({ baseURL: "/api", timeout: 15000, headers: { "Content-Type": "application/json", Accept: "application/json" } })`. Uso: `api.post("/contact", data)`.

### Endpoint `POST /api/contact` (sustituye a `app/api/send/route.ts`)
1. **Origen**: `Origin` (o `Referer` si falta) debe ser `https://sm8.es` o `https://www.sm8.es`; en desarrollo también `http://localhost:3000`. Si no → 403. Lista en `ALLOWED_ORIGINS` (env) con esos valores por defecto; para probar en un despliegue de preview de Vercel se añade su URL a esa variable.
2. **Bots**: Vercel BotID (`checkBotId()`) en nivel **Basic** (gratis en todos los planes, sin cargos). Si `isBot` → 403. El nivel Deep Analysis (Pro, $1 por cada 1.000 llamadas a `checkBotId()`) queda desactivado; se activaría con `advancedOptions.checkLevel: "deepAnalysis"` si Diego lo decide.
3. **Validación**: mismo esquema zod; si falla → 400 con los errores por campo.
4. **Envío**: los dos correos con Resend (`resend.batch.send` o dos `emails.send`). Si falla → 502 con mensaje genérico (el detalle solo en `console.error`).
5. Respuestas JSON `{ ok: true }` / `{ ok: false, message, fieldErrors? }`. Solo `POST` (otros métodos → 405 automático de Next).

### Fuera de alcance
- Página de política de privacidad / aviso de privacidad: **pendiente** hasta que se lo compartan a Diego; entonces se genera la página y se enlaza desde el texto de la casilla. Mientras, el texto queda sin enlace (`<span>`, no un enlace roto).
- Límite de envíos por IP (rate limit). Se puede añadir más adelante con Upstash si hace falta.
- Guardar los contactos en una base de datos.

## 3. Preguntas y respuestas

- **P:** ¿Cómo se protege el endpoint contra bots?
  **R:** Vercel BotID (además de la comprobación de origen), nivel Basic, sin coste adicional en el plan Pro.
- **P:** ¿Cuándo se ven las imágenes de los correos?
  **R:** Cuando la web nueva esté publicada en `www.sm8.es` (o en un preview público si se cambia `EMAIL_ASSETS_URL`).
- **P:** ¿En qué rama se trabaja?
  **R:** En `feat/resend`, que ya está al día con `develop`.
- **P:** ¿Política de privacidad?
  **R:** Queda pendiente hasta que se la compartan a Diego; entonces se genera la página.
- **P:** El formulario no tiene teléfono y `EmailInfo` no muestra el asunto. ¿Qué campos?
  **R:** Añadir Teléfono y mantener todos; `EmailInfo` muestra también el asunto.
- **P:** ¿Toasts con shadcn o propios?
  **R:** Componente propio, sin dependencias.
- **P:** ¿De dónde se cargan las imágenes del correo?
  **R:** URL de producción `https://www.sm8.es/img/…` en PNG.

### Supuestos (Diego puede cambiarlos al aprobar)
- Correos al cliente en **tuteo** (hoy `EmailContact` usa "usted").
- `EmailInfo` sin saludo personal: título "Nuevo cliente interesado".
- La página de vista previa `/email` solo existe en desarrollo (`notFound()` en producción) y muestra las dos plantillas con datos de ejemplo.
- Remitente `SM8 España <ventas@sm8.es>` (env `CONTACT_FROM_EMAIL`): **Diego confirma que `sm8.es` está verificado en Resend**.
- Validación con **zod** (dependencia nueva) para compartir reglas entre cliente y servidor.

## 4. Estado actual

- `app/api/send/route.ts`: prueba de Resend, envía `EmailContact()` fijo a `dtapia@sm8.com.mx`, no lee el body.
- `app/email/page.tsx`: vista previa pública de `EmailContact`.
- `components/Email/EmailContact` y `EmailInfo`: maquetas con datos fijos ("Diego Alejandro", "Juan Pérez"…), usan `next/image` con rutas relativas (no funciona en correo); `EmailContact` lleva `"use client"`; `EmailInfo` usa `<button>` (no funciona en correo).
- `ContactForm`: estado local, 5 inputs + textarea, `onSubmit` solo hace `preventDefault`. Sin teléfono ni validación.
- `Form` (shared): pinta `CheckBox`, texto de privacidad ("SM8 Andamios") y `MainButton`.
- `CheckBox`: estado interno (el formulario no lo puede leer), `<button>` sin `type` (envía el formulario), sin `role`/`aria-checked`, 20 px.
- `InputText` / `TextArea`: sin soporte de error, `required`, `inputMode`, `autoComplete` ni `maxLength`.
- Dependencias: `resend`, `@react-email/components` instalados; **falta `axios`, `zod`, `botid`**.
- `public/img/`: `logo.webp`, `logoAzul.webp`, `lona.webp` (sin PNG).

## 5. Análisis de impacto

- **Archivos que se modifican:**
  - `components/Contact/ContactForm/ContactForm.tsx` (estado, validación, envío, toasts, campo teléfono)
  - `components/shared/Forms/Form/Form.tsx` (casilla controlada, error, botón con estado, texto "SM8 España")
  - `components/shared/Forms/CheckBox/CheckBox.tsx` (controlado y accesible)
  - `components/shared/Forms/Inputs/InputText/InputText.tsx`, `TextArea/TextArea.tsx` (props `error`, `required`, `inputMode`, `autoComplete`, `maxLength`)
  - `types/shared/forms/**` (props nuevas)
  - `components/shared/Buttons/MainButton` (si hace falta `disabled`)
  - `components/Email/EmailContact/EmailContact.tsx`, `EmailInfo/EmailInfo.tsx` (react-email + props)
  - `app/email/page.tsx` (solo desarrollo)
  - `next.config.ts` (`withBotId`)
  - `lib/business.ts` (URLs absolutas de imágenes de correo)
  - `package.json` (`axios`, `zod`, `botid`)
- **Archivos nuevos:**
  - `lib/contact/schema.ts` (esquema zod + tipos)
  - `lib/http/api.ts` (instancia Axios)
  - `app/api/contact/route.ts`
  - `instrumentation-client.ts` (`initBotId` protegiendo `POST /api/contact`)
  - `components/shared/Toast/…` (componente + hook/proveedor)
  - `types/email/…` (props de las plantillas)
  - `public/img/email/logo-azul.png`, `lona.jpg`
  - `.env.example` (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `ALLOWED_ORIGINS`, `EMAIL_ASSETS_URL`)
- **Archivos que se borran:** `app/api/send/route.ts`.
- **Se reutiliza:** `InputText`, `TextArea`, `CheckBox`, `Form`, `MainButton`, `PaperAirplane`, `CheckSvg`, `BUSINESS`.
- **Riesgos de rotura:**
  - `Form`/`CheckBox`/`InputText` solo los usa `ContactForm` hoy → cambios de props controlados; se verifica con `tsc`.
  - BotID modifica `next.config.ts` y añade `instrumentation-client.ts`: comprobar compatibilidad con Next 16.4 + `cacheComponents` (leer docs de `node_modules/next/dist/docs/` y de `botid`). En local `checkBotId()` no detecta bots, así que **la protección solo se prueba de verdad desplegado en Vercel**.
  - `@react-email/components` `Tailwind` con Tailwind v4 (colores `oklch`): comprobar el HTML generado; si algún color no se convierte, usar hex en las plantillas.
  - Las imágenes del correo no se verán hasta que el sitio esté desplegado en `www.sm8.es`.

## 6. Plan de implementación

### Fase 1 · Plataforma: dependencias, esquema, Axios, endpoint y BotID — `nextjs-platform-engineer`
- [x] 1.1 Instalar `axios`, `zod`, `botid`.
- [x] 1.2 `lib/contact/schema.ts`: esquema zod (§2), mensajes de error en es-ES, tipo `ContactPayload`.
- [x] 1.3 `lib/http/api.ts`: instancia Axios.
- [x] 1.4 BotID: `withBotId` en `next.config.ts` + `instrumentation-client.ts` con `initBotId({ protect: [{ path: "/api/contact", method: "POST" }] })` (verificar API en la doc instalada).
- [x] 1.5 `app/api/contact/route.ts`: origen → BotID → zod → Resend (dos correos, `replyTo`) → respuestas JSON (§2). Borrar `app/api/send/route.ts`.
- [x] 1.6 `.env.example` y `lib/business.ts` (base `EMAIL_ASSETS_URL` para las imágenes).
- **Resultado esperado:** `curl` sin `Origin` válido → 403; body inválido → 400 con `fieldErrors`; válido en local → envía los dos correos.
- [x] Fase 1 verificada por el Lead

### Fase 2 · Plantillas de correo — `ui-system-engineer`
- [x] 2.1 Convertir `logoAzul.webp` y `lona.webp` a PNG en `public/img/email/`.
- [x] 2.2 `EmailContact` con react-email, prop `name`, tuteo, datos de `BUSINESS`, enlaces reales a Facebook e Instagram.
- [x] 2.3 `EmailInfo` con react-email, props de `ContactPayload`, botón `mailto:`.
- [x] 2.4 `app/email/page.tsx`: solo desarrollo, muestra las dos plantillas con datos de ejemplo.
- **Resultado esperado:** los correos se ven como las maquetas en Gmail y Outlook web.
- [x] Fase 2 verificada por el Lead

### Fase 3 · Componentes compartidos del formulario y Toast — `ui-system-engineer`
- [x] 3.1 `CheckBox` controlado (`checked`, `onChange`), `type="button"`, `role="checkbox"`, `aria-checked`, `aria-labelledby`, área táctil ≥ 24 px, foco visible.
- [x] 3.2 `InputText` / `TextArea`: props `error`, `required`, `inputMode`, `autoComplete`, `maxLength`; mensaje de error en `text-red-400` con `aria-describedby`.
- [x] 3.3 `Form`: recibe estado de la casilla, su error y `isSubmitting`; texto "Política de Privacidad de SM8 España"; `noValidate`.
- [x] 3.4 `MainButton` con `disabled` si no lo tiene.
- [x] 3.5 Toast propio (`components/shared/Toast`): éxito / error, `role="status"` / `role="alert"`, `aria-live`, cierre manual y automático (6 s), estilo oscuro de la web, mobile-first, `prefers-reduced-motion`.
- **Resultado esperado:** piezas listas y tipadas sin romper el formulario actual.
- [x] Fase 3 verificada por el Lead

### Fase 4 · Integración en el formulario — `sections-engineer`
- [x] 4.1 `ContactForm`: campo teléfono, filtro de caracteres en nombre / ciudad / teléfono, validación con el esquema, errores por campo, foco al primer error.
- [x] 4.2 Envío con `api.post("/contact", payload)`, estado "Enviando…", toasts, reseteo al éxito, mapeo de `fieldErrors` del servidor.
- [x] 4.3 Revisar textos en es-ES (`content-seo-specialist` si hace falta).
- **Resultado esperado:** flujo completo funcionando en local.
- [x] Fase 4 verificada por el Lead

### Fase 5 · Revisión QA — `qa-a11y-reviewer`
- [x] Lint, typecheck y build sin errores
- [x] Accesibilidad WCAG 2.2 AA (errores, casilla, toasts, foco)
- [x] Responsive en móvil (375px), tablet (768px) y escritorio (1280px+)
- [x] Contenido en español de España
- [x] Seguridad del endpoint: origen, validación, respuestas sin datos internos
- **Resultado esperado:** veredicto ✅ o ⚠️ sin bloqueantes
- [x] Revisión QA verificada por el Lead

### Cierre — Frontend Lead
- [x] `npm run lint` sin errores
- [x] `npm run build` sin errores
- [x] Errores encontrados (si los hubo) reportados, corregidos y anotados en "Errores de lint y build aprendidos" de `CLAUDE.md`
- [x] Resumen final escrito
- [x] `CLAUDE.md` actualizado (envío del formulario decidido, componentes nuevos, variables de entorno, pendientes)
- [x] Resumen enviado a Diego

## 7. Cambios sobre el plan

- **Fase 1**
  - El endpoint es `app/api/contact/route.tsx` (no `.ts`) porque monta las plantillas con JSX.
  - Las URLs de las imágenes del correo van en `lib/email/assets.ts` (`getEmailAssets()`, `server-only`), no en `lib/business.ts`, que también lo usan componentes cliente. La Fase 2 usa `getEmailAssets()`.
  - Los dos correos salen en un solo `resend.batch.send`.
  - Límite extra: 413 si el body pasa de 16 KB.
  - Nombres de campos del esquema: `name`, `email`, `phone`, `subject`, `company`, `city`, `message`, `privacy` (el formulario de la Fase 4 deja `asunto`/`empresa`/`ciudad`/`mensaje`).
  - Se quitó `"use client"` de `EmailContact` y se tocó `app/email/page.tsx` (prop `name`) para que compile; el resto de la plantilla es de la Fase 2.
  - Para probar el envío real en local hace falta `CONTACT_TO_EMAIL` en `.env.development` o `.env.local`.
- **Fase 2**
  - Colores de las plantillas en hex explícito y `pixelBasedPreset` (px en vez de rem); bordes, subrayado y fuente (Helvetica/Arial) en `style` porque Tailwind genera `border-inline`/`text-decoration-line`, que Outlook no entiende.
  - Enlaces en `#a16207` (yellow-700) en vez de yellow-600, por contraste AA sobre blanco.
  - Lona recortada a 2:1 en lugar de `object-cover` y en **JPG** (`lona.jpg`, 768×384, 85 KB; el PNG pesaba 368 KB). El logo sigue en PNG por la transparencia. Decidido por Diego.
  - `EmailContact` pasa de 384 a **600 px** de ancho (estándar de correo). Decidido por Diego.
  - Enlaces en yellow-700 confirmados por Diego.
- **Fase 3**
  - Piezas nuevas no previstas: `components/shared/Forms/FieldError`, `components/shared/Forms/Inputs/fieldClasses.ts` (estilos compartidos de input, textarea y casilla) e `Icons/ExclamationCircleSvg`.
  - `ToastProvider` se monta en `ContactSection`, solo alrededor de `ContactForm` (el layout no queda dentro de un componente cliente). Si hacen falta avisos globales, se sube a `app/layout.tsx`.
  - El toast reutiliza `CloseSvg`, que deja de estar sin uso.
  - La casilla se alterna con clic y Espacio; Enter no (patrón ARIA de checkbox).
  - Campos más altos en móvil (`text-base`, `py-2.5`, ~46 px; evita el zoom de iOS); desde `md`, `text-sm`/`py-2`.
  - `MainButton` sigue con `py-1` (~30 px): cumple el mínimo AA, pero se revisa en el spec de responsive.
  - Sin asterisco en los campos: como todos son obligatorios, una nota "Todos los campos son obligatorios." bajo la cabecera del formulario (decidido por Diego). `required` sigue dando `aria-required`.
  - Toast en verde (éxito) y rojo (error), confirmado por Diego.
- **Fase 4**
  - Un campo vacío no muestra error al salir de él antes del primer envío (para no llenar el formulario de errores al tabular); con contenido, se valida al salir y luego en cada cambio.
  - Se envían los valores sin recortar; el servidor recorta y vuelve a validar.
  - Contenedor del formulario `p-4 md:p-8`.
- **Fase 5 (QA: ⚠️ aprobado con sugerencias, sin bloqueantes) — correcciones del Lead**
  - `MainButton` con `busy` usa `aria-disabled` en vez de `disabled`, para que el foco no salte a `<body>` al enviar (el doble envío lo evita `submittingRef` en `ContactForm`).
  - Toast: el de error ya no se cierra solo (WCAG 2.2.1); el de éxito, a los 6 s. Al cerrarlo con la X o Escape, el foco vuelve a donde estaba. Decidido por Diego.
  - Borde de los campos `neutral-800` → `neutral-600` (contraste ≈ 3:1, WCAG 1.4.11). Decidido por Diego. Foco con `ring-2`, azul también en campos con error.
  - Endpoint: exige `Content-Type: application/json` (si no, 415) y lee el body cortando a 16 KB aunque no haya `Content-Length` (chunked → 413).
  - Pie de `EmailContact` en `#666666` (contraste 5,1:1 sobre `#f5f5f5`).
  - Prueba real en local: Resend fallaba con "Failed to render React component" porque `@react-email/render` solo está anidado dentro de `@react-email/components` y Resend lo importa por su cuenta. El endpoint ahora renderiza las plantillas con `render()` de `@react-email/components` (HTML + texto plano) y envía `html`/`text` en vez de `react`.
  - **Riesgo aceptado por Diego:** el acuse de recibo se envía a cualquier email válido; la protección es origen + BotID Basic + validación. Si aparecen envíos raros en Resend, se añade límite por IP (Upstash) o BotID Deep Analysis.
  - `/email` renderiza las plantillas con `render()` dentro de `<iframe srcDoc>`, `noindex` y 404 fuera de desarrollo.

## 8. Resumen final

El formulario de contacto envía dos correos con Resend: acuse al cliente (`EmailContact`, con su nombre) y aviso interno a `CONTACT_TO_EMAIL` (`EmailInfo`, con todos los datos, `replyTo` del cliente y botón `mailto:`).

- **Servidor:** `app/api/contact/route.tsx` → origen (`ALLOWED_ORIGINS`) → BotID Basic → `Content-Type` JSON → body ≤ 16 KB → zod → `resend.batch.send`. Respuestas 200/400/403/405/413/415/500/502 sin datos internos.
- **Compartido cliente/servidor:** `lib/contact/schema.ts` (reglas, filtros de escritura, tipos). Axios en `lib/http/api.ts`.
- **BotID:** `withBotId` en `next.config.ts` + `instrumentation-client.ts`. Solo detecta bots desplegado en Vercel.
- **Plantillas:** react-email, colores hex, 600 px, imágenes en `public/img/email/` (`logo-azul.png`, `lona.jpg`) servidas desde `EMAIL_ASSETS_URL` (`lib/email/assets.ts`). Vista previa en `/email` solo en desarrollo.
- **UI compartida:** `CheckBox` controlado y accesible, `InputText`/`TextArea` con error, `FieldError`, `fieldClasses`, `Form` con estado de envío, `MainButton` con `disabled`/`busy`, Toast propio (`components/shared/Toast`, montado en `ContactSection`).
- **Formulario:** 7 campos obligatorios + privacidad, filtrado al escribir, errores por campo, foco al primer error, toasts.
- **Variables de entorno:** `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `ALLOWED_ORIGINS`, `EMAIL_ASSETS_URL` (ver `.env.example`). Hay que darlas de alta en Vercel al desplegar.
- `npm run lint` (0 errores) y `npm run build` correctos.

**Pendientes**
- Política / aviso de privacidad: crear la página cuando se la pasen a Diego y enlazarla desde la casilla.
- Límite por IP o BotID Deep Analysis si hay abuso del acuse de recibo.
- Probar un envío real (local y desplegado) y ver los correos en Gmail y Outlook; las imágenes solo se ven con la web publicada en `EMAIL_ASSETS_URL`.
- `MainButton` mide ~30 px de alto: revisar en el spec de responsive.
