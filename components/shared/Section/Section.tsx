import { SectionProps } from "@/types/shared/section/section";

export const Section = (props: SectionProps) => {
  return (
    <section className=" py-48 px-48 border-t border-t-neutral-900 ">
      {props.children}
    </section>
  );
};
