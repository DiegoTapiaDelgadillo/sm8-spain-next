# 02 · SEO on-page de la landing

- **Estado:** Terminado (06/11/2026) · pendientes: tarea 6.8 (logo SVG) y confirmaciones de §3
- **Fecha:** 06/11/2026
- **Rama:** `fix/seo`
- **Solicitado por:** Diego

## 1. Objetivo

Optimizar la landing para posicionar a SM8 España en las búsquedas de alquiler, montaje y venta de andamios en la Comunidad de Madrid: textos con las palabras clave correctas, jerarquía HTML limpia (un solo `h1`), metadata completa, datos estructurados (JSON-LD), `sitemap.xml`, `robots.txt` y redirecciones de las rutas viejas.

## 2. Requisitos

- Zona objetivo: **Comunidad de Madrid** (palabras clave con "Madrid"; la zona completa se declara en JSON-LD con `areaServed`).
- Servicios que se pueden nombrar (confirmados por Diego): **alquiler con montaje y desmontaje**, **venta** del Sistema Multidireccional SM8 y **gestión del PMUD y de licencias**. No se menciona "alquiler sin montaje".
- Datos confirmados para metadata y JSON-LD: dominio `https://www.sm8.es`, Av. de Manoteras 38, Chamartín, 28050 Madrid, `+34 616 74 02 90`, `info@sm8.es`, instagram.com/sm8espana, facebook.com/sm8espana.
- Un solo `h1` en la página y `h2`/`h3` en orden.
- Textos en español de España, naturales, sin repetir palabras clave de forma forzada.
- No se cambia el diseño visual: mismos tamaños y colores (cambia la etiqueta, no el estilo).
- Fuera de alcance:
  - Páginas por servicio (`/andamios-fachadas-madrid`, etc.): propuesta para un spec futuro (ver §9).
  - Contenido real de proyectos, testimonios, logos de clientes y PDF (siguen como placeholder).
  - Envío del formulario de contacto.
  - SEO fuera de la web (Google Business Profile, Search Console, directorios): solo se deja como recomendación (§9).

## 3. Preguntas y respuestas

- **P:** ¿Qué zona cubre SM8 España?
  **R:** Comunidad de Madrid.
- **P:** ¿Solo la landing o también páginas por servicio?
  **R:** Solo la landing ahora.
- **P:** ¿Qué servicios se ofrecen?
  **R:** Alquiler con montaje y desmontaje, venta de andamio y gestión de licencias / PMUD.
- **P:** ¿Se pueden usar los datos del sitio actual (dominio, dirección, teléfono, email, redes)?
  **R:** Sí, todos confirmados.
- **P:** ¿Se añade una sección de preguntas frecuentes (FAQ)?
  **R:** Sí, con un componente tipo *collapse* (desplegable) para mejorar la experiencia.
- **P:** ¿El sistema cumple la UNE-EN 12810?
  **R:** Diego lo tiene que confirmar. **Por ahora no se cita.**
- **P:** ¿Se puede decir "presupuesto sin compromiso"?
  **R:** Sí.
- **P:** URLs del grupo en el footer.
  **R:** SM8 Desarrollos → `https://www.sm8desarrollos.com.mx/`, Timbrela → `https://timbrela.com`. SM8 México → `https://sm8.com.mx` (referencia de `CLAUDE.md`).
- **P:** Copyright.
  **R:** Sin "Grupo" ni "Inc.": "© 2026 SM8. Todos los derechos reservados."
- **P:** ¿Las redirecciones de rutas viejas llevan al ancla?
  **R:** Sí.
- **P:** ¿Qué se hace con los datos de normativa y licencias sin confirmar?
  **R:** Se anotan como pendientes de confirmación y **solo se publica lo que ya es oficial**. Diego pasará las respuestas cuando las tenga.

### Pendientes de confirmación (no se publican hasta que Diego los confirme)
- [ ] ¿El sistema cumple la **UNE-EN 12810**? → se citaría en Certificaciones y en JSON-LD.
- [ ] **PMUD:** en qué casos lo exige el RD 2177/2004 (p. ej. altura > 6 m) → ampliaría la respuesta 2 de la FAQ.
- [ ] **Licencia en Madrid:** si se necesita licencia de ocupación de vía pública cuando el andamio ocupa acera o calzada y si se tramita junto a la licencia de obras → recuperaría la pregunta "¿Necesito licencia para poner un andamio en la calle en Madrid?".

