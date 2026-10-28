import { TitlesProps } from "@/types/shared/titles/titles";

export const Titles = (props: TitlesProps) => {
  return (
    <div>
      <h1 className={` ${props.titleClassName} text-white font-bold text-3xl`}>
        {props.title}
      </h1>
      <h2 className={` ${props.subtitleClassName} text-neutral-500 mt-2`}>
        {props.subtitle}
      </h2>
    </div>
  );
};
