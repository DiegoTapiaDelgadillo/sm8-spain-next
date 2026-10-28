import { MainButton } from "@/components/shared/Buttons/MainButton/MainButton";
import { SecondaryButton } from "@/components/shared/Buttons/SecondaryButton/SecondaryButton";
import { MapPin } from "@/components/shared/Icons/MapPin";

export const HomeSection = () => {
  return (
    <section className=" h-screen w-full bg-linear-to-b from-black to-neutral-900 flex justify-center items-center px-80">
      <div className=" w-full">
        <div className=" w-full flex justify-center">
          <div className=" items-center gap-1 px-4 py-2 bg-linear-to-b from-neutral-950 to-neutral-800 rounded-full border border-neutral-500 w-fit flex justify-center">
            <MapPin className=" w-4 stroke-neutral-400" />
            <p className=" text-xs text-neutral-400">
              Alquiler y montaje de andamios en Madrid
            </p>
          </div>
        </div>

        <h1 className=" text-white font-bold text-4xl text-center mt-8">
          Soluciones integrales de andamiaje para{" "}
          <span className=" text-yellow-300">
            construcción, restauración e industria
          </span>
        </h1>
        <h2 className=" text-center text-neutral-500 mt-4 mb-8">
          Sistema Multidireccional homologado, montado por personal propio
          cualificado
        </h2>
        <div className=" flex justify-center gap-4">
          <MainButton text="Solicitar Presupuesto" />
          <SecondaryButton text="Contactar personal" />
        </div>
      </div>
    </section>
  );
};
