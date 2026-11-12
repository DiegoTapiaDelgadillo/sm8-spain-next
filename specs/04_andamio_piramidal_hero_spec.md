# 04 · Andamio piramidal del hero

- **Estado:** Terminado (11/11/2026)
- **Fecha:** 11/11/2026
- **Rama:** `feat/andamio-principal`
- **Solicitado por:** Diego

## 1. Objetivo

Sustituir la imagen del diseño original (un mismo andamio tradicional duplicado 7 veces en escalera) por una **estructura exenta escalonada de andamio multidireccional SM8**, dibujada con la skill **anatomy**, que se pueda montar de verdad y que muestre la versatilidad del sistema. Primero se itera el diseño en un HTML de anatomy; cuando Diego lo apruebe, se convierte en componente y se coloca en el hero.

## 2. Requisitos

- **Caso real:** estructura exenta (sin edificio) formada por torres **unidas entre sí** que suben por niveles hasta un pico central, con silueta triangular/piramidal como la referencia. Debe ser montable: mismos módulos, nudos de roseta, arriostramiento y accesos reales. Ejemplos de uso: soporte de escenario o tribuna, estructura para un monumento o una torre de iluminación.
- **Piezas reales del sistema** (reutilizando `andamio/fig2.mjs`): postes Ø48,3 mm con roseta cada 0,5 m, horizontales con cabezal de cuña, diagonales verticales, husillos con placa base, plataformas con trampilla, rodapiés, barandillas y escalera interior de acceso.
- **Formato del hero:** apaisado (~16:9), **sin tarjeta** (sin "Fig", título ni lectura), fondo transparente y degradado a negro en la parte de abajo. Solo tema oscuro.
- **Movimiento:** se monta nivel a nivel **una vez** al cargar y se queda quieta. Con `prefers-reduced-motion` aparece ya montada.
- Mobile-first: legible a 375 px (se puede reencuadrar o recortar los laterales en móvil).
- Rendimiento: el hero no puede empeorar el LCP (el `h1` sigue siendo el LCP); SVG objetivo ≤ 150 KB comprimido.
- **Fuera de alcance:** cambiar textos o botones del hero, tema claro, versión 3D/WebGL, PDF imprimible.

## 3. Preguntas y respuestas

- **P:** ¿Qué caso real representa la estructura?
  **R:** Andamio exento escalonado: torres unidas que suben hasta un pico central, sin edificio.
- **P:** ¿Dónde va y con qué formato?
  **R:** En el hero, ancho y sin tarjeta, con degradado a negro abajo.
- **P:** ¿Qué movimiento?
  **R:** Montaje al cargar y luego quieta.
- **P:** ¿Spec antes de iterar?
  **R:** Sí, este spec cubre las dos fases.

## 4. Estado actual

- `components/Home/HomeSection/HomeSection.tsx`: hero con chip, `h1`, subtítulo y dos botones; **no tiene imagen**.
- `andamio/fig2.mjs`, `obra.mjs`, `industria.mjs`: modelos con las piezas del sistema (postes, rosetas, cabezales, plataformas, diagonales, bases). `andamio/gen-next.mjs` genera SVG + datos para `IsoBuildFigure`.
- `components/Scaffolds/IsoBuildFigure/IsoBuildFigure.tsx`: carga el SVG en diferido y anima el montaje por pasos; modos `auto` (bucle) y `scroll`, y prop `eager`. Lo usa la sección Andamios.

## 5. Análisis de impacto

- **Archivos nuevos (fase 1):** `andamio/piramide.mjs` (modelo), `andamio/build-piramide.mjs` → `andamio/piramide-dark.html` (página de iteración).
- **Archivos nuevos (fase 2):** `public/figures/andamio-sm8-piramide.svg`, `components/Home/HeroScaffold/…` (datos generados + componente).
- **Archivos que se modifican (fase 2):** `andamio/gen-next.mjs` (emitir la nueva figura), `components/Home/HomeSection/HomeSection.tsx` (colocar la figura y ajustar el alto del hero), posiblemente `IsoBuildFigure.tsx` (nuevo modo `once`).
- **Se reutiliza:** piezas de `fig2.mjs`, la animación por pasos de `IsoBuildFigure` y su CSS generado.
- **Riesgos de rotura:**
  - Si se añade el modo `once` a `IsoBuildFigure`, los modos `auto` y `scroll` de la sección Andamios no deben cambiar.
  - El hero es `h-screen`: añadir la figura puede desplazar los botones en móviles bajos; se revisa en 375×667.
  - LCP: la figura carga con `eager` pero sin bloquear el texto.

