# 05 · Animaciones de la landing y carga de imágenes

- **Estado:** Terminado (aprobado por Diego el 11/11/2026)
- **Fecha:** 11/11/2026
- **Rama:** `feat/motions` (ya sale de `develop`)
- **Solicitado por:** Diego

## 1. Objetivo

Dar al sitio un acabado premium con un sistema de animación **editorial y sobrio**, el mismo en todas las secciones, que acompañe la lectura sin penalizar el rendimiento. También eliminar los saltos de diseño (CLS) y los "pop-in" de las imágenes en conexiones lentas.

## 2. Requisitos

### Estilo de movimiento (lenguaje común)

| Token | Valor | Uso |
|---|---|---|
| `--ease-out-soft` | `cubic-bezier(.22,1,.36,1)` | entradas y revelados (el easing de Humbleteam) |
| `--ease-in-out-soft` | `cubic-bezier(.65,0,.35,1)` | hovers que van y vuelven (texto que rueda, subrayado) |
| `--dur-fast` | `300ms` | hovers |
| `--dur-base` | `600ms` | bloques de texto, tarjetas |
| `--dur-slow` | `900ms` | imágenes, títulos |
| `--stagger` | `70ms` | retraso entre hermanos (máx. 6 escalones) |

- **Títulos (`h1`, `h2`)**: cada palabra sube desde una máscara (`overflow: clip` + `translateY(110%)` → `0`), con un escalonado de 40 ms por palabra. El texto sigue siendo un único nodo legible para lectores de pantalla.
- **Bloques** (párrafos, listas, tarjetas, campos del formulario): `opacity 0 → 1` + `translateY(16px) → 0`, con escalonado entre hermanos.
- **Imágenes**: se destapan con `clip-path: inset(8% round 12px) → inset(0 round 12px)` y la foto pasa de `scale(1.06)` a `1` dentro del marco.
- **Cada elemento se anima una sola vez**, al entrar un 15 % en pantalla. Nada se repite al volver a subir.
- **Solo se animan `transform`, `opacity` y `clip-path`** (en GPU). Nunca `width`, `height`, `top` ni `margin`.
- **Hero (al cargar)**: insignia → `h1` palabra a palabra → párrafo → botones, en unos 900 ms. Después arranca el montaje de la pirámide, que ya existe. La navbar baja con un fundido. Se hace solo con CSS (sin esperar a JS), para no retrasar el LCP.
- **Scroll suave Lenis solo en escritorio** (`pointer: fine` y sin movimiento reducido). En táctil y con `prefers-reduced-motion` se mantiene el scroll nativo.
- **Microinteracciones:**
  - `MainButton` / `SecondaryButton`: al pasar el ratón el texto sube y entra una copia desde abajo. La copia lleva `aria-hidden`.
  - Enlaces de Navbar y Footer (`Enlance`): subrayado que crece de izquierda a derecha (`scale-x`, `transform-origin` que cambia al salir).
  - `ProjectCard`: la imagen escala de 1 a 1,04 dentro del marco y el borde se aclara.
  - `ClientsSection`: marquesina de logos en bucle lento (unos 40 s por vuelta), con máscara de degradado en los bordes. Se pausa al pasar el ratón o al enfocar algo dentro. Se deja preparada con los logos de relleno actuales.
- **Movimiento reducido**: todo aparece al instante y sin desplazamiento. Lenis está apagado, la marquesina se convierte en una fila estática que pasa a la línea siguiente y los botones solo cambian de color.
- **Sin JS**: el contenido se ve completo. El estado oculto inicial solo se aplica con `@media (scripting: enabled)`, y una red de seguridad muestra todo si el observador no arranca en 3 s.

### Carga de imágenes (conexiones lentas)

- **Cero CLS**: toda imagen tiene su proporción reservada (`aspect-ratio` o `width`/`height` reales). Se corrige el marco `w-96 h-96` de `ManualSection` y los logos de `ClientsSection` (aviso de proporción de `next/image`).
- **Placeholder borroso + fundido**: las imágenes locales se importan de forma estática (`import foto from "@/public/img/…"`), así Next genera `blurDataURL` sin coste extra. Se muestran con `placeholder="blur"` y, al cargar (`onLoad`), la foto nítida entra con un fundido de 400 ms.
- **`sizes` correcto** en todas las `Image` con `fill` (hoy descargan a `100vw`).
- **`priority`/`preload` solo** para lo que está en la primera pantalla (logo de la navbar). El resto, `loading="lazy"` (por defecto).
- **Recomprimir las fuentes**: `fachada.jpg` (3,1 MB), `historico.jpg` (1,5 MB), `edificio.jpg` (1,3 MB) y `manual.png` (764 KB) pasan a WebP de 2400 px de ancho como máximo y unos 300 KB o menos. Se guardan los originales fuera de `public/`. Next sigue sirviendo AVIF/WebP según el navegador.

