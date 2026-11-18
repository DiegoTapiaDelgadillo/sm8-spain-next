import Image from "next/image";
import { Marquee } from "@/components/shared/Motion/Marquee";
import avir from "@/public/img/avir.webp";
import abedul from "@/public/img/abedul.webp";
import dago from "@/public/img/dago.webp";
import greenval from "@/public/img/greenval.webp";
import haineken from "@/public/img/heineken.webp";
import nestle from "@/public/img/nestle.webp";
import pg from "@/public/img/pg.webp";

// Logos de relleno (1148 × 700) hasta tener los de clientes reales. Con la importación
// estática y solo `width`, Next calcula el `height` real (61) y el hueco se reserva con
// la proporción correcta (no añadir `height={100}`: provocaba un salto de 39 px).
const CLIENT_LOGOS = [
  { id: "cliente-1", src: avir, alt: "Logo de cliente" },
  { id: "cliente-2", src: abedul, alt: "Logo de cliente" },
  { id: "cliente-3", src: dago, alt: "Logo de cliente" },
  { id: "cliente-4", src: greenval, alt: "Logo de cliente" },
  { id: "cliente-5", src: haineken, alt: "Logo de cliente" },
  { id: "cliente-6", src: nestle, alt: "Logo de cliente" },
  { id: "cliente-7", src: pg, alt: "Logo de cliente" },
];

export const ClientsSection = () => {
  return (
    <section className=" p-4 sm:p-12">
      <h2
        data-reveal
        className=" font-text text-center text-neutral-400 xl:px-120"
      >
        Empresas que confían en SM8 España
      </h2>
      {/* En la marquesina los logos no encogen (`shrink-0`): 100 px de ancho también en móvil. */}
      <Marquee
        className=" mt-6 sm:mt-12"
        ariaLabel="Empresas que confían en SM8 España"
        items={CLIENT_LOGOS.map((client) => (
          <Image
            key={client.id}
            src={client.src}
            width={100}
            alt={client.alt}
          />
        ))}
      />
    </section>
  );
};