## 6. Plan de implementación

### Fase 1 · Diseño en HTML de anatomy (iterativo) — Lead + `motion-engineer`
- [x] 1.1 Modelo verdadero: módulos de 2,07 m × 0,73/1,09 m, niveles cada 2 m, altura de cada torre, accesos y arriostramiento (que sea montable)
- [x] 1.2 Lista de piezas (tamaño **Hero**, 80–150 piezas distintas)
- [x] 1.3 `andamio/piramide.mjs` + `build-piramide.mjs` → `piramide-dark.html` con montaje por pasos
- [x] 1.4 Capturas (escritorio, 390 px y close-ups 4×) revisadas
- [x] 1.5 Iteraciones con Diego hasta aprobar el diseño
- **Resultado esperado:** HTML aprobado por Diego.
- [x] Fase 1 verificada por el Lead (diseño aprobado por Diego el 11/11/2026: iteración 4)

### Fase 2 · Componente en el hero — `motion-engineer` + `sections-engineer`
- [x] 2.1 Emitir SVG y datos desde `gen-next.mjs` (sin tarjeta, fondo transparente)
- [x] 2.2 Componente cliente `HeroScaffold` con montaje único (helpers compartidos extraídos de `IsoBuildFigure`, sin cambiar sus modos `auto`/`scroll`)
- [x] 2.3 Colocar en `HomeSection` con degradado a negro, mobile-first
- [x] 2.4 `prefers-reduced-motion`: figura montada y estática
- **Resultado esperado:** hero con la figura montándose una vez al cargar.
- [x] Fase 2 verificada por el Lead

### Fase 3 · Revisión QA — `qa-a11y-reviewer`
- [x] Lint, typecheck y build sin errores
- [x] Accesibilidad WCAG 2.2 AA (figura decorativa o con `aria-label` adecuado)
- [x] Responsive en móvil (375px), tablet (768px) y escritorio (1280px+)
- [x] LCP y peso del SVG
- **Resultado esperado:** veredicto ✅ o ⚠️ sin bloqueantes
- [x] Revisión QA verificada por el Lead (veredicto inicial ❌ por B1; corregido B1, I1, I2 y S1 y verificado: queda ⚠️ sin bloqueantes)

### Cierre — Frontend Lead
- [x] `npm run lint` sin errores
- [x] `npm run build` sin errores
- [x] Errores encontrados (si los hubo) reportados, corregidos y anotados en "Errores de lint y build aprendidos" de `CLAUDE.md`
- [x] Resumen final escrito
- [x] `CLAUDE.md` actualizado
- [x] Resumen enviado a Diego

## 7. Cambios sobre el plan