### Presupuesto de rendimiento

- JS nuevo como mucho de unos 6 KB gzip (Lenis ~4 KB + observador). Sin GSAP, Framer Motion ni otras librerías.
- Un **único** `IntersectionObserver` para toda la página, que deja de observar cada elemento tras revelarlo.
- Sin precargador de página ni cursor personalizado (dañan el LCP y la accesibilidad).
- Lighthouse móvil: CLS < 0,05 y LCP sin empeorar respecto a `develop`.

### Fuera de alcance

- El responsive de las secciones (pasa al spec `06`), salvo los dos arreglos de proporción citados arriba.
- El desborde de `ProjectCard` entre 768 y 1023 px (spec `06`).
- Transiciones entre páginas (el sitio es una sola landing).
- Cambios en el montaje de la pirámide (`HeroScaffold`) y en la escena de Andamios, salvo lo necesario para que convivan con Lenis.
- Contenido nuevo: los logos, las fotos y los textos siguen siendo los actuales.

## 3. Preguntas y respuestas

- **P:** ¿Qué nivel de animación?
  **R:** Editorial sobrio: máscara palabra a palabra en títulos, fade + 16 px en bloques, clip-path en imágenes, sin librerías.
- **P:** ¿Scroll suave con Lenis?
  **R:** Sí, solo en escritorio.
- **P:** ¿Qué microinteracciones?
  **R:** Las cuatro: texto que rueda en botones, subrayado animado en enlaces, zoom en `ProjectCard` y marquesina de logos.
- **P:** ¿Qué estado de carga para las imágenes?
  **R:** Blur + fundido, con proporción reservada y recompresión de los JPG pesados.
- **P:** ¿Resolución de las fotos recomprimidas?
  **R:** Se queda en 1200–2000 px para no pasar de unos 300 KB.
- **P:** ¿Versionar los originales (`assets-src/`, 7,3 MB)?
  **R:** No: `assets-src/` va al `.gitignore`; Diego guarda los originales aparte.
- **P:** ¿Activar AVIF?
  **R:** No, solo WebP (la recomendación de Next).
- **P:** El JS nuevo ronda los 7 KB gzip (Lenis 1.3.27 pesa 5,4 KB), por encima de los ~6 KB previstos. ¿Se acepta?
  **R:** Sí.
- **P:** ¿Se puede tocar la velocidad de la escena de Andamios para que conviva con Lenis?
  **R:** No. La velocidad de la animación de los andamios se conserva tal cual (`STEP_VH=60`, `PAUSE_VH=30`, `FADE_VH=45` y la sensación actual). Si Lenis la altera, se ajusta Lenis o se compensa el suavizado para que se perciba igual que hoy.

## 4. Estado actual

- **Animaciones existentes:** `HeroScaffold` (montaje de la pirámide), `ScaffoldsScroll` + `useScrollProgress` (escena fijada con su propio suavizado y un listener de scroll pasivo), `Collapse` (apertura con `::details-content`), `BurgerButton` y `Toast`. El resto de secciones no tienen animación de entrada.
- **Scroll:** nativo con `html { scroll-behavior: smooth }` en `globals.css`.
- **Imágenes:** `next/image` con `src` en texto (sin `blurDataURL`) en `ClientsSection`, `ProjectCard`, `CertificationSection`, `ManualSection`, `Navbar` y `Footer`. Las de `fill` no llevan `sizes`.
- **Referencias analizadas:** clintagency.com (Webflow + Lenis + Lottie, marquesinas), duo-studio.co (Next.js + Lenis, máscaras de texto, etiquetas duplicadas para el hover que rueda, marquesina de trabajos), humbleteam.com (Lenis, `cubic-bezier(.22,1,.36,1)` y `(.22,.61,.36,1)` con 0,3–0,6 s).

