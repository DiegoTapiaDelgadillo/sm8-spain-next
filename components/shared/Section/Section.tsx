import { SectionProps } from "@/types/shared/section/section";

export const Section = (props: SectionProps) => {
  return (
    <section
      id={props.id}
      className=" py-24 px-4 sm:py-48 lg:px-24  border-t border-t-neutral-900 scroll-mt-20 lg:scroll-mt-28"
    >
      {props.children}
    </section>
  );
};
