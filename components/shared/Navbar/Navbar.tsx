import { MainButton } from "../Buttons/MainButton/MainButton";
import { NavbarLinks } from "./NavbarLinks/NavbarLinks";
import Image from "next/image";

export const Navbar = () => {
  return (
    <nav className=" px-64 bg-transparent  w-full fixed z-50 pt-4">
      <div className=" backdrop-blur-xl bg-black/50 flex justify-between items-center w-full border border-neutral-800/70 rounded-full p-4">
        <figure>
          <Image
            src={"/img/logo.webp"}
            width={50}
            height={50}
            alt="Logo sm8 spain"
          />
        </figure>
        <div className=" flex gap-4 items-center">
          <NavbarLinks />
          <NavbarLinks />
          <NavbarLinks />
          <NavbarLinks />
          <div className=" border-r border-r-neutral-500 h-4 p-1"></div>
          <MainButton text="Contactar" />
        </div>{" "}
      </div>
    </nav>
  );
};
