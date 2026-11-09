import type { SectionAnchorProps } from "@/types/shared/section/section";
import { CertItem } from "@/components/Certifications/CertItem/CertItem";
import { Section } from "@/components/shared/Section/Section";
import { Titles } from "@/components/shared/Titles/Titles";
import { ContactForm } from "../ContactForm/ContactForm";
import { MapPin } from "@/components/shared/Icons/MapPin";
import { PhoneSvg } from "@/components/shared/Icons/PhoneSvg";
import { EnvelopeSvg } from "@/components/shared/Icons/EnvelopeSvg";
import { BUSINESS } from "@/lib/business";
import type { CertItemProps } from "@/components/shared/Certifications/certItems";
import Image from "next/image";

export const ContactSection = ({ id }: SectionAnchorProps) => {
  const items: CertItemProps[] = [
    {
      title: "Dirección",
      description: BUSINESS.address.display,
      icon: <MapPin className=" w-6 stroke-yellow-500" />,
    },
    {
      title: "Teléfono",
      description: BUSINESS.phone.display,
      href: BUSINESS.phone.href,
      icon: <PhoneSvg className=" w-6 stroke-yellow-500" />,
    },
    {
      title: "Correo electrónico",
      description: BUSINESS.email,
      href: `mailto:${BUSINESS.email}`,
      icon: <EnvelopeSvg className=" w-6 stroke-yellow-500" />,
    },
  ];

  return (
    <Section id={id}>
      <div className=" grid lg:grid-cols-2 gap-4">
        <div>
          <Titles
            titleClassName="text-start"
            subtitleClassName="text-start"
            title="Pide presupuesto de andamios en Madrid"
            subtitle="Cuéntanos qué obra tienes y te preparamos un presupuesto sin compromiso de alquiler, montaje o venta."
          />
          <div className=" mt-4">
            {items.map((item) => (
              <CertItem
                key={item.title}
                title={item.title}
                description={item.description}
                href={item.href}
                icon={item.icon}
              />
            ))}
          </div>

          <div className="  w-full  h-90 relative">
            <Image
              src={"/img/lona.webp"}
              fill
              alt="Lona"
              className="object-cover rounded-xl"
            />
          </div>
        </div>
        <ContactForm />
      </div>
    </Section>
  );
};
