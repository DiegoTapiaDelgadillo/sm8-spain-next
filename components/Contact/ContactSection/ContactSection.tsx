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
import { ToastProvider } from "@/components/shared/Toast/ToastProvider";
import { ClockSvg } from "@/components/shared/Icons/ClockSvg";

export const ContactSection = ({ id }: SectionAnchorProps) => {
  const items: CertItemProps[] = [
    {
      title: "Oficina",
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
      title: "WhatsApp",
      description: BUSINESS.whatsapp.display,
      href: BUSINESS.whatsapp.href,
      icon: <PhoneSvg className=" w-6 stroke-yellow-500" />,
    },
    {
      title: "Correo electrónico",
      description: BUSINESS.email,
      href: `mailto:${BUSINESS.email}`,
      icon: <EnvelopeSvg className=" w-6 stroke-yellow-500" />,
    },
    {
      title: "Horario de atención",
      description: BUSINESS.businessHours.hours,
      icon: <ClockSvg className=" w-6 stroke-yellow-500" />,
    },
  ];

  return (
    <Section id={id}>
      <div className=" grid lg:grid-cols-2 gap-4 items-center">
        <div>
          <Titles
            titleClassName="text-start"
            subtitleClassName="text-start"
            title="Pide presupuesto de andamios en Madrid"
            subtitle="Cuéntanos qué obra tienes y te preparamos un presupuesto sin compromiso de alquiler, montaje o venta."
          />
          <div data-reveal-group className=" mt-4">
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
        </div>
        {/* Solo el formulario usa avisos: el proveedor (cliente) no envuelve el layout. */}
        <ToastProvider>
          <ContactForm />
        </ToastProvider>
      </div>
    </Section>
  );
};
