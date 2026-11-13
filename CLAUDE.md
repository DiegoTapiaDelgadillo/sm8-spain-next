@AGENTS.md

# SM8 España — rediseño web (Next.js)

## Reglas obligatorias para Claude (todas las sesiones)

1. **Empieza SIEMPRE cada respuesta con "Diego,"**. Aplica a todas las salidas: avisos antes de usar herramientas, actualizaciones intermedias y respuesta final. Ejemplos: "Diego, empecé a revisar el proyecto…", "Diego, lancé al subagente…", "Diego, terminé la tarea…".
2. **Si algo no está claro, pregunta antes de implementar.** Ante dudas de contenido, diseño, alcance o decisiones técnicas sin respuesta en este archivo, haz las preguntas correspondientes (AskUserQuestion) en vez de suponer. Nunca inventes contenido real (teléfonos, testimonios, clientes, proyectos).
3. Responde en español.
4. **`develop` es integración y `main` es producción; las dos las fusiona solo Diego.** Ningún agente ni subagente hace merge, rebase, push o commit directo a `develop` o `main`, ni despliega a producción, sin autorización explícita de Diego en ese momento. Se trabaja siempre en ramas de tarea que salen de `develop`; los PR van a `develop` y los revisa y fusiona Diego. Cuando lo de `develop` está aprobado y listo, Diego lo pasa a `main` (PR `develop` → `main`).
5. **Toda implementación nueva sigue el "Flujo de implementación con specs"** (sección siguiente). Sin spec aprobado por Diego no se implementa, salvo los cambios pequeños descritos allí.
6. **Ningún spec se cierra sin que pasen `npm run lint` y `npm run build`.** Ojo: desde Next 16, `next build` **ya no ejecuta ESLint**, así que hay que correr los dos comandos. Si alguno falla:
   1. Reporta el error a Diego (comando, archivo, regla y mensaje).
   2. Corrígelo y vuelve a ejecutar los dos comandos hasta que pasen sin errores.
   3. Anótalo en la sección "Errores de lint y build aprendidos" de este archivo (qué falló, por qué y cómo evitarlo), para no volver a generarlo al modificar el código.

## Flujo de implementación con specs

El Frontend Lead (sesión principal) sigue estos pasos en orden para cada funcionalidad o caso de uso nuevo:

1. **Entender la petición.** Analiza qué se pide y para qué. Si algún punto es ambiguo o incompleto (alcance, diseño, contenido, comportamiento en móvil, casos límite), **pregunta a Diego con AskUserQuestion antes de seguir**. No supongas. Si hace falta, apóyate en un subagente especializado para entender una parte concreta.
2. **Revisar el estado actual del proyecto.** Lee el código afectado, los componentes reutilizables que ya existen, los specs anteriores en `specs/` y este archivo.
3. **Analizar el impacto.** Con la petición y el estado del proyecto, identifica qué archivos y componentes se tocan, qué se puede reutilizar (para no crear componentes duplicados) y qué podría romperse (otras secciones que usan el mismo componente, props que cambian, estilos compartidos).
4. **Escribir el spec** en `specs/` con el nombre `NN_nombre_en_snake_case_spec.md`:
   - `NN` es un número de dos dígitos autoincremental, empezando en `00` (`00_…`, `01_…`, `02_…`). Usa el siguiente al mayor que exista en `specs/`.
   - Ejemplo: `00_navbar_responsive_spec.md`.
   - Parte de la plantilla `specs/_TEMPLATE.md`.
5. **Pedir aprobación.** Muestra a Diego un resumen del spec y **espera su OK** (o sus cambios) antes de implementar.
6. **Implementar por fases.** Crea la rama de la tarea (`feat/…`, `fix/…`) desde `develop` actualizado y lanza a cada subagente con su fase, indicándole la ruta del spec. Cada tarea es una casilla `- [ ]` que se marca `- [x]` al completarse:
   - El subagente marca sus propias casillas al terminar (excepto `qa-a11y-reviewer`, que no edita archivos: el Lead marca las casillas de QA según su informe).
   - El Lead verifica el informe y marca la casilla de cierre de cada fase.
   - Si algo cambia durante la implementación, se actualiza el spec (sección "Cambios sobre el plan").