## 4. Estado actual

### Sitio en producción (sm8.es, SPA React + Vite)
- El HTML que recibe Google está vacío (`<div id="root"></div>`): título "SM8 España", `lang="en"`, sin meta description, sin Open Graph, sin JSON-LD.
- `/andamio-multidireccional`, `/nosotros` y `/contacto` devuelven **404** al pedirlas directamente.
- Conclusión: el sitio actual apenas tiene SEO indexable. El renderizado en servidor de Next ya es una mejora grande; este spec aprovecha esa base.

### Repo Next.js
| Problema | Dónde |
|---|---|
| `title: "Create Next App"`, descripción por defecto, sin `metadataBase`, canonical, Open Graph ni Twitter | `app/layout.tsx` |
| `<html lang="en">` y espacio de más en `"--font-heading "` | `app/layout.tsx` |
| No hay `sitemap.ts`, `robots.ts`, imagen OG ni JSON-LD | `app/` |
| **7 `h1`** en la página: `Titles` pinta el título como `h1` (y el subtítulo como `h2`) en Proyectos, Certificaciones, Manual, Opiniones y Contacto; `ProjectCard` usa `h1` | `components/shared/Titles/Titles.tsx`, `ProjectCard.tsx` |
| El subtítulo del hero es un `h2` | `HomeSection.tsx` |
| Clientes usa `h3` sin `h2` previo | `ClientsSection.tsx` |
| Andamios no tiene título de sección; las categorías son `h2` | `ScaffoldsSection.tsx`, `ScaffoldsScroll.tsx` |
| Los títulos de `CertItem` son `<p>` | `CertItem.tsx` |
| El `h1` no contiene "alquiler" ni "andamios" (solo "andamiaje"); "Madrid" solo en la píldora | `HomeSection.tsx` |
| Botones "Solicitar presupuesto" sin destino | Hero y `ScaffoldsScroll.tsx` |
| Teléfono y email como texto, sin `tel:` / `mailto:` | `ContactSection.tsx` |
| Sin dirección/teléfono en el footer; "Menu" sin tilde, "© 2027… All rights reserved.", enlaces del grupo a `/` y redes vacías | `Footer.tsx` |
| Erratas: "Apuntalamineto", "Escribenos como podemos ayudarte" | `ProjectCard.tsx`, `ContactForm.tsx` |
| `alt="Logo sm8 spain"` | `Footer.tsx` |

## 5. Investigación de palabras clave

> Las herramientas usadas no dan volumen de búsqueda fiable para España. La priorización sigue la **intención de compra** y la competencia observada (Aneur, Rf Rental, Andamios Izquierdo, Stark… se anuncian como "alquiler/montaje de andamios Madrid"; pocas destacan el multidireccional ni el PMUD). Tras el despliegue hay que validarlo con Google Search Console y el Planificador de palabras clave de Google Ads.

### Palabras clave principales (title, `h1`, description)
- **alquiler de andamios Madrid**
- **montaje de andamios Madrid**
- **andamio multidireccional**

### Secundarias (`h2`, `h3`, textos de sección)
- andamios para fachadas / rehabilitación de fachadas Madrid
- andamios para construcción / andamios de obra
- andamios industriales
- venta de andamio multidireccional
- andamios homologados
- empresa de andamios en Madrid
- montaje y desmontaje de andamios

### Long tail y áreas de oportunidad
- **PMUD** (plan de montaje, utilización y desmontaje) y **licencia de andamio / ocupación de vía pública en Madrid**: dudas frecuentes de comunidades de vecinos y constructoras; poca competencia que lo explique. SM8 lo gestiona → diferenciador.
- **Andamio multidireccional / roseta octogonal / sistema homologado UNE-EN 12811**: búsquedas técnicas de jefes de obra con alta intención.
- **Tanques, silos, industria naval y aeronáutica**: nicho industrial poco atendido por las empresas locales.
- **"Comunidad de Madrid"** como zona de servicio (sin listas de municipios que parezcan relleno).
- **Marca**: "SM8 España", "Andamios SM8", "Sistema Multidireccional SM8" — se usan siempre igual.

