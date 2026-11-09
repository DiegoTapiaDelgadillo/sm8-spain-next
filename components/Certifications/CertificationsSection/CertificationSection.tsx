import type { SectionAnchorProps } from "@/types/shared/section/section";
import { Section } from "@/components/shared/Section/Section";
import { Titles } from "@/components/shared/Titles/Titles";
import { CertItem } from "../CertItem/CertItem";
import { ShieldSvg } from "@/components/shared/Icons/ShieldSvg";
import { CheckCircleSvg } from "@/components/shared/Icons/CheckCircleSvg";
import { PlusCircleSvg } from "@/components/shared/Icons/PlusCircleSvg";
import { DocumentTextSvg } from "@/components/shared/Icons/DocumentText";
import Image from "next/image";

export const CertificationsSection = ({ id }: SectionAnchorProps) => {
  const items = [
    {
      title: "Normativa UNE-EN 12811",
      description: "Requisitos de diseño y cálculo de andamios de trabajo",
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
    {
      title: "PMUD y licencias",
      description:
        "Redactamos el plan de montaje, utilización y desmontaje y gestionamos las licencias necesarias.",
      icon: <DocumentTextSvg className=" w-12 stroke-yellow-500" />,
    },
  ];

  return (
    <Section id={id}>
      <div className=" grid lg:grid-cols-2 gap-12">
        <div className="grid gap-4">
          <Titles
            titleClassName=" text-start"
            title="Andamios homologados y montaje seguro según normativa"
          />
          <div>
            {items.map((item) => (
              <CertItem
                key={item.title}
                title={item.title}
                description={item.description}
                icon={item.icon}
              />
            ))}
          </div>
        </div>
        <figure className="relative h-full w-full">
          <Image
            src={"/img/image2.webp"}
            fill
            alt="obra"
            className="rounded-xl object-cover"
          />
        </figure>
      </div>
    </Section>
  );
};
