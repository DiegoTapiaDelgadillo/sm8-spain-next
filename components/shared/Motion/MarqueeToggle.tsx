"use client";

import { useState, type MouseEvent } from "react";
import { PauseSvg } from "@/components/shared/Icons/PauseSvg";
import { PlaySvg } from "@/components/shared/Icons/PlaySvg";
import { MarqueeToggleProps } from "@/types/shared/motion/marquee";

/**
 * Botón de pausa/reanudar de `Marquee` (WCAG 2.2.2). Alterna `data-paused` en el
 * `.marquee-root` que lo contiene; el CSS pausa la pista. El nombre accesible
 * cambia con el estado. Con movimiento reducido no se muestra (ya está estática).
 */
export const MarqueeToggle = ({
  pauseLabel,
  playLabel,
}: MarqueeToggleProps) => {
  const [paused, setPaused] = useState(false);

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    const root = event.currentTarget.closest<HTMLElement>(".marquee-root");
    const next = !paused;
    root?.toggleAttribute("data-paused", next);
    setPaused(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={paused ? playLabel : pauseLabel}
      className=" flex size-8 cursor-pointer items-center justify-center rounded-full border border-neutral-800 text-neutral-400 transition-colors duration-200 hover:border-neutral-600 hover:text-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
    >
      {paused ? (
        <PlaySvg className=" size-4" />
      ) : (
        <PauseSvg className=" size-4" />
      )}
    </button>
  );
};
