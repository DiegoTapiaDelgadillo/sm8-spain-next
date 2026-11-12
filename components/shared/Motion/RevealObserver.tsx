"use client";

import { useEffect } from "react";

const SELECTOR = "[data-reveal]:not([data-revealed]), [data-reveal-group]:not([data-revealed])";
/** Tras este tiempo, lo que ya quedó por encima del viewport se revela sin esperar. */
const SAFETY_MS = 3000;
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Motor del revelado al hacer scroll (contrato en `app/globals.css`, "Revelado al hacer scroll").
 * Un único IntersectionObserver para toda la página: añade `data-revealed` una sola vez y deja de
 * observar. Detecta nodos nuevos con un MutationObserver que solo agenda un re-escaneo en idle.
 * Marca `data-reveal-ready` en <html> al arrancar: si no llega en 3 s (JS caído), el script en
 * línea de `app/layout.tsx` pone `data-reveal-all` y se ve todo.
 * Lo que el usuario se salta (ancla, Inicio/Fin) y queda por encima del viewport se revela al
 * terminar el scroll; a los 3 s se repasa una vez más. Nunca revela de golpe lo que está debajo.
 */
export const RevealObserver = () => {
  useEffect(() => {
    const root = document.documentElement;

    // Movimiento reducido: el CSS ya lo enseña todo. `data-reveal-all` solo evita que algo se
    // oculte si el usuario vuelve a activar el movimiento con la página abierta.
    if (window.matchMedia(REDUCED_QUERY).matches) {
      root.setAttribute("data-reveal-all", "");
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      root.setAttribute("data-reveal-all", "");
      return;
    }

    const pending = new Set<Element>();

    const reveal = (el: Element) => {
      el.setAttribute("data-revealed", "");
      io.unobserve(el);
      pending.delete(el);
    };

    let io: IntersectionObserver;
    try {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) reveal(entry.target);
          }
        },
        { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
      );
    } catch {
      root.setAttribute("data-reveal-all", "");
      return;
    }

    const scan = () => {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (pending.has(el)) return;
        pending.add(el);
        io.observe(el);
      });
    };

    /** Revela lo pendiente que ya está entero por encima del viewport (sin animación visible). */
    const revealPassed = () => {
      for (const el of pending) {
        if (el.getBoundingClientRect().bottom <= 0) reveal(el);
      }
    };

    root.setAttribute("data-reveal-ready", "");

    // El primer escaneo y los siguientes van en idle: así no se toca ningún nodo que React aún
    // no haya hidratado (las secciones pueden hidratarse después que el layout y un atributo
    // nuevo daría un aviso de hidratación). Los nodos que aparecen después los detecta el
    // MutationObserver, cuyo callback solo agenda otro escaneo.
    let idle = 0;
    const scheduleScan = () => {
      if (idle) return;
      const run = () => {
        idle = 0;
        scan();
      };
      idle =
        "requestIdleCallback" in window
          ? window.requestIdleCallback(run, { timeout: 500 })
          : (setTimeout(run, 100) as unknown as number);
    };
    scheduleScan();
    const mo = new MutationObserver(scheduleScan);
    mo.observe(document.body, { childList: true, subtree: true });

    // Al terminar cada scroll (o 150 ms sin eventos donde no hay `scrollend`).
    let settle = 0;
    const onScroll = () => {
      clearTimeout(settle);
      settle = setTimeout(revealPassed, 150) as unknown as number;
    };
    const hasScrollEnd = "onscrollend" in window;
    window.addEventListener(hasScrollEnd ? "scrollend" : "scroll", hasScrollEnd ? revealPassed : onScroll, {
      passive: true,
    });

    const safety = setTimeout(revealPassed, SAFETY_MS);

    return () => {
      io.disconnect();
      mo.disconnect();
      clearTimeout(safety);
      clearTimeout(settle);
      window.removeEventListener(hasScrollEnd ? "scrollend" : "scroll", hasScrollEnd ? revealPassed : onScroll);
      if (idle) {
        if ("cancelIdleCallback" in window) window.cancelIdleCallback(idle);
        else clearTimeout(idle);
      }
    };
  }, []);

  return null;
};