## 6. Textos que cambian

Formato: **antes → después**. Los textos de placeholder (proyectos, testimonios, logos) no se reescriben.

### Metadata (`app/layout.tsx`)
- `title`: "Create Next App" → **"Alquiler y montaje de andamios en Madrid | SM8 España"** (53 caracteres).
- `description`: → **"Alquiler, montaje y venta de andamio multidireccional en la Comunidad de Madrid para fachadas, obra e industria. Gestionamos el PMUD y las licencias."**
- `openGraph`: mismo título y descripción, `locale: "es_ES"`, `siteName: "SM8 España"`, `type: "website"`, imagen 1200×630.
- `alternates.canonical: "/"`, `metadataBase: https://www.sm8.es`, `robots: index, follow`.

### Hero (`HomeSection`)
- Píldora: "Alquiler y montaje de andamios en Madrid" → **"Andamio multidireccional · Comunidad de Madrid"**.
- `h1`: "Soluciones integrales de andamiaje para construcción, restauración e industria" → **"Alquiler y montaje de andamios en Madrid** <amarillo>para fachadas, obra e industria</amarillo>**"**.
- Subtítulo (`h2` → `p`): "Sistema Multidireccional homologado, montado por personal propio cualificado" → **"Sistema Multidireccional SM8 homologado, montado y desmontado por personal propio cualificado. También lo vendemos y nos encargamos del PMUD y las licencias."**
- Botones: "Solicitar Presupuesto" → **"Solicitar presupuesto"** (enlaza a `#contacto`); "Contactar personal" → **"Llamar al +34 616 74 02 90"** (enlace `tel:`).

### Clientes (`ClientsSection`)
- `h3` → `h2`: "Empresas que confían en Andamios SM8" → **"Empresas que confían en SM8 España"**.

### Andamios (`ScaffoldsSection` / `ScaffoldsScroll`)
- Nuevo `h2` de sección (el texto de la caja azul pasa a ser el título visible o se añade encima, según maquetación): **"Andamios multidireccionales para cada tipo de obra"**. La caja azul se mantiene: "El Sistema Multidireccional SM8 se adapta a cualquier proyecto gracias a la geometría de su roseta octogonal."
- Categorías `h2` → `h3`:
  - "Andamios para la restauración de fachadas y cubiertas" → **"Andamios para rehabilitación de fachadas y cubiertas"**. Descripción → "Andamio multidireccional para restaurar y rehabilitar fachadas y cubiertas, tanto en exterior como en interior. Su estabilidad permite cubrir grandes superficies a cualquier altura."
  - "Andamios para la construcción" → **"Andamios para construcción y obra nueva"**. Descripción → "Gran versatilidad para estructuras provisionales en obras de cualquier altura o profundidad: apuntalamiento, escaleras de obra y estructuras de servicio."
  - "Andamios para la industria" → **"Andamios industriales"**. Descripción → "La roseta octogonal permite formas circulares para tanques y silos, instalaciones industriales, puentes, torres de acceso y los sectores naval y aeronáutico."
- Botón "Solicitar presupuesto" → enlaza a `#contacto`.

### Proyectos (`ProjectsSection`)
- Título: "Equipo certificado, en cada montaje, conoce nuestros proyectos" → **"Proyectos de andamiaje en la Comunidad de Madrid"**.
- Subtítulo → **"Cada montaje lo hace personal propio con casco, arnés anclado y calzado de seguridad. Estas son algunas de nuestras obras."**
- `ProjectCard`: `h1` → `h3` y "Apuntalamineto" → "Apuntalamiento" (el resto sigue de placeholder).

### Certificaciones (`CertificationsSection`)
- Título: "Montaje rápido, seguro y a medida de cada obra" → **"Andamios homologados y montaje seguro según normativa"**.
- Títulos de `CertItem` `p` → `h3`.
- "Requisitos de diseño y dimensionado de andamios" → "Requisitos de diseño y cálculo de andamios de trabajo" (UNE-EN 12811; la 12810 no se cita hasta que Diego la confirme).
- **Nuevo ítem:** **"PMUD y licencias"** — "Redactamos el plan de montaje, utilización y desmontaje y gestionamos las licencias necesarias."

