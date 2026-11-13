"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ContactFormSkeleton } from "../ContactFormSkeleton/ContactFormSkeleton";

/**
 * Carga diferida del formulario (spec 06): `ContactForm` arrastra `libphonenumber-js` y la
 * lista de países (~34 KB gzip). Se descarga en un chunk propio solo cuando el formulario se
 * acerca al viewport (o al entrar por `#contacto`); hasta entonces se pinta un esqueleto con la
 * misma estructura para no mover el contenido. `ssr: false` solo se permite en componentes
 * cliente, por eso existe este envoltorio.
 */
const ContactForm = dynamic(
  () => import("../ContactForm/ContactForm").then((mod) => mod.ContactForm),
  { ssr: false, loading: () => <ContactFormSkeleton /> },
);

/** Margen de antelación: empieza a cargar unas dos pantallas antes de llegar. */
const ROOT_MARGIN = "1200px 0px";

export const ContactFormLazy = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setLoad(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: ROOT_MARGIN },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className=" w-full">
      {load ? <ContactForm /> : <ContactFormSkeleton />}
    </div>
  );
};
