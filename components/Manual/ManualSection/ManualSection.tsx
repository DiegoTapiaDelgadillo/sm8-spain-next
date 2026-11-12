import type { CSSProperties } from "react";
import { MainButton } from "@/components/shared/Buttons/MainButton/MainButton";
import { DownloadSvg } from "@/components/shared/Icons/Download";
import { Section } from "@/components/shared/Section/Section";
import { Titles } from "@/components/shared/Titles/Titles";
import { BlurImage } from "@/components/shared/BlurImage/BlurImage";
import manual from "@/public/img/manual.webp";

export const ManualSection = () => {
  return (
    <Section>
      <div className="  flex justify-center w-full">
        {/* Proporción real de la imagen (1:1, sin `fill`): ancho completo en móvil
            hasta 24rem (el antiguo w-96). El marco lleva el revelado `image`. */}
        <div data-reveal="image" className=" w-full max-w-96">
          <BlurImage
            src={manual}
            sizes="(min-width: 26rem) 24rem, calc(100vw - 2rem)"
            alt="Manual"
            wrapperClassName="w-full"
            className="h-auto w-full"
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

      {/* Título (palabras) → subtítulo (--i 2, en Titles) → botón. */}
      <div
        data-reveal
        style={{ "--i": 3 } as CSSProperties}
        className=" w-full flex justify-center"
      >
        <MainButton
          icon={<DownloadSvg className="w-4" />}
          text="Descargar ficha técnica"
        />
      </div>
    </Section>
  );
};