7. **Cerrar.** Con todas las casillas marcadas y la revisión de `qa-a11y-reviewer` aprobada:
   - Ejecuta `npm run lint` y `npm run build` (regla 6). Si fallan: reporta, corrige, repite y anota el error en "Errores de lint y build aprendidos". No se cierra el spec hasta que los dos pasen.
   - Rellena la sección "Resumen final" del spec con los cambios realizados.
   - Actualiza este `CLAUDE.md` con lo más relevante (decisiones nuevas, componentes nuevos, convenciones, pendientes resueltos o nuevos).
   - Da a Diego un resumen claro de los cambios y da por terminada la implementación. El PR va a `develop`; el merge a `develop` y el paso a `main` los decide Diego (regla 4).

**Cambios pequeños sin spec:** una errata, un color, un texto puntual o un ajuste mínimo en un solo archivo se pueden hacer directamente. Si hay duda de si un cambio es "pequeño", pregunta a Diego.

## Errores de lint y build aprendidos

Registro de errores que han hecho fallar `npm run lint` o `npm run build` (regla 6). **Léelo antes de escribir código** para no repetirlos. Formato de cada entrada:

- **[Spec NN] Regla o error** — `archivo`: qué falló y por qué. **Cómo evitarlo:** …

- **[Spec 03] `react-hooks/error-boundaries`** — `app/api/contact/route.tsx`: crear JSX (`react: <EmailContact … />`) dentro de un `try/catch` da error. **Cómo evitarlo:** montar el JSX (o el array de correos) antes del `try` y dejar dentro solo la llamada a Resend.
- **[Spec 03] `@typescript-eslint/no-unused-vars`** (aviso) — plantillas de correo: props o campos desestructurados con prefijo `_` siguen contando como sin usar. **Cómo evitarlo:** tipar como `FC<Props>` y desestructurar solo lo que se usa.
- **[Spec 04] TS2339 `Property 'setTimeout' does not exist on type 'never'`** (lo da `tsc`, y por tanto `next build`) — `components/Home/HeroScaffold/HeroScaffold.tsx`: tras `if ("requestIdleCallback" in window) {…} else {…}`, TypeScript deduce que en el `else` `window` es `never` (el tipo de `window` ya incluye `requestIdleCallback`). **Cómo evitarlo:** en la rama de respaldo usar `setTimeout`/`clearTimeout` globales, no `window.setTimeout`.

## Errores de despliegue y producción aprendidos

Errores que solo aparecen al desplegar o en producción (no los detectan lint ni build). Mismo formato que la sección anterior.

- **[Spec 04] Figura del hero con ancho 0 (no se ve)** — `HeroScaffold`: unidades `cqh` dentro de un contenedor `container-type: size` cuyo alto sale de `flex-1` en una columna con solo `min-height`: Chrome las resolvía a 0. No lo detectan lint ni build. **Cómo evitarlo:** no depender de `cqh` para alturas que salen de flex; medir con `ResizeObserver` y pasar el alto como variable CSS (`--stage-h`).
- **[Spec 03] `POST /api/contact` → 502 + `validation_error` (422) de Resend: "Invalid `from` field…"** — variables de entorno en Vercel: `CONTACT_FROM_EMAIL` se guardó con comillas (`"SM8 España <ventas@sm8.es>"`, copiado de `.env.example`). En un `.env` las comillas se quitan al leerlo, pero **el panel de Vercel guarda el valor literal**, comillas incluidas, y Resend no lo reconoce como `Nombre <email>`. En local funcionaba. **Cómo arreglarlo:** en Vercel → Settings → Environment Variables, poner el valor **sin comillas** (`SM8 España <ventas@sm8.es>`) y hacer **Redeploy** (las variables solo se aplican en despliegues nuevos). **Cómo evitarlo:** nunca poner comillas en los valores de Vercel. **Cómo diagnosticarlo:** el 502 del endpoint siempre es un rechazo de Resend; el motivo exacto está en Vercel → Logs (línea `[api/contact] Resend devolvió un error`) o en Resend → Logs. Si sale un 403 de dominio no verificado, falta verificar `sm8.es` en Resend → Domains (registros DNS).

