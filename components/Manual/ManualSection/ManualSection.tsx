import { MainButton } from "@/components/shared/Buttons/MainButton/MainButton";
import { DownloadSvg } from "@/components/shared/Icons/Download";
import { Section } from "@/components/shared/Section/Section";
import { Titles } from "@/components/shared/Titles/Titles";
import Image from "next/image";

export const ManualSection = () => {
  return (
    <Section>
      <div className="  flex justify-center w-full">
        <div className=" w-96 h-96 relative">
          <Image
            src={"/img/manual.png"}
            fill
            alt="Manual"
            className="object-cover"
          />
        </div>
      </div>
      <div className=" mt-0 mb-6">
        <Titles
          titleClassName=" text-center"
          subtitleClassName=" text-center"
          title="Ficha técnica del andamio multidireccional SM8"
          subtitle="Descarga la ficha técnica completa del Sistema Multidireccional SM8: componentes, capacidades de carga y configuraciones disponibles. Disponible en alquiler y en venta."
        />
      </div>

      <div className=" w-full flex justify-center">
        <MainButton
          icon={<DownloadSvg className="w-4" />}
          text="Descargar ficha técnica"
        />
      </div>
    </Section>
  );
};