### Ficha técnica (`ManualSection`)
- Título: "Conoce todos nuestros andamios multidireccionales" → **"Ficha técnica del andamio multidireccional SM8"**.
- Subtítulo: se mantiene y se añade "Disponible en alquiler y en venta."
- Botón: "Descargar" → **"Descargar ficha técnica"**.

### Opiniones (`OpionsSection`)
- Título: "La opinión de quienes ya han trabajado con SM8" → **"Opiniones de clientes de SM8 España"**.
- Subtítulo (repetido de Proyectos) → **"Lo que dicen las empresas que ya han trabajado con nosotros."**
- Testimonios: siguen de placeholder; **no** se añade JSON-LD de reseñas hasta que sean reales.

### Contacto (`ContactSection` / `ContactForm`)
- Título: "¿Tienes algún proyecto?" → **"Pide presupuesto de andamios en Madrid"**.
- Subtítulo → **"Cuéntanos qué obra tienes y te preparamos un presupuesto sin compromiso de alquiler, montaje o venta."**
- Teléfono y email como enlaces `tel:+34616740290` y `mailto:info@sm8.es`.
- Formulario: "Escribenos como podemos ayudarte" → **"Cuéntanos en qué podemos ayudarte"**.

### Footer
- "Menu" → **"Menú"**; "© 2027 Grupo SM8, Inc. All rights reserved." → **"© 2026 SM8. Todos los derechos reservados."** (año con `new Date()`).
- `alt="Logo sm8 spain"` → **"Logo de SM8 España"**.
- Nueva columna **"Contacto"** con dirección, teléfono y email (NAP coherente con el JSON-LD).
- "Redes sociales": enlaces a Instagram y Facebook.
- "Más de SM8": SM8 México (`https://sm8.com.mx`), SM8 Desarrollos (`https://www.sm8desarrollos.com.mx/`) y Timbrela (`https://timbrela.com`), en pestaña nueva con `rel="noopener"`.

### Preguntas frecuentes (nueva sección, aprobada)
- Va entre Opiniones y Contacto, con ancla `#preguntas-frecuentes` (no se añade al menú salvo que Diego lo pida).
- Título `h2`: **"Preguntas frecuentes sobre el alquiler de andamios"**. Subtítulo: **"Resolvemos las dudas más habituales antes de empezar una obra."**
- Cada pregunta es un desplegable (*collapse*): la pregunta es el `summary` y la respuesta se muestra al abrir. Todas cerradas al cargar y se pueden abrir varias a la vez.
- Genera JSON-LD `FAQPage` con los mismos textos.

Respuestas (solo con datos confirmados; lo pendiente está en §3):

1. **¿Montáis y desmontáis el andamio?**
   Sí. Nuestro servicio de alquiler incluye el montaje y el desmontaje, que realiza personal propio cualificado con el Sistema Multidireccional SM8.
2. **¿Qué es el PMUD?**
   El Plan de Montaje, Utilización y Desmontaje (PMUD) es el documento que define cómo se monta, se usa y se desmonta un andamio con seguridad. Nosotros lo redactamos por ti.
3. **¿Os encargáis de las licencias del andamio?**
   Sí. Gestionamos las licencias necesarias para montar el andamio, además del PMUD.
4. **¿Qué ventajas tiene el andamio multidireccional frente al europeo?**
   El andamio europeo (de marco) se monta en módulos fijos sobre planos rectos. El multidireccional une sus piezas en una roseta octogonal en varias direcciones, así que se adapta a esquinas, curvas, desniveles e instalaciones industriales.
5. **¿Vendéis el andamio o solo lo alquiláis?**
   Las dos cosas. Además del alquiler con montaje, vendemos los componentes del Sistema Multidireccional SM8. Descarga la ficha técnica o pídenos presupuesto.
6. **¿En qué zonas trabajáis?**
   En toda la Comunidad de Madrid. Nuestra oficina está en la Av. de Manoteras 38, Chamartín (Madrid).

## 7. Análisis de impacto

