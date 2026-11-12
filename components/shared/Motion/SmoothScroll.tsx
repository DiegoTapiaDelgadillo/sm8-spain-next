"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { setLenis } from "@/lib/motion/lenis";

const POINTER_QUERY = "(pointer: fine)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Enlace a un ancla de esta misma página (`#id`), o `null`. Respeta clics con modificadores,
 * botón central, `target` y descargas: esos siguen su comportamiento nativo.
 */
const samePageHash = (event: MouseEvent) => {
  if (event.defaultPrevented || event.button !== 0) return null;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  const link = event
    .composedPath()
    .find((node): node is HTMLAnchorElement => node instanceof HTMLAnchorElement);
  if (!link || !link.href || link.hasAttribute("download")) return null;
  if (link.target && link.target !== "_self") return null;
  const url = new URL(link.href);
  const here = window.location;
  if (url.origin !== here.origin || url.pathname !== here.pathname || url.search !== here.search) {
    return null;
  }
  return url.hash;
};

/** Destino de un hash: `#` o `#top` = arriba del todo; si no existe, `null`. */
const hashTarget = (hash: string): HTMLElement | 0 | null => {
  if (hash === "" || hash === "#" || hash === "#top") return 0;
  return document.getElementById(decodeURIComponent(hash.slice(1)));
};

const USER_INPUT = ["wheel", "touchstart", "pointerdown", "keydown"] as const;
/** Tiempo sin eventos de scroll para dar por terminado el salto inicial al ancla. */
const SETTLE_MS = 200;
/** Como mucho se espera esto desde el montaje; después ya no se recoloca. */
const ALIGN_MAX_MS = 2500;

/**
 * Carga con hash (p. ej. la redirección 308 a `/#andamios`): el navegador salta al ancla
 * mientras la página aún cambia de alto al hidratar, y se queda unos px corto. Cuando el scroll
 * se para (tras `load`), se recoloca una vez en el destino con su `scroll-margin-top`, con
 * Lenis si está activo. Si el usuario toca, pulsa o mueve la rueda antes, no se hace nada.
 * Devuelve la función de limpieza.
 */
const alignInitialHash = (getLenis: () => Lenis | null) => {
  if (!hashTarget(window.location.hash)) return () => undefined;
  let timer = 0;
  let done = false;
  const deadline = performance.now() + ALIGN_MAX_MS;

  const cleanup = () => {
    done = true;
    clearTimeout(timer);
    window.removeEventListener("scroll", arm);
    window.removeEventListener("load", arm);
    USER_INPUT.forEach((type) => window.removeEventListener(type, cleanup, true));
  };

  const align = () => {
    const target = hashTarget(window.location.hash);
    cleanup();
    if (!target) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
    else target.scrollIntoView({ block: "start", behavior: "instant" });
  };

  function arm() {
    if (done) return;
    clearTimeout(timer);
    if (document.readyState !== "complete") return; // `load` lo vuelve a armar
    const wait = Math.min(SETTLE_MS, Math.max(0, deadline - performance.now()));
    timer = setTimeout(align, wait) as unknown as number;
  }

  window.addEventListener("scroll", arm, { passive: true });
  window.addEventListener("load", arm);
  USER_INPUT.forEach((type) =>
    window.addEventListener(type, cleanup, { capture: true, passive: true }),
  );
  arm();
  return cleanup;
};

/**
 * Scroll suave con Lenis solo en escritorio: puntero fino y sin `prefers-reduced-motion`.
 * Si cambia cualquiera de las dos preferencias, se crea o se destruye. En táctil y con
 * movimiento reducido el scroll es nativo.
 *
 * Anclas: los clics a `#…` de esta página se hacen con `lenis.scrollTo(elemento)`, que resta el
 * `scroll-margin-top` del destino (el `scroll-mt-20 lg:scroll-mt-28` de `Section`), y la URL se
 * actualiza con `history.pushState` como haría el navegador. No se usa la opción `anchors` de
 * Lenis porque no cancela el salto nativo (habría un frame en el destino y vuelta atrás).
 */
export const SmoothScroll = () => {
  useEffect(() => {
    const pointer = window.matchMedia(POINTER_QUERY);
    const reduced = window.matchMedia(REDUCED_QUERY);
    let lenis: Lenis | null = null;

    const onClick = (event: MouseEvent) => {
      if (!lenis) return;
      const hash = samePageHash(event);
      if (hash === null) return;
      const target = hashTarget(hash);
      if (target === null) return;
      event.preventDefault();
      // Si el menú estaba abierto, Lenis está parado: se reanuda antes de desplazar
      // (el menú se cierra en este mismo clic; ver `Navbar`).
      lenis.start();
      // Un foco que haga scroll nativo en el mismo frame (lectores de pantalla) deja a Lenis
      // con una posición vieja: se sincroniza con `scrollY` antes de calcular el destino.
      if (lenis.isScrolling !== "smooth") {
        lenis.scrollTo(window.scrollY, { immediate: true, force: true });
      }
      lenis.scrollTo(target);
      if (window.location.hash !== hash) {
        window.history.pushState(window.history.state, "", hash || "#");
      }
    };

    const create = () => {
      if (lenis) return;
      lenis = new Lenis({ autoRaf: true, lerp: 0.1 });
      setLenis(lenis);
      document.addEventListener("click", onClick);
    };

    const destroy = () => {
      if (!lenis) return;
      document.removeEventListener("click", onClick);
      lenis.destroy();
      lenis = null;
      setLenis(null);
    };

    const sync = () => {
      if (pointer.matches && !reduced.matches) create();
      else destroy();
    };

    sync();
    pointer.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    const cancelAlign = alignInitialHash(() => lenis);
    return () => {
      pointer.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
      cancelAlign();
      destroy();
    };
  }, []);

  return null;
};
