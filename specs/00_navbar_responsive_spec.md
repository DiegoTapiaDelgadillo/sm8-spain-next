# 00 · Navbar responsive con menú móvil animado y scroll suave

- **Estado:** Terminado (aprobado por Diego el 04/11/2026; cerrado el 04/11/2026)
- **Fecha:** 04/11/2026
- **Rama:** `fix/navbar-responsive` (ya creada; Diego indicó que se trabaja en ella)
- **Solicitado por:** Diego

## 1. Objetivo

Que la navbar funcione en móvil, tablet y escritorio, con un menú móvil a pantalla completa animado y un botón hamburguesa animado, y que cada enlace lleve con desplazamiento suave a su sección de la landing (sin cambiar de página).

## 2. Requisitos

- Enlaces del menú (mismo array para Navbar y Footer):
  | Texto | Ancla | Sección |
  |---|---|---|
  | Inicio | `#inicio` | `HomeSection` |
  | Andamios | `#andamios` | `ScaffoldsSection` |
  | Proyectos | `#proyectos` | `ProjectsSection` |
  | Certificaciones | `#certificaciones` | `CertificationsSection` |
  | Contacto | `#contacto` | `ContactSection` |
- Los `id` de las secciones se asignan en `app/page.tsx` (cada sección recibe una prop `id` opcional).
- **Scroll suave** al pulsar un enlace. La sección no queda tapada por la navbar fija (`scroll-margin-top`). Con `prefers-reduced-motion: reduce` el salto es inmediato.
- **Escritorio (≥ `lg`, 1024px):** píldora flotante con logo, enlaces, separador y botón "Contactar". Paddings por breakpoint (nada de `sm:px-64`).
- **Móvil y tablet (< `lg`):** barra con logo + botón hamburguesa. Al pulsarlo se abre un **overlay a pantalla completa** (negro con `backdrop-blur`) con los enlaces centrados en grande y el botón "Contactar".
  - Animación de apertura/cierre: fundido + ligero desplazamiento del overlay, y entrada escalonada de los enlaces.
  - El menú se cierra al pulsar un enlace, al pulsar el botón X y con la tecla `Escape`.
  - Mientras está abierto, la página de fondo no hace scroll.
  - Si se amplía la ventana a escritorio con el menú abierto, se cierra.
- **Botón hamburguesa:** tres líneas que se transforman en X de forma animada.
- **Enlace activo (scrollspy):** el enlace de la sección visible se resalta en amarillo (`yellow-400`), en escritorio y en el overlay móvil.
- El botón "Contactar" de la navbar lleva a `#contacto`.
- **Accesibilidad:** `aria-label` y `aria-expanded`/`aria-controls` en la hamburguesa, `aria-current` en el enlace activo, foco visible, el overlay cerrado no recibe foco (`inert`), al cerrar con Escape el foco vuelve a la hamburguesa.
- **Fuera de alcance:** metadata/SEO y `lang="es"` del layout, contenido de las secciones, rediseño del Footer (solo recibe el nuevo array de enlaces), formulario de contacto.

## 3. Preguntas y respuestas

- **P:** ¿Qué enlaces lleva el menú? ("Nosotros" no tiene sección.)
  **R:** Inicio, Andamios, Proyectos, Certificaciones y Contacto.
- **P:** ¿Qué animación para el menú móvil?
  **R:** Pantalla completa.
- **P:** ¿Cómo es el botón hamburguesa?
  **R:** Líneas que se transforman en X.
- **P:** ¿Resaltar el enlace de la sección visible?
  **R:** Sí, en amarillo.
- **P:** `app/layout.tsx` tiene un `<div className="h-screen"></div>` entre la Navbar y el contenido. ¿Es un espaciador de prueba que se puede quitar?
  **R:** Sí, se quita.
- **P:** ¿El logo puede ser un enlace a `#inicio`?
  **R:** Sí.

## 4. Estado actual