## Qué es

Rediseño del sitio real https://www.sm8.es/ (alquiler y montaje de andamios multidireccionales en Madrid, Grupo SM8). El sitio actual es una SPA React + Vite en Vercel, hecha por Diego hace tiempo. Este repo es la nueva versión en Next.js. Aún **no está desplegado**.

## Decisiones tomadas

| Tema | Decisión |
|---|---|
| Estructura | **Solo landing** (`app/page.tsx`) con secciones y anclas `#inicio`, `#andamios`, `#proyectos`, `#certificaciones`, `#preguntas-frecuentes` (fuera del menú), `#contacto` (los `id` se pasan como prop desde `app/page.tsx`; los enlaces viven en el array `links` de `app/layout.tsx`, compartido por Navbar y Footer). Scroll suave global (`globals.css` + `data-scroll-behavior="smooth"` en `<html>`), desactivado con `prefers-reduced-motion`. Las rutas del sitio viejo redirigen con 308 en `next.config.ts`: `/andamio-multidireccional` → `/#andamios`, `/nosotros` → `/`, `/contacto` → `/#contacto`. |
| Deploy | **Vercel** (producción = `main`). **Todavía no se ha desplegado nada**; Diego avisará cuando lo haga. Los despliegues a producción los hace **solo Diego** (ver regla 4). No hay subagente de DevOps/despliegue. |
| Responsive | **Mobile-first obligatorio**: todo componente nuevo o modificado debe funcionar en móvil, tablet y escritorio. Nada de paddings fijos gigantes sin breakpoints (ej. `px-80` → `px-4 md:px-12 lg:px-48`). |
| Idioma | **Solo español de España (es-ES)** (`<html lang="es">`, `og:locale es_ES`). Sin i18n. El público objetivo está en España (Madrid): todo el contenido usa vocabulario peninsular ("móvil", "ordenador", "presupuesto"), tuteo y "vosotros" para el plural, formatos españoles (`+34`, `1.234,56 €`, `dd/mm/aaaa`, coma decimal) y nada de latinoamericanismos ni mexicanismos. Ver `.claude/agents/content-seo-specialist.md`. |
| Tema | **Solo oscuro.** |
| Contenido | **Lo proporciona Diego.** Mantener placeholders hasta recibir el contenido definitivo; no copiar ni inventar datos. |
| SEO | Spec `specs/02_seo_onpage_landing_spec.md`. Zona objetivo **Comunidad de Madrid**; palabras clave principales "alquiler de andamios Madrid", "montaje de andamios Madrid", "andamio multidireccional". Servicios que se pueden nombrar: alquiler **con** montaje y desmontaje, venta del Sistema Multidireccional SM8 y gestión del PMUD y licencias. Un solo `h1` (hero). Metadata en `app/layout.tsx` (textos en `lib/seo/seo.ts`), JSON-LD en `app/page.tsx` (`lib/seo/jsonLd.ts`: `LocalBusiness` + `WebSite` + `FAQPage`), `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`. **Solo datos oficiales**: nada de normativa, geo, horario ni reseñas sin confirmar. |
| Hero | Spec `specs/04_andamio_piramidal_hero_spec.md`. Andamio multidireccional exento en pirámide escalonada (7 torres de 2,07 × 2,07 m, 2-4-6-8-6-4-2 m), dibujado con anatomy (`andamio/piramide.mjs`, cámara a 84°) y aprobado por Diego. `HomeSection` es una columna flex `min-h-[max(100svh,35rem)]` (sin alto fijo ni `overflow-hidden`, para que el texto ampliado no corte los botones) y `HeroScaffold` ocupa el alto libre bajo los botones: siempre se ve el pico y la base se corta bajo el degradado. Decorativo (`aria-hidden`); se monta una vez (≈3 s, 2 pasos/s, por tiempo transcurrido) y con movimiento reducido aparece montado. |
| Animaciones | Spec `specs/05_animaciones_y_carga_de_imagenes_spec.md`. Estilo **editorial sobrio**, sin librerías de animación. Una sola curva `ease-out-soft` (`cubic-bezier(.22,1,.36,1)`), tokens `duration-fast/base/slow` (300/600/900 ms) y `delay-stagger` (70 ms) en `@theme`. Revelados al hacer scroll por **atributos**: `data-reveal` (fade-up 16 px), `data-reveal="image"` (en el marco: clip-path + escala 1,06 → 1), `data-reveal="words"` (lo pone `Titles`), `data-reveal-group` (hijos directos escalonados, máx. 6) y `--i` para retrasos manuales. Un único `RevealObserver` (en el layout) marca `data-revealed` una vez; red de seguridad de 3 s (`data-reveal-all`). Solo `transform`/`opacity`/`clip-path`. Con `prefers-reduced-motion` no hay animación y sin JS todo se ve. Hero: entrada solo CSS (`hero-intro-*`, ≈ 960 ms) y la pirámide arranca al terminar. **Lenis 1.3.27 solo en escritorio** (`pointer: fine`, sin movimiento reducido) con anclas propias en `SmoothScroll`; instancia en `lib/motion/lenis.ts`. **La velocidad de la escena de Andamios no se toca** (Diego): `useScrollProgress` mide contra `lenis.targetScroll` para no sumar inercias. |
| Imágenes | Fuente en `assets-src/img/` (fuera de git; Diego guarda los originales) → `node scripts/optimize-images.mjs` → WebP ≤ ~300 KB en `public/img/`. Solo WebP (sin AVIF). **Importación estática** siempre (da `blurDataURL` y proporción real; nunca `width`+`height` inventados: causaban saltos). Fotos de contenido con `BlurImage` (blur + fundido) y `sizes` según su columna. En Next 16 `priority` está obsoleto: usar `preload` (solo el logo de la navbar). |
| Datos del negocio | **Única fuente: `lib/business.ts`** (NAP, redes, webs del grupo, servicios), confirmados por Diego. No duplicar teléfono, email ni dirección en componentes. Copyright: "© {año} SM8. Todos los derechos reservados." |
| Formulario de contacto | **Route Handler `POST /api/contact` + Resend** (spec `03`; campos del spec `06`). **Solo 4 campos:** nombre completo, teléfono (+ país), correo y mensaje, más la casilla de privacidad. **Teléfono internacional:** `PhoneInput` con `<select>` nativo de 245 países (`lib/contact/countries.ts`, generado con `node scripts/gen-countries.mjs`; España por defecto, prefijo delante "+34 España") y validación por país con `libphonenumber-js` 1.13.16 en el mismo esquema zod (teléfono + país en un `phoneSchema` propio unido con `.and()`: en zod 4 un `abort` impide los checks de objeto); sale en E.164 con el país real. `ContactSection` usa `ContactFormLazy` (`next/dynamic` `ssr: false` + IntersectionObserver) con `ContactFormSkeleton`: el formulario, `libphonenumber-js`, zod y axios no entran en la carga inicial. El cliente llama con la instancia de Axios `lib/http/api.ts` (`api.post("/contact", …)`). Reglas en `lib/contact/schema.ts` (zod, compartidas cliente/servidor). Protección: origen (`ALLOWED_ORIGINS`) + **Vercel BotID Basic** (sin coste) + validación + body ≤ 16 KB JSON. Envía `EmailContact` al cliente (sin cambios) y `EmailInfo` a `CONTACT_TO_EMAIL` (nombre, teléfono internacional + país, correo y mensaje; asunto `Nuevo contacto web: {nombre}`). Las plantillas se renderizan en el endpoint con `render()` (HTML + `plainText`) y se envían como `html`/`text`: **no usar `react:` de Resend**, que importa `@react-email/render` (no instalado como dependencia directa) y falla. Plantillas con `@react-email/components`: colores en hex (no `oklch`), 600 px, bordes/subrayados en `style`, imágenes en `public/img/email/` vía `getEmailAssets()` (`lib/email/assets.ts`, `EMAIL_ASSETS_URL`). Vista previa en `/email` solo en desarrollo. Variables en `.env.example`. |
| Git | **Git flow simplificado**: `develop` = integración continua, `main` = producción. Ramas por tarea `feat/...`, `fix/...`, `chore/...` desde `develop` → PR a `develop` → cuando está aprobado y listo, PR `develop` → `main`. Tras el merge, la rama de tarea se borra. Conventional Commits (`feat: ...`). Claude no hace commit ni push si Diego no lo pide. **Prohibido hacer merge a `develop` o `main` sin autorización de Diego.** |

