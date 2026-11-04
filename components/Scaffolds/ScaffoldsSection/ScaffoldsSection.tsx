import { MainButton } from "@/components/shared/Buttons/MainButton/MainButton";
import { Section } from "@/components/shared/Section/Section";
import { IndustryFigure } from "../IndustryFigure/IndustryFigure";
import { ScaffoldFigure } from "../ScaffoldFigure/ScaffoldFigure";
import { ConstructionFigure } from "../ConstructionFigure/ConstructionFigure";
import { DocumentTextSvg } from "@/components/shared/Icons/DocumentText";

export const ScaffoldsSection = () => {
  const infoSection = [
    {
      category: "Restauración",
      title: "Andamios para la restauración de fachadas y cubiertas",
      description:
        "Nuestro sistema de Andamios para Restauración es el ideal para restauraciones tanto en exteriores como en interiores, además gracias a su estabilidad, se pueden cubrir grandes extensiones de obra sin importar la altura.",
      ilustration: <ScaffoldFigure showCaption={false} className="mt-0" />,
    },
    {
      category: "Construcción",
      title: "Andamios para la construcción",
      description:
        "Nuestro sistema de Andamios para Construcción ofrece una gran versatilidad para la realización de obras provisionales sin importar lo alto o profunda que sea la obra, apuntalamiento, escalera de obra y estructura de servicio.",
      ilustration: <ConstructionFigure showCaption={false} className="mt-0" />,
    },
    {
      category: "Industria",
      title: "Andamios para la industria",
      description:
        "Debido a la flexibilidad de nuestro sistema de Andamios para Industria puede adquirir formas circulares para tanques y silos, instalaciones industriales, puentes y torres de acceso, industria naval y de aviación",
      ilustration: <IndustryFigure showCaption={false} className="mt-0" />,
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
        <div className=" grid gap-24">
          {infoSection.map((section, index) => (
            <div className=" grid grid-cols-2 gap-4 items-center" key={index}>
              {section.ilustration}
              <div>
                <h3 className=" text-yellow-400">
                  0{index + 1} {section.category}
                </h3>
                <h1 className=" text-white font-bold text-4xl mt-6">
                  {section.title}
                </h1>
                <p className=" text-neutral-500 mt-2 mb-6">
                  {section.description}
                </p>
                <MainButton
                  icon={<DocumentTextSvg className=" w-4" />}
                  text="Solicitar presupuesto"
                />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
};
