import type { SectionAnchorProps } from "@/types/shared/section/section";
import { Titles } from "@/components/shared/Titles/Titles";
import { ProjectCard } from "../ProjectCard/ProjectCard";
import { Section } from "@/components/shared/Section/Section";

export const ProjectsSection = ({ id }: SectionAnchorProps) => {
  const projects = [
    {
      title: "Andamio perimetral para rehabilitación energética",
      description:
        "Andamio en todo el contorno del edificio, con redes de protección, para colocar el aislamiento térmico exterior (SATE). La solución da acceso seguro a todas las plantas de la fachada.",
      imageUrl: "/img/historico.jpg",
    },
    {
      title: "Andamio para la rehabilitación de un edificio histórico",
      description:
        "Montamos el andamio de fachada para los trabajos de rehabilitación de la portada. Dejamos libre el paso bajo la estructura para que la iglesia siguiera abierta al público durante toda la obra.",
      imageUrl: "/img/fachada.jpg",
    },
    {
      title: "Rehabilitación de fachada en edificio de viviendas",
      description:
        "Montaje en esquina con redes de protección y paso peatonal habilitado, lo que permitió a los comercios de la planta baja seguir abiertos durante la obra.",
      imageUrl: "/img/edificio.jpg",
    },
  ];

  return (
    <Section id={id}>
      <Titles
        title="Proyectos de andamiaje en la Comunidad de Madrid"
        subtitle="Cada montaje lo hace personal propio con casco, arnés anclado y calzado de seguridad. Estas son algunas de nuestras obras."
      />
      <div className=" grid sm:grid-cols-1 md:grid-cols-2 lg:flex gap-8 w-full items-end">
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            title={project.title}
            description={project.description}
            imageUrl={project.imageUrl}
          />
        ))}
      </div>
    </Section>
  );
};
