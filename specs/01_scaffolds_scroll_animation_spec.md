# 01 · Montaje de andamios guiado por scroll en la sección Andamios

- **Estado:** Terminado (aprobado por Diego el 04/11/2026; cerrado el 04/11/2026)
- **Fecha:** 04/11/2026
- **Rama:** `feat/animation-scroll` (ya creada)
- **Solicitado por:** Diego

## 1. Objetivo

Que en la sección `#andamios` el montaje y desmontaje de cada andamio lo controle el scroll del usuario, en lugar del bucle automático actual. La sección queda fijada en pantalla mientras se recorren las tres categorías (Restauración → Construcción → Industria): al bajar se monta el andamio paso a paso; al subir, se desmonta. Al terminar el montaje de una categoría, se pasa a la siguiente con un fundido. Referencia de sensación: las páginas de producto de Apple (iPhone Pro), pero animando el SVG real, no imágenes ni fotogramas.

## 2. Requisitos

### Comportamiento
- **Scrub continuo:** el progreso del montaje sigue al scroll de forma suave (con un ligero suavizado tipo inercia). No se secuestra la rueda: funciona igual con trackpad, rueda, teclado (`Espacio`, `AvPág`, flechas) y gesto táctil.
- **Fijado (sticky):** al llegar a la sección, el bloque figura + texto queda fijado a pantalla completa (`100dvh`) mientras dura el recorrido de las tres categorías. Después, la página sigue con normalidad hacia `#proyectos`.
- **Estado inicial:** al llegar se ve la categoría 01 (Restauración) con la base del andamio (paso 0).
- **Montaje:** cada figura tiene 5 pasos (0–4). Cada paso ocupa aprox. **60 % de la altura de pantalla** de scroll (constante ajustable). Las piezas caen y aparecen con el mismo efecto que hoy (caída desde 80 cm + fundido), pero con el progreso dictado por el scroll.
- **Desmontaje:** al subir, el proceso se invierte exactamente (scrub bidireccional).
- **Transición entre categorías (fundido cruzado):** al completar el paso 4 hay una pequeña pausa con el andamio terminado (~30 % de pantalla de scroll); luego texto y figura de la categoría actual se desvanecen y entra la siguiente con fundido + leve desplazamiento vertical (~45 % de pantalla). Al subir se invierte.
- **Duración total aproximada** del recorrido fijado: 3 × (4 × 60 + 30 + 45) ≈ 9,5 pantallas de scroll. Se ajustará probándolo; los valores viven en constantes al inicio del componente.

### Layout
- **Escritorio (≥ `xl`, 1280px):** igual que hoy: **figura a la izquierda, texto a la derecha** (columna de 2). El texto es el que cambia por categoría (fundido), sin moverse de su sitio.
- **Móvil y tablet (< `xl`):** también fijado. Pantalla completa con el texto arriba (compacto: categoría, título, descripción y botón) y la figura debajo, ocupando el espacio restante. Usar `dvh` para que la barra del navegador móvil no descuadre el fijado.
- El aviso "El Sistema Multidireccional SM8 se adapta…" se mantiene **encima** del bloque fijado, sin fijarse.
- El botón "Solicitar presupuesto" se mantiene en cada categoría.
- El título de cada categoría pasa de `<h1>` a `<h2>` (un solo `h1` por página; accesibilidad y SEO), sin cambiar su aspecto visual.

### Accesibilidad y rendimiento
- **`prefers-reduced-motion: reduce`:** sin fijado ni scrub. Se muestra el layout apilado actual (una categoría tras otra) con cada andamio **completo y estático**.
- Los tres textos están siempre en el DOM (SEO y lectores de pantalla). Los que no están activos llevan `aria-hidden` + `inert`, para que el foco y el lector no caigan en contenido invisible. Si el usuario tabula hasta el botón de una categoría, el scroll lleva a esa categoría.
- Se elimina la interacción actual de ratón (`pointermove`) y clic sobre la figura, porque chocaría con el scroll. La figura deja de ser un `role="slider"` en este modo y pasa a ser una imagen (`role="img"` + `aria-label` existente); el progreso visible lo dicta el scroll.
- Sin re-renders de React por frame: el bucle escribe atributos del SVG directamente (como hoy). Un único listener de scroll pasivo + `requestAnimationFrame`, que se para cuando la sección está fuera de pantalla.
- Los tres SVG (~130 KB c/u comprimidos) se precargan cuando la sección se acerca a la pantalla, para que la siguiente categoría esté lista antes del fundido. Mientras carga se muestra el placeholder pulsante actual.
- Sin dependencias nuevas (nada de GSAP ni Framer Motion): `position: sticky` + cálculo de progreso propio.

