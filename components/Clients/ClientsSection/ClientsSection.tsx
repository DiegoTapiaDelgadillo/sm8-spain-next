import Image from "next/image";

export const ClientsSection = () => {
  return (
    <section className=" p-4 sm:p-12">
      <h3 className=" text-center text-neutral-500 xl:px-120">
        Empresas que confían en Andamios SM8
      </h3>
      <div className="flex gap-8 justify-center w-full mt-6 sm:mt-12">
        <figure>
          <Image
            src={"/img/logo.webp"}
            height={100}
            width={100}
            alt="Logo de cliente"
          />
        </figure>
        <figure>
          <Image
            src={"/img/logo.webp"}
            height={100}
            width={100}
            alt="Logo de cliente"
          />
        </figure>
        <figure>
          <Image
            src={"/img/logo.webp"}
            height={100}
            width={100}
            alt="Logo de cliente"
          />
        </figure>{" "}
        <figure>
          <Image
            src={"/img/logo.webp"}
            height={100}
            width={100}
            alt="Logo de cliente"
          />
        </figure>
        <figure>
          <Image
            src={"/img/logo.webp"}
            height={100}
            width={100}
            alt="Logo de cliente"
          />
        </figure>
        <figure>
          <Image
            src={"/img/logo.webp"}
            height={100}
            width={100}
            alt="Logo de cliente"
          />
        </figure>
      </div>
    </section>
  );
};
