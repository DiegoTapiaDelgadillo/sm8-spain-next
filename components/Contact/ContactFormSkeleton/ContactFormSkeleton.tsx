/**
 * Esqueleto del formulario mientras se descarga `ContactForm` (spec 06). Copia su estructura
 * (tarjeta, cabecera, 3 campos, mensaje, casilla y botón) con las mismas medidas (medidas por QA a 320, 375, 768 y 1280 px) para que el
 * cambio no mueva el contenido. Decorativo salvo el aviso para lectores de pantalla.
 */
const FIELD_LABELS = ["Nombre completo", "Teléfono", "Correo electrónico"];

const Box = ({ className }: { className: string }) => (
  <div
    aria-hidden="true"
    className={` rounded-xl border border-neutral-800 bg-neutral-900/40 ${className}`}
  />
);

export const ContactFormSkeleton = () => (
  <div
    aria-busy="true"
    className=" border border-neutral-800 w-full rounded-xl bg-linear-to-b from-neutral-900/60 to-black p-4 md:p-8"
  >
    <div>
      <p className=" text-white">Empieza la conversación</p>
      <p className=" text-neutral-400 text-xs">
        Cuéntanos en qué podemos ayudarte
      </p>
    </div>
    <p role="status" className=" sr-only">
      Cargando el formulario de contacto…
    </p>
    <div aria-hidden="true" className=" grid gap-4 mt-4">
      {FIELD_LABELS.map((label) => (
        <div key={label}>
          <p className=" text-sm leading-6 text-neutral-400">{label}</p>
          <Box className=" mt-1 h-[46px] md:h-[38px]" />
        </div>
      ))}
      <div>
        <p className=" text-sm leading-6 text-neutral-400">Mensaje</p>
        {/* 70/58 px del textarea + ~6 px de su línea inline. */}
        <Box className=" mt-1 h-[76px] md:h-[64px]" />
      </div>
      {/* Mismo texto y estructura que la casilla de `Form`, invisible: salta de línea igual. */}
      <div className=" invisible flex gap-2 items-start">
        <div className=" size-6 shrink-0" />
        <p className=" pt-0.5 text-xs">
          He leído y acepto la Política de Privacidad de SM8 España para el
          tratamiento de mis datos con el fin de responder a mi solicitud.
        </p>
      </div>
      <Box className=" h-[30px] rounded-full" />
    </div>
  </div>
);