### Fuera de alcance
- Indicador de progreso (01 · 02 · 03) y leyenda del paso actual bajo la figura: no se añaden (se pueden pedir más adelante).
- Cambios en los modelos de `andamio/` o en los SVG generados.
- Textos de la sección (se mantienen los actuales).
- Responsive del resto de secciones.

## 3. Preguntas y respuestas

- **P:** ¿Cómo responde el montaje al scroll: scrub continuo, pasos con snap o secuestrar la rueda?
  **R:** Scrub continuo.
- **P:** ¿Qué pasa en móvil y tablet?
  **R:** Fijado también en móvil.
- **P:** ¿Texto a la izquierda y figura a la derecha?
  **R:** No: el texto queda a la derecha, como está ahora.
- **P:** ¿Extras (indicador de progreso, leyenda del paso)?
  **R:** No se pidieron; quedan fuera de alcance.
- **P:** ¿Transición entre categorías?
  **R:** Fundido cruzado con pausa al terminar el montaje.
- **P:** ¿Se quita la interacción de ratón y clic sobre la figura?
  **R:** Sí.
- **P:** ¿Se cambia el `<h1>` de cada categoría a `<h2>`?
  **R:** Sí, se incluye en este spec.
- **P:** ¿Numeración del spec?
  **R:** Se mantiene `01`; el spec de responsive de secciones será el siguiente número libre.

## 4. Estado actual

- `components/Scaffolds/ScaffoldsSection/ScaffoldsSection.tsx` (Server Component): array `infoSection` con 3 categorías; cada una renderiza su figura (`ScaffoldFigure`, `ConstructionFigure`, `IndustryFigure`) y su texto en `grid xl:grid-cols-2`, apiladas con `gap-24`.
- `components/Scaffolds/IsoBuildFigure/IsoBuildFigure.tsx` (cliente): carga el SVG en diferido (IntersectionObserver), y anima en bucle automático (`tourAt`, 12 s) los grupos `[data-step]`. Además responde a ratón (posición X), clic (siguiente paso) y teclado (`role="slider"`). Tras interactuar, vuelve al bucle a los 4,2 s. Con movimiento reducido, salta sin animación.
- Las 3 figuras tienen 5 pasos. Sus datos (`*FigureData.ts`) y `iso-figure.css` son **generados** por `andamio/gen-next.mjs` y no se editan a mano.
- `IsoBuildFigure` solo se usa a través de los tres wrappers de la sección Andamios.
- `Section` no tiene `overflow` que rompa `position: sticky`. El scrollspy (`useActiveSection`) usa IntersectionObserver con una franja del 35–45 % del viewport: con una sección más alta, `#andamios` seguirá activo mientras se recorre.

## 5. Análisis de impacto

- **Archivos que se modifican:**
  - `components/Scaffolds/IsoBuildFigure/IsoBuildFigure.tsx`: se extrae la lógica de pintado a una función reutilizable y se añade un **modo controlado** (`mode="scroll"`): sin bucle automático, sin ratón/clic, `role="img"`, y un `ref` (React 19, `ref` como prop) que expone `setProgress(p: number)` para que el padre marque el paso (float 0–4). El modo actual (`mode="auto"`, por defecto) se conserva tal cual para no romper otros usos futuros.
  - `ScaffoldFigure`, `ConstructionFigure`, `IndustryFigure`: reenvían `mode` y `ref`.
  - `components/Scaffolds/ScaffoldsSection/ScaffoldsSection.tsx`: sigue siendo Server Component; mantiene el aviso y los datos de las categorías y delega el bloque animado al nuevo componente cliente.
- **Archivos nuevos:**
  - `components/Scaffolds/ScaffoldsScroll/ScaffoldsScroll.tsx` (cliente): contenedor alto + escena `sticky`, cálculo del progreso de scroll, reparto en categoría/paso/transición, fundidos y versión de movimiento reducido.
  - `components/Scaffolds/ScaffoldsScroll/useScrollProgress.ts`: hook que devuelve el progreso 0–1 del contenedor con suavizado y rAF (sin estado de React por frame).
  - `types/Scaffolds/scaffolds.ts`: interfaz de cada categoría (`category`, `title`, `description`, figura).
