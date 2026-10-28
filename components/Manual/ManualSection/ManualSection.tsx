import { MainButton } from "@/components/shared/Buttons/MainButton/MainButton";
import { Section } from "@/components/shared/Section/Section";
import { Titles } from "@/components/shared/Titles/Titles";

export const ManualSection = () => {
  return (
    <Section>
      <div className="  flex justify-center w-full">
        <div className=" w-96 h-96 border border-neutral-800 rounded-2xl"></div>
      </div>
      <div className=" mt-12 mb-6">
        <Titles
          titleClassName=" text-center"
          subtitleClassName=" text-center"
          title="Conoce todos nuestros andamios multidireccionales"
          subtitle="Descarga la ficha técnica completa del Sistema Multidireccional SM8: componentes, capacidades de carga y configuraciones disponibles."
        />
      </div>

      <div className=" w-full flex justify-center">
        <MainButton text="Descargar" />
      </div>
    </Section>
  );
};