- `components/shared/Navbar/Navbar.tsx` (`"use client"`): recibe `links`, usa `useState` para `isOpen`. Escritorio desde `sm` con `sm:px-64` (se rompe en tablet). El menú móvil se monta/desmonta con `{isOpen && …}`, sin animación ni cierre al pulsar enlace.
- `components/shared/Navbar/NavbarLinks/NavbarLinks.tsx`: `<a>` dentro de un `<div>`, sin estado activo.
- `components/shared/Buttons/BurgerButton/BurgerButton.tsx` (nuevo, sin commit): alterna `BurgerSvg`/`CloseSvg` sin transición ni atributos ARIA; tipos definidos dentro del archivo.
- `MainButton` es siempre `<button>`: no puede navegar a un ancla.
- `app/layout.tsx`: array `links` con `#home`, `#andamios`, `#nosotros`, `#contacto`; lo pasa a `Navbar` y `Footer`.
- Ninguna sección tiene `id`. `Section` (compartido) no acepta `id`. `HomeSection` y `ClientsSection` usan `<section>` directamente; el resto usa `<Section>`.
- No hay `scroll-behavior` en `globals.css`. Next 16 ya no fuerza el comportamiento de scroll: para que respete el scroll suave se añade `data-scroll-behavior="smooth"` en `<html>` (ver `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`).

## 5. Análisis de impacto

- **Archivos que se modifican:**
  - `components/shared/Navbar/Navbar.tsx` — layout responsive, overlay, cierre, bloqueo de scroll, scrollspy.
  - `components/shared/Navbar/NavbarLinks/NavbarLinks.tsx` — estado activo, `onClick`, tamaños.
  - `components/shared/Buttons/BurgerButton/BurgerButton.tsx` — líneas animadas + ARIA.
  - `components/shared/Section/Section.tsx` + `types/shared/section/section.ts` — prop `id` opcional y `scroll-mt`.
  - `components/shared/Buttons/MainButton/MainButton.tsx` + `types/shared/button/buttonProps.ts` — prop `href` opcional (si existe, renderiza `<a>` con el mismo estilo).
  - `types/shared/links/links.ts` — props de `NavbarLinks` (`isActive`, `onClick`).
  - `HomeSection`, `ScaffoldsSection`, `ProjectsSection`, `CertificationSection`, `ContactSection` — aceptan `id` y lo pasan a su `<section>`/`<Section>`.
  - `app/page.tsx` — pasa los `id`.
  - `app/layout.tsx` — nuevo array de enlaces y `data-scroll-behavior="smooth"` en `<html>`.
  - `app/globals.css` — `scroll-behavior: smooth` y desactivarlo con `prefers-reduced-motion`.
- **Archivos nuevos:**
  - `types/shared/button/burgerButtonProps.ts` — tipos sacados de `BurgerButton`.
  - `components/shared/Navbar/useActiveSection.ts` — hook cliente con `IntersectionObserver` que devuelve el `id` visible.
- **Se reutiliza:** `MainButton`, `NavbarLinks`, `Section`, `BurgerButton`, el array `links` compartido con el Footer. `BurgerSvg`/`CloseSvg` dejan de usarse en la hamburguesa (se conservan por si se usan en otro sitio; no se borran sin preguntar).
- **Riesgos de rotura:**
  - `Section` lo usan 6 secciones → la prop `id` es opcional, no cambia nada si no se pasa. `scroll-mt` no afecta al aspecto.
  - `MainButton` se usa en Home, Contact, etc. → `href` opcional; sin `href` sigue siendo `<button>` igual que ahora.
  - Footer usa el mismo array → sus enlaces pasan a las nuevas anclas (deseado). `Enlance` no cambia.
  - Bloqueo de scroll del `body`: hay que restaurarlo siempre al cerrar y al desmontar.
  - `IsoBuildFigure` usa `IntersectionObserver` propio: el scrollspy es independiente, no comparte estado.

## 6. Plan de implementación

### Fase 1 · Piezas compartidas — `ui-system-engineer`
- [x] 1.1 `Section`: prop `id?: string` y clase `scroll-mt-20 lg:scroll-mt-28` (ajustar a la altura real de la navbar).
- [x] 1.2 `MainButton`: prop `href?: string`; con `href` renderiza `<a>` con los mismos estilos y foco visible.
- [x] 1.3 `globals.css`: `html { scroll-behavior: smooth }` y `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto } }`.
- [x] 1.4 Mover los tipos de `BurgerButton` a `types/shared/button/burgerButtonProps.ts` y ampliar `types/shared/links/links.ts` (`isActive?`, `onClick?`).
- **Resultado esperado:** piezas listas sin cambiar el aspecto actual de ninguna sección.
- [x] Fase 1 verificada por el Lead