## Equipo de agentes

La **sesión principal actúa como Frontend Lead**: planifica, divide el trabajo, asigna cada tarea al subagente correspondiente (`.claude/agents/`), revisa e integra el resultado en la rama de la tarea. Los subagentes no lanzan otros subagentes ni hablan con Diego directamente: le devuelven un informe al Lead, y sus preguntas ("Preguntas para Diego") el Lead se las traslada a Diego.

| Subagente | Rol | Zona principal |
|---|---|---|
| `ui-system-engineer` | Design System Engineer | `components/shared/**`, `types/shared/**`, `app/globals.css` |
| `sections-engineer` | Feature / Sections Engineer | secciones de `components/<Seccion>/**`, `app/page.tsx` |
| `motion-engineer` | Motion & Interaction Engineer | animaciones, `IsoBuildFigure`, `andamio/**` |
| `nextjs-platform-engineer` | Next.js Platform Engineer | `next.config.ts`, Server Actions, `lib/**`, `.env.example` |
| `content-seo-specialist` | Content & SEO Specialist (es-ES) | textos, `metadata`, `sitemap.ts`, `robots.ts`, JSON-LD |
| `qa-a11y-reviewer` | QA & Accessibility Reviewer | solo lectura: lint/tsc/build, WCAG 2.2 AA, responsive |