- **Archivos que se modifican:** `app/layout.tsx`, `app/page.tsx`, `next.config.ts`, `components/shared/Titles/Titles.tsx`, `types/shared/titles/titles.ts`, `components/shared/Footer/Footer.tsx`, `components/Home/HomeSection/HomeSection.tsx`, `components/Clients/ClientsSection/ClientsSection.tsx`, `components/Scaffolds/ScaffoldsSection/ScaffoldsSection.tsx`, `components/Scaffolds/ScaffoldsScroll/ScaffoldsScroll.tsx`, `components/Projects/**`, `components/Certifications/**`, `components/Manual/ManualSection/ManualSection.tsx`, `components/Opinions/OpionsSection/OpionsSection.tsx`, `components/Contact/**`.
- **Archivos nuevos:** `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx` (o imagen estática en `public/`), `lib/seo/jsonLd.ts` (datos de negocio en un solo sitio, reutilizados por JSON-LD, Footer y Contacto), `components/shared/Collapse/Collapse.tsx` + `types/shared/collapse/collapse.ts`, `components/Faq/FaqSection/FaqSection.tsx`.
- **Por qué `<details>`/`<summary>` en el *collapse*:** la respuesta está en el HTML desde el servidor (Google la indexa), funciona sin JavaScript, es accesible por teclado y lector de pantalla de forma nativa y no obliga a usar `"use client"`.
- **Se reutiliza:** `Titles`, `Section`, `CertItem`, `MainButton`/`SecondaryButton` (ya aceptan `href`), `Enlace`, iconos existentes, array `links` del layout.
- **Riesgos de rotura:**
  - `Titles` lo usan 5 secciones: pasa a `h2` + `p` con las mismas clases → sin cambio visual. Se añade prop opcional `as` (`"h1" | "h2" | "h3"`, por defecto `"h2"`).
  - `CertItem` se usa en Certificaciones y Contacto: el `h3` mantiene las clases del `p`.
  - `ScaffoldsScroll`: solo cambian etiquetas y `href`; no se toca la lógica de scroll ni los tiempos aprobados.
  - El nuevo `h2` de Andamios no debe alterar el alto de la escena fijada (va fuera de `ScaffoldsScroll`).
  - Footer: nueva columna, revisar en 375 px.
  - Redirects: solo rutas viejas concretas, sin comodines que capturen `/sitemap.xml`, `/robots.txt` o `/_next`.

## 8. Plan de implementación

### Fase 1 · Componentes compartidos — `ui-system-engineer`
- [x] 1.1 `Titles`: título como `h2` por defecto (prop `as`), subtítulo como `p`; mismas clases.
- [x] 1.2 `Footer`: columna "Contacto" (NAP con `tel:`/`mailto:`), enlaces de redes y del grupo, copyright con año dinámico.
- [x] 1.3 Nuevo `Collapse` en `components/shared/Collapse/` (Server Component): `<details>` + `<summary>` con props `title` y `children`. Estilo de tarjeta del sitio (`rounded-xl`, borde `neutral-800`), icono `PlusCircleSvg` que gira al abrir, foco visible `yellow-400`, área táctil ≥ 44 px. Apertura animada con `::details-content` + `interpolate-size` (degrada sin animación en navegadores que no lo soportan) y sin animación con `prefers-reduced-motion`.
- **Resultado esperado:** sin cambios visuales en lo existente; ningún `h1` en componentes compartidos; `Collapse` reutilizable.
- [x] Fase 1 verificada por el Lead

### Fase 2 · Estructura HTML de secciones — `sections-engineer`
- [x] 2.1 Hero: subtítulo `h2` → `p`; botones con `href="#contacto"` y `tel:`.
- [x] 2.2 Clientes: `h3` → `h2`.
- [x] 2.3 Andamios: `h2` de sección en `ScaffoldsSection`; categorías `h2` → `h3`; botones a `#contacto`.
- [x] 2.4 `ProjectCard` `h1` → `h3`; `CertItem` `p` → `h3`; cuarto ítem en Certificaciones.
- [x] 2.5 Contacto: teléfono y email como enlaces.
- **Resultado esperado:** un solo `h1`, jerarquía `h2`/`h3` ordenada, mismo aspecto.
- [x] Fase 2 verificada por el Lead

