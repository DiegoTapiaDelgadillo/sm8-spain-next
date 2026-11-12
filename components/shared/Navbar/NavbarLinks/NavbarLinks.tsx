import { NavbarLinkProps } from "@/types/shared/links/links";

/**
 * Enlace de la navbar. El tamaño es responsive porque la versión grande solo
 * existe en el overlay móvil (< lg) y la pequeña solo en la píldora (lg+).
 * `link-underline` (globals.css): subrayado animado al pasar el ratón, en el
 * color del texto (amarillo si es el enlace activo del scrollspy).
 */
export const NavbarLinks = ({
  href,
  text,
  isActive,
  onClick,
}: NavbarLinkProps) => {
  return (
    <a
      href={href}
      onClick={onClick}
      aria-current={isActive ? "true" : undefined}
      className={` link-underline rounded-sm text-3xl  md:text-4xl lg:text-sm lg:font-normal transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-400 motion-reduce:transition-none ${
        isActive ? "text-yellow-400" : "text-neutral-400 hover:text-white"
      }`}
    >
      {text}
    </a>
  );
};