Flujo: Lead crea rama `feat/...` → asigna a subagentes → `qa-a11y-reviewer` revisa → Lead corrige/integra → Diego revisa el PR a `develop` y decide el merge → cuando está listo, Diego pasa `develop` a `main`. No hay subagente de despliegue. Los subagentes no hacen commits; los hace el Lead solo si Diego lo pide.

## Stack

- **Next.js 16.4** (App Router) — tiene cambios que rompen con versiones anteriores: leer `node_modules/next/dist/docs/` antes de usar APIs (ver AGENTS.md).
  - `next.config.ts` activa `cacheComponents: true` y `partialPrefetching: true`.
  - Se usan los tipos globales `LayoutProps<"/">` / `PageProps` generados por Next.
- **React 19.3**, **TypeScript** estricto, alias `@/*` → raíz del repo.
- **Tailwind CSS v4** (`@import "tailwindcss"` en `app/globals.css`, sin `tailwind.config`; tokens con `@theme` si hacen falta). Usar sintaxis v4 (`bg-linear-to-b`, etc.).
- Fuentes con `next/font/google`: Montserrat → `--font-heading`, Mona Sans → `--font-body`.
- ESLint 9 (`eslint-config-next`). No hay tests todavía.
- Gestor de paquetes: **npm**. Node 23.

## Comandos

```bash
npm run dev     # servidor de desarrollo (turbopack)
npm run build   # build de producción — correrlo para validar cambios importantes
npm run lint    # eslint
```

## Estructura y convenciones

