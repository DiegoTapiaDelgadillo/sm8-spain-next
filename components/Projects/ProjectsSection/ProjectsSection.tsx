import type { SectionAnchorProps } from "@/types/shared/section/section";
import { Titles } from "@/components/shared/Titles/Titles";
import { ProjectCard } from "../ProjectCard/ProjectCard";
import { Section } from "@/components/shared/Section/Section";

export const ProjectsSection = ({ id }: SectionAnchorProps) => {
  return (
    <Section id={id}>
      <Titles
        title="Proyectos de andamiaje en la Comunidad de Madrid"
        subtitle="Cada montaje lo hace personal propio con casco, arnés anclado y calzado de seguridad. Estas son algunas de nuestras obras."
      />
      <div className=" mt-12 grid sm:grid-cols-1 md:grid-cols-2 lg:flex gap-8 w-full items-end">
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
      </div>
    </Section>
  );
};