### Fase 2 · Anclas de las secciones — `sections-engineer`
- [x] 2.1 `HomeSection`, `ScaffoldsSection`, `ProjectsSection`, `CertificationSection`, `ContactSection` aceptan `id?: string` y lo aplican a su sección (`HomeSection` no necesita `scroll-mt` porque es la primera).
- [x] 2.2 `app/page.tsx`: `id="inicio"`, `"andamios"`, `"proyectos"`, `"certificaciones"`, `"contacto"`.
- [x] 2.3 `app/layout.tsx`: nuevo array de 5 enlaces; quitar el `<div className="h-screen">` (confirmado por Diego).
- **Resultado esperado:** cada enlace del Footer y de la Navbar salta a su sección (todavía sin animaciones del menú).
- [x] Fase 2 verificada por el Lead

### Fase 3 · Navbar, animaciones y scroll — `motion-engineer`
- [x] 3.1 `Navbar` responsive: píldora en `lg+` con paddings por breakpoint (`px-4 md:px-8 lg:px-16 xl:px-48`); barra con logo + hamburguesa en `< lg`.
- [x] 3.2 `BurgerButton`: tres líneas (`span`) que se transforman en X con `transition-transform`; `type="button"`, `aria-label` ("Abrir menú" / "Cerrar menú"), `aria-expanded`, `aria-controls`.
- [x] 3.3 Overlay a pantalla completa siempre montado; abrir/cerrar con clases (`opacity`, `translate`, `pointer-events`) e `inert` cuando está cerrado. Enlaces grandes centrados con entrada escalonada (`transition-delay`) y botón "Contactar" (`href="#contacto"`).
- [x] 3.4 Cierre al pulsar enlace, con `Escape` (foco de vuelta a la hamburguesa) y al pasar a `lg`. Bloqueo del scroll del `body` mientras está abierto, restaurado al cerrar/desmontar.
- [x] 3.5 `useActiveSection`: `IntersectionObserver` sobre los `id` de `links`; `NavbarLinks` muestra el activo en `yellow-400` con `aria-current="true"`.
- [x] 3.6 `<html data-scroll-behavior="smooth">` en `app/layout.tsx`. Respetar `prefers-reduced-motion` también en las transiciones del menú (`motion-reduce:transition-none`).
- **Resultado esperado:** menú móvil fluido, scroll suave sin tapar títulos y enlace activo resaltado.
- [x] Fase 3 verificada por el Lead

### Fase 4 · Revisión QA — `qa-a11y-reviewer`
- [x] Lint, typecheck y build sin errores
- [x] Accesibilidad WCAG 2.2 AA (teclado, foco, ARIA del menú, contraste del amarillo activo, reduced motion)
- [x] Responsive en móvil (375px), tablet (768px) y escritorio (1280px+)
- [x] Contenido en español de España
- **Resultado esperado:** veredicto ✅ o ⚠️ sin bloqueantes
- [x] Revisión QA verificada por el Lead

### Cierre — Frontend Lead
- [x] Resumen final escrito
- [x] `CLAUDE.md` actualizado (anclas, `MainButton href`, `Section id`, pendiente de Navbar resuelto)
- [x] Resumen enviado a Diego

## 7. Cambios sobre el plan

- 04/11/2026 · Fases 1 y 2 hechas con agentes generales que asumieron el rol de `ui-system-engineer` y `sections-engineer`, porque los subagentes del proyecto no estaban cargados. La Fase 2 se detuvo justo después de aplicar sus cambios; el Lead la validó (tsc y lint sin errores). Se añadió `SectionAnchorProps` en `types/shared/section/section.ts`.
- **Pausa (04/11/2026):** Diego reinicia Claude Code para habilitar los subagentes. Retomada el mismo día con los subagentes del proyecto ya activos; la Fase 3 la hace `motion-engineer`.

- Fase 3 (`motion-engineer`), decisiones añadidas al plan:
  - Paddings exteriores solo en la píldora (`lg:px-16 xl:px-48 lg:pt-4`); en móvil la barra ocupa todo el ancho (`px-4 md:px-8`, `py-3`). `scroll-mt-20 lg:scroll-mt-28` se mantiene (barra ≈75 px móvil / ≈92 px escritorio).
  - El logo pasa a ser enlace a `#inicio` (`alt` "SM8 España, ir al inicio") y cierra el menú. Confirmado por Diego (04/11/2026).
  - `NavbarLinks` devuelve un `<a>` (sin `<div>`), envuelto en `ul/li`; tamaño por breakpoint (`text-3xl md:text-4xl lg:text-sm`).
  - Trampa de foco con el menú abierto (no estaba en el spec) y compensación del ancho de la barra de scroll al bloquearlo.
  - Scrollspy con `rootMargin: "-35% 0px -55% 0px"`; `<nav aria-label="Principal">`.
  - `BurgerButtonProps` añade `ref?: Ref<HTMLButtonElement>` para devolver el foco con Escape.