```
app/            layout.tsx (Navbar + Footer), page.tsx (orden de secciones), globals.css
components/
  <Seccion>/<Seccion>Section/…   secciones de la landing (Home, Clients, Scaffolds, Projects,
                                 Certifications, Manual, Opinions, Contact)
  <Seccion>/<Pieza>/…            subcomponentes de cada sección (CertItem, ProjectCard, …)
  Email/                         plantillas de correo (react-email): EmailContact, EmailInfo
  shared/                        piezas reutilizables: Buttons, Forms (+ FieldError, fieldClasses), Toast, Icons, Navbar, Footer,
                                 Section, Titles, Enlace, Collapse, CurrentYear
  shared/Motion/                 RevealObserver, SmoothScroll (Lenis), Marquee + MarqueeToggle (pausa)
  shared/BlurImage/              next/image con placeholder blur + fundido (cliente)
  Home/HeroScaffold/             andamio piramidal del hero (cliente; heroScaffoldData.ts generado)
  Contact/ContactFormLazy/       carga diferida del formulario (+ ContactFormSkeleton)
  shared/Forms/PhoneInput/       teléfono con selector de país
  Faq/FaqSection/                preguntas frecuentes (textos en faqItems.ts, reutilizados en el JSON-LD)
lib/            business.ts (datos del negocio), seo/ (seo.ts, jsonLd.ts), contact/schema.ts, contact/countries.ts (generado), http/api.ts, email/assets.ts, motion/lenis.ts
scripts/        optimize-images.mjs (assets-src/img → public/img en WebP), gen-countries.mjs (→ lib/contact/countries.ts)
types/          interfaces de props, espejo de la estructura de components/
public/         img/logo.webp, figures/*.svg (figuras isométricas)
andamio/        generadores de las figuras isométricas (ver abajo)
specs/          planes de implementación NN_nombre_spec.md (plantilla: specs/_TEMPLATE.md)
.claude/agents/ definiciones de los subagentes del equipo
```

- Una carpeta por componente: `components/Area/Componente/Componente.tsx`.
- **Named exports** con arrow function: `export const Navbar = () => {…}`.
- Props tipadas con `interface` en `types/...` (ej. `types/shared/button/buttonProps.ts`).
- Server Components por defecto; `"use client"` solo cuando haya estado/efectos (ContactForm, ProjectCard, IsoBuildFigure).
- Formularios: `PhoneInput` (selector de país + `tel`, controlado; ids `{name}` y `{name}-country`, error en `{name}-error`; el input lleva `w-0 min-w-0 flex-1` para no desbordar en móvil). `fieldClasses(invalid, { inline: true })` quita `mt-1 w-full` para controles en fila. `InputText`/`TextArea` aceptan `error`, `required`, `inputMode`, `autoComplete`, `maxLength`; `CheckBox` es controlado (`checked`, `onChange`); `Form` recibe `privacyChecked`, `onPrivacyChange`, `privacyError`, `isSubmitting`. `MainButton` acepta `disabled` y `busy` (`aria-disabled`, conserva el foco). Avisos con `useToast()` (`toast.success` se cierra a los 6 s, `toast.error` queda fijo) dentro de `ToastProvider`.
- Listas de contenido como arrays de objetos dentro del componente y `.map()`.
- Envolver secciones con `<Section id?>` (lleva `scroll-mt` para la navbar fija; las secciones aceptan `SectionAnchorProps`) y títulos con `<Titles>` (pinta `h2` por defecto, prop `as`; subtítulo en `<p>`); botones con `MainButton` / `SecondaryButton` (con `href` renderizan un `<a>`, para anclas o `tel:`); desplegables con `Collapse` (`<details>`/`<summary>`, Server Component); enlaces del footer con `Enlance` (`external`, `ariaLabel`); año dinámico con `CurrentYear` (`"use cache"`, necesario por `cacheComponents`); iconos SVG en `components/shared/Icons` (aceptan `className`).
- Imágenes con `next/image` e importación estática; fotos de contenido con `BlurImage` y `sizes`.
- Animación de una sección nueva: solo atributos `data-reveal*` (ver "Animaciones" en Decisiones), sin JS propio. Los botones ya traen el texto que rueda (`RollText`, copia en `::after` con texto alternativo vacío) y los enlaces de Navbar/Footer el subrayado animado. Para listas en bucle, `Marquee` (lleva botón de pausa, WCAG 2.2.2).

