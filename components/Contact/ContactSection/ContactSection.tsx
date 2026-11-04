import type { SectionAnchorProps } from "@/types/shared/section/section";
import { CertItem } from "@/components/Certifications/CertItem/CertItem";
import { Section } from "@/components/shared/Section/Section";
import { Titles } from "@/components/shared/Titles/Titles";
import { ContactForm } from "../ContactForm/ContactForm";
import { MapPin } from "@/components/shared/Icons/MapPin";
import { PhoneSvg } from "@/components/shared/Icons/PhoneSvg";
import { EnvelopeSvg } from "@/components/shared/Icons/EnvelopeSvg";

export const ContactSection = ({ id }: SectionAnchorProps) => {
  const items = [
    {
      title: "Dirección",
      description: "Av. de Manoteras 38, Chamartín, Madrid, España, 28050",
      icon: <MapPin className=" w-12 stroke-yellow-500" />,
    },
    {
      title: "Teléfono",
      description: "+34 616 74 02 90",
      icon: <PhoneSvg className=" w-12 stroke-yellow-500" />,
    },
    {
      title: "Correo electrónico",
      description: "info@sm8.es",
      icon: <EnvelopeSvg className=" w-12 stroke-yellow-500" />,
    },
  ];

  return (
    <Section id={id}>
      <div className=" grid lg:grid-cols-2 gap-12">
        <div className="grid gap-2 items-start">
          <Titles
            titleClassName="text-start"
            subtitleClassName="text-start"
            title="¿Tienes algún proyecto?"
            subtitle="Nos encantaría trabajar contigo. Cuéntanos qué necesitas y te responderemos a la mayor brevedad."
          />

          {items.map((item, index) => (
            <CertItem
              key={index}
              title={item.title}
              description={item.description}
              icon={item.icon}
            />
          ))}
          <div className=" border w-full border-neutral-800 h-60 rounded-xl"></div>
        </div>
        <ContactForm />
      </div>
    </Section>
  );
};
