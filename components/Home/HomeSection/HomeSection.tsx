import type { SectionAnchorProps } from "@/types/shared/section/section";
import { MainButton } from "@/components/shared/Buttons/MainButton/MainButton";
import { SecondaryButton } from "@/components/shared/Buttons/SecondaryButton/SecondaryButton";
import { MapPin } from "@/components/shared/Icons/MapPin";
import { BUSINESS } from "@/lib/business";
import { HeroScaffold } from "@/components/Home/HeroScaffold/HeroScaffold";
import { Fragment, type CSSProperties } from "react";

const TITLE = "Alquiler y montaje de andamios en Madrid";
const TITLE_HIGHLIGHT = "para fachadas, obra e industria";

/**
 * Palabras del `h1` con la máscara de `.reveal-word` (la entrada del hero es CSS, al cargar).
 * `from` continúa la numeración entre la parte blanca y la amarilla. Los espacios quedan
 * como texto real, así que el nombre accesible no cambia.
 */
const introWords = (text: string, from = 0) => {
  const words = text.split(" ");
  return words.map((word, index) => (
    <Fragment key={index}>
      <span className="reveal-word">
        <span style={{ "--w": from + index } as CSSProperties}>{word}</span>
      </span>
      {index < words.length - 1 ? " " : null}
    </Fragment>
  ));
};

export const HomeSection = ({ id }: SectionAnchorProps) => {
  return (
    <section
      id={id}
      className=" flex min-h-[max(100svh,35rem)] w-full flex-col items-center bg-linear-to-b from-black to-neutral-900 pt-24 lg:pt-28"
    >
      <div className=" w-full max-w-4xl shrink-0 px-4">
        <div className=" w-full flex justify-center">
          <div className=" hero-intro items-center gap-1 px-4 py-2 bg-linear-to-b from-neutral-950 to-neutral-800 rounded-full border border-neutral-500 w-fit flex justify-center">
            <MapPin className=" w-4 stroke-neutral-400" />
            <p className=" text-xs text-neutral-400">
              Andamio multidireccional · Comunidad de Madrid
            </p>
          </div>
        </div>

        <h1 className=" hero-intro-title text-white font-bold text-xl sm:text-4xl text-center mt-8">
          {introWords(TITLE)}{" "}
          <span className=" text-yellow-300">
            {introWords(TITLE_HIGHLIGHT, TITLE.split(" ").length)}
          </span>
        </h1>
        <p
          style={{ "--intro-delay": "300ms" } as CSSProperties}
          className=" hero-intro text-center text-neutral-400 mt-4 mb-8"
        >
          Sistema Multidireccional SM8 homologado, montado y desmontado por
          personal propio cualificado. También lo vendemos y nos encargamos del
          PMUD y las licencias.
        </p>
        <div
          style={{ "--intro-delay": "400ms" } as CSSProperties}
          className=" hero-intro grid sm:flex justify-center gap-4"
        >
          <MainButton text="Solicitar presupuesto" href="#contacto" />
          <SecondaryButton
            text={`Llamar al ${BUSINESS.phone.display}`}
            href={BUSINESS.phone.href}
          />
        </div>
      </div>
      {/* Figura decorativa: ocupa el alto que queda bajo los botones, de borde a borde */}
      <HeroScaffold className="mt-3" />
    </section>
  );
};