## Diseño visual

- Fondo negro (`bg-black`), superficies `neutral-900/950`, bordes `neutral-800/900`, **texto secundario `neutral-400`** (`neutral-500` da 4,43:1 y no llega a AA: no usarlo para texto; solo bordes y placeholders). Texto de `MainButton` en `blue-400` por contraste.
- Tipografía: `h1`–`h3` en Montserrat desde `app/globals.css` (`@layer base`); texto en Mona Sans. Los títulos en gris (`text-neutral-400`) llevan `font-text` (Mona Sans).
- Acento principal **amarillo** (`yellow-300/400/500`): categorías, iconos, palabras destacadas.
- Acento de acción **azul** (`blue-500`): botones principales (borde + fondo `blue-500/30`, `rounded-full`).
- Tarjetas `rounded-xl` con borde `neutral-800` y gradientes suaves (`bg-linear-to-b from-neutral-900/60 to-black`).
- Navbar flotante tipo píldora con `backdrop-blur` desde `lg`; por debajo, hamburguesa animada (`BurgerButton`) y menú a pantalla completa. Scrollspy con `components/shared/Navbar/useActiveSection.ts` (activo en `yellow-400`). Detalle en `specs/00_navbar_responsive_spec.md`.

## Figuras isométricas (andamio/)

- `andamio/*.mjs` modelan las figuras (fachada `fig2.mjs`, obra `obra.mjs`, industria `industria.mjs`, nudo de roseta `fig1.mjs`) con el kit del skill **anatomy** (`~/.claude/skills/anatomy`, rutas absolutas en los scripts).
- `node andamio/gen-next.mjs` regenera `public/figures/*.svg`, `components/Scaffolds/*/…FigureData.ts` y `components/Scaffolds/IsoBuildFigure/iso-figure.css`. **Esos archivos generados no se editan a mano**: cambiar el modelo y regenerar.
- `IsoBuildFigure` (cliente) carga el SVG en diferido con IntersectionObserver y anima el montaje por pasos. Tiene dos modos:
  - `mode="auto"` (por defecto): bucle automático con ratón, clic y teclado.
  - `mode="scroll"`: lo controla el padre con `ref.setProgress(p)`. Acepta además `eager` para precargar.
- La sección Andamios usa `components/Scaffolds/ScaffoldsScroll/ScaffoldsScroll.tsx`, una escena fijada guiada por scroll con `useScrollProgress`. La velocidad (`STEP_VH=60`, `PAUSE_VH=30`, `FADE_VH=45`) está aprobada por Diego. Con `prefers-reduced-motion` se muestra apilado y estático. El ancla `#andamios` va en `<Section id>` de `ScaffoldsSection` para que se vea el título de la sección (spec 02). Detalle en `specs/01_scaffolds_scroll_animation_spec.md`.
- Pirámide del hero: `node andamio/build-piramide.mjs` → `andamio/piramide-dark.html` (página de iteración que imita el hero, con todo el detalle). `node andamio/gen-next.mjs piramide` genera solo `public/figures/andamio-sm8-piramide.svg` y `components/Home/HeroScaffold/heroScaffoldData.ts` con la versión ligera (`PIR_LITE=1`: sin perforaciones, cuñas ni roscas) y los `d` compactados por `andamio/lib/svg-min.mjs`. El SVG está en el límite de 150 KB gzip: cualquier pieza nueva lo supera.
- `components/Scaffolds/IsoBuildFigure/isoSteps.ts` tiene los helpers del montaje por pasos (`fetchSvg` con caché, `collectGroups`, `paintSteps` con caída opcional y sin reescribir grupos que no cambian); los usan `IsoBuildFigure` y `HeroScaffold`.
- `andamio/shots/` son capturas de referencia locales, fuera de git.