### Fase 3 · Textos, metadata y datos estructurados — `content-seo-specialist`
- [x] 3.1 Aplicar los textos de §6 (y corregir erratas y `alt`).
- [x] 3.2 `metadata` completa en `app/layout.tsx`: title, description, `metadataBase`, canonical, Open Graph `es_ES`, Twitter, robots; `lang="es"`.
- [x] 3.3 Imagen Open Graph 1200×630 (`app/opengraph-image.tsx`) con logo y lema.
- [x] 3.4 `lib/seo/jsonLd.ts` + `<script type="application/ld+json">` en `app/page.tsx` con `@graph`: `LocalBusiness` (NAP, `geo`, `areaServed` Comunidad de Madrid, `sameAs` redes, `makesOffer` con los 3 servicios), `Organization` (`parentOrganization` SM8, con `sameAs` a sm8.com.mx) y `WebSite`. Escapar `<` según la guía de Next.
- [x] 3.5 `app/sitemap.ts` (home) y `app/robots.ts` (permitir todo + URL del sitemap).
- [x] 3.6 Revisión de los textos de la FAQ y JSON-LD `FAQPage` generado desde el mismo array que pinta la sección.
- **Resultado esperado:** HTML con title, description, OG y JSON-LD válidos (Rich Results Test / Schema Validator sin errores).
- [x] Fase 3 verificada por el Lead

### Fase 3b · Sección FAQ — `sections-engineer`
- [x] 3b.1 `FaqSection` entre Opiniones y Contacto (`id="preguntas-frecuentes"` desde `app/page.tsx`), con `Section`, `Titles` y un `Collapse` por pregunta; array de preguntas exportado para reutilizarlo en el JSON-LD.
- [x] 3b.2 Mobile-first: una columna en móvil y ancho de lectura limitado (`max-w-3xl`) en escritorio.
- [x] Fase 3b verificada por el Lead

### Fase 4 · Plataforma — `nextjs-platform-engineer`
- [x] 4.1 Redirects 308 en `next.config.ts`: `/andamio-multidireccional` → `/#andamios`, `/nosotros` → `/`, `/contacto` → `/#contacto`.
- [x] 4.2 Corregir `variable: "--font-heading "`; export `viewport` con `themeColor: "#000000"`.
- **Resultado esperado:** `npm run build` genera `/sitemap.xml`, `/robots.txt` y `/opengraph-image`.
- [x] Fase 4 verificada por el Lead (sitemap/robots/OG se comprueban tras la Fase 3)

### Fase 5 · Revisión QA — `qa-a11y-reviewer`
- [x] Lint, typecheck y build sin errores
- [x] Un solo `h1` y jerarquía de encabezados correcta
- [x] Metadata, OG, JSON-LD, sitemap y robots presentes en el HTML del build
- [x] Accesibilidad WCAG 2.2 AA (enlaces `tel:`/`mailto:` con nombre accesible; `Collapse` operable con teclado y lector de pantalla)
- [x] Respuestas de la FAQ presentes en el HTML del servidor (no solo al abrir)
- [x] Responsive en móvil (375px), tablet (768px) y escritorio (1280px+), sobre todo Footer
- [x] Contenido en español de España
- **Resultado esperado:** veredicto ✅ o ⚠️ sin bloqueantes
- [x] Revisión QA verificada por el Lead (⚠️ sin bloqueantes; contraste de los enlaces nuevos corregido por el Lead)