- Revisión QA 1 (❌): 
  - B1 `MainButton` con `href`: faltaba un espacio en `inline-block${...}` y Tailwind no generaba la clase (botón "Contactar" del overlay partido). Corregido por el Lead.
  - B2 contraste de `neutral-500` (4,43:1). Diego decide `neutral-400` solo en `NavbarLinks` y `Enlace` (Footer). Corregido por el Lead. Revisar el resto del sitio en otra tarea.
  - Diego aprueba además: foco a la sección de destino al pulsar un enlace del menú, orden del Tab logo → X → enlaces, y quitar el aviso de `next/image` del logo (`motion-engineer`).
  - Scroll horizontal en móvil por `Section px-48` y `ClientsSection px-120`: fuera de alcance; irá en un spec aparte (01).
- Revisión QA 2 (⚠️ sin bloqueantes): B1, B2 y los cambios de foco comprobados en el navegador. Diego decide además:
  - `MainButton`: texto `blue-500` → `blue-400` (hover `blue-300`) por contraste (3,98:1 → ≈5,7:1). Afecta a todos los botones principales. Hecho por el Lead.
  - Logo del Footer con proporción real (`width={50} height={30}` + `h-auto w-[50px]`). Hecho por el Lead.

## 8. Resumen final

**Qué se hizo**
- Navbar responsive: píldora flotante desde `lg` (1024px); por debajo, barra con logo + hamburguesa animada (3 líneas → X) y menú a pantalla completa con fundido y entrada escalonada de enlaces.
- El menú se cierra con enlace, X, Escape (foco a la hamburguesa) o al pasar a `lg`; bloquea el scroll del body mientras está abierto; trampa de foco; al navegar, el foco pasa a la sección de destino.
- Scroll suave a las anclas (`globals.css` + `data-scroll-behavior="smooth"` en `<html>`), desactivado con `prefers-reduced-motion`; `scroll-mt` para que la navbar no tape los títulos.
- Scrollspy (`useActiveSection`): enlace activo en `yellow-400` con `aria-current`.
- Anclas `#inicio`, `#andamios`, `#proyectos`, `#certificaciones`, `#contacto` asignadas en `app/page.tsx`; mismos 5 enlaces en Navbar y Footer. Logo enlaza a `#inicio`.
- Contraste: enlaces inactivos de navbar/footer en `neutral-400`; texto de `MainButton` en `blue-400`.

**Archivos principales**
- `components/shared/Navbar/Navbar.tsx`, `NavbarLinks/NavbarLinks.tsx`, `useActiveSection.ts` (nuevo)
- `components/shared/Buttons/BurgerButton/BurgerButton.tsx`, `MainButton/MainButton.tsx` (prop `href`)
- `components/shared/Section/Section.tsx` (prop `id` + `scroll-mt`), `components/shared/Enlace/Enlace.tsx`, `components/shared/Footer/Footer.tsx`
- Secciones Home, Scaffolds, Projects, Certifications, Contact (prop `id`), `app/page.tsx`, `app/layout.tsx`, `app/globals.css`
- Tipos: `types/shared/section/section.ts` (`SectionAnchorProps`), `types/shared/button/burgerButtonProps.ts`, `types/shared/links/links.ts` (`NavbarLinkProps`)

**Pendientes que quedan**
- Spec 01: responsive de `Section` (`px-48` fijo) y `ClientsSection` (`px-120`), que provocan scroll horizontal en móvil; proporción de los logos de `ClientsSection`.
- Revisar el contraste de `neutral-500` en el resto del sitio.
- `BurgerSvg` y `CloseSvg` ya no se usan (no se borraron).
- Posible mejora: bloqueo de scroll táctil en Safari iOS si se nota; "Contactar" del overlay mide 30px de alto (cumple 2.5.8, ideal 44px).
- `lang="en"` y metadata del layout siguen pendientes (fuera de alcance).