## 5. Análisis de impacto

- **Archivos que se modifican:**
  - `app/globals.css`: tokens de movimiento en `@theme`, clases `reveal`, máscara de palabras, marquesina, subrayado, entrada del hero. Lenis exige `scroll-behavior: auto` mientras está activo.
  - `app/layout.tsx`: monta `RevealObserver` y `SmoothScroll`.
  - `components/shared/Titles/Titles.tsx`: divide el título en palabras enmascaradas (sigue siendo Server Component).
  - `components/shared/Buttons/MainButton`, `SecondaryButton`: texto que rueda.
  - `components/shared/Enlace/Enlace.tsx`, `components/shared/Navbar/NavbarLinks`: subrayado.
  - `components/Home/HomeSection/HomeSection.tsx`: entrada del hero con CSS.
  - `components/Clients/ClientsSection/ClientsSection.tsx`: marquesina y logos en un array.
  - `components/Projects/ProjectCard/ProjectCard.tsx`, `CertificationSection.tsx`, `ManualSection.tsx`, `Footer.tsx`, `Navbar.tsx`: imágenes con importación estática, `sizes` y `placeholder`.
  - Todas las secciones: atributos `data-reveal` y `data-reveal-group` en sus bloques.
  - `components/Scaffolds/ScaffoldsScroll/useScrollProgress.ts`: comprobar que el doble suavizado (Lenis + el suyo) no deja la escena "lenta". Si pasa, se reduce su constante cuando Lenis está activo.
  - `package.json`: `lenis` con versión exacta.
- **Archivos nuevos:**
  - `components/shared/Motion/RevealObserver.tsx` (cliente): un observador para todos los `[data-reveal]`.
  - `components/shared/Motion/SmoothScroll.tsx` (cliente): Lenis condicionado, con integración de anclas y offset de la navbar.
  - `components/shared/Motion/Marquee.tsx` (Server Component, CSS puro).
  - `components/shared/BlurImage/BlurImage.tsx` (cliente): envoltorio de `next/image` con el fundido al cargar.
  - `types/shared/motion/…`: props de los anteriores.
  - Imágenes WebP recomprimidas en `public/img/`.
- **Se reutiliza:** `Section`, `Titles`, `next/image`, el patrón de `prefers-reduced-motion` de `globals.css` y el criterio de animar por tiempo transcurrido que ya usan `HeroScaffold` e `IsoBuildFigure`.
- **Riesgos de rotura:**
  - **Escena fijada de Andamios con Lenis:** Lenis mueve el scroll nativo (`window.scrollY`), así que `useScrollProgress` sigue recibiendo eventos. El riesgo es el doble suavizado; se prueba en la fase 2.
  - **Anclas y `scroll-mt`:** con Lenis activo, los clics a `#contacto` y demás los gestiona Lenis con el offset de la navbar. Hay que verificar el scrollspy (`useActiveSection`) y las redirecciones 308 a `/#andamios`.
  - **Menú móvil a pantalla completa:** sin Lenis en táctil, no le afecta.
  - **Titles dividido en palabras:** no debe cambiar el texto accesible ni el JSON-LD (los textos del FAQ salen de `faqItems.ts`, no del DOM).
  - **LCP:** el `h1` no puede empezar en `opacity: 0` a la espera de JS. Por eso su entrada es solo CSS y dura menos de 1 s.
  - **Peso del hero:** no se toca el SVG de la pirámide (está en el límite de 150 KB gzip).

## 6. Plan de implementación

### Fase 1 · Base de movimiento y piezas compartidas — `ui-system-engineer`
- [x] 1.1 Tokens de easing y duración en `@theme` (`app/globals.css`).
- [x] 1.2 CSS de `[data-reveal]` (variantes `fade-up`, `image`) y `[data-reveal-group]` (escalonado con `--i`), condicionado a `scripting: enabled` y `prefers-reduced-motion: no-preference`.
- [x] 1.3 `Titles`: máscara palabra a palabra, Server Component, texto accesible intacto.
- [x] 1.4 `MainButton` / `SecondaryButton`: texto que rueda (copia con `aria-hidden`; el foco visible se mantiene).
- [x] 1.5 Subrayado animado en `Enlance` y `NavbarLinks` (el enlace activo del scrollspy conserva su `yellow-400`).
- [x] 1.6 `Marquee` (CSS puro: lista duplicada con `aria-hidden`, pausa con `:hover` y `:focus-within`, estático con movimiento reducido).
- [x] 1.7 `BlurImage` (cliente): `placeholder="blur"` + fundido con `onLoad`, admite `fill` y `sizes`.
- **Resultado esperado:** piezas listas y documentadas; ninguna sección cambia todavía, salvo títulos y botones.
- [x] Fase 1 verificada por el Lead