### Fase 6 · Ajustes tras QA (decididos por Diego) — Lead + `motion-engineer`
- [x] 6.1 Categoría 01 de Andamios: "Restauración" → "Rehabilitación" (Lead).
- [x] 6.2 Ancla `#andamios` en un contenedor que incluya el título de la sección, con `scroll-mt` de la navbar; scrollspy y `useScrollProgress` sin cambios de comportamiento (`motion-engineer`).
- [x] 6.3 Contraste AA en todo el sitio: texto `neutral-500` → `neutral-400` (subtítulos de `Titles`, hero, Clientes, `CertItem`, `ContactForm`, `ProjectCard`, `OpionCard`; `figcaption` y textos de `IsoBuildFigure` los hace `motion-engineer`). Bordes y placeholders no cambian.
- [x] 6.4 `InputText` y `TextArea` con `id={name}` para asociar sus `label` (Lead).
- [x] 6.5 `<main>` envolviendo `{children}` en `app/layout.tsx` (Lead).
- [x] 6.7 Tipografía (Diego): `h1`–`h3` en Montserrat desde `globals.css` (`@layer base`); los títulos en gris (`text-neutral-400`) usan `font-text` (Mona Sans). Se quita la utilidad `font-display` (Lead).
- [ ] 6.8 Logo SVG en la imagen Open Graph (`app/opengraph-image.tsx`) cuando Diego lo entregue.
- [x] 6.6 Revisión QA de los ajustes (`qa-a11y-reviewer`).
- [x] Fase 6 verificada por el Lead (6.8 queda pendiente del logo SVG)

### Cierre — Frontend Lead
- [x] Resumen final escrito
- [x] `CLAUDE.md` actualizado
- [x] Resumen enviado a Diego

## 9. Recomendaciones fuera de esta web (no se implementan aquí)

1. **Google Business Profile** con la misma dirección, teléfono y categoría "Servicio de alquiler de andamios". Es lo que más pesa en el SEO local de Madrid.
2. **Google Search Console**: verificar `sm8.es` y enviar el sitemap al desplegar.
3. **Reseñas reales** en Google; después, testimonios reales en la web.
4. **NAP coherente** en directorios (Habitissimo, Páginas Amarillas, Empresite).
5. **Spec futuro: páginas por servicio** (`/andamios-fachadas-madrid`, `/andamios-industriales`, `/venta-andamio-multidireccional`, `/pmud-licencia-andamio-madrid`): es la forma de competir por cada búsqueda secundaria.
6. **Proyectos reales con fotos** (`alt` descriptivo y ubicación): contenido local que Google valora.
7. Nota: el `h3`/texto de los proyectos de ejemplo usa la dirección de la oficina; al poner proyectos reales, usar su ubicación real.

## 10. Cambios sobre el plan

- Los datos del negocio viven en `lib/business.ts` (creado por el Lead antes de las fases para que Footer, Contacto y JSON-LD usen la misma fuente). `lib/seo/jsonLd.ts` los importa.
- JSON-LD sin `geo` (coordenadas): no están confirmadas.
- Orden de ejecución: Fases 1 y 4 en paralelo → Fase 2 + 3b (`sections-engineer`, ya con `Collapse`) → Fase 3 (`content-seo-specialist`) → QA. Los textos de la FAQ los pone `sections-engineer` tal cual están en §6; `content-seo-specialist` los revisa.
- Fase 1: `Titles` lleva la nueva utilidad `font-display` (Montserrat) para no perder la fuente al pasar de `h1` a `h2`; `Enlance` acepta `external` y `ariaLabel`; nuevo `CurrentYear` (`"use cache"` + `cacheLife("days")`) para el año dinámico con `cacheComponents`; Footer en rejilla 1 → 2 columnas → fila en `lg`; copyright a `neutral-400` por contraste AA.
- Fase 2: `SecondaryButton` acepta `href` (mismo patrón que `MainButton`); `CertItemProps` tiene `href?` opcional para los enlaces de Contacto; la dirección de Contacto sale de `BUSINESS.address.display` ("Av. de Manoteras 38, Chamartín, 28050 Madrid"); el `h2` de Andamios usa `Titles` encima de la caja azul; los textos de la FAQ viven en `components/Faq/FaqSection/faqItems.ts` (`FAQ_ITEMS`).
- Fase 3: nuevo `lib/seo/seo.ts` (title, description y alt OG en un solo sitio); imagen OG solo texto (el logo es webp y `ImageResponse` no lo admite); JSON-LD sin `Organization` independiente (SM8 como `parentOrganization`); sitemap con fecha fija `2026-11-06` (actualizar a mano); etiqueta del formulario "Email" → "Correo electrónico".
- QA: el Lead pasó a `neutral-400` el `SecondaryButton` y los enlaces de `CertItem` (`neutral-500` daba 4,43:1, no llega a AA).
- Fase 6: el ancla `#andamios` pasa a `<Section id>` de `ScaffoldsSection` (antes en el contenedor de `ScaffoldsScroll`); se elimina `id` de `ScaffoldsScrollProps`.
- Tras QA de la Fase 6: `Titles` pasa a `text-2xl sm:text-3xl` (a 320 px "multidireccionales" se salía 4 px).
- La FAQ no incluye la pregunta sobre licencias en la vía pública ni el detalle del RD 2177/2004 (pendientes de confirmación, §3).

