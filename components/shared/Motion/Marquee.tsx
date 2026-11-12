import type { CSSProperties } from "react";
import { MarqueeProps } from "@/types/shared/motion/marquee";
import { MarqueeToggle } from "./MarqueeToggle";

/**
 * Marquesina en bucle, solo CSS (clases `.marquee*` en globals.css). Pinta la lista
 * dos veces: la copia es `aria-hidden` e `inert`, así que se lee y se tabula una
 * sola vez. Se pausa con hover, con foco dentro o con el botón `MarqueeToggle`
 * (fuera de la máscara, debajo a la derecha). Con movimiento reducido es una fila
 * estática centrada que pasa a la línea siguiente y el botón no se muestra.
 */
export const Marquee = ({
  items,
  ariaLabel,
  duration = 40,
  gap,
  className = "",
  showToggle = true,
  pauseLabel = "Pausar animación de logos",
  playLabel = "Reanudar animación de logos",
}: MarqueeProps) => {
  const style = {
    "--marquee-duration": `${duration}s`,
    ...(gap && { "--marquee-gap": gap }),
  } as CSSProperties;

  const renderItems = () =>
    items.map((item, index) => (
      <li key={index} className=" flex shrink-0 items-center">
        {item}
      </li>
    ));

  return (
    <div className={`marquee-root w-full ${className}`} style={style}>
      <div className="marquee w-full">
        <div className="marquee-track">
          <ul className="marquee-list" aria-label={ariaLabel}>
            {renderItems()}
          </ul>
          <ul className="marquee-list" aria-hidden="true" inert>
            {renderItems()}
          </ul>
        </div>
      </div>
      {showToggle && (
        <div className=" mt-3 flex justify-end px-4 motion-reduce:hidden">
          <MarqueeToggle pauseLabel={pauseLabel} playLabel={playLabel} />
        </div>
      )}
    </div>
  );
};
