import Image from "next/image";
import { ProjectProps } from "@/types/Projects/project";

export const ProjectCard = ({ title, description, imageUrl }: ProjectProps) => {
  return (
    <div className={` w-full  transition-all duration-500 h-120`}>
      <div className="flex items-end mt-12">
        <div
          className={`w-full p-4 relative flex flex-col justify-between  border border-neutral-800 rounded-xl hover:bg-neutral-900 transition-colors duration-500 h-100`}
        >
          <Image
            src={imageUrl}
            fill
            alt={title}
            className="object-cover rounded-lg"
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
