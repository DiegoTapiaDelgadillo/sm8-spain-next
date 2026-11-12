import Image from "next/image";
import { Enlance } from "../Enlace/Enlace";
import { CurrentYear } from "../CurrentYear/CurrentYear";
import type { LinkPropsArray } from "@/types/shared/links/links";
import { BUSINESS } from "@/lib/business";
import logo from "@/public/img/logo.webp";

export const Footer = ({ links }: LinkPropsArray) => {
  return (
    <footer className=" w-full  mt-12 border-t border-t-neutral-900 bg-linear-to-t from-black to-neutral-900/50">
      {/* Columnas en grupo escalonado (revelado de spec 05). */}
      <div
        data-reveal-group
        className=" grid grid-cols-1 gap-8 sm:grid-cols-2 lg:flex lg:justify-between w-full px-4 lg:px-30 py-12"
      >
        <div>
          <figure className=" w-fit h-fit">
            <Image
              src={logo}
              width={50}
              className="h-auto w-12.5"
              alt="Logo de SM8 España"
            />
          </figure>
        </div>
        <div>
          <p className=" text-yellow-400 text-sm mb-4">Menú</p>
          {links.map((link) => (
            <Enlance key={link.href} href={link.href} text={link.text} />
          ))}
        </div>
        <div>
          <p className=" text-yellow-400 text-sm mb-4">Contacto</p>
          <address className=" not-italic">
            <p className=" text-sm text-neutral-400">
              {BUSINESS.address.display}
            </p>
            <Enlance
              href={BUSINESS.phone.href}
              text={BUSINESS.phone.display}
              ariaLabel={`Llamar al ${BUSINESS.phone.display}`}
            />
            <Enlance
              href={`mailto:${BUSINESS.email}`}
              text={BUSINESS.email}
              ariaLabel={`Escribir a ${BUSINESS.email}`}
            />
          </address>
        </div>
        <div>
          <p className=" text-yellow-400 text-sm mb-4">Más de SM8</p>
          {BUSINESS.group.map((site) => (
            <Enlance key={site.url} href={site.url} text={site.name} external />
          ))}
        </div>
        <div>
          <p className=" text-yellow-400 text-sm mb-4">Redes sociales</p>
          <Enlance
            href={BUSINESS.social.instagram}
            text="Instagram"
            ariaLabel="Instagram de SM8 España"
            external
          />
          <Enlance
            href={BUSINESS.social.facebook}
            text="Facebook"
            ariaLabel="Facebook de SM8 España"
            external
          />
        </div>
      </div>
      <div className=" border-t border-t-neutral-900 pt-4 px-4 lg:px-30 flex justify-start">
        <p className=" text-neutral-400 text-xs mb-4">
          © <CurrentYear /> SM8. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};
