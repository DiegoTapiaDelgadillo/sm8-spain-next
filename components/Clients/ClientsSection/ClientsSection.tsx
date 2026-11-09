import Image from "next/image";

export const ClientsSection = () => {
  return (
    <section className=" p-4 sm:p-12">
      <h2 className=" font-text text-center text-neutral-400 xl:px-120">
        Empresas que confían en SM8 España
      </h2>
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
