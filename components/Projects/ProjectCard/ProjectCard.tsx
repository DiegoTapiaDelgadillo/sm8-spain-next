"use client";
import Image from "next/image";
import { useState } from "react";

export const ProjectCard = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={` ${isHovered ? "w-full sm:w-1/2" : " w-full sm:w-1/3"} transition-all duration-500`}
    >
      <div className=" h-120 flex items-end">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`w-full p-4 relative flex flex-col justify-between  border border-neutral-800 rounded-xl hover:bg-neutral-900 transition-colors duration-500 cursor-pointer 
          ${isHovered ? "h-full" : "h-100"}`}
        >
          <Image
            src={"/img/image.webp"}
            fill
            alt="Obra"
            className="object-cover rounded-lg"
          />
        </div>
      </div>
      <div>
        <div className=" mt-4">
          <h3 className=" text-white font-bold">
            Apuntalamiento Unidad Bioclimática
          </h3>
          <p className=" text-neutral-400 text-xs mt-0">
            Av. de Manoteras, 38, Chamartín, 28050 Madrid, España
          </p>
          <div></div>
        </div>
      </div>
    </div>
  );
};