- **Se reutiliza:** `IsoBuildFigure` (pintado, carga diferida, placeholder), `Section`, `MainButton`, `DocumentTextSvg`, los datos generados de las figuras.
- **Riesgos de rotura:**
  - **Navbar/anclas:** el enlace a `#andamios` debe aterrizar al inicio del recorrido (categoría 01, paso 0). `scroll-mt` de `Section` se mantiene.
  - **Scrollspy:** se comprobará que "Andamios" queda activo durante todo el recorrido y que "Proyectos" se activa al salir.
  - **Rendimiento en móvil:** se limita el trabajo por frame a los grupos que cambian (como hoy, `drawn !== p`) y se para el rAF fuera de pantalla.
  - **Barra del navegador móvil:** `dvh` en la escena; el alto del contenedor se calcula con `svh` para que no "salte" el progreso al mostrarse/ocultarse la barra.
  - **SSR:** el HTML inicial (sin JS) muestra la categoría 01 completa y legible; los textos de las demás siguen en el DOM.

## 6. Plan de implementación

### Fase 1 · Modo controlado de la figura — `motion-engineer`
- [x] 1.1 Extraer el pintado de grupos `[data-step]` a una función interna reutilizable (sin cambiar el efecto visual).
- [x] 1.2 Añadir prop `mode: "auto" | "scroll"` (por defecto `"auto"`, comportamiento actual intacto).
- [x] 1.3 En `mode="scroll"`: sin bucle, sin ratón/clic/teclado, `role="img"`, y `ref` con `setProgress(p)` que pinta directamente.
- [x] 1.4 Permitir precarga del SVG controlada por el padre (prop `eager` o `rootMargin` mayor) para que las 3 figuras estén listas.
- [x] 1.5 Reenviar `mode`, `ref` y la precarga en los tres wrappers.
- **Resultado esperado:** la sección actual se ve igual que hoy; la figura acepta control externo.
- [x] Fase 1 verificada por el Lead

### Fase 2 · Escena fijada guiada por scroll — `motion-engineer` (lógica) + `sections-engineer` (maquetación)
- [x] 2.1 `useScrollProgress`: progreso 0–1 del contenedor, listener pasivo + rAF, suavizado (lerp), parada fuera de pantalla.
- [x] 2.2 `ScaffoldsScroll`: reparto del progreso en tramos por categoría (montaje 4 pasos → pausa → fundido) con constantes ajustables.
- [x] 2.3 Fundido cruzado de texto y figura (opacidad + `translateY` leve) escribiendo estilos directamente, sin re-render por frame.
- [x] 2.4 Gestión de `aria-hidden`/`inert` en la categoría inactiva (cambia solo al cruzar el umbral, no por frame) y salto de scroll al recibir foco el botón de otra categoría.
- [x] 2.5 Maquetación mobile-first: escena `sticky top-0 h-dvh`; móvil/tablet texto arriba + figura debajo; `xl` figura izquierda / texto derecha. Probar 375, 768, 1280 y 1440 px.
- [x] 2.6 Versión `prefers-reduced-motion`: layout apilado actual con figuras completas y estáticas.
- [x] 2.7 Cambiar el título de cada categoría de `<h1>` a `<h2>` manteniendo los estilos.
- [x] 2.8 Integrar en `ScaffoldsSection` (aviso encima, datos de categorías tipados en `types/Scaffolds/scaffolds.ts`).
- **Resultado esperado:** al hacer scroll, cada andamio se monta y desmonta siguiendo el scroll y las categorías se suceden con fundido, en móvil y escritorio.
- [x] Fase 2 verificada por el Lead (incluye prueba manual en navegador y ajuste de constantes con Diego)

### Fase 3 · Revisión QA — `qa-a11y-reviewer`
- [x] Lint, typecheck y build sin errores
- [x] Accesibilidad WCAG 2.2 AA (foco, `inert`, lector de pantalla, movimiento reducido)
- [x] Responsive en móvil (375px), tablet (768px) y escritorio (1280px+), sin scroll horizontal
- [ ] Rendimiento: sin tirones al hacer scroll en móvil (CPU throttling 4×), sin CLS al cargar los SVG — CLS 0 y ~0,7 ms de script por frame (p95) en escritorio; **falta probar con CPU 4× o en un móvil real**
- [x] Anclas y scrollspy de la Navbar funcionando
- [x] Contenido en español de España
- **Resultado esperado:** veredicto ✅ o ⚠️ sin bloqueantes
- [x] Revisión QA verificada por el Lead

### Cierre — Frontend Lead
- [x] Resumen final escrito
- [x] `CLAUDE.md` actualizado (nuevo componente `ScaffoldsScroll`, modo `scroll` de `IsoBuildFigure`)
- [x] Resumen enviado a Diego

## 7. Cambios sobre el plan