## 11. Resumen final

**Qué se hizo**
- **Metadata y SEO técnico:** `lang="es"`, title "Alquiler y montaje de andamios en Madrid | SM8 España", description, `metadataBase`, canonical, Open Graph `es_ES`, Twitter, robots, `viewport` (theme-color negro). Nuevos `app/sitemap.ts`, `app/robots.ts` y `app/opengraph-image.tsx` (1200×630, solo texto por ahora).
- **Datos estructurados:** `lib/seo/jsonLd.ts` con `@graph` `LocalBusiness` + `WebSite` + `FAQPage`, inyectado en `app/page.tsx`. Sin `geo`, horario ni reseñas.
- **Datos del negocio en un solo sitio:** `lib/business.ts` (NAP, redes, webs del grupo, servicios) y `lib/seo/seo.ts` (title/description/alt OG). Los usan metadata, JSON-LD, Footer, Contacto, hero y FAQ.
- **Jerarquía HTML:** un solo `h1` (hero); `Titles` pinta `h2` (prop `as`) y el subtítulo como `p`; categorías de Andamios, `ProjectCard`, `CertItem` y FAQ en `h3`; `<main>` en el layout.
- **Textos:** todos los de §6 con las palabras clave (alquiler/montaje de andamios Madrid, andamio multidireccional, rehabilitación de fachadas, construcción y obra nueva, andamios industriales, venta, PMUD y licencias, Comunidad de Madrid).
- **Nueva sección FAQ** (`components/Faq/FaqSection`, datos en `faqItems.ts`) entre Opiniones y Contacto, con el nuevo componente compartido `Collapse` (`<details>`/`<summary>`, animado, sin JS, respuestas en el HTML).
- **Conversión:** "Solicitar presupuesto" lleva a `#contacto`; "Llamar al +34 616 74 02 90" (`tel:`); teléfono y email como enlaces en Contacto y Footer.
- **Footer:** columnas Menú, Contacto (NAP), Más de SM8 (webs reales) y Redes; "© {año} SM8. Todos los derechos reservados." con `CurrentYear` (`"use cache"`).
- **Redirects 308:** `/andamio-multidireccional` → `/#andamios`, `/nosotros` → `/`, `/contacto` → `/#contacto`.
- **Accesibilidad:** contraste AA en todo el sitio (`neutral-500` → `neutral-400` en texto), labels del formulario asociadas, ancla `#andamios` aterriza en el título de la sección.
- **Tipografía:** `h1`–`h3` en Montserrat desde `globals.css` (`@layer base`); títulos en gris con `font-text` (Mona Sans).

**Validación:** lint (0 errores), `tsc` y `build` correctos; `/`, `/opengraph-image`, `/robots.txt` y `/sitemap.xml` estáticas. QA ⚠️ sin bloqueantes en las Fases 5 y 6.

**Pendientes**
- Confirmaciones de §3 (UNE-EN 12810, casos del PMUD según el RD 2177/2004, licencia de vía pública en Madrid).
- 6.8: logo SVG en la imagen Open Graph (Diego lo entregará en `public/img/logo.svg`).
- Ya existían antes, detectados por QA: el checkbox de privacidad es un `<button>` que envía el formulario y no es accesible (`CheckBox.tsx`); las tarjetas de proyecto se desbordan entre 768 y 1023 px (`ProjectCard.tsx`); "Política de Privacidad de SM8 Andamios" en `Form.tsx`; el botón "Descargar ficha técnica" no hace nada (falta el PDF).
- Al desplegar: Search Console + sitemap, Google Business Profile, validar el JSON-LD con Rich Results Test y actualizar a mano `LAST_MODIFIED` del sitemap cuando cambie el contenido.
- Recomendaciones de §9 (páginas por servicio, proyectos reales, reseñas).
