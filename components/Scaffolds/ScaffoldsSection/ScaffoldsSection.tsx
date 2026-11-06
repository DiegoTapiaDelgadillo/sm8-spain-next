import type { SectionAnchorProps } from "@/types/shared/section/section";
import type { ScaffoldCategory } from "@/types/Scaffolds/scaffolds";
import { Section } from "@/components/shared/Section/Section";
import { ScaffoldsScroll } from "../ScaffoldsScroll/ScaffoldsScroll";

export const ScaffoldsSection = ({ id }: SectionAnchorProps) => {
  const infoSection: ScaffoldCategory[] = [
    {
      category: "Restauración",
      title: "Andamios para la restauración de fachadas y cubiertas",
      description:
        "Nuestro sistema de Andamios para Restauración es el ideal para restauraciones tanto en exteriores como en interiores, además gracias a su estabilidad, se pueden cubrir grandes extensiones de obra sin importar la altura.",
      figure: "fachada",
    },
    {
      category: "Construcción",
      title: "Andamios para la construcción",
      description:
        "Nuestro sistema de Andamios para Construcción ofrece una gran versatilidad para la realización de obras provisionales sin importar lo alto o profunda que sea la obra, apuntalamiento, escalera de obra y estructura de servicio.",
      figure: "obra",
    },
    {
      category: "Industria",
      title: "Andamios para la industria",
      description:
        "Debido a la flexibilidad de nuestro sistema de Andamios para Industria puede adquirir formas circulares para tanques y silos, instalaciones industriales, puentes y torres de acceso, industria naval y de aviación",
      figure: "industria",
    },
  ];

  return (
    <Section>
      <div className=" flex justify-center items-center">
        <div className=" bg-blue-500/10 py-2 px-8 rounded-xl mb-12">
          <p className=" text-center sm:text-start text-white text-sm">
            El Sistema Multidireccional SM8 se adapta a cualquier tipo de
            proyecto gracias a la geometría de su roseta octogonal
          </p>
        </div>
      </div>
      {/* El ancla va en el recorrido fijado para que `#andamios` aterrice en la categoría 01, paso 0. */}
      <ScaffoldsScroll categories={infoSection} id={id} />
    </Section>
  );
};
