import { Section } from "@/components/shared/Section/Section";
import { Titles } from "@/components/shared/Titles/Titles";
import { CertItem } from "../CertItem/CertItem";
import { ShieldSvg } from "@/components/shared/Icons/ShieldSvg";
import { CheckCircleSvg } from "@/components/shared/Icons/CheckCircleSvg";
import { PlusCircleSvg } from "@/components/shared/Icons/PlusCircleSvg";

export const CertificationsSection = () => {
  const items = [
    {
      title: "Normativa UNE-EN 12811",
      description: "Requisitos de diseño y dimensionado de andamios",
      icon: <ShieldSvg className=" w-12 stroke-yellow-500" />,
    },
    {
      title: "RD 2177/2004",
      description: "Trabajos temporales en altura con andamios",
      icon: <CheckCircleSvg className=" w-12 stroke-yellow-500" />,
    },
    {
      title: "Equipo con EPI certificado",
      description:
        "Cumplimiento de la Ley 31/1995 de Prevención de Riesgos Laborales",
      icon: <PlusCircleSvg className=" w-12 stroke-yellow-500" />,
    },
  ];

  return (
    <Section>
      <div className=" grid grid-cols-2 gap-12">
        <div className="grid gap-4">
          <Titles
            titleClassName=" text-start"
            title="Montaje rápido, seguro y a medida de cada obra"
          />
          <div>
            {items.map((item, index) => (
              <CertItem
                key={index}
                title={item.title}
                description={item.description}
                icon={item.icon}
              />
            ))}
          </div>
        </div>
        <div className=" border border-neutral-800 rounded-xl"></div>
      </div>
    </Section>
  );
};