## Datos del negocio (referencia del sitio actual — usar solo si Diego lo confirma)

- Email: info@sm8.es · Tel/WhatsApp: +34 616 74 02 90
- Dirección: Av. de Manoteras 38, Chamartín, 28050 Madrid
- Redes: instagram.com/sm8espana · facebook.com/sm8espana
- Grupo SM8: SM8 México (sm8.com.mx), SM8 Desarrollos (sm8desarrollos.com.mx), Timbrela
- Producto: Sistema Multidireccional SM8 (roseta octogonal). Normativas citadas: UNE-EN 12811, RD 2177/2004, Ley 31/1995 PRL.

## Pendientes conocidos

- Contenido de relleno a sustituir cuando Diego lo pase: testimonios (`OpionsSection`), logos de clientes, tarjetas de proyectos, imagen/PDF de la ficha técnica (`ManualSection`, el botón "Descargar ficha técnica" no hace nada), caja vacía en Certificaciones, caja vacía (mapa) en Contacto.
- Responsive de las secciones (próximo spec libre, `07`): queda el desborde de `ProjectCard` (abajo). Los logos de `ClientsSection` ya tienen su proporción (spec 05).
- Animaciones (spec 05): probar la escena de Andamios con ratón y trackpad reales y en Firefox; probar en móvil real; decidir si la red de seguridad del revelado baja de 3 s a 1,5 s (con red muy lenta, entrar por un ancla puede dejar la sección oculta hasta 3 s).
- `BurgerSvg` ya no se usa; confirmar con Diego si se borra (`CloseSvg` vuelve a usarse en el Toast).
- Typos en nombres: `Opion*` (→ `Opinion*`), `Enlance` (→ `Enlace`), `CertificationSection.tsx`. Confirmar con Diego antes de renombrar.
- Formulario (spec 03): si hay abuso del acuse de recibo (se envía a cualquier email válido), añadir límite por IP (Upstash) o BotID Deep Analysis. Probar un envío real y ver los correos en Gmail/Outlook. Dar de alta las variables de `.env.example` en Vercel.
- `MainButton` mide ~30 px de alto (`py-1`): subirlo en el spec de responsive (`07`). Si cambia, ajustar también `ContactFormSkeleton`.
- Andamios (spec 01):
  - Falta probar el scroll en un móvil real o con CPU 4×.
  - El viewBox de los SVG tiene aire alrededor del dibujo.
- SEO (spec 02):
  - Pendiente de confirmar por Diego: UNE-EN 12810, en qué casos exige el PMUD el RD 2177/2004 y la licencia de vía pública en Madrid. No publicar hasta tenerlo.
  - Logo SVG en la imagen Open Graph (`public/img/logo.svg`, tarea 6.8).
  - Al desplegar: Search Console + sitemap, Google Business Profile, Rich Results Test; actualizar `LAST_MODIFIED` en `app/sitemap.ts` cuando cambie el contenido.
  - Futuro: páginas por servicio (fachadas, industria, venta, PMUD).
- Hero (spec 04): probar el montaje en un móvil real o con CPU 4×; a 320×568 solo se ven ≈42 px del pico; decidir si se versiona `andamio/piramide-dark.html` (2,4 MB). Los rodapiés del modelo de la pirámide salen con `NaN` y no se dibujan (Diego prefirió dejarlo así).
- Formulario (spec 06): re-medir en navegador las alturas ajustadas de `ContactFormSkeleton` frente al formulario real; probar un envío real con número extranjero; el select no cambia solo de país al escribir `+XX` (el servidor guarda el país correcto); probar el desplegable nativo en Windows; "8:00 hrs" en Contacto → "8:00 h" (cambio pequeño aparte).
- **Aviso / política de privacidad**: pendiente hasta que se lo compartan a Diego. Entonces se genera la página y se enlaza desde el texto de la casilla del formulario (spec 03).
- `ProjectCard` se desborda entre 768 y 1023 px (`w-1/3` dentro de `md:grid-cols-2`).
