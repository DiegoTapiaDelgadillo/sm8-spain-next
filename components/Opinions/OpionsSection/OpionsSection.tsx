import { Section } from "@/components/shared/Section/Section";
import { Titles } from "@/components/shared/Titles/Titles";
import { OpionCard } from "../OpionCard/OpionCard";

export const OpionsSection = () => {
  const optionArray = [
    {
      opinion:
        "“Monitor your DNS configuration for any errors or regressions. Be notified of any changes that could hinder your deliverability.”",
      name: "Piter Parker",
      position: "CEO del Diario el Clarin",
    },
    {
      opinion:
        "“Monitor your DNS configuration for any errors or regressions. Be notified of any changes that could hinder your deliverability.”",
      name: "Piter Parker",
      position: "CEO del Diario el Clarin",
    },
    {
      opinion:
        "“Monitor your DNS configuration for any errors or regressions. Be notified of any changes that could hinder your deliverability.”",
      name: "Piter Parker",
      position: "CEO del Diario el Clarin",
    },
  ];

  return (
    <Section>
      <Titles
        title="La opinión de quienes ya han trabajado con SM8"
        subtitle="Nuestra política de calidad mantiene el equipo en perfecto estado, cuidando ante todo la seguridad en cada andamio instalado."
        titleClassName=" text-center"
        subtitleClassName=" text-center"
      />
      <div className=" grid grid-cols-3 gap-4 mt-12">
        {optionArray.map((opion, index) => (
          <OpionCard
            key={index}
            opinion={opion.opinion}
            name={opion.name}
            position={opion.position}
          />
        ))}
      </div>
    </Section>
  );
};