### Fase 2 · Motor: observador, Lenis y hero — `motion-engineer`
- [x] 2.1 `RevealObserver`: un único `IntersectionObserver` (`threshold 0.15`, `rootMargin` inferior de -10 %), `unobserve` tras revelar, red de seguridad de 3 s y respeto a `prefers-reduced-motion`.
- [x] 2.2 `SmoothScroll`: instalar `lenis` (versión exacta), activarlo solo con `(pointer: fine)` y sin movimiento reducido, anclas con offset de la navbar, se apaga si cambian las preferencias.
- [x] 2.3 Comprobar `ScaffoldsScroll` / `useScrollProgress` y `useActiveSection` con Lenis. **La velocidad de la escena de Andamios debe percibirse idéntica a la actual** (no se tocan `STEP_VH`, `PAUSE_VH`, `FADE_VH`); si hay doble inercia, se compensa sin cambiar el ritmo.
- [x] 2.4 Entrada del hero y de la navbar solo con CSS (escalonado de unos 900 ms en total), coordinada para que el montaje de la pirámide empiece después.
- **Resultado esperado:** scroll suave en escritorio, revelados funcionando y escena de Andamios sin regresiones.
- [x] Fase 2 verificada por el Lead

### Fase 3 · Imágenes sin saltos — `nextjs-platform-engineer`
- [x] 3.1 Recomprimir `fachada.jpg`, `historico.jpg`, `edificio.jpg` y `manual.png` a WebP (≤ 2400 px, ≤ ~300 KB) con `sharp` (ya viene con Next). Los originales se quedan fuera de `public/`.
- [x] 3.2 Importaciones estáticas, `sizes` adecuados y `BlurImage` en `ProjectCard`, `CertificationSection` y `ManualSection`. Logo de la navbar con `priority` y sin blur.
- [x] 3.3 Proporción correcta en los logos de `ClientsSection` y en el marco de `ManualSection` (aspecto real en lugar de `w-96 h-96`).
- [x] 3.4 Revisar `next.config.ts` → `images.formats: ["image/avif", "image/webp"]` (leer antes `node_modules/next/dist/docs/`).
- **Resultado esperado:** CLS de imágenes = 0 y placeholder borroso visible con "Slow 4G" en DevTools.
- [x] Fase 3 verificada por el Lead

### Fase 4 · Aplicar el sistema en las secciones — `sections-engineer`
- [x] 4.1 `ClientsSection`: logos en un array + `Marquee`.
- [x] 4.2 `ScaffoldsSection`: revelado de la caja azul (la escena fijada no se toca).
- [x] 4.3 `ProjectsSection` / `ProjectCard`: tarjetas en grupo escalonado, imagen con revelado `image` y zoom 1,04 al pasar el ratón.
- [x] 4.4 `CertificationsSection`: `CertItem` escalonados e imagen con revelado `image`.
- [x] 4.5 `ManualSection`, `FaqSection` (preguntas escalonadas), `ContactSection` (campos escalonados) y `Footer` (columnas).
- **Resultado esperado:** recorrido completo de la landing con el mismo lenguaje de movimiento.
- [x] Fase 4 verificada por el Lead

### Fase 5 · Revisión QA — `qa-a11y-reviewer`
- [x] Lint, typecheck y build sin errores
- [x] Accesibilidad WCAG 2.2 AA (2.3.3 movimiento reducido, 2.2.2 pausa de la marquesina, foco visible, texto de títulos y botones leído una sola vez)
- [x] Responsive en móvil (375 px), tablet (768 px) y escritorio (1280 px+)
- [x] Rendimiento: CLS < 0,05, LCP no peor que en `develop`, sin tareas largas por las animaciones (CPU 4×), Slow 4G con placeholders
- [x] Sin JS: todo el contenido visible
- [x] Contenido en español de España
- **Resultado esperado:** veredicto ✅ o ⚠️ sin bloqueantes
- [x] Revisión QA verificada por el Lead

