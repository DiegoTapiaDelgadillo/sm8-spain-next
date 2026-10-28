"use client";
import { useState } from "react";

export const ProjectCard = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={` ${isHovered ? "w-1/2" : "w-1/3"} transition-all duration-300`}
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={` h-120 w-full p-4 flex flex-col justify-between  border border-neutral-800 rounded-xl hover:bg-neutral-900 transition-colors duration-300 cursor-pointer`}
      ></div>
      <div>
        <div className=" mt-4">
          <h1 className=" text-white font-bold">
            Apuntalamineto Unidad Bioclimática
          </h1>
          <p className=" text-neutral-500 text-xs mt-0">
            Av. de Manoteras, 38, Chamartín, 28050 Madrid, España
          </p>
          <div></div>
        </div>
      </div>
    </div>
  );
};
