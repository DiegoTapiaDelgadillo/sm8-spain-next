import { MainButton } from "@/components/shared/Buttons/MainButton/MainButton";
import { Section } from "@/components/shared/Section/Section";
import { IndustryFigure } from "../IndustryFigure/IndustryFigure";
import { ScaffoldFigure } from "../ScaffoldFigure/ScaffoldFigure";
import { ConstructionFigure } from "../ConstructionFigure/ConstructionFigure";

export const ScaffoldsSection = () => {
  const infoSection = [
    {
      title: "Andamios para la restauración de fachadas y cubiertas",
      description:
        "Nuestro sistema de Andamios para Restauración es el ideal para restauraciones tanto en exteriores como en interiores, además gracias a su estabilidad, se pueden cubrir grandes extensiones de obra sin importar la altura.",
      ilustration: <ScaffoldFigure showCaption={false} className="mt-24" />,
    },
    {
      title: "Andamios para la construcción",
      description:
        "Nuestro sistema de Andamios para Construcción ofrece una gran versatilidad para la realización de obras provisionales sin importar lo alto o profunda que sea la obra, apuntalamiento, escalera de obra y estructura de servicio.",
      ilustration: <ConstructionFigure showCaption={false} className="mt-24" />,
    },
    {
      title: "Andamios para la industria",
      description:
        "Debido a la flexibilidad de nuestro sistema de Andamios para Industria puede adquirir formas circulares para tanques y silos, instalaciones industriales, puentes y torres de acceso, industria naval y de aviación",
      ilustration: <IndustryFigure showCaption={false} className="mt-24" />,
    },
  ];

  return (
    <>
      <Section>
        <div className=" flex justify-center items-center">
          <div className=" bg-blue-500/10 py-2 px-8 rounded-xl">
            <p className=" text-white text-sm">
              El Sistema Multidireccional SM8 se adapta a cualquier tipo de
              proyecto gracias a la geometría de su roseta octogonal
            </p>
          </div>
        </div>
        {infoSection.map((section, index) => (
          <div className=" grid grid-cols-2 gap-0 items-center" key={index}>
            {section.ilustration}
            <div>
              <h3 className=" text-yellow-400">01 Restauración</h3>
              <h1 className=" text-white font-bold text-4xl mt-6">
                {section.title}
              </h1>
              <p className=" text-neutral-500 mt-2 mb-6">
                {section.description}
              </p>
              <MainButton text="Solicitar presupuesto" />
            </div>
          </div>
        ))}
      </Section>
    </>
  );
};