- **Iteración 1 (11/11/2026):** vanos de 2,07 × 2,07 m, cámara a 72° (a 58° no se leía la pirámide; probados también 38° y 80°, y vanos de 1,57 × 1,09 m). Todas las plataformas llevan barandillas a 0,5 y 1,0 m y rodapié; las diagonales van en zigzag (frente en vanos pares y fondo en impares) y en los costados de cada escalón; la escalera de aluminio con trampilla va en el vano central; hay tablones de reparto bajo las bases. Peso: ≈1.950 piezas, 2,3 MB (400 KB comprimido), muy por encima del objetivo de 150 KB, que se resolverá en la fase 2.
- **Iteración 2 (11/11/2026, petición de Diego):** figura más pegada a los botones y más ancha. El alto del lienzo se calcula a partir de los puntos reales de la estructura (sin aire arriba ni a los lados, `PAD = 4`), y el contenedor pasa a ocupar todo el ancho (hasta 1600 px) sin padding lateral. En móvil se amplía al 150 % y se recorta por los lados.
- **Iteración 3 (11/11/2026, petición de Diego):** cámara de 72° a **84°**, más frontal, para que la base quede casi horizontal y no se vea un lado más alto que el otro. Se probaron también 80° (aún inclinada) y 87° (casi simétrica, pero plana).
- **Iteración 4 (11/11/2026, petición de Diego): responsive vertical.** El hero mide una pantalla (`100svh`, mínimo 560 px) y la figura ocupa el alto que queda bajo los botones (contenedor `flex: 1` con `container-type: size`). El ancho del SVG es `min(100cqw, 1600px, 100cqh × W/H ÷ 0,6)`: siempre se ve el pico y, como en el diseño original, la base queda cortada bajo el degradado (como mínimo se ve el 60 % superior de la figura). En vertical o por debajo de 1024 px se permite hasta `150cqw`, y por debajo de 640 px hasta `170cqw`, recortando los laterales. Revisado en 1920×1080, 1440×900, 1440×700, 1280×800, 1024×1366, 820×1180, 768×1024, 390×844 y 375×667, sin scroll horizontal. En la fase 2 se pasa a Tailwind v4 (`@container`, unidades `cqh`/`cqw`).
- **Fase 2 · figura para la web (11/11/2026, `motion-engineer`):**
  - El hero se genera con `node andamio/gen-next.mjs piramide` (sin argumentos regenera todas; las tres figuras existentes y `iso-figure.css` salen idénticas). Salidas: `public/figures/andamio-sm8-piramide.svg` (1.038 KB, **145 KB gzip**, 1.601 piezas) y `components/Home/HeroScaffold/heroScaffoldData.ts` (`svgUrl`, `screenPerCmUp`, `steps`, `ratio`). El SVG es decorativo (`aria-hidden="true"`, sin `role` ni etiqueta).
  - Versión ligera del modelo con `PIR_LITE=1` (la página de iteración sigue con todo el detalle y sale byte a byte igual): sin perforaciones de plataformas, tornillos de placas, roscas de husillo ni la cuña del cabezal (todo < 1 px a escala de hero); rosetas y tuercas de 16-18 a 10 lados; tubos rectos sin vértices intermedios; largueros en 2 trozos en vez de 4 (diagonales y escalera conservan sus trozos para no cambiar el orden de pintado en los cruces).
  - Los `d` se compactan con `andamio/lib/svg-min.mjs` (coordenadas relativas en décimas exactas, sin pérdida). `PIR_LITE=1 node andamio/build-piramide.mjs` genera `andamio/piramide-lite-dark.html` para comparar. Capturas antes/después en `andamio/shots/pir/f2-*.png`.
  - Helpers del montaje por pasos extraídos a `components/Scaffolds/IsoBuildFigure/isoSteps.ts` (`ease`, `collectGroups`, `paintSteps` con caída opcional, `fetchSvg`, `StepGroup`, `DROP_CM`); `IsoBuildFigure` los importa sin cambiar su comportamiento.
  - Encontrado: los rodapiés del modelo salen con coordenadas `NaN` (al plano le falta `r`), así que no se pintan ni en el diseño aprobado. En la versión ligera no se emiten; arreglarlo añadiría rodapiés visibles (pendiente de Diego).

- **Fase 2 · hero en `HomeSection` (11/11/2026, `sections-engineer`):** la sección pasa de `h-screen` centrada con `xl:px-80` a columna flex `h-svh min-h-140 overflow-hidden` con `pt-24 lg:pt-28` (la barra móvil mide ≈68 px y la píldora de `lg` acaba en ≈72 px). El bloque de texto queda en `w-full max-w-4xl shrink-0 px-4` (sustituye a `xl:px-80`; textos y estilos sin cambios) y debajo va `<HeroScaffold className="mt-3" />` de borde a borde. Capturas en `andamio/shots/pir/home-*.png` (1920×1080, 1440×900, 1440×700, 1024×1366, 768×1024, 390×844 y 375×667), sin scroll horizontal; Clientes empieza justo al acabar el hero.

