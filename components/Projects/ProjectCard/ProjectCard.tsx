import { BlurImage } from "@/components/shared/BlurImage/BlurImage";
import { ProjectProps } from "@/types/Projects/project";

export const ProjectCard = ({ title, description, imageUrl }: ProjectProps) => {
  return (
    <div className={` group w-full  transition-all duration-500 h-120`}>
      <div className="flex items-end mt-12">
        {/* Marco: revelado `image` (clip-path + escala del envoltorio `.blur-image`) y
            `overflow: clip`. El zoom del hover escala la <img>, no el envoltorio, para no
            pisar la misma propiedad que el revelado. `group-hover` ya va con `(hover: hover)`. */}
        <div
          data-reveal="image"
          className={`w-full p-4 relative flex flex-col justify-between overflow-clip border border-neutral-800 rounded-xl hover:bg-neutral-900 group-hover:border-neutral-700 transition-colors duration-500 h-100`}
        >
          {/* Ancho de la tarjeta: 1 columna (móvil), 2 (md) y 3 en flex (lg),
              descontando el padding de Section (px-4 / lg:px-24) y gap-8. */}
          <BlurImage
            src={imageUrl}
            fill
            sizes="(min-width: 64rem) calc((100vw - 16rem) / 3), (min-width: 48rem) calc(50vw - 2rem), calc(100vw - 2rem)"
            alt={title}
            wrapperClassName="rounded-lg"
            className="object-cover motion-safe:transition-[scale] motion-safe:duration-slow motion-safe:ease-out-soft motion-safe:group-hover:scale-104"
          />
        </div>
      </div>
      <div>
        <div className=" mt-4">
          <h3 className=" text-white font-bold">{title}</h3>
          <p className=" text-neutral-400 text-xs mt-0">{description}</p>
        </div>
      </div>
    </div>
  );
};
