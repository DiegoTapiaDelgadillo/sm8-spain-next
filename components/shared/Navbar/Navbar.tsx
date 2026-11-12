"use client";

import { BurgerButton } from "../Buttons/BurgerButton/BurgerButton";
import { MainButton } from "../Buttons/MainButton/MainButton";
import { NavbarLinks } from "./NavbarLinks/NavbarLinks";
import { useActiveSection } from "./useActiveSection";
import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { LinkPropsArray } from "@/types/shared/links/links";
import { startLenis, stopLenis } from "@/lib/motion/lenis";
import logo from "@/public/img/logo.webp";

/** Breakpoint `lg` de Tailwind v4 (64rem = 1024px). */
const LG_QUERY = "(min-width: 64rem)";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Transición común del menú: corta, sin rebote, desactivada con reduced motion. */
const menuTransition =
  "transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

export const Navbar = ({ links }: LinkPropsArray) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const navRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const savedScroll = useRef<{ overflow: string; paddingRight: string } | null>(
    null,
  );

  const activeId = useActiveSection(
    links.map((link) => link.href.replace(/^#/, "")),
  );

  const lockScroll = useCallback(() => {
    if (savedScroll.current) return;
    const { body, documentElement } = document;
    savedScroll.current = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };
    // Compensa la barra de scroll para que el contenido no salte.
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    // Con Lenis (escritorio estrecho con ratón) `overflow: hidden` no basta: Lenis desplaza
    // con `scrollTo`. Se para mientras el menú está abierto.
    stopLenis();
  }, []);

  const unlockScroll = useCallback(() => {
    if (!savedScroll.current) return;
    document.body.style.overflow = savedScroll.current.overflow;
    document.body.style.paddingRight = savedScroll.current.paddingRight;
    savedScroll.current = null;
    startLenis();
  }, []);

  /**
   * Clic en un enlace interno (overlay, píldora, logo o "Contactar"):
   * - libera el scroll de forma síncrona, antes de que el navegador procese
   *   el salto al ancla;
   * - cierra el menú;
   * - mueve el foco a la sección de destino con `preventScroll`, para que el
   *   scroll suave del ancla no se cancele y el foco no se quede en <body>
   *   cuando el overlay pasa a `inert`.
   */
  const navigateTo = (href: string) => () => {
    unlockScroll();
    setIsOpen(false);
    const target = document.getElementById(href.replace(/^#/, ""));
    if (!target) return;
    if (target.tabIndex < 0 && !target.hasAttribute("tabindex")) {
      // Enfocable solo por script y sin anillo: la sección no es un control.
      target.setAttribute("tabindex", "-1");
      target.classList.add("outline-none");
      target.addEventListener(
        "blur",
        () => {
          target.removeAttribute("tabindex");
          target.classList.remove("outline-none");
        },
        { once: true },
      );
    }
    target.focus({ preventScroll: true });
  };

  // Bloqueo del scroll del body mientras el menú está abierto.
  useEffect(() => {
    if (!isOpen) return;
    lockScroll();
    return unlockScroll;
  }, [isOpen, lockScroll, unlockScroll]);

  // Escape cierra (foco a la hamburguesa) y Tab no sale de la navbar.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        burgerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !navRef.current) return;
      const focusables = Array.from(
        navRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => !el.closest("[inert]") && el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Al pasar a escritorio (lg) con el menú abierto, se cierra.
  useEffect(() => {
    const mql = window.matchMedia(LG_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsOpen(false);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return (
    <nav
      ref={navRef}
      aria-label="Principal"
      className=" nav-intro fixed inset-x-0 top-0 z-50 w-full lg:px-16 lg:pt-4 "
    >
      {/* Barra: primero en el DOM (orden de Tab: logo → X → enlaces → "Contactar")
          y por encima del overlay (z-10) para que la X siga visible y clicable. */}
      <div className=" relative z-10 flex w-full items-center justify-between border-b border-b-neutral-800/70 bg-black/50 px-4 py-3 backdrop-blur-xl md:px-8 lg:rounded-full lg:border lg:border-neutral-800/70 lg:px-6">
        <a
          href="#inicio"
          onClick={navigateTo("#inicio")}
          className=" rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-400"
        >
          <Image
            src={logo}
            width={50}
            preload
            alt="SM8 España, ir al inicio"
            className=" h-auto w-12.5"
          />
        </a>
        <div className=" hidden items-center gap-6 lg:flex">
          <ul className=" flex items-center gap-6">
            {links.map((link) => (
              <li key={link.href}>
                <NavbarLinks
                  href={link.href}
                  text={link.text}
                  isActive={activeId === link.href.slice(1)}
                  onClick={navigateTo(link.href)}
                />
              </li>
            ))}
          </ul>
          <div
            aria-hidden="true"
            className=" h-4 border-r border-r-neutral-500"
          ></div>
          <MainButton
            text="Contactar"
            href="#contacto"
            onClick={navigateTo("#contacto")}
          />
        </div>
        <div className=" lg:hidden">
          <BurgerButton
            ref={burgerRef}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            controlsId={menuId}
          />
        </div>
      </div>
      {/* Overlay móvil/tablet: siempre montado, se muestra con clases. Va después
          de la barra en el DOM y queda por debajo de ella visualmente. */}
      <div
        id={menuId}
        inert={!isOpen}
        className={` fixed inset-0 flex h-dvh flex-col items-center justify-center gap-10 bg-black/90 px-4 backdrop-blur-xl lg:hidden ${menuTransition} ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <ul className=" flex flex-col items-center gap-6">
          {links.map((link, index) => (
            <li
              key={link.href}
              className={`${menuTransition} ${
                isOpen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
              style={{
                transitionDelay: isOpen ? `${80 + index * 50}ms` : "0ms",
              }}
            >
              <NavbarLinks
                href={link.href}
                text={link.text}
                isActive={activeId === link.href.slice(1)}
                onClick={navigateTo(link.href)}
              />
            </li>
          ))}
        </ul>
        <div
          className={`${menuTransition} ${
            isOpen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
          style={{
            transitionDelay: isOpen ? `${80 + links.length * 50}ms` : "0ms",
          }}
        >
          <MainButton
            text="Contactar"
            href="#contacto"
            onClick={navigateTo("#contacto")}
          />
        </div>
      </div>
    </nav>
  );
};
