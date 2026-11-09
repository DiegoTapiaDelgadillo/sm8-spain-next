import type { SectionAnchorProps } from "@/types/shared/section/section";
import type { ScaffoldCategory } from "@/types/Scaffolds/scaffolds";
import { Section } from "@/components/shared/Section/Section";
import { Titles } from "@/components/shared/Titles/Titles";
import { ScaffoldsScroll } from "../ScaffoldsScroll/ScaffoldsScroll";

export const ScaffoldsSection = ({ id }: SectionAnchorProps) => {
  const infoSection: ScaffoldCategory[] = [
    {
      category: "Rehabilitación",
      title: "Andamios para rehabilitación de fachadas y cubiertas",
      description:
        "Andamio multidireccional para restaurar y rehabilitar fachadas y cubiertas, tanto en exterior como en interior. Su estabilidad permite cubrir grandes superficies a cualquier altura.",
      figure: "fachada",
    },
    {
      category: "Construcción",
      title: "Andamios para construcción y obra nueva",
      description:
        "Gran versatilidad para estructuras provisionales en obras de cualquier altura o profundidad: apuntalamiento, escaleras de obra y estructuras de servicio.",
      figure: "obra",
    },
    {
      category: "Industria",
      title: "Andamios industriales",
      description:
        "La roseta octogonal permite formas circulares para tanques y silos, instalaciones industriales, puentes, torres de acceso y los sectores naval y aeronáutico.",
      figure: "industria",
    },
  ];

  return (
    // El ancla `#andamios` va en `<Section>` (con su `scroll-mt` para la navbar fija): al entrar
    // desde el menú o desde `/andamio-multidireccional` se ve el título, y el elemento que observa
    // el scrollspy cubre título + caja + toda la escena fijada.
    <Section id={id}>
      {/* El título va fuera de `ScaffoldsScroll`: no altera el alto de la escena fijada. */}
      <Titles
        title="Andamios multidireccionales para cada tipo de obra"
        titleClassName=" text-center"
      />
      <div className=" flex justify-center items-center mt-6">
        <div className=" bg-blue-500/10 py-2 px-8 rounded-xl mb-12">
          <p className=" text-center sm:text-start text-white text-sm">
            El Sistema Multidireccional SM8 se adapta a cualquier proyecto
            gracias a la geometría de su roseta octogonal.
          </p>
        </div>
      </div>
      <ScaffoldsScroll categories={infoSection} />
    </Section>
  );
};
