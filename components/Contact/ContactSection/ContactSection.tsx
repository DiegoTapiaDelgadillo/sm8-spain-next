import { CertItem } from "@/components/Certifications/CertItem/CertItem";
import { Section } from "@/components/shared/Section/Section";
import { Titles } from "@/components/shared/Titles/Titles";
import { ShieldSvg } from "@/components/shared/Icons/ShieldSvg";
import { ContactForm } from "../ContactForm/ContactForm";

export const ContactSection = () => {
  const items = [
    {
      title: "Dirección",
      description: "+54 11 1234-5678",
      icon: <ShieldSvg className=" w-12 stroke-yellow-500" />,
    },
    {
      title: "Teléfono",
      description: "+54 11 1234-5678",
      icon: <ShieldSvg className=" w-12 stroke-yellow-500" />,
    },
    {
      title: "email",
      description: "+54 11 1234-5678",
      icon: <ShieldSvg className=" w-12 stroke-yellow-500" />,
    },
  ];

  return (
    <Section>
      <div className=" grid grid-cols-2 gap-12">
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
