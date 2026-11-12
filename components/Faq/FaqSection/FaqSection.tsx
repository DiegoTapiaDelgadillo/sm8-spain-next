import type { SectionAnchorProps } from "@/types/shared/section/section";
import { Section } from "@/components/shared/Section/Section";
import { Titles } from "@/components/shared/Titles/Titles";
import { Collapse } from "@/components/shared/Collapse/Collapse";
import { FAQ_ITEMS } from "./faqItems";

export const FaqSection = ({ id }: SectionAnchorProps) => {
  return (
    <Section id={id}>
      <Titles
        title="Preguntas frecuentes sobre el alquiler de andamios"
        subtitle="Resolvemos las dudas más habituales antes de empezar una obra."
        titleClassName=" text-center"
        subtitleClassName=" text-center"
      />
      {/* Sin `name`: se pueden abrir varias a la vez. Las respuestas van en el HTML del servidor. */}
      {/* Grupo escalonado: el revelado anima el <details> (opacidad y translate); la apertura
          de `Collapse` (::details-content) no se ve afectada. */}
      <div
        data-reveal-group
        className=" mx-auto mt-12 flex max-w-3xl flex-col gap-3"
      >
        {FAQ_ITEMS.map((item) => (
          <Collapse key={item.id} title={item.question}>
            <p>{item.answer}</p>
          </Collapse>
        ))}
      </div>
    </Section>
  );
};
