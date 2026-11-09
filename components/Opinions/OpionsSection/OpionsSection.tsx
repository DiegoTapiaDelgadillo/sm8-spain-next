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
        title="Opiniones de clientes de SM8 España"
        subtitle="Lo que dicen las empresas que ya han trabajado con nosotros."
        titleClassName=" text-center"
        subtitleClassName=" text-center"
      />
      <div className=" grid lg:grid-cols-3 gap-4 mt-12">
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