### Cierre — Frontend Lead
- [x] `npm run lint` sin errores
- [x] `npm run build` sin errores
- [x] Errores encontrados (si los hubo) reportados, corregidos y anotados en "Errores de lint y build aprendidos" de `CLAUDE.md`
- [x] Resumen final escrito
- [x] `CLAUDE.md` actualizado (lenguaje de movimiento, `data-reveal`, `BlurImage`, `Marquee`, Lenis; el responsive pasa al spec `06`)
- [x] Resumen enviado a Diego

## 7. Cambios sobre el plan

- 1.6 bis: botón de pausa en Marquee, decisión de Diego (WCAG 2.2.2; `MarqueeToggle` alterna `data-paused` en `.marquee-root`, visible en todos los dispositivos y oculto con movimiento reducido).

- **3.1:** a 2400 px las fotos pesaban 380–820 KB. `scripts/optimize-images.mjs` baja el ancho (2400 → 2000 → 1600 → 1400 → 1200) hasta caber en ~300 KB: fachada 1200 px, edificio 1400 px, histórico 2000 px, manual 1080 px (55 KB, con transparencia). Originales en `assets-src/img/` (ignorado en git).
- **1.1:** los tokens se llaman `--transition-duration-{fast,base,slow}` y `--transition-delay-stagger` (en vez de `--dur-*`/`--stagger`) para que Tailwind genere `duration-fast`, `delay-stagger`, etc.; `@theme static`.
- **1.2:** el revelado usa `@keyframes` con `fill-mode: backwards` (no transiciones) para no pisar los `transition-*` ni los hovers; anima `translate`/`scale` sueltos.
- **1.4:** nueva pieza `components/shared/Buttons/RollText` (texto que rueda dentro de `.roll-trigger`). `MainButton` pasa de `div`/`p` a `span` (HTML válido); `SecondaryButton` gana `type` y foco visible.
- **1.7:** `BlurImage` pinta el placeholder de Next (vía `getImageProps`) en un envoltorio `.blur-image` y el `<img>` va con `placeholder="empty"`, para que el fundido no oculte el blur. Estado en `data-blur-state` desde `ref`/`onLoad`, sin `setState`.
- **3.2:** en Next 16 `priority` está obsoleto: usar `preload`.
- **2.1:** la red de seguridad de 3 s tiene dos partes. (a) Un `<script>` en línea en `app/layout.tsx` pone `data-reveal-all` a los 3 s si `RevealObserver` no ha marcado `data-reveal-ready` en `<html>` (JS caído o sin hidratar); va en línea porque `next/script` con `beforeInteractive` encola los scripts en línea para el runtime de Next y no correría sin él. (b) Con el observador vivo no se revela todo de golpe: al terminar cada scroll (`scrollend`) y a los 3 s se revela lo pendiente que ya quedó entero por encima del viewport. El primer escaneo va en `requestIdleCallback` para no tocar nodos que React aún no ha hidratado (daba un aviso de hidratación en dev). `<html>` lleva `suppressHydrationWarning`. Con movimiento reducido solo pone `data-reveal-all` (por si el usuario vuelve a activar el movimiento).
- **2.2:** `lenis@1.3.27` (`lerp: 0.1`, `autoRaf`). No se usa la opción `anchors` de Lenis (no cancela el salto nativo): `SmoothScroll` intercepta los clics a `#…` de la misma página, llama a `lenis.scrollTo(elemento)` (resta el `scroll-margin-top` del destino) y actualiza la URL con `history.pushState`. Instancia expuesta en `lib/motion/lenis.ts` (`getLenis`, `getScrollLead`, `scrollToImmediate`, `stopLenis`/`startLenis`). `Navbar` para Lenis mientras el menú está abierto. `html.lenis { scroll-behavior: auto }` en `globals.css`.
- **2.2 (hallazgo previo):** al cargar con hash, el navegador salta al ancla mientras algo por encima de `#andamios` encoge 39 px al hidratar, y se quedaba corto (73 px en vez de 112, también en `develop` y en táctil). `SmoothScroll` recoloca una vez cuando el scroll se para tras `load` (con Lenis o `scrollIntoView`), salvo que el usuario interactúe antes. El origen de esos 39 px no se ha investigado (fuera de alcance).
- **2.3:** no se tocan las constantes ni el suavizado de `ScaffoldsScroll`. `useScrollProgress` mide contra el destino de Lenis (`targetScroll`) en vez de la posición interpolada, así que el único suavizado de la escena sigue siendo el suyo (`SMOOTH_SECONDS = 0.12`). `focusCategory` usa `scrollToImmediate` (pasa por `lenis.scrollTo(…, { immediate })` si Lenis está activo).
- **2.4:** la entrada usa keyframes propios `hero-intro-*` (no las clases del observador): insignia 0 ms, `h1` 80 ms + 30 ms/palabra (550 ms), párrafo 300 ms, botones 400 ms ≈ 960 ms; navbar 600 ms. Los bloques arrancan con opacidad 0,01 (no 0) por el LCP. `HeroScaffold` espera a que terminen las animaciones `hero-intro-*` (`document.getAnimations()`) antes de arrancar el montaje; la velocidad no cambia.
- **Presupuesto JS:** Lenis 1.3.27 pesa ≈ 5,4 KB gzip (no ~4 KB); con el observador y `SmoothScroll` el total ronda los 7 KB, algo por encima de los ~6 KB previstos.
- **3.2:** `ProjectProps.imageUrl` pasa a `StaticImageData`. `sizes`: `ProjectCard` `(min-width: 64rem) calc((100vw - 16rem) / 3), (min-width: 48rem) calc(50vw - 2rem), calc(100vw - 2rem)`; Certificaciones `(min-width: 64rem) calc(50vw - 7.5rem), calc(100vw - 2rem)`; Manual `(min-width: 26rem) 24rem, calc(100vw - 2rem)`. Radio en `wrapperClassName` (`rounded-lg` en ProjectCard, `rounded-xl` en Certificaciones). Logos de Navbar y Footer con importación estática y solo `width={50}` (Next calcula el alto, 30); el de la navbar con `preload`.
- **3.3:** Manual sin `fill`: `BlurImage` con el tamaño intrínseco (1080 × 1080, 1:1), `w-full max-w-96` y `h-auto`; en móvil ya no se sale de 320–375 px. Logos de Clients con importación estática y solo `width={100}` (alto real 61, proporción 1148 × 700); sin aviso de `next/image`.
- **Salto de 39 px al cargar `/#andamios` (resuelto):** no era la hidratación ni el hero ni la fuente. Eran los logos de `ClientsSection`: con `width={100} height={100}` el navegador reservaba 100 px de alto y, al cargar la imagen, `height: auto` lo bajaba a 61 px (Clients 292 → 253 px). Medido con Playwright: `#inicio` fijo en 800 px; `#andamios` pasaba de 1092 a 1053 px. Con la proporción real, `#andamios` queda en 1053 desde el primer frame, en dev y en `next start`, a 1280 y 375 px, y no hay entradas `layout-shift`. La recolocación de `SmoothScroll` tras `load` (2.2) ya no debería hacer falta en este caso.
- **3.4:** no se añade AVIF (decisión de Diego, siguiendo la doc de Next 16); `next.config.ts` sin cambios.
- **4.3:** el zoom del hover escala la `<img>` (`motion-safe:group-hover:scale-104`, `transition-[scale] duration-slow ease-out-soft`) y el revelado `image` escala el envoltorio `.blur-image`: propiedades en nodos distintos, sin choque. El marco lleva `overflow-clip` y `group-hover:border-neutral-700` (`group-hover` de Tailwind v4 ya va dentro de `@media (hover: hover)`). `key` de las tarjetas pasa del índice al título.
- **4.5 (Contacto):** para que los campos sean hijos directos del grupo, `data-reveal-group` va en el `<form>` de `components/shared/Forms/Form/Form.tsx` (componente compartido, solo un atributo fijo). Entran campos, casilla de privacidad y botón (9 hijos; del 7.º en adelante, juntos). Los `FieldError` están dentro de cada campo: no se animan. Además, los datos de contacto (`CertItem` de `ContactSection`) van en un grupo escalonado, como en Certificaciones.
- **4.5 (Manual):** el marco del revelado `image` es un `div` nuevo (`w-full max-w-96`) alrededor de `BlurImage`; el botón entra con `--i: 3` (tras el subtítulo de `Titles`, `--i: 2`). La caja azul de Andamios usa `--i: 2` por la misma razón.
- **QA (fase 5) y correcciones del Lead:** primer veredicto ❌ con un bloqueante y dos importantes, corregidos y verificados con Playwright en `next start`:
  - **B1:** scroll horizontal de 1–13 px entre 600 y 1023 px antes de revelar la imagen de Certificaciones (el `clip-path` no recorta el desborde con scroll y la imagen va a escala 1,06). Arreglo general: `[data-reveal="image"] { overflow: clip }` en `globals.css`. Ahora `scrollWidth` = ancho de ventana a 600, 768 y 1000 px.
  - **I1:** con movimiento reducido, la marquesina no pasaba a otra línea (`.marquee-list` con `flex-shrink: 0`) y se cortaban logos. Ahora `flex-shrink: 1; width: 100%` y se ven los 6 a 320, 375 y 768 px.
  - **I2:** con Lenis, un ancla activada justo tras un scroll nativo del foco (lectores de pantalla) iba a un sitio equivocado. `SmoothScroll` sincroniza Lenis con `scrollY` antes de `scrollTo` si no hay un scroll suave en curso. Foco + clic en el footer → `#andamios` a 112 px.
  - **S1:** la copia del texto que rueda estaba en el DOM ("Solicitar presupuestoSolicitar presupuesto" en el texto del enlace). Ahora es un `::after` con `content: attr(data-text) / ""` (texto alternativo vacío): fuera del DOM y del nombre accesible.
  - **S3:** errata previa "Whastapp" → "WhatsApp" en `ContactSection`.
  - **S2:** con red muy lenta y entrando por un ancla, la sección puede tardar hasta 3 s en verse (red de seguridad del diseño). Se mantiene; pendiente de decisión de Diego si se baja a 1,5 s.