- **Reparto de la Fase 2:** `motion-engineer` hizo la lógica y una primera versión del layout, incluida la integración (2.1–2.4 y 2.6–2.8). El pulido del layout (2.5) queda para `sections-engineer`.
- **Recorrido:** dura 900 svh (la última categoría no tiene fundido de salida). El contenedor mide `calc(900svh + 100dvh)`. El suavizado tiene una constante de tiempo de 0,12 s, y el fundido usa `FADE_SPLIT=0.6` y un desplazamiento de 24 px.
- **Ancla `#andamios`:** pasa del `<Section>` al contenedor del recorrido, para que se aterrice ya fijado en la categoría 01, paso 0. El aviso azul queda justo encima, fuera de vista (pendiente de confirmar con Diego).
- **Botón fuera del `inert`:** `aria-hidden` e `inert` se aplican a la figura y al texto, pero no al botón, para que el tabulador llegue a los botones de las otras categorías y salte a su tramo. Los bloques inactivos llevan `pointer-events-none`.
- **Rótulo "0n Categoría":** pasa de `<h3>` a `<p>`, para no romper el orden de encabezados (pendiente de confirmar con Diego).
- **Título `<h2>`:** usa la fuente de títulos de forma explícita y un tamaño escalado `text-2xl sm:text-3xl xl:text-4xl`.
- **Ancla y rótulo:** Diego aprobó la velocidad y pidió cerrar. Se mantiene lo recomendado: el ancla aterriza al inicio del recorrido y el rótulo queda como `<p>`.
- **Layout por debajo de `xl` (2.5):** el texto y la figura van juntos y centrados como un bloque (16 px entre el botón y la figura). La celda de la figura mide `min(ancho, 600px)`.
- **Nuevo, no previsto en el spec:** en móvil apaisado o pantallas bajas (alto ≤ 560 px y ancho < 1280 px) se usan dos columnas, figura 2/5 y texto 3/5, con tipografía más compacta.
- **Correcciones tras QA (decididas por Diego):**
  - El texto de las tres categorías ya no lleva `aria-hidden`/`inert`, para que el lector de pantalla lo lea; solo se ocultan las figuras inactivas.
  - El salto al recibir foco ya no exige `:focus-visible`, así que también funciona con el lector en móvil.
  - Si el foco está en el botón de una categoría que se desvanece, pasa al botón de la nueva.
  - La descripción cambia de `neutral-500` a `neutral-400` (AA).
- **Movimiento reducido:** el layout se resuelve con variantes CSS `motion-reduce:`, sin parpadeo al hidratar. Por JS solo se colocan las figuras completas (`setProgress(4)`).

## 8. Resumen final

La sección `#andamios` pasa a ser una escena fijada guiada por scroll. Al bajar, el andamio de cada categoría se monta paso a paso y al subir se desmonta. Las tres categorías (Restauración → Construcción → Industria) se suceden con un fundido cruzado tras una pausa con el andamio completo. El recorrido es de 900 svh.

**Archivos**
- **Nuevos:**
  - `components/Scaffolds/ScaffoldsScroll/ScaffoldsScroll.tsx`: escena, tramos, fundidos, accesibilidad y movimiento reducido.
  - `components/Scaffolds/ScaffoldsScroll/useScrollProgress.ts`: progreso suavizado con rAF y sin re-render.
  - `types/Scaffolds/scaffolds.ts`.
- **Modificados:**
  - `IsoBuildFigure.tsx`: modo `scroll` con `ref.setProgress(p)`, `eager` y caché de SVG; el modo `auto` sigue intacto.
  - Los tres wrappers de figura.
  - `ScaffoldsSection.tsx`: sigue siendo Server Component, con datos tipados y el aviso encima.

**Decisiones**
- Scrub continuo, sin secuestrar la rueda.
- Escena fijada también en móvil.
- Se quitó la interacción con ratón y clic.
- Títulos en `h2` y rótulo de categoría como `p`.
- El ancla aterriza al inicio del recorrido.
- Dos columnas en móvil apaisado.
- Sin dependencias nuevas.

**Pendientes**
- Probar en un móvil real o con CPU 4×.
- El viewBox de los SVG deja aire alrededor del dibujo (habría que recortarlo en `andamio/`).
- La figura está limitada a 600 px (`max-w-150`).
- La condición de pantalla baja apaisada se repite en las clases: se podría crear un `@custom-variant`.
- Los botones "Solicitar presupuesto" no llevan a ningún sitio (ya pasaba antes).
- Al cargar directamente con `/#andamios` se aterriza entre 12 y 39 px más abajo.
- `will-change` está activo de forma permanente en las figuras.
