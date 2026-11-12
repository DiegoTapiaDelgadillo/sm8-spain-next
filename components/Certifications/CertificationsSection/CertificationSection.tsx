import type { CSSProperties } from "react";
import type { SectionAnchorProps } from "@/types/shared/section/section";
import { Section } from "@/components/shared/Section/Section";
import { Titles } from "@/components/shared/Titles/Titles";
import { CertItem } from "../CertItem/CertItem";
import { ShieldSvg } from "@/components/shared/Icons/ShieldSvg";
import { CheckCircleSvg } from "@/components/shared/Icons/CheckCircleSvg";
import { PlusCircleSvg } from "@/components/shared/Icons/PlusCircleSvg";
import { DocumentTextSvg } from "@/components/shared/Icons/DocumentText";
import { BlurImage } from "@/components/shared/BlurImage/BlurImage";
import lona from "@/public/img/lona.webp";

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
      <div className=" grid lg:grid-cols-2 gap-12 items-center">
        <div className="grid gap-4">
          <Titles
            titleClassName=" text-start"
            title="Andamios homologados y montaje seguro según normativa"
          />
          <div data-reveal-group>
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
        {/* Revelado `image`: el recorte usa el mismo radio que el envoltorio (rounded-xl). */}
        <figure
          data-reveal="image"
          style={{ "--reveal-radius": "0.75rem" } as CSSProperties}
          className=" aspect-square grid relative h-full w-full"
        >
          {/* 1 columna hasta lg; luego la mitad, menos px-24 y gap-12. */}
          <BlurImage
            src={lona}
            fill
            sizes="(min-width: 64rem) calc(50vw - 7.5rem), calc(100vw - 2rem)"
            alt="obra"
            wrapperClassName="rounded-xl"
            className="object-cover"
          />
        </figure>
      </div>
    </Section>
  );
};