## 8. Resumen final

**Qué se hizo.** Sistema de movimiento editorial y sobrio para toda la landing, más carga de imágenes sin saltos.

- **Lenguaje común:** tokens en `@theme` (`ease-out-soft` = `cubic-bezier(.22,1,.36,1)`, `ease-in-out-soft`, `duration-fast/base/slow`, `delay-stagger`) y revelados por atributos: `data-reveal` (fade-up), `"image"` (clip-path + escala), `"words"` (máscara palabra a palabra, la pone `Titles`) y `data-reveal-group` (hijos escalonados). Un único `RevealObserver` marca `data-revealed`, con red de seguridad de 3 s (`data-reveal-all`).
- **Hero:** entrada solo con CSS (≈ 960 ms), navbar con fundido; la pirámide se monta al terminar.
- **Scroll:** Lenis 1.3.27 solo en escritorio (`pointer: fine`, sin movimiento reducido), con anclas propias que respetan `scroll-margin-top` y el hash. La escena de Andamios conserva su velocidad (constantes intactas; mide contra `lenis.targetScroll`, comprobado por QA con valores idénticos a `develop`).
- **Microinteracciones:** texto que rueda en botones (`RollText`), subrayado animado en enlaces, zoom en `ProjectCard`, marquesina de logos con botón de pausa.
- **Imágenes:** fotos recomprimidas a WebP (7,3 MB → 0,96 MB; script `scripts/optimize-images.mjs`), importación estática + `BlurImage` (blur + fundido), `sizes` por layout, proporciones reales (arregló el salto de 39 px al entrar por `/#andamios`).
- **Accesibilidad y rendimiento:** con movimiento reducido no hay animación; sin JS todo se ve; CLS ≈ 0,0015; LCP igual que en `develop`; sin tareas largas por las animaciones.

**Archivos principales nuevos:** `components/shared/Motion/{RevealObserver,SmoothScroll,Marquee,MarqueeToggle}.tsx`, `components/shared/BlurImage/BlurImage.tsx`, `components/shared/Buttons/RollText/RollText.tsx`, `components/shared/Icons/{PauseSvg,PlaySvg}.tsx`, `lib/motion/lenis.ts`, `types/shared/{motion,blurImage}/…`, `scripts/optimize-images.mjs`, `public/img/*.webp`.

**Pendientes:**
- Probar la escena de Andamios con ratón y trackpad reales, y en Firefox (la rueda por líneas).
- Decidir si la red de seguridad baja de 3 s a 1,5 s (S2).
- La recolocación de `SmoothScroll` tras `load` ya no hace falta para el salto de los logos; se deja como red de seguridad.
- Prueba en móvil real.

