"use client";

import { useCallback, useEffect, useEffectEvent, useRef, type RefObject } from "react";
import { getScrollLead } from "@/lib/motion/lenis";

type ScrollProgressOptions = {
  /** Si es `false`, no escucha el scroll (p. ej. con movimiento reducido). */
  enabled?: boolean;
  /**
   * Constante de tiempo del suavizado (segundos). El progreso pintado recorre ~63 % de la
   * distancia al real en ese tiempo, de forma independiente de los fps. 0 = sin suavizado.
   */
  smoothTime?: number;
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** Por debajo de esta diferencia se considera que el progreso ya ha llegado (≈0,01 vh en 9 pantallas). */
const EPSILON = 1e-5;

/**
 * Progreso 0–1 de un contenedor alto: 0 cuando su borde superior toca el del viewport,
 * 1 cuando su borde inferior toca el del viewport. Llama a `onProgress` en cada frame en
 * que el valor suavizado cambia (sin estado de React). Un único listener de scroll pasivo
 * + `requestAnimationFrame`; se desconecta mientras el contenedor está fuera de pantalla.
 *
 * Devuelve `snap()`: el siguiente cálculo salta al valor real sin suavizado
 * (útil antes de un `scrollTo` programático).
 */
export const useScrollProgress = (
  targetRef: RefObject<HTMLElement | null>,
  onProgress: (p: number) => void,
  { enabled = true, smoothTime = 0.12 }: ScrollProgressOptions = {},
) => {
  const emit = useEffectEvent(onProgress);
  const snapRef = useRef(false);

  useEffect(() => {
    const el = targetRef.current;
    if (!enabled || !el) return;

    let target = 0;
    let current = 0;
    let frame = 0;
    let last = 0;
    let listening = false;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      // Con Lenis se mide contra su destino (`targetScroll`), no contra la posición interpolada:
      // así el único suavizado es el de aquí (`smoothTime`) y la escena va igual que con scroll
      // nativo. Sin Lenis, `getScrollLead()` es 0.
      const top = rect.top - getScrollLead();
      const travel = rect.height - window.innerHeight;
      target = travel > 0 ? clamp01(-top / travel) : top <= 0 ? 1 : 0;
    };

    const jump = () => {
      measure();
      current = target;
      snapRef.current = false;
      emit(current);
    };

    const tick = (now: number) => {
      const dt = last ? Math.min(now - last, 64) / 1000 : 1 / 60;
      last = now;
      if (snapRef.current || smoothTime <= 0) {
        snapRef.current = false;
        current = target;
      } else {
        current += (target - current) * (1 - Math.exp(-dt / smoothTime));
        if (Math.abs(target - current) < EPSILON) current = target;
      }
      emit(current);
      frame = current !== target ? requestAnimationFrame(tick) : 0;
    };

    const onScroll = () => {
      measure();
      if (!frame) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };

    const listen = (on: boolean) => {
      if (on === listening) return;
      listening = on;
      if (on) {
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
      } else {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    // Al entrar o salir de pantalla se salta al valor real: si se llega por un ancla o
    // saltando media página, no se "reproduce" el montaje/desmontaje intermedio.
    const io = new IntersectionObserver((entries) => {
      const visible = entries[entries.length - 1].isIntersecting;
      listen(visible);
      jump();
    });
    io.observe(el);

    return () => {
      io.disconnect();
      listen(false);
    };
  }, [targetRef, enabled, smoothTime]);

  return useCallback(() => {
    snapRef.current = true;
  }, []);
};