- **Fase 3 · correcciones tras la QA (11/11/2026, Lead):**
  - **B1 (bloqueante, WCAG 1.4.4):** con el texto al 150–200 % en móvil, el hero (`h-svh` + `overflow-hidden`) recortaba los botones. Ahora la sección usa `min-h-[max(100svh,35rem)]`, sin alto fijo ni `overflow-hidden`; `HeroScaffold` ya recorta por su cuenta. Verificado a 375×667: al 150 % y al 200 % la sección crece y Clientes empieza justo debajo.
  - Al quitar el alto fijo, las unidades `cqh` daban 0 en Chrome (el alto del escenario sale de `flex-1` dentro de un `min-height`) y la figura medía 0 px. Se sustituyen `container-type: size` y `cqh`/`cqw` por un `ResizeObserver` que escribe `--stage-h` (px) en el escenario. El ancho pasa a `min(170% | 150% | 100% y 1600px, --stage-h × ratio ÷ 0,6)`, con los mismos cortes que antes.
  - **I1 (WCAG 2.2.2):** el progreso del montaje sale del tiempo transcurrido (no de la suma de `dt` limitada), así que dura ≈4,8 s aunque el móvil vaya lento.
  - **I2:** `paintSteps` guarda en cada `StepGroup` el último avance (`e`) y no toca el DOM de los grupos que no cambian. No cambia el comportamiento de la sección Andamios.
  - **S1:** la inyección del SVG (≈1 MB) se hace con `requestIdleCallback` (`timeout` 600 ms; `setTimeout` como respaldo), después del LCP.
  - Pendientes de la QA que no se tocan: S2 (el SVG está en el límite de 150 KB: 144 KiB con gzip -9, 151 KB con gzip -6; Vercel sirve brotli), S4 (a 320×568 solo se ven ≈42 px del pico), S5 (cosmético, ya no aplica tras quitar `container-type`).
- **Ajuste final (11/11/2026, petición de Diego):** montaje más rápido: `RATE` de 1,25 a **2 pasos/s** en `HeroScaffold` (de ≈4,8 s a ≈3 s).

## 8. Resumen final

**Qué se hizo.** El hero de la landing muestra un andamio multidireccional SM8 exento en forma de pirámide escalonada: 7 torres de 2,07 × 2,07 m unidas, de 2-4-6-8-6-4-2 m, con plataformas, barandillas, diagonales en zigzag y escalera con trampilla en la torre central. Se dibujó con la skill anatomy, se iteró 4 veces con Diego (cámara a 84°, encuadre ajustado y responsive vertical) y se monta nivel a nivel una vez al cargar (≈3 s); con movimiento reducido aparece montado. Es decorativo (`aria-hidden`).

**Archivos principales.**
- Modelo y generación: `andamio/piramide.mjs` (diseño; `PIR_LITE=1` = versión web), `andamio/build-piramide.mjs` → `andamio/piramide-dark.html` (página de iteración), `andamio/gen-next.mjs piramide`, `andamio/lib/svg-min.mjs`.
- Generados: `public/figures/andamio-sm8-piramide.svg` (≈1 MB, ≈145 KB gzip), `components/Home/HeroScaffold/heroScaffoldData.ts`.
- Componentes: `components/Home/HeroScaffold/HeroScaffold.tsx` (cliente), `components/Home/HomeSection/HomeSection.tsx`, `components/Scaffolds/IsoBuildFigure/isoSteps.ts` (helpers compartidos con `IsoBuildFigure`), `types/Home/heroScaffold/heroScaffoldProps.ts`.

**Decisiones.** Componente propio del hero en vez de un modo `once` en `IsoBuildFigure`; el ancho de la figura depende del alto libre (medido con `ResizeObserver`), así que siempre se ve el pico y la base se corta bajo el degradado; en vertical o por debajo de 1024 px se amplía hasta el 150 % (170 % en móvil) recortando los lados. Rodapiés y perforaciones no se dibujan (como en el diseño aprobado).

**Validación.** `npm run lint` (0 errores; 1 aviso previo en `andamio/industria.mjs`), `npx tsc --noEmit` y `npm run build` correctos. QA en 320–1920 px sin scroll horizontal; LCP = `h1`; CLS ≈ 0; sección Andamios sin cambios de comportamiento.

**Pendientes.** Probar el montaje en un móvil real o con CPU 4×; el SVG está en el límite de 150 KB (cualquier pieza nueva lo supera); decidir si se versiona `andamio/piramide-dark.html` (2,4 MB), como las otras páginas de diseño.
