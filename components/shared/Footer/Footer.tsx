import Image from "next/image";
import { Enlance } from "../Enlace/Enlace";
import type { LinkPropsArray } from "@/types/shared/links/links";

export const Footer = ({ links }: LinkPropsArray) => {
  return (
    <footer className=" w-full  mt-12 border-t border-t-neutral-900 bg-linear-to-t from-black to-neutral-900/50">
      <div className=" grid sm:flex justify-between gap-4 w-full px-4 lg:px-30  py-12">
        <div>
          <figure className=" w-fit h-fit">
            <Image
              src={"/img/logo.webp"}
              width={50}
              height={30}
              className="h-auto w-12.5"
              alt="Logo sm8 spain"
            />
          </figure>
        </div>
        <div className=" ">
          <p className=" text-yellow-400 text-sm mb-4">Menu</p>
          {links.map((link, index) => (
            <Enlance key={index} href={link.href} text={link.text} />
          ))}
        </div>
        <div className="  ">
          <p className=" text-yellow-400 text-sm mb-4">Más de SM8</p>
          <Enlance href={"/"} text={"SM8 México"} />
          <Enlance href={"/"} text={"SM8 Desarrollos"} />
          <Enlance href={"/"} text={"Timbrela"} />
        </div>
        <div>
          <p className=" text-yellow-400 text-sm mb-4">Redes sociales</p>
        </div>
      </div>
      <div className=" border-t border-t-neutral-900 pt-4 px-4 lg:px-30 flex justify-start">
        <p className=" text-neutral-500 text-xs mb-4">
          © 2027 Grupo SM8, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
