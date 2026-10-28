import { Titles } from "@/components/shared/Titles/Titles";
import { ProjectCard } from "../ProjectCard/ProjectCard";
import { Section } from "@/components/shared/Section/Section";

export const ProjectsSection = () => {
  return (
    <Section>
      <Titles
        title="Equipo certificado, en cada montaje, conoce nuestros proyectos"
        subtitle="Casco, arnés anclado y calzado de seguridad en cada intervención.
        Nuestra política de calidad mantiene el equipo en perfecto estado,
        cuidando ante todo la seguridad en cada andamio instalado."
      />
      <div className=" mt-12 flex justify-between gap-8 w-full">
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
      </div>
    </Section>
  );
};
